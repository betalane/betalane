const { exec } = require('child_process');
const logger = require('../helper/logger');

const run = async (lane, job) => {
  logger.info('🚀 On the Air Distribution using AWS S3...');
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
