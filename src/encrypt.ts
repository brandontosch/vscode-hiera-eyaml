import * as vscode from 'vscode';
import { exec } from 'child_process';

export function encryptCommand() {
    const configuration = vscode.workspace.getConfiguration("hiera-eyaml");
    const workspaceDir = vscode.workspace.rootPath;
    const output = vscode.window.createOutputChannel("hiera-eyaml");

    var editor = vscode.window.activeTextEditor;
    if (!editor) {
        return;
    }
    
    var selection = editor.selection;
    if (selection.isEmpty) {
        return;
    }

    var path = "";
    var publicKeyPath = "C:\\Users\\brand\\Source\\inf\\control-repo\\keys\\public_key.pkcs7.pem";
    var text = editor.document.getText(selection);
    var blockSize = 74;
    
    encrypt(path, text, publicKeyPath).then((encrypted) => {
        editor.edit((builder) => {
            builder.replace(selection, blockFormat(encrypted, blockSize));
        });
    }).catch((error) => {
        output.appendLine("hiera-eyaml.encrypt: Failed: ");
        output.append(error);
        vscode.window.showErrorMessage("Encryption failed, more information in the output tab.");
    });
}

function encrypt(execPath: string, text: string, publicKeyPath: string): Promise<string> {
    return new Promise<string>((resolve, reject) => {
        const commandLine = `${execPath}eyaml encrypt -o string --stdin --pkcs7-public-key "${publicKeyPath}"`;

        const child = exec(commandLine, {
            encoding: 'utf8',
            maxBuffer: 1024 * 1024,
        }, (error, stdout, stderr) => {
            if (error) {
                reject(stderr);
            } else {
                resolve(stdout);
            }
        });

        child.stdin.write(text);
        child.stdin.end();
    });
}

function blockFormat(encryptedString: string, blockSize: number): string {
    var i:number;
    var formatted = "";

    for (i = 0; i < encryptedString.length; i += blockSize) {
        formatted += encryptedString.substring(i, i + blockSize) + "\n";
    }

    return formatted;
}