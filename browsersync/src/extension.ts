'use strict';
// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from 'vscode';
import * as browsersync from 'browser-sync';
import { openUrl } from './utils';

let browserSyncServer: browsersync.BrowserSyncInstance, statusBarItem: vscode.StatusBarItem;

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
    let folderPath = m.path;
    if (!folderPath) {
      return vscode.window.showErrorMessage('Unable to find the directory to serve. Exiting');
    }

    if (process.platform === 'win32') {
      console.log('BrowserSync (WIN): Replace paths');
      folderPath = m.fsPath;
    }

    // if we already have a server active. Close that first.
    if (browserSyncServer) {
      vscode.window.showWarningMessage(`Shutting down the existing server at localhost:3000`);
      browserSyncServer.exit();
      browserSyncServer = null;
      statusBarItem.dispose();
      statusBarItem = null;
    }

    const configuration = vscode.workspace.getConfiguration('browsersync');
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
      if (configuration.get('openBrowser')) {
        openUrl(details.url);
      }
      statusBarItem = vscode.window.createStatusBarItem(vscode.StatusBarAlignment.Left);
      statusBarItem.command = 'extension.openInBrowser';
      statusBarItem.text = `$(link-external) ${details.url}`;
      statusBarItem.color = '#fff';
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
  if (browserSyncServer) {
    browserSyncServer.exit();
  }

  if (statusBarItem) {
    statusBarItem.dispose();
  }
  browserSyncServer = statusBarItem = null;
}