Highly inspired by [Fastlane.tools](https://fastlane.tools/) the greatest Automation tool ever for your beta deployments of iOS/Android Builds, but `betalane` is purely made in Javascript and it's super easy to use! 

# Features

* `build` - Building your app
* `cli` - Execute any cli command

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

# Execute.

From the root of your project execute the following command 
```sh
$ betalane [lane] [job]
```

### Example 1 - excute all `lanes` and all `jobs`
```sh
$ betalane
```

### Example 2 - excute specific `lane` and all it's `jobs`
```sh
$ betalane beta
```

### Example 3 - excute specific `lane` and specific `job`
```sh
$ betalane beta build
```