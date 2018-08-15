const logger = require('./helper/logger');
const fs = require('fs');
const path = require('path');

const laneDriver = {};
laneDriver.validateLane = (lane, index) => {
  const laneName = lane.laneName || index;
  const { jobs } = lane;
  if (!Array.isArray(jobs) || jobs.length <= 0) {
    logger.error(`[Lane: "${laneName}"] - expects "jobs" array!`);
    process.exit();
  } else {
    // Let's check all jobs are ok!
    jobs.forEach((job, idx) => {
      if (!job.action) {
        logger.error(`[Lane: "${laneName}", Job: "${idx}"] - "action" key is missing!`);
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
        logger.error(`[Lane: "${laneName}", Job: "${idx}"] - "action" is not valid!`);
        process.exit();
      }
    });
  }
};

laneDriver.driveLane = (lane) => {
  const { jobs } = lane;
  jobs.forEach((job) => {
    require(`./actions/${job.action}`)(lane, job);
  });
};

module.exports = laneDriver;
