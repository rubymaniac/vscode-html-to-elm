'use strict';

import * as vscode from 'vscode';
import * as parser from './parser';

let convert = () => {
    let editor = vscode.window.activeTextEditor;
    let selectedText = editor.document.getText(editor.selection);
    let tabSize = editor.options.tabSize;
    let withSpaces = editor.options.insertSpaces;

    if (selectedText.length === 0) {
        vscode.window.showWarningMessage('No selection has been made. Select some HTML text and try again.');
        return;
    } else {
        editor.edit((editBuilder: vscode.TextEditorEdit) => {
            editBuilder.replace(editor.selection, parser.convert(selectedText, {
                indent: {
                    with: withSpaces ? ' ' : '\t',
                    size: withSpaces ? Number(tabSize) : 1
                }
            }));
        }).then(() => {
        });
    }
}

export function activate(context: vscode.ExtensionContext) {
    context.subscriptions.push(vscode.commands.registerCommand('htmlToElm.convert', convert));
}

export function deactivate() {
}