const fs = require('fs');
const aws = require('aws-sdk');
const logger = require('../../helper/logger');
const moment = require('moment');
const ipaExtractor = require('./ipaExtractor');
const path = require('path');
const ProgressBar = require('ascii-progress');

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
      bar = new ProgressBar({
        schema: '[:bar] :percent ETA :etas',
      });
    }

    const upload = new aws.S3.ManagedUpload({
      params,
      leavePartsOnError: true,
      service: s3,
    });

    upload.on('httpUploadProgress', (progress) => {
      if (showProgressBar) {
        bar.update((progress.loaded / progress.total));
      }
    });

    upload.send((err, data) => {
      if (err) {
        reject(err);
      } else {
        resolve({
          key, url: awsUtils.getS3Url(jobOptions.s3Bucket, key),
        });
      }
    });
  });
};

awsUtils.getS3Url = (s3Bucket, key) => {
  return `https://${s3Bucket}.s3.amazonaws.com/${key}`;
};

const run = async (lane, job) => {
  logger.info('🚀 On the Air Distribution using AWS S3...');

  let { buildPath } = job.options;

  if (!buildPath) {
    buildPath = process.env.BL_BUILD_IPA_PATH;
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
  const s3Prefix = `builds/doa-${lane.laneName}-${now.format('DD-MMM-YYYY-HH-mm-ss')}`;

  try {
    const fileContent = fs.readFileSync(buildPath);
    logger.info('Uploading IPA file...');
    const ipa = await awsUtils.putObject(job.options, fileContent, `${s3Prefix}/package.ipa`, null, true);
    // Export Process ENVs
    process.env.BL_DOA_S3_BUILD_URL = ipa.url;


    // Creating plist file
    let manifest = fs.readFileSync(path.resolve(__dirname, './manifest.tpl'), 'utf8');
    const ipaInfo = ipaExtractor(buildPath);
    manifest = manifest.split('{{ipaLink}}').join(process.env.BL_DOA_S3_BUILD_URL);
    manifest = manifest.split('{{bundleId}}').join(ipaInfo.bundleId);
    manifest = manifest.split('{{versionNumber}}').join(ipaInfo.version);
    manifest = manifest.split('{{appName}}').join(ipaInfo.bundleName);

    logger.info('Uploading manifest file...');
    const manifestS3 = await awsUtils.putObject(job.options, manifest, `${s3Prefix}/manifest.plist`);
    process.env.BL_DOA_S3_MANIFEST_URL = manifestS3.url;

    let downloadTpl = fs.readFileSync(path.resolve(__dirname, './download.tpl'), 'utf8');
    downloadTpl = downloadTpl.replace('{{title}}', `${ipaInfo.bundleName} - v${ipaInfo.version}`);
    downloadTpl = downloadTpl.replace('{{description}}', `Auto generated build using http://betalane.tools on ${now.format('DD-MMM-YYYY @ HH:mm')}`);
    downloadTpl = downloadTpl.replace('{{menifestLink}}', manifestS3.url);
    downloadTpl = downloadTpl.replace('{{appName}}', ipaInfo.bundleName);
    downloadTpl = downloadTpl.replace('{{versionNumber}}', ipaInfo.version);

    logger.info('Creating Download Link...');
    const downloadS3 = await awsUtils.putObject(job.options, downloadTpl, `${s3Prefix}/download.html`, 'text/html');

    process.env.BL_DOA_S3_INSTALL_URL = downloadS3.url;

    logger.table([['env.BL_DOA_S3_BUILD_URL', ipa.url], ['env.BL_DOA_S3_MANIFEST_URL', manifestS3.url], ['env.BL_DOA_S3_INSTALL_URL', downloadS3.url]], ['Variable', 'Value'], `${job.job} - Output Params`);
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
  }
  return true;
};


module.exports = { run, validator };
