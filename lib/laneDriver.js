const logger = require('./helper/logger');
const fs = require('fs');
const path = require('path');
const async = require('async');

const laneDriver = {};
laneDriver.validateLane = (lane, index) => {
  logger.info(`👨🏽‍✈️ 👀 Validating Lane: ${lane.laneName}`);
  const laneName = lane.laneName || index;
  const { jobs } = lane;
  if (!Array.isArray(jobs) || jobs.length <= 0) {
    logger.error(`[lane: "${laneName}"] - expects "jobs" array!`);
    process.exit();
  } else {
    // Let's check all jobs are ok!
    jobs.forEach((job, idx) => {
      if (!job.job) {
        logger.error(`[lane: "${laneName}", jobIndex: "${idx}"] - "job" key is missing!`);
        process.exit();
      }

      const jobTypes =
        JSON.parse(fs.readFileSync(
          path.resolve(
            __dirname,
            'jobs/jobs.json',
          ),
          'utf8',
        ));

      if (jobTypes.indexOf(job.job) < 0) {
        logger.error(`[lane: "${laneName}", jobIndex: "${idx}", job: "${job.job}"] - "job" is not valid!`);
        process.exit();
      }

      // eslint-disable-next-line global-require, import/no-dynamic-require
      const validate = require(`./jobs/${job.job}/${job.job}`).validator(lane, job);
      if (validate !== true) {
        logger.error(validate.error);
        process.exit();
      }
    });
  }
};

laneDriver.driveLane = (lane) => {
  logger.info(`🛫 Driving Lane: ${lane.laneName}`);
  const { jobs } = lane;
  logger.info(jobs);
  const series = [];

  jobs.forEach((job) => {
    series.push((callback) => {
      // eslint-disable-next-line global-require, import/no-dynamic-require
      require(`./jobs/${job.job}/${job.job}`)
        .run(lane, job)
        .then((data) => {
          callback(null, data);
        })
        .catch((err) => {
          callback(err);
        });
    });
  });

  // console.log(series);
  async.series(series, (err) => {
    if (!err) logger.info('All ok!');
    else logger.error(err);
  });
};

module.exports = laneDriver;
