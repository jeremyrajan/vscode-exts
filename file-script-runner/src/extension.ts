'use strict';
// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from 'vscode';

// this method is called when your extension is activated
// your extension is activated the very first time the command is executed
export function activate(context: vscode.ExtensionContext) {

  let term: vscode.Terminal | any;

  // Use the console to output diagnostic information (console.log) and errors (console.error)
  // This line of code will only be executed once when your extension is activated
  console.log('Congratulations, your extension "file-script-runner" is now active!');

  // The command has been defined in the package.json file
  // Now provide the implementation of the command with  registerCommand
  // The commandId parameter must match the command field in package.json
  let disposable = vscode.commands.registerCommand('extension.run', (m) => {
    // The code you place here will be executed every time your command is executed

    // Display a message box to the user
    const filePath = m.path;
    const config = vscode.workspace.getConfiguration('fileScriptRunner');

    if (!config.script) {
      vscode.window.showErrorMessage('Please setup a script to run!');
      return;
    }
    
    if (!term) {
      term = vscode.window.createTerminal('file-script-runner');
    }
    term.show();
    term.sendText(`${config.script} ${filePath}`, true);

    vscode.window.onDidCloseTerminal((activeTerminal:any) => {
      if (activeTerminal._id === term._id) {
        term.dispose();
        term = null;
      }
    });
  });

  context.subscriptions.push(disposable);
}

// this method is called when your extension is deactivated
export function deactivate() {
}