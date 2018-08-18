const path = require('path');
const { execSync, exec } = require('child_process');
const logger = require('../helper/logger');
const plist = require('plist');
const fs = require('fs');

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
  let appName = '';
  try {
    const dummy = '';
    const projectName = execSync(`ls -lA | awk -F':[0-9]* ' '/:/{print $2}' | grep '.xcodeproj'${dummy}`).toString();
    appName = path.basename(projectName.trim(), '.xcodeproj');
    logger.info(`Building "${appName}"`);
  } catch (error) {
    logger.error('Please check your directory - looks like it\'s not an iOS project.');
    process.exit();
  }

  let { teamID, provisioningProfile } = job.options;

  const scheme = job.options.scheme || appName;
  const target = job.options.target || appName;
  const compileBitcode = job.options.compileBitcode || 'NO';
  const method = job.options.method || 'development';
  const signingCertificate = job.options.signingCertificate || 'iOS Developer';
  const signingStyle = 'manual';
  const stripSwiftSymbols = job.options.stripSwiftSymbols || 'YES';
  const buildConfiguration = job.options.buildConfiguration || 'Debug';
  let { bundleId } = job.options;


  if (!teamID) {
    logger.info('Fetching Team ID from build settings...');
    teamID = execSync('xcodebuild -showBuildSettings | grep DEVELOPMENT_TEAM').toString().replace('DEVELOPMENT_TEAM = ', '').trim();
  }

  if (!provisioningProfile) {
    logger.info(`Could not fine profile details from lane settings, trying to fetch from Build Settings for Target ${target}, Build Configuration ${buildConfiguration}`);

    provisioningProfile = execSync(`xcodebuild -showBuildSettings -target ${target} -configuration Dev | grep " PROVISIONING_PROFILE = "`).toString().replace('PROVISIONING_PROFILE = ', '').trim();
  }

  if (!bundleId) {
    logger.info(`Fetching Bundle ID from Build Settings for Target ${target}`);
    bundleId = execSync(`xcodebuild -showBuildSettings -target ${target} | grep " PRODUCT_BUNDLE_IDENTIFIER = "`).toString().replace('PRODUCT_BUNDLE_IDENTIFIER = ', '').trim();
  }

  const provisioningProfiles = {};
  provisioningProfiles[`${bundleId}`] = provisioningProfile;

  const json = {
    method,
    teamID,
    compileBitcode,
    signingCertificate,
    signingStyle,
    stripSwiftSymbols,
    provisioningProfiles,
  };

  if (!fs.existsSync(`${process.env.BLTmpProcessingDir}`)) {
    execSync(`mkdir ${process.env.BLTmpProcessingDir}`);
  }

  fs.writeFileSync(`${process.env.BLTmpProcessingDir}/exportOptions.plist`, plist.build(json));

  // -destination generic/platform=iOS
  const cmdBuild = `xcodebuild -project ${appName}.xcodeproj -scheme ${scheme || appName} -sdk iphoneos  archive -archivePath ${process.cwd()}/${process.env.BLTmpProcessingDir}/${appName}.xcarchive`;

  // PROVISIONING_PROFILE="${provisioningProfile}"
  logger.info(`Archiving... ${cmdBuild}`);
  await genArchive(cmdBuild);

  const cmdIpa = `xcodebuild -exportArchive -archivePath ${process.cwd()}/${process.env.BLTmpProcessingDir}/${appName}.xcarchive -exportOptionsPlist ${process.cwd()}/${process.env.BLTmpProcessingDir}/exportOptions.plist -exportPath ${process.cwd()}/${process.env.BLTmpProcessingDir}`;

  await genArchive(cmdIpa);

  logger.info(`🎉 Build Generated! ${process.cwd()}/${process.env.BLTmpProcessingDir}/${scheme}.ipa`);
};
