'use strict';
// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from 'vscode';
const path = require('path');

/**
 * There are 2 versions/specs available for defining custom elements (without polyfilling).
 * Using the registerElement which is v0 and using class method in v1.
 * Support: http://caniuse.com/#search=custom
 */

const createSnippetV0 = (componentName) => {
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
};

const createSnippetV1 = (componentName) => {
  const className = componentName.split('-').map(f => f.charAt(0).toUpperCase() + f.slice(1)).join('');
return `// <${componentName}></${componentName}>
class ${className} extends HTMLElement {
  constructor() {
    super(); // always call super() first in the ctor.
    ...
  }
  connectedCallback() {
    ...
  }
  disconnectedCallback() {
    ...
  }
  attributeChangedCallback(attrName, oldVal, newVal) {
    ...
  }
}

window.customElements.define('${componentName}', ${className});`;
};


const createComponent = (vscode, v0 = true) => {
  // The code you place here will be executed every time your command is executed
  const editor = vscode.window.activeTextEditor;
  const fileName = editor.document.fileName;
  let componentName = 'my-component';
  if (!editor) {
      return; // No open text editor
  }

  if (fileName && !fileName.includes('Untitled')) {
    // if we have a file name then take that.
    componentName = fileName.split(path.sep).pop().split('.')[0];
  }

  // its a standard to have - in name. Hence check that.
  if (!componentName || !componentName.includes('-')) {
    // Display a message box to the user saying component name cant be empty or without -
    vscode.window.showInformationMessage(`Cant Create: ${componentName}. Component name invalid.`);
  }

  // create the snippet and do the deed. (change according to type defined.)
  const template = v0 ? createSnippetV0(componentName) : createSnippetV1(componentName);

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
};

// this method is called when your extension is activated
// your extension is activated the very first time the command is executed
export function activate(context: vscode.ExtensionContext) {
  const createComponentV0 = vscode.commands.registerCommand('extension.createComponentV0', () => createComponent(vscode));
  const createComponentV1 = vscode.commands.registerCommand('extension.createComponentV1', () => createComponent(vscode, false));
  context.subscriptions.push(createComponentV0, createComponentV1);
}

// this method is called when your extension is deactivated
export function deactivate() {
  console.log('Bye Bye Ext');
}
