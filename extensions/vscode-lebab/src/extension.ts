'use strict';
// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from 'vscode';
import {transform} from 'lebab';
import {parse} from 'esprima';

/**
 * Definitions
 */
interface IWarning {
  line: number;
  msg: string;
  type: string
};

interface IWarnings extends Array<IWarning>{};

// this method is called when your extension is activated
// your extension is activated the very first time the command is executed
export function activate(context: vscode.ExtensionContext) {
  console.log('Congratulations, your extension "vscode-lebab" is now active!');
  const es5_es6 = vscode.commands.registerCommand('extension.lebab', () => {
    const editor = vscode.window.activeTextEditor;
    const fileName = vscode.window.activeTextEditor.document.fileName;
    if (!editor) {
       return; // No open text editor
    }

    const textCode = editor.document.getText();
    // check for errors in JS code and if yes, then show the error.
    try {
      parse(textCode)
    } catch(err) {
      return vscode.window.showErrorMessage(`ERROR: ${err.description} at ${err.lineNumber}`);
    }
    // transforms: https://github.com/lebab/lebab#safe-transforms
    const {code, warnings}: {code: string, warnings: IWarnings} = transform(textCode, ['arrow', 'let', 'for-of', 'for-each', 'arg-rest', 'arg-spread', 'obj-method', 'obj-shorthand', 'no-strict', 'exponent', 'template']);

    const es6File = vscode.window.activeTextEditor.document.uri.fsPath.replace(/[.*]/, '_es6.');
    const setting: vscode.Uri = vscode.Uri.parse('untitled:' + es6File);
    vscode.workspace.openTextDocument(setting).then((a: vscode.TextDocument) => {
      vscode.window.showTextDocument(a, 1, false)
      .then(e => {
        e.edit(edit => {
          /**
           * If its an untitled file, then we will insert the ES6 after 2 line breaks in same file.
           */
          if (es6File.includes('Untitled')) {
            edit.insert(new vscode.Position(0, 0), `\n \n ${code}`);
          } else {
            // Otherwise create a new file with `name_es6.js` and paste the code.
            edit.insert(new vscode.Position(0, 0), code);
          }
        });
      })
    }, (error: any) => {
      // if we errors, log it. No need to show.
      console.error(error);
    });

    if (warnings.length > 0) {
      const es6Diag = vscode.languages.createDiagnosticCollection('es6');
      let diagnostics: vscode.Diagnostic[] = [];
      warnings.map((warning) => {
        diagnostics.push({
          range: new vscode.Range(warning.line, 0, warning.line - 1, 0),
          message: warning.msg,
          source: 'es5-es6',
          severity: vscode.DiagnosticSeverity.Warning,
          code: 1
        });
      });
      es6Diag.set(vscode.window.activeTextEditor.document.uri, diagnostics);
    }
  });

  context.subscriptions.push(es5_es6);
}

// this method is called when your extension is deactivated
export function deactivate() {
  console.log('Ext deactived.');
}
