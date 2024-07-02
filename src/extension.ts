import * as vscode from "vscode";
import * as fs from "fs/promises";
import * as path from "path";

/**
 * This function is called when your extension is activated.
 * It registers a command "dryfs.makeMyFolder" that creates a new module folder structure
 * based on the template defined in a configuration file located in VS Code settings.
 *
 * @param context - The context in which the extension is run, provided by VSCode.
 */
export function activate(context: vscode.ExtensionContext) {
  // Registering the command.
  const disposable = vscode.commands.registerCommand(
    "dryfs.makeMyFolder",
    async (uri: vscode.Uri) => {
      try {
        // Prompting the user to input the module name.
        const moduleName = await getModuleName();

        if (!moduleName) {
          return;
        }

        // Reading the configuration file.
        const config = getConfig();

        if (!validateConfig(config)) {
          vscode.window.showErrorMessage("Invalid configuration in settings");
          return;
        }
        // Getting the folder path from the URI.
        const folderPath = await getFolderPath(uri);

        // Creating the new folder if it doesn't exist.
        await createFolderIfNotExists(folderPath);

        // Creating folders and files based on the configuration.
        await createFoldersAndFiles(folderPath, config, moduleName);

        vscode.window.showInformationMessage(
          "Folder and files created successfully!"
        );
      } catch (error: unknown) {
        if (error instanceof Error) {
          vscode.window.showErrorMessage(
            `Error creating folder and files: ${error.message}`
          );
          return;
        }

        vscode.window.showErrorMessage(
          `Unknown error occurred while creating folder and files`
        );
      }
    }
  );

  // Adding the command to the context's subscriptions.
  context.subscriptions.push(disposable);
}

export function deactivate() {}

/** Function to prompt the user to input the module name. */
async function getModuleName(): Promise<string | undefined> {
  return vscode.window.showInputBox({ prompt: "Enter the module name" });
}

/**  Function to get the folder path from the URI. */
async function getFolderPath(uri: vscode.Uri): Promise<string> {
  const stat = await fs.lstat(uri.fsPath);
  return stat.isDirectory() ? uri.fsPath : path.dirname(uri.fsPath);
}

/** Function to check if a file exists. */
async function fileExists(filePath: string): Promise<boolean> {
  try {
    await fs.stat(filePath);
    return true;
  } catch {
    return false;
  }
}

/** Function to get the configuration from VS Code settings. */
function getConfig(): any {
  const config = vscode.workspace.getConfiguration("dryfs");
  return config.get("rootFolder");
}

/** Function to validate the configuration file format. */
function validateConfig(config: any): boolean {
  // Basic validation logic; can be extended as needed
  return config && typeof config === "object" && config.folders && config.files;
}

/** Function to create a folder if it doesn't exist. */
async function createFolderIfNotExists(folderPath: string) {
  try {
    if (!(await fileExists(folderPath))) {
      await fs.mkdir(folderPath, { recursive: true });
    }
  } catch (error) {
    throw new Error(
      `Failed to create folder ${folderPath}: ${
        error instanceof Error ? error.message : "Unknown error"
      }`
    );
  }
}

/** Function to create folders and files based on the configuration. */
async function createFoldersAndFiles(
  basePath: string,
  config: any,
  moduleName: string
) {
  async function createFolder(folderPath: string) {
    try {
      if (!(await fileExists(folderPath))) {
        await fs.mkdir(folderPath, { recursive: true });
      }
    } catch (error) {
      if (error instanceof Error) {
        throw new Error(
          `Failed to create folder ${folderPath}: ${error.message}`
        );
      }

      throw new Error(`Failed to create folder ${folderPath}: Unknown error`);
    }
  }

  async function processFolders(base: string, folders: any[]) {
    for (const folder of folders) {
      const folderPath = path.join(
        base,
        folder.name.replace("{moduleName}", moduleName)
      );
      await createFolder(folderPath);
      if (folder.folders) {
        await processFolders(folderPath, folder.folders);
      }

      if (folder.files) {
        await processFiles(folderPath, folder.files, moduleName);
      }
    }
  }

  async function processFiles(base: string, files: any[], moduleName: string) {
    for (const file of files) {
      const fileName = file.name.replace("{moduleName}", moduleName);
      const content = file.content
        ? file.content.replace(/{moduleName}/g, moduleName)
        : "";
      await createFile(base, fileName, content);
    }
  }

  await processFolders(basePath, config.folders);
  await processFiles(basePath, config.files, moduleName);
}

/** Function to create a file. */
async function createFile(
  folderPath: string,
  fileName: string,
  content: string
) {
  const filePath = path.join(folderPath, fileName);

  try {
    // Check if the folder exists, if not create it
    await fs.mkdir(folderPath, { recursive: true });

    // Check if the file exists and handle the overwrite option
    const fileExistsFlag = await fileExists(filePath);
    if (fileExistsFlag) {
      throw new Error(
        `File ${filePath} already exists and overwrite is disabled`
      );
    }

    await fs.writeFile(filePath, content);
  } catch (error) {
    throw new Error(
      `Failed to create file ${filePath}: ${
        error instanceof Error ? error.message : "Unknown error"
      }`
    );
  }
}
