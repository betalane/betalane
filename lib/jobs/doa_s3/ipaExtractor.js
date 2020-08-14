const { execSync } = require('child_process');
const logger = require('../../helper/logger');
const plist = require('plist');
const fs = require('fs');

module.exports = (ipa, filename) => {
  logger.info(`unzip -o -d ${process.cwd()}/${process.env.BLTmpProcessingDir}/${filename} ${ipa}`);
  execSync(`unzip -o -d ${process.cwd()}/${process.env.BLTmpProcessingDir}/${filename} ${ipa}`);
  const path = execSync(`cd ${process.cwd()}/${process.env.BLTmpProcessingDir}/${filename}/Payload/*.app && pwd`).toString().trim();
  logger.info(path);
  const { CFBundleVersion, CFBundleShortVersionString, CFBundleIdentifier, CFBundleName } = plist.parse(fs.readFileSync(`${path}/Info.plist`, 'utf8'));
  logger.info({ CFBundleVersion, CFBundleShortVersionString, CFBundleIdentifier, CFBundleName });
  execSync(`rm -rf ${process.cwd()}/${process.env.BLTmpProcessingDir}/${filename}`);

  return {
    version: CFBundleShortVersionString,
    versionCode: CFBundleVersion,
    bundleId: CFBundleIdentifier,
    bundleName: CFBundleName,
  };
};
// unzip - d ipa GTHubApp - Dev.ipa
// defaults read `pwd`/ipa/Payload/*.app/Info CFBundleVersion 
// rm - rf ipa
