Highly inspired by [Fastlane.tools](https://fastlane.tools/) the greatest Automation tool ever for your beta deployments of iOS/Android Builds, but `betalane` is purely made in Javascript and it's super easy to use! 

# Features

* [`build`](#build---building-your-app) - Building your app
* [`doa_s3`](#doa_s3---distribute-on-the-air-using-aws-s3) - Distribute on the Air using AWS S3
* [`cli`](#cli---execute-any-cli-command) - Execute any cli command

# Getting Started

Make sure you have the latest version of the Xcode command line tools installed:

```sh
xcode-select --install
```

# Installation

```sh
[sudo] npm i betalane -g
```


# Setup

1. Create `betalane.json` on the root of your project.
```
.
├── Example
├── Example.xcodeproj
└── betalane.json
```

2. Confgiure `lane` and `jobs` in `betalane.json` file as shown in the following example

```javascript
[
  {
    "laneName": "beta",
    "jobs": [
      {
        "job": "cli",
        "options": {
          "cmd": "cd Example && carthage update --platform iOS"
        }
      },
      {
        "job": "build",
        "options": {
          "scheme": "Example-Dev",
          "provisioningProfile": "e9890938-67cd-4e01-a197-7a43c2e355a4"
        }
      }
    ]
  }
]
```


3. Add `.betalane` to your `.gitignore` file

```sh
# Betalane processing directory
.betalane
```

# In action...

From the root of your project execute the following command 
```sh
$ betalane [lane] [job]
```

### Example 1 - excute all `lanes` and all `jobs`
```sh
$ betalane
```

### Example 2 - excute specific `lane` and all it's `jobs`
```shell
$ betalane beta
```

### Example 3 - excute specific `lane` and specific `job`
```shell
$ betalane beta build
```

# Documentation

## `build` - Building your app

```javascript
{
  "job": "build",
  "options": {
    "scheme": "Example-Dev",
    "target": "Example",
    "buildConfiguration": "Debug",
    "method": "development",
    "signingCertificate": "iOS Developer",
    "compileBitcode": "NO",
    "provisioningProfile": "e9890938-67cd-4e01-a197-7a43c2e355a4"
  }
}
```

### `options` : {
  property | Optional | Description | Default | Available Options
--- | --- | --- | --- | ---
`scheme` | (Optional) | Scheme | `<Project Name>`
`target` | (Optional) | Target | `<Project Name>`
`buildConfiguration` | (Optional) | Build Configuration | `Debug`
`compileBitcode` | (Optional) | Should complie BitCode? | `NO` | `YES`, `NO`
`method` | (Optional) | Distribution Method | `development` | `app-store`, `ad-hoc`, `development`
`signingCertificate` | (Optional) | Certificate | Auto Selected from Build Setting
`provisioningProfile` | (Optional) | Provisioning Profile | Auto Selected from Build Settings | `Profile ID`, `Profile Name`
### }

### Output Params
  Params | Description | Sample Value
--- | --- | ---
BL_BUILD_ARCHIVE_PATH | Archive path | `/Users/jay.mehta/Example/.betalane/Example.xcarchive`
BL_BUILD_IPA_PATH | IPA File path | `/Users/jay.mehta/Example/.betalane/Example-Dev.ipa`

## `doa_s3` - Distribute on the Air using AWS S3
```javascript
{
  "job": "doa_s3",
  "options": {
    "AccessKeyID": "AKXXXXXXXXXEXAMPLE",
    "SecretAccessKey": "wJXXXXXXXXXX/K7XXXXXX/XXXXXXXEXAMPLEKEY",
    "s3Bucket": "example-beta-builds",
    "region": "us-east-2",
    "prefix": "builds/ios/",
    "buildPath" : "env.BL_BUILD_IPA_PATH"
  }
}
```

### `options` : {
  property | Optional | Description | Default | Available Options
--- | --- | --- | --- | ---
`AccessKeyID` | Required | AccessKeyID - Obtain from IAM
`SecretAccessKey` | Required | SecretAccessKey - Obtain from IAM
`s3Bucket` | Required | AWS S3 Bucket Name
`region` | Required | AWS S3 Bucket Region
`prefix` | (Optional) | S3 Key Prefix | `betalane/`
`buildPath` | (Optional) | Build Path to upload on S3 | `env.BL_BUILD_IPA_PATH` - Env variable exposed by `build` job
### }

### Output Params
  Params | Description | Sample Value
--- | --- | ---
BL_DOA_S3_BUILD_URL | Build Url | `https://example-beta-builds.s3.amazonaws.com/doa-beta-20-Aug-2018-14-40-58/package.ipa`
BL_DOA_S3_MANIFEST_URL | Menifest Url | `https://example-beta-builds.s3.amazonaws.com/doa-beta-20-Aug-2018-14-40-58/manifest.plist`
BL_DOA_S3_INSTALL_URL | Installable Url | `https://example-beta-builds.s3.amazonaws.com/doa-beta-20-Aug-2018-14-40-58/download.html`

### IAM Policy Sample

```javascript
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Sid": "StmtBetalaneS3Policy",
      "Action": [
        "s3:PutObject",
        "s3:PutObjectAcl"
      ],
      "Effect": "Allow",
      "Resource": "arn:aws:s3:::example-beta-builds/*"
    }
  ]
}
```
### Steps to create S3 bucket
1. Login to [AWS Console](https://console.aws.amazon.com/console/home)
2. Click on S3 service
3. Create Bucket
4. Enter "Bucket Name", Click "Next", "Next", "Next", "Cerate Bucket".

### Steps to create IAM User

1. Login to [AWS Console](https://console.aws.amazon.com/console/home)
2. Click on IAM service
3. Select Policies from left side menu
4. Select "Create Policy"
5. Click on "JSON" tab
6. Replace JSON with above sample and change bucket name in `Resource` key
7. Click "Review Policy"
8. Name your policy, e.g. Example Beta Lane S3 Policy
9. Click "Create Policy"
10. Now select "Users" from left side menu
11. Click "Add User"
12. Give some "Username", and select "Programmatic access" from Access Type.
13. Select "Attach Existing Policy"
14. Look for the policy you just created and select it, Click "Next: Review"
15. Review and Click "Create"
16. Download CSV file containing your `AccessKeyID` and `SecretAccessKey`

## `cli` - Execute any cli command

```javascript
{
  "job": "cli",
  "options": {
    "cmd": "cd Example && carthage update --platform iOS"
  }
}
```

### `options` : {
  property | Optional | Description | Default | Available Options
--- | --- | --- | --- | ---
`cmd` | Required | Command to be performed
### }