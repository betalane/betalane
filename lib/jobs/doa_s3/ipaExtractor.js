const { execSync } = require('child_process');
const logger = require('../../helper/logger');
const plist = require('plist');
const fs = require('fs');
var isXML = require('is-xml');

module.exports = (ipa, filename) => {
  execSync(`unzip -o -d ${process.cwd()}/${process.env.BLTmpProcessingDir}/${filename} ${ipa}`);
  const path = execSync(`cd ${process.cwd()}/${process.env.BLTmpProcessingDir}/${filename}/Payload/*.app && pwd`).toString().trim();
  console.log(10, path);

  const plistContent = fs.readFileSync(`${path}/Info.plist`, 'utf8');

  console.log(14, plistContent);

  let CFBundleVersion, CFBundleShortVersionString, CFBundleIdentifier, CFBundleName;

  if (isXML(plistContent)) {
    const parsed = plist.parse(plistContent);
    console.log(20, parsed);
    { CFBundleVersion, CFBundleShortVersionString, CFBundleIdentifier, CFBundleName } = parsed;
  } else {
    const decodePlistCmd = `/usr/bin/plistutil -i ${path}/Info.plist`;
    const decodedPlist = execSync(decodePlistCmd).toString().trim();
    const parsed = plist.parse(decodedPlist);
    console.log(26, parsed);
    { CFBundleVersion, CFBundleShortVersionString, CFBundleIdentifier, CFBundleName } = parsed;
  }

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
