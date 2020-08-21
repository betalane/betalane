const { execSync } = require('child_process');
const logger = require('../../helper/logger');
const plist = require('plist');
const fs = require('fs');
var isXML = require('is-xml');

module.exports = (ipa, filename) => {
  execSync(`unzip -o -d ${process.cwd()}/${process.env.BLTmpProcessingDir}/${filename} ${ipa}`);
  const path = execSync(`cd ${process.cwd()}/${process.env.BLTmpProcessingDir}/${filename}/Payload/*.app && pwd`).toString().trim();

  const plistContent = fs.readFileSync(`${path}/Info.plist`, 'utf8');

  let CFBundleVersion, CFBundleShortVersionString, CFBundleIdentifier, CFBundleName;

  if (isXML(plistContent)) {
    const parsed = plist.parse(plistContent);
    CFBundleVersion = parsed.CFBundleVersion;
    CFBundleShortVersionString = parsed.CFBundleShortVersionString;
    CFBundleIdentifier = parsed.CFBundleIdentifier;
    CFBundleName = parsed.CFBundleName;
  } else {
    const decodePlistCmd = `/usr/bin/plistutil -i ${path}/Info.plist`;
    const decodedPlist = execSync(decodePlistCmd).toString().trim();
    const parsed = plist.parse(decodedPlist);
    CFBundleVersion = parsed.CFBundleVersion;
    CFBundleShortVersionString = parsed.CFBundleShortVersionString;
    CFBundleIdentifier = parsed.CFBundleIdentifier;
    CFBundleName = parsed.CFBundleName;
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
