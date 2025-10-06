const { execSync } = require('child_process');
const logger = require('../../helper/logger');
const plist = require('plist');
const fs = require('fs');
var isXML = require('is-xml');

function readPlist(path) {
  // Convert the plist to JSON using plutil
  const decodePlistCmd = `plutil -convert json -o - "${path}/Info.plist"`;
  const decodedPlist = execSync(decodePlistCmd).toString().trim();

  // Parse the JSON directly
  const parsed = JSON.parse(decodedPlist);

  return {
    CFBundleVersion: parsed.CFBundleVersion,
    CFBundleShortVersionString: parsed.CFBundleShortVersionString,
    CFBundleIdentifier: parsed.CFBundleIdentifier,
    CFBundleName: parsed.CFBundleName,
    CFBundleDisplayName: parsed.CFBundleDisplayName,
    AppName: parsed.CFBundleDisplayName || parsed.CFBundleName || parsed.CFBundleExecutable,
  };
}

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
    const info = readPlist(path);
    CFBundleVersion = info.CFBundleVersion;
    CFBundleShortVersionString = info.CFBundleShortVersionString;
    CFBundleIdentifier = info.CFBundleIdentifier;
    CFBundleName = info.CFBundleName;
    AppName = info.AppName;
  }

  execSync(`rm -rf ${process.cwd()}/${process.env.BLTmpProcessingDir}/${filename}`);

  return {
    version: CFBundleShortVersionString,
    versionCode: CFBundleVersion,
    bundleId: CFBundleIdentifier,
    bundleName: CFBundleName,
    appName: AppName,
  };
};
// unzip - d ipa GTHubApp - Dev.ipa
// defaults read `pwd`/ipa/Payload/*.app/Info CFBundleVersion 
// rm - rf ipa
