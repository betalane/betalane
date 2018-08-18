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

```json
[
  {
    "laneName": "beta",
    "jobs": [ // Jobs Array - Perform Jobs in sync manner - One after another...
      {
        "action": "cli", // action name
        "options": { // action options
          "cmd": "cd GTHubApp && carthage update --platform iOS"
        }
      },
      {
        "action": "build", // action name
        "options": { // action options
          "scheme": "GTHubApp-Dev",
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
betalane
```