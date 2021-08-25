const fs = require('fs');
const aws = require('aws-sdk');
const logger = require('../../helper/logger');
const moment = require('moment');
const ipaExtractor = require('./ipaExtractor');
const path = require('path');
const { v4: uuidv4 } = require('uuid');
const util = require('util')
const ApkReader = require('adbkit-apkreader')

const Platforms = {
  iOS: "iOS",
  Android: "Android"
}

const awsUtils = {};
awsUtils.putObject = (jobOptions, fileContent, key, contentType, showProgressBar) => {
  aws.config = {
    accessKeyId: jobOptions.AccessKeyID,
    secretAccessKey: jobOptions.SecretAccessKey,
    region: jobOptions.region,
    signatureVersion: 'v4',
  };

  const s3 = new aws.S3();
  return new Promise((resolve, reject) => {
    // eslint-disable-next-line no-param-reassign
    const params = {
      Body: fileContent,
      Bucket: jobOptions.s3Bucket,
      Key: key,
      ACL: 'public-read',
      ContentType: contentType || 'application/octet-stream',
      ContentDisposition: 'inline',
    };

    let bar;
    if (showProgressBar) {
      // bar = new ProgressBar({
      //   schema: '[:bar] :percent ETA :etas',
      // });
    }

    const upload = new aws.S3.ManagedUpload({
      params,
      leavePartsOnError: true,
      service: s3,
    });

    upload.on('httpUploadProgress', (progress) => {
      if (showProgressBar) {
        // bar.update((progress.loaded / progress.total));
      }
    });

    upload.send((err, data) => {
      if (err) {
        reject(err);
      } else {
        resolve({
          key, url: awsUtils.getS3Url(jobOptions.s3Bucket, key, jobOptions.region),
        });
      }
    });
  });
};

awsUtils.getS3Url = (s3Bucket, key, region) => {
  return `https://s3.${region}.amazonaws.com/${s3Bucket}/${key}`;
};

const run = async (lane, job) => {
  logger.info('🚀 On the Air Distribution using AWS S3...');

  let { buildPath, description = '', filename, prefix = '', platform } = job.options;

  let ext = platform === Platforms.iOS ? 'ipa' : 'apk';

  if (!buildPath) {
    buildPath = process.env.BL_DOWNLOADED_FILE || process.env.BL_BUILD_IPA_PATH;
  } else if (buildPath.indexOf('env.') === 0) {
    buildPath = process.env[buildPath.replace('env.', '')];
  }

  if (!buildPath) {
    logger.error('Could not find `buildPath`, Please ensure you perform `build` job prior `doa_s3`');
    process.exit();
  }

  if (!fs.existsSync(buildPath)) {
    logger.error(`Could not find file at \`buildPath\`: ${buildPath}`);
    process.exit();
  }

  const now = moment();
  const _fileuid = filename || uuidv4();
  const s3Prefix = `${prefix}doa-${_fileuid}`;

  try {
    const fileContent = fs.readFileSync(buildPath);
    logger.info('Uploading Build file...');
    const build = await awsUtils.putObject(job.options, fileContent, `${s3Prefix}/${_fileuid}.${ext}`, null, true);
    // Export Process ENVs
    process.env.BL_DOA_S3_BUILD_URL = build.url;

    let downloadLink = build.url;
    const buildInfo = {
      bundleName: '',
      version: ''
    }

    if (platform === Platforms.iOS) {
      // Creating plist file
      let manifest = fs.readFileSync(path.resolve(__dirname, './manifest.tpl'), 'utf8');
      const ipaInfo = ipaExtractor(buildPath, filename);
      manifest = manifest.split('{{ipaLink}}').join(process.env.BL_DOA_S3_BUILD_URL);
      manifest = manifest.split('{{bundleId}}').join(ipaInfo.bundleId);
      manifest = manifest.split('{{versionNumber}}').join(ipaInfo.version);
      manifest = manifest.split('{{appName}}').join(ipaInfo.bundleName);

      logger.info('Uploading manifest file...');
      const manifestS3 = await awsUtils.putObject(job.options, manifest, `${s3Prefix}/${_fileuid}.plist`);
      process.env.BL_DOA_S3_MANIFEST_URL = manifestS3.url;
      downloadLink = `itms-services://?action=download-manifest&url=${manifestS3.url}`;

      buildInfo.bundleName = ipaInfo.bundleId;
      buildInfo.version = `${ipaInfo.version} (${ipaInfo.versionCode})`;
    }

    else if (platform === Platforms.Android) {
      const reader = await ApkReader.open(buildPath);
      const manifest = await reader.readManifest();
      const decodedManifest = util.inspect(manifest, { depth: null })
      const { package, versionName, versionCode } = manifest;
      buildInfo.bundleName = package;
      buildInfo.version = `${versionName} (${versionCode})`;
    }

    let downloadTpl = fs.readFileSync(path.resolve(__dirname, './download.tpl'), 'utf8');
    downloadTpl = downloadTpl.replace('{{title}}', `${buildInfo.bundleName} - v${buildInfo.version}`);
    downloadTpl = downloadTpl.replace('{{description}}', description);
    downloadTpl = downloadTpl.replace('{{downloadLink}}', downloadLink);
    downloadTpl = downloadTpl.replace('{{appName}}', buildInfo.bundleName);
    downloadTpl = downloadTpl.replace('{{versionNumber}}', buildInfo.version);

    logger.info('Creating Download Link...');
    const downloadS3 = await awsUtils.putObject(job.options, downloadTpl, `${s3Prefix}/${_fileuid}.html`, 'text/html');

    process.env.BL_DOA_S3_INSTALL_URL = downloadS3.url;

    logger.table([['env.BL_DOA_S3_BUILD_URL', build.url], ['env.BL_DOA_S3_INSTALL_URL', downloadS3.url]], ['Variable', 'Value'], `${job.job} - Output Params`);

    fs.unlinkSync(buildPath);
  } catch (error) {
    logger.error(error);
    process.exit();
  }
};

const validator = (lane, job) => {
  const doc = 'Please check documentaion. https://github.com/betalane/betalane#doa_s3---distribute-on-the-air-using-aws-s3';
  if (!job.options.AccessKeyID) {
    return { error: `Lane: ${lane.laneName}, Job: ${job.job}, 'AccessKeyID' is missing. ${doc}` };
  } else if (!job.options.SecretAccessKey) {
    return { error: `Lane: ${lane.laneName}, Job: ${job.job}, 'SecretAccessKey' is missing. ${doc}` };
  } else if (!job.options.s3Bucket) {
    return { error: `Lane: ${lane.laneName}, Job: ${job.job}, 's3Bucket' is missing. ${doc}` };
  } else if (!job.options.region) {
    return { error: `Lane: ${lane.laneName}, Job: ${job.job}, 'region' is missing. ${doc}` };
  } else if (!job.options.platform) {
    return { error: `Lane: ${lane.laneName}, Job: ${job.job}, 'platform' is missing. ${doc}` };
  }
  return true;
};


module.exports = { run, validator };