"use strict";
// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from "vscode";
import * as browsersync from "browser-sync";
import { openUrl } from "./utils";

let browserSyncServer: browsersync.BrowserSyncInstance;
let statusBarItem: vscode.StatusBarItem;
let statusBarItemExt: vscode.StatusBarItem;
let browserSyncDetails: any;

// this method is called when your extension is activated
// your extension is activated the very first time the command is executed
export function activate(context: vscode.ExtensionContext) {
  // Use the console to output diagnostic information (console.log) and errors (console.error)
  // This line of code will only be executed once when your extension is activated
  console.log('Congratulations, your extension "browsersync" is now active!');

  // The command has been defined in the package.json file
  // Now provide the implementation of the command with  registerCommand
  // The commandId parameter must match the command field in package.json
  let startServer = vscode.commands.registerCommand(
    "extension.startServer",
    m => {
      // The code you place here will be executed every time your command is executed
      // Display a message box to the user
      let folderPath = m.path;
      if (!folderPath) {
        return vscode.window.showErrorMessage(
          "Unable to find the directory to serve. Exiting"
        );
      }

      if (process.platform === "win32") {
        console.log("BrowserSync (WIN): Replace paths");
        folderPath = m.fsPath;
      }

      // if we already have a server active. Close that first.
      if (browserSyncServer) {
        vscode.window.showWarningMessage(
          `Shutting down the existing server at localhost:3000`
        );
        browserSyncServer.exit();
        browserSyncServer = null;
        statusBarItem.dispose();
        statusBarItem = null;
      }

      const configuration = vscode.workspace.getConfiguration("browsersync");
      browserSyncServer = browsersync.create();
      const defaultConfig = Object.assign({}, configuration.options, {
        serveStatic: [folderPath],
        logLevel: "silent",
        watchOptions: {
          ignoreInitial: true,
          ignored: "*.txt"
        },
        files: [folderPath]
      });

      browserSyncServer.init(defaultConfig);

      browserSyncServer.emitter.on("service:running", details => {
        browserSyncDetails = details;
        vscode.window.showInformationMessage(
          `BrowserSync (external) [with reload] running at ${details.urls.external}`
        );
        vscode.window.showInformationMessage(
          `BrowserSync [with reload] running at ${details.url}`
        );

        const isLocal =
          configuration.get("openBrowser") &&
          !configuration.get("openExternal");

        isLocal ? openUrl(details.url) : openUrl(details.urls.external);

        statusBarItem = vscode.window.createStatusBarItem(
          "local",
          vscode.StatusBarAlignment.Left
        );
        statusBarItem.command = "extension.openInBrowser";
        statusBarItem.text = `$(link-external) ${
          isLocal ? details.url : details.urls.external
        }`;
        statusBarItem.color = "#fff";
        statusBarItem.show();
      });

      // open in browser
      let openInBrowser = vscode.commands.registerCommand(
        "extension.openInBrowser",
        () => {
          vscode.window
            .showQuickPick(["Open", "Restart", "Stop"])
            .then(result => {
              if (!result) {
                return;
              }

              const cmd = result.toLowerCase();

              if (cmd === "restart") {
                return browserSyncServer.reload();
              }

              if (cmd === "open") {
                const configuration = vscode.workspace.getConfiguration(
                  "browsersync"
                );
                const isLocal =
                  configuration.get("openBrowser") &&
                  !configuration.get("openExternal");

                isLocal
                  ? openUrl(browserSyncDetails.url)
                  : openUrl(browserSyncDetails.urls.external);

                return;
              }

              vscode.window.showInformationMessage(
                `BrowserSync is shutting down.`
              );
              return browserSyncServer.exit();
            });
        }
      );

      context.subscriptions.push(startServer);
    }
  );
}

// this method is called when your extension is deactivated
export function deactivate() {
  if (browserSyncServer) {
    browserSyncServer.exit();
  }

  if (statusBarItem) {
    statusBarItem.dispose();
  }

  if (statusBarItemExt) {
    statusBarItemExt.dispose();
  }

  browserSyncServer = statusBarItem = null;
}
