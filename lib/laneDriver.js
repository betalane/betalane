const logger = require('./helper/logger');
const fs = require('fs');
const path = require('path');
const async = require('async');

const laneDriver = {};
laneDriver.validateLane = (lane, index) => {
  const laneName = lane.laneName || index;
  const { jobs } = lane;
  if (!Array.isArray(jobs) || jobs.length <= 0) {
    logger.error(`[lane: "${laneName}"] - expects "jobs" array!`);
    process.exit();
  } else {
    // Let's check all jobs are ok!
    jobs.forEach((job, idx) => {
      if (!job.action) {
        logger.error(`[lane: "${laneName}", job: "${idx}"] - "action" key is missing!`);
        process.exit();
      }

      const actionTypes =
        JSON.parse(fs.readFileSync(
          path.resolve(
            __dirname,
            'actions/actions.json',
          ),
          'utf8',
        ));

      if (actionTypes.indexOf(job.action) < 0) {
        logger.error(`[lane: "${laneName}", job: "${idx}", action: "${job.action}"] - "action" is not valid!`);
        process.exit();
      }
    });
  }
};

laneDriver.driveLane = (lane) => {
  const { jobs } = lane;
  logger.info(jobs);
  const series = [];

  jobs.forEach((job) => {
    logger.info(`Adding... ${job.action}`);
    // eslint-disable-next-line global-require, import/no-dynamic-require
    series.push((cb) => {
      require(`./actions/${job.action}`)(lane, job)
        .then((data) => {
          cb(null, data);
        })
        .catch((err) => {
          cb(err);
        });
    });
  });

  // console.log(series);
  async.waterfall(series, (err) => {
    if (!err) logger.info('All ok!');
    else logger.error(err);
  });
};

module.exports = laneDriver;
