import * as vscode from 'vscode';
import { encryptCommand } from './encrypt';
import { decryptCommand } from './decrypt';

export function activate(ctx: vscode.ExtensionContext) {
    ctx.subscriptions.push(vscode.commands.registerCommand('hiera-eyaml.encrypt', () => { encryptCommand(); }));
    ctx.subscriptions.push(vscode.commands.registerCommand('hiera-eyaml.decrypt', () => { decryptCommand(); }));
}

export function deactivate() {
}