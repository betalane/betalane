xcodebuild -project GTHubApp.xcodeproj -scheme GTHubApp-Dev -destination generic/platform=iOS archive -archivePath $PWD/build/CLI.xcarchive PROVISIONING_PROFILE="e9890938-67cd-4e01-a197-7a43c2e355a4" 

xcodebuild -exportArchive -archivePath $PWD/build/CLI.xcarchive -exportOptionsPlist exportOptions.plist -exportPath $PWD/build PROVISIONING_PROFILE="e9890938-67cd-4e01-a197-7a43c2e355a4"

72QNZQDWV7

<key>com.gtbank.gthub.dev</key>
<string>Habari Dev</string>


s3-cli put --acl-public build/Packaging.log s3://beta-apps-plist/builds/Packa.log


xcodebuild -exportArchive -archivePath $PWD/.betalane/GTHubApp.xcarchive -exportOptionsPlist $PWD/.betalane/exportOptions.plist -exportPath $PWD/.betalane\

xcodebuild -project GTHubApp.xcodeproj -scheme GTHubApp-Dev -destination generic/platform=iOS archive -archivePath $PWD/build/CLI.xcarchive PROVISIONING_PROFILE="e9890938-67cd-4e01-a197-7a43c2e355a4"