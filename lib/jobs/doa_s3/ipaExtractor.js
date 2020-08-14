const { execSync } = require('child_process');
const logger = require('../../helper/logger');
const plist = require('plist');
const fs = require('fs');

module.exports = (ipa, filename) => {
  execSync(`unzip -o -d ${process.cwd()}/${process.env.BLTmpProcessingDir}/${filename} ${ipa}`);
  const path = execSync(`cd ${process.cwd()}/${process.env.BLTmpProcessingDir}/${filename}/Payload/*.app && pwd`).toString().trim();
  const { CFBundleVersion, CFBundleShortVersionString, CFBundleIdentifier, CFBundleName } = plist.parse(fs.readFileSync(`${path}/Info.plist`, 'utf8'));
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
