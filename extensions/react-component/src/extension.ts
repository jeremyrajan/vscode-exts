'use strict';
// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from 'vscode';
import {format} from 'prettier';
import {capitalize} from './utils';
const path = require('path');

const prettyConfig = {
  // Fit code within this line limit
  printWidth: 80,
  // Number of spaces it should use per tab
  tabWidth: 2,
  // If true, will use single instead of double quotes
  singleQuote: true,
  // Controls the printing of trailing commas wherever possible
  trailingComma: false,
  // Controls the printing of spaces inside array and objects
  bracketSpacing: true,
  // Which parser to use. Valid options are 'flow' and 'babylon'
  parser: 'babylon'
};

const getComponentName = (vscode) => {
  const editor = vscode.window.activeTextEditor;
  const fileName = editor.document.fileName;
  let componentName = 'MyComponent';
  if (!editor) {
    return; // No open text editor
  }

  if (fileName && !fileName.includes('Untitled')) {
    // if we have a file name then take that.
    componentName = fileName.split(path.sep).pop().split('.')[0];
  }

  return capitalize(componentName);
}

const createComponentCode = (componentName) => {
  const boilerplate = `import React from 'react';

    class ${componentName} extends React.Component {
      constructor() {
        super();
        this.state = {
          someKey: 'someValue'
        };
      }

      render() {
        return (
          <p>{this.state.someKey}</p>
        );
      }

      componentDidMount() {
        this.setState({
          someKey: 'otherValue'
        });
      }
    }

    export default ${componentName};`

  return format(boilerplate, prettyConfig); // make things pretty, because who doesnt like pretty.
};

// this method is called when your extension is activated
// your extension is activated the very first time the command is executed
export function activate(context: vscode.ExtensionContext) {
  const createComponent = vscode.commands.registerCommand('extension.createComponent', () => {
    const componentName = getComponentName(vscode)
    const componentCode = createComponentCode(componentName)

    // writes the code
    const editor = vscode.window.activeTextEditor;
    const editorEdit = vscode.window.activeTextEditor;
    editorEdit.edit((editBuilder) => {
      editBuilder.delete(editor.selection);
    }).then(() => {
      editorEdit.edit((editBuilder) => {
        editBuilder.insert(editor.selection.start, componentCode);
      });
    });
  });
  context.subscriptions.push(createComponent);
}

// this method is called when your extension is deactivated
export function deactivate() {
  console.log('React Component EXT deactivated.');
}
