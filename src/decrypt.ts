import * as vscode from 'vscode';
import { exec } from 'child_process';

export function decryptCommand() {
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
    var privateKeyPath = "C:\\Users\\brand\\Source\\inf\\control-repo\\keys\\private_key.pkcs7.pem";
    var publicKeyPath = "C:\\Users\\brand\\Source\\inf\\control-repo\\keys\\public_key.pkcs7.pem";
    var text = editor.document.getText(selection);
    
    decrypt(path, text, publicKeyPath, privateKeyPath).then((decrypted) => {
        editor.edit((builder) => {
            builder.replace(selection, decrypted);
        });
    }).catch((error) => {
        output.appendLine("hiera-eyaml.decrypt: Failed: ");
        output.append(error);
        vscode.window.showErrorMessage("Decryption failed, more information in the output tab.");
    });
}

function decrypt(execPath: string, text: string, publicKeyPath: string, privateKeyPath: string): Promise<string> {
    return new Promise<string>((resolve, reject) => {
        const commandLine = `${execPath}eyaml decrypt --stdin --pkcs7-public-key "${publicKeyPath}" --pkcs7-private-key "${privateKeyPath}"`;

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

        var formattedText = removeAll(text, ['\r', '\n']);
        
        child.stdin.write(formattedText);
        child.stdin.end();
    });
}

function removeAll(source: string, removes: string[]): string {
    var result = source;
    
    removes.forEach((remove) => {
        while(result.indexOf(remove) != -1) {
            result = result.replace(remove, "");
        }
    });

    return result;
}