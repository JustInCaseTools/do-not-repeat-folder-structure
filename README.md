## Intro

Introducing an extension that saves you time in creating folders.

## Features

- With just one click and a single input, you can effortlessly create complex, repetitive folder structures.
- You can customize and save folder structures, folder names, file names, and even the content within files through the configuration file.

## Usage

To use the `Make My Folder` feature in your VS Code environment, follow these simple steps:

### 1. **Configure Settings**

First, configure the folder and file structure in your `.vscode/settings.json` file. Here is an example configuration:

```json
{
  "dryfs.rootFolder": {
    "folders": [
      {
        "name": "{moduleName}",
        "folders": [
          {
            "name": "components",
            "files": [
              {
                "name": "{moduleName}.tsx"
              }
            ]
          },
          {
            "name": "styles",
            "files": [
              {
                "name": "{moduleName}.module.css"
              }
            ]
          }
        ],
        "files": [
          {
            "name": "index.ts",
            "content": "export { default } from './{moduleName}';"
          },
          {
            "name": "types.ts"
          }
        ]
      }
    ],
    "files": []
  }
}
```

### 2. **Right-click** on the folder in the VS Code Explorer where you want to create your new component structure and select **Make My Folder** from the context menu.

<!-- ![usage_1](/images/usage_1.png) -->

<img src="/images/usage_1.png" alt="usage_1" width="480" />

### 4. You will be prompted to enter the **name of your new folder**. Type the desired name and press **Enter**.

<!-- ![usage_2](/images/usage_2.png) -->
<img src="/images/usage_2.png" alt="usage_2" width="480" />

### 5. The extension will automatically generate a new folder with the specified name and the predefined set of files:

<img src="/images/usage_3.png" alt="usage_3" width="480" />

# Requirement

- This extension requires Visual Studio Code version 1.82.0 or above.

# Contributing

If you'd like to contribute to the development of DRYFS, please create a pull request or raise an issue on the repository.

# Known Issues

No known issues at the moment.

# Release Notes

## 1.0.0

Introduced the "Make My Folder" feature, which allows users to quickly generate a folder structure for their project.

---

**Enjoy the simplicity and efficiency of creating new components with `dryfs`!**
