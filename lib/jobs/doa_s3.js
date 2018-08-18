const { fs } = require('fs');
const logger = require('../helper/logger');

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
