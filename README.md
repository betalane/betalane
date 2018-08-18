Highly inspired by [Fastlane.tools](https://fastlane.tools/) the greatest Automation tool ever for your beta deployments of iOS/Android Builds, but `betalane` is purely made in Javascript and it's super easy to use! 

# Features

* [`build`](#) - Building your app
* [`doa_s3`](#) - Distribute your app on the Air using AWS S3
* [`cli`](#) - Execute any cli command

# Getting Started

Make sure you have the latest version of the Xcode command line tools installed:

```sh
xcode-select --install
```

# Installation

```sh
[sudo] npm i betalane -g
```

Add `.betalane` to your `.gitignore` file

```sh
# Betalane processing directory
.betalane
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

```json
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

```json
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
  `scheme` - (Optional) Scheme, Default: `<Project Name>`
  `target` - (Optional) Target, Default: `<Project Name>`
  `buildConfiguration` - (Optional) Build Configuration, Default: `Debug`
  `compileBitcode` - (Optional) Should complie BitCode?, Default: `NO`, Available options: `YES`, `NO`
  `method` - (Optional) Should complie BitCode?, Default: `NO`, Available options: `app-store`, `ad-hoc`, `development`
  `signingCertificate` - (Optional) Certificate, Default: Auto Selected from Build Setting
  `provisioningProfile` - (Optional) Provisioning Profile, Default: Auto Selected from Build Settings, Available options: `Profile ID`, `Profile Name`
### }