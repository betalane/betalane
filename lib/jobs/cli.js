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

module.exports = async (lane, job) => {
  logger.info('Executing Command...');
  try {
    await progressiveCmd(job.options.cmd);
  } catch (error) {
    logger.error('Please check your command');
    process.exit();
  }
};