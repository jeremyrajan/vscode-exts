'use strict';
// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from 'vscode';
const path = require('path');
import { getWebpackConfig, createFile, formatCode, checkExists, updateDevDependencies } from './utils';

export function activate(context: vscode.ExtensionContext) {
  console.log('Congratulations, your extension "webpack" is now active!');
  const disposable = vscode.commands.registerCommand('extension.createConfig', () => {
    const rootPath = vscode.workspace.rootPath;
    
    // if a folder is not open, then bail.
    if (!rootPath) {
      vscode.window.showErrorMessage('Please open a folder before generating a webpack file');
    }

    const webPackPath = path.join(rootPath, 'webpack.config.js')
    if (checkExists(webPackPath)) {
      return vscode.window.showInformationMessage('Webpack config already exists.');
    }
    const webPackConfig = formatCode(getWebpackConfig()); // get the webpack config
    const isDevDepsUpdated = updateDevDependencies(); // update dev deps
    if (createFile(webPackPath, webPackConfig) && isDevDepsUpdated) { // if written and updated
      return vscode.window.showInformationMessage('Webpack config created and dependencies update. Please run npm install');
    }
    return vscode.window.showErrorMessage('Something went wrong, please try again.');
    
  });

  context.subscriptions.push(disposable);
}

// this method is called when your extension is deactivated
export function deactivate() {
  console.log('Webpack ext deactived.');
}
