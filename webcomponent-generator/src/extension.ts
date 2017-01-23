'use strict';
// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from 'vscode';
const path = require('path');

const createSnippet = (componentName) => {
return `// <${componentName}></${componentName}>

var componentProto = Object.create(HTMLElement.prototype);

// Lifecycle callbacks
componentProto.createdCallback = function() {
    // initialize, render templates, etc.
};
componentProto.attachedCallback = function() {
    // called when element is inserted into the DOM
    // good place to add event listeners
};
componentProto.detachedCallback = function() {
    // called when element is removed from the DOM
    // good place to remove event listeners
};
componentProto.attributeChangedCallback = function(name, oldVal, newVal) {
    // make changes based on attribute changes
};

// Add a public method
componentProto.doSomething = function() { ... };

document.registerElement('${componentName}', {prototype: componentProto});`;
}

// this method is called when your extension is activated
// your extension is activated the very first time the command is executed
export function activate(context: vscode.ExtensionContext) {
  // Use the console to output diagnostic information (console.log) and errors (console.error)
  // This line of code will only be executed once when your extension is activated
  console.log('Congratulations, your extension "webcomponent-generator" is now active!');

  // The command has been defined in the package.json file
  // Now provide the implementation of the command with  registerCommand
  // The commandId parameter must match the command field in package.json
  let disposable = vscode.commands.registerCommand('extension.createComponent', () => {
      // The code you place here will be executed every time your command is executed

      const editor = vscode.window.activeTextEditor;
      if (!editor) {
          return; // No open text editor
      }

      const componentName = editor.document.fileName.split(path.sep).pop().split('.')[0];

      // create the snippet and do the deed.
      const template = createSnippet(componentName);

      const editorEdit = vscode.window.activeTextEditor;
      editorEdit.edit((editBuilder) => {
          editBuilder.delete(editor.selection);
      }).then(() => {
          editorEdit.edit(function (editBuilder) {
          editBuilder.insert(editor.selection.start, template);
          });
      });


      // Display a message box to the user
      vscode.window.showInformationMessage(`Webcomponent created: ${componentName}`);
  });

  context.subscriptions.push(disposable);
}

// this method is called when your extension is deactivated
export function deactivate() {
  console.log('Bye Bye Ext');
}
