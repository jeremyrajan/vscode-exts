'use strict';
// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from 'vscode';
import * as browsersync from 'browser-sync';
import { openUrl } from './utils';

let browserSyncServer, statusBarItem;

// this method is called when your extension is activated
// your extension is activated the very first time the command is executed
export function activate(context: vscode.ExtensionContext) {

  // Use the console to output diagnostic information (console.log) and errors (console.error)
  // This line of code will only be executed once when your extension is activated
  console.log('Congratulations, your extension "browsersync" is now active!');

  // The command has been defined in the package.json file
  // Now provide the implementation of the command with  registerCommand
  // The commandId parameter must match the command field in package.json
  let startServer = vscode.commands.registerCommand('extension.startServer', (m) => {
    // The code you place here will be executed every time your command is executed
    // Display a message box to the user
    const folderPath = m.path;
    if (!m.path) {
      return vscode.window.showErrorMessage('Unable to find the directory to serve. Exiting');
    }

    browserSyncServer = browsersync.create();
    browserSyncServer.init({
      serveStatic: [folderPath],
      logLevel: 'silent',
      watchOptions: {
        ignoreInitial: true,
        ignored: '*.txt'
      },
      files: [folderPath]
    });

    browserSyncServer.emitter.on('service:running', (details) => {
      vscode.window.showInformationMessage(`BrowserSync [with reload] running at ${details.url}`);
      openUrl(details.url);
      statusBarItem = vscode.window.createStatusBarItem(vscode.StatusBarAlignment.Left);
      statusBarItem.command = 'extension.openInBrowser';
      statusBarItem.text = `$(link-external) ${details.url}`;
      statusBarItem.show();
    });
  });

  // open in browser
  let openInBrowser = vscode.commands.registerCommand('extension.openInBrowser', () => {
    vscode.window.showQuickPick(['Restart', 'Stop'])
      .then(result => {
        if (!result) {
          return;
        }
        const cmd = result.toLowerCase();
        statusBarItem.hide();
        if (cmd === 'restart') {
          return browserSyncServer.reload();
        }
        vscode.window.showInformationMessage(`BrowserSync is shutting down.`);
        return browserSyncServer.exit();
      });
  });

  context.subscriptions.push(startServer);
}

// this method is called when your extension is deactivated
export function deactivate() {
  browserSyncServer = statusBarItem = null;
}