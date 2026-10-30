const fs = require('fs');
const aws = require('aws-sdk');
const logger = require('../../helper/logger');
const moment = require('moment');
const ipaExtractor = require('./ipaExtractor');
const path = require('path');
const { v4: uuidv4 } = require('uuid');
const ApkReader = require('adbkit-apkreader')

const Platforms = {
  iOS: "iOS",
  Android: "Android"
}

const APK_CONTENT_TYPE = 'application/vnd.android.package-archive';

const PlatformUi = {
  iOS: {
    name: 'iOS',
    deviceNames: 'iPhone or iPad',
    iconPath: 'M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.81-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M13 3.5c.73-.83 1.94-1.46 2.94-1.5.13 1.17-.34 2.35-1.04 3.19-.69.85-1.83 1.51-2.95 1.42-.15-1.15.41-2.35 1.05-3.11z',
  },
  Android: {
    name: 'Android',
    deviceNames: 'Android phone or tablet',
    iconPath: 'M17.6 9.48l1.84-3.18c.16-.31.04-.69-.26-.85-.29-.15-.65-.06-.83.22l-1.88 3.24c-2.86-1.21-6.08-1.21-8.94 0L5.65 5.67c-.19-.29-.58-.38-.87-.2-.28.18-.37.54-.22.83L6.4 9.48C3.3 11.25 1.28 14.44 1 18h22c-.28-3.56-2.3-6.75-5.4-8.52zM7 15.25c-.69 0-1.25-.56-1.25-1.25s.56-1.25 1.25-1.25 1.25.56 1.25 1.25-.56 1.25-1.25 1.25zm10 0c-.69 0-1.25-.56-1.25-1.25s.56-1.25 1.25-1.25 1.25.56 1.25 1.25-.56 1.25-1.25 1.25z',
  },
};

const slugify = (text) => text.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '');

const awsUtils = {};
awsUtils.putObject = (jobOptions, fileContent, key, contentType, showProgressBar, contentDisposition) => {
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
      ContentDisposition: contentDisposition || 'inline',
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
    const isAndroid = platform === Platforms.Android;
    const buildInfo = {
      bundleName: '',
      version: '',
      appName: '',
    };

    let buildContentType = null;
    let buildDisposition = null;
    if (isAndroid) {
      const reader = await ApkReader.open(buildPath);
      const manifest = await reader.readManifest();
      const { package, versionName, versionCode } = manifest;
      // `application.label` is often an unresolved resource reference (e.g. "resourceId:0x7f...")
      const label = manifest.application && manifest.application.label;
      const readableLabel = typeof label === 'string' && !/^resourceId:/i.test(label) ? label : '';
      buildInfo.appName = job.options.appName || readableLabel || package.split('.').pop();
      buildInfo.bundleName = package;
      buildInfo.version = `${versionName} (${versionCode})`;

      // Android Chrome only downloads/installs an APK when it is served with the right type and as an attachment
      const apkFileName = `${slugify(buildInfo.appName) || _fileuid}.apk`;
      buildContentType = APK_CONTENT_TYPE;
      buildDisposition = `attachment; filename="${apkFileName}"`;
    }
    logger.info('Uploading Build file...');
    const build = await awsUtils.putObject(job.options, fileContent, `${s3Prefix}/${_fileuid}.${ext}`, buildContentType, true, buildDisposition);
    // Export Process ENVs
    process.env.BL_DOA_S3_BUILD_URL = build.url;

    let downloadLink = build.url;

    if (platform === Platforms.iOS) {
      // Creating plist file
      let manifest = fs.readFileSync(path.resolve(__dirname, './manifest.tpl'), 'utf8');
      const ipaInfo = ipaExtractor(buildPath, filename);
      manifest = manifest.split('{{ipaLink}}').join(process.env.BL_DOA_S3_BUILD_URL);
      manifest = manifest.split('{{bundleId}}').join(ipaInfo.bundleId);
      manifest = manifest.split('{{versionNumber}}').join(ipaInfo.version);
      manifest = manifest.split('{{appName}}').join(ipaInfo.appName);

      logger.info('Uploading manifest file...');
      const manifestS3 = await awsUtils.putObject(job.options, manifest, `${s3Prefix}/${_fileuid}.plist`);
      process.env.BL_DOA_S3_MANIFEST_URL = manifestS3.url;
      downloadLink = `itms-services://?action=download-manifest&url=${manifestS3.url}`;

      buildInfo.bundleName = ipaInfo.bundleId;
      buildInfo.version = `${ipaInfo.version} (${ipaInfo.versionCode})`;
      buildInfo.appName = ipaInfo.appName;
    }

    const ui = PlatformUi[platform];
    let downloadTpl = fs.readFileSync(path.resolve(__dirname, './download.tpl'), 'utf8');
    downloadTpl = downloadTpl.replace('{{title}}', () => `${buildInfo.appName} - v${buildInfo.version}`);
    downloadTpl = downloadTpl.replace('{{description}}', () => description);
    downloadTpl = downloadTpl.replace('{{downloadLink}}', () => downloadLink);
    downloadTpl = downloadTpl.split('{{appName}}').join(buildInfo.appName);
    downloadTpl = downloadTpl.replace('{{versionNumber}}', () => buildInfo.version);
    downloadTpl = downloadTpl.split('{{platformName}}').join(ui.name);
    downloadTpl = downloadTpl.split('{{deviceNames}}').join(ui.deviceNames);
    downloadTpl = downloadTpl.split('{{platformIconPath}}').join(ui.iconPath);

    logger.info('Creating Download Link...');
    const downloadS3 = await awsUtils.putObject(job.options, downloadTpl, `${s3Prefix}/${_fileuid}.html`, 'text/html');

    process.env.BL_DOA_S3_INSTALL_URL = downloadS3.url;

    logger.table([['env.BL_DOA_S3_BUILD_URL', build.url], ['env.BL_DOA_S3_INSTALL_URL', downloadS3.url]], ['Variable', 'Value'], `${job.job} - Output Params`);

    // fs.unlinkSync(buildPath);
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
