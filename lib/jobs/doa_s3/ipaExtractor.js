const { execSync } = require('child_process');

module.exports = (ipa) => {
  execSync(`unzip -o -d ${process.cwd()}/${process.env.BLTmpProcessingDir}/ipa ${ipa}`);
  const version = execSync(`cd ${process.cwd()}/${process.env.BLTmpProcessingDir}/ipa/Payload/*.app && defaults read \`pwd\`/Info CFBundleShortVersionString`).toString().trim();
  const bundleId = execSync(`cd ${process.cwd()}/${process.env.BLTmpProcessingDir}/ipa/Payload/*.app && defaults read \`pwd\`/Info CFBundleIdentifier`).toString().trim();
  const bundleName = execSync(`cd ${process.cwd()}/${process.env.BLTmpProcessingDir}/ipa/Payload/*.app && defaults read \`pwd\`/Info CFBundleName`).toString().trim();

  execSync(`rm -rf ${process.cwd()}/${process.env.BLTmpProcessingDir}/ipa`);

  return {
    version,
    bundleId,
    bundleName,
  };
};
// unzip - d ipa GTHubApp - Dev.ipa
// defaults read `pwd`/ipa/Payload/*.app/Info CFBundleVersion 
// rm - rf ipa
