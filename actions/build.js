const path = require('path');
const { execSync, exec } = require('child_process');
const logger = require('../helper/logger');

const genArchive = (cmdBuild) => {
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
  const { scheme, provisioningProfile } = job.options;
  let { teamID } = job.options;

  let appName = '';
  if (!teamID) {
    teamID = execSync('xcodebuild -showBuildSettings | grep DEVELOPMENT_TEAM').toString().replace('DEVELOPMENT_TEAM = ', '').trim();
  }
  console.log(teamID);
  process.exit();
  try {
    const dummy = '';
    const projectName = execSync(`ls -lA | awk -F':[0-9]* ' '/:/{print $2}' | grep '.xcodeproj'${dummy}`).toString();
    appName = path.basename(projectName.trim(), '.xcodeproj');
    logger.info(`Building "${appName}"`);
  } catch (error) {
    logger.error('Please check your directory - looks like it\'s not an iOS project.');
    process.exit();
  }

  let cmdBuild = `xcodebuild -project ${appName}.xcodeproj -scheme ${scheme || appName} -destination generic/platform=iOS archive -archivePath ${process.cwd()}/${process.env.BLTmpProcessingDir}/${appName}.xcarchive`;

  if (provisioningProfile) {
    cmdBuild += ` PROVISIONING_PROFILE="${provisioningProfile}"`;
  }

  await genArchive(cmdBuild);


  console.log(`rm -rf ${process.cwd()}/${process.env.BLTmpProcessingDir}`);
  execSync(`rm -rf ${process.cwd()}/${process.env.BLTmpProcessingDir}`);
  // logger.info(cmdBuild);
};
