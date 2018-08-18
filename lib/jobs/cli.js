const { exec } = require('child_process');
const logger = require('../helper/logger');

const progressiveCmd = (cmdBuild) => {
  return new Promise((resolve, reject) => {
    const ls = exec(cmdBuild);

    ls.stdout.on('data', (data) => {
      logger.info(data);
    });

    ls.stderr.on('data', (data) => {
      logger.error(data);
    });

    ls.on('close', (code) => {
      if (code !== 0) {
        logger.error(`child process exited with code ${code}`);
        return reject();
      }
      return resolve();
    });
  });
};

const run = async (lane, job) => {
  logger.info('Executing Command...');
  try {
    await progressiveCmd(job.options.cmd);
  } catch (error) {
    logger.error('Please check your command');
    process.exit();
  }
};

const validator = (lane, job) => {
  if (!job.options.cmd) {
    return { error: `Lane: ${lane.laneName}, Job: ${job.job}, 'cmd' is missing, please check documentaion. https://github.com/betalane/betalane#cli---execute-any-cli-command` };
  }
  return true;
};

module.exports = { run, validator };
