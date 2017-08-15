import * as vscode from 'vscode';

interface HieraEyamlConfiguration {
    path: string;
    publicKeyPath: string;
    privateKeyPath: string;
    encryptOutputFormat: OutputFormat;
    encryptOutputBlockSize: 74;
}

enum OutputFormat {
    Block,
    String
}

export function getConfiguration() : HieraEyamlConfiguration {
    let raw = vscode.workspace.getConfiguration("hiera-eyaml");

    let convertible = {
        path: raw.path,
        publicKeyPath: raw.publicKeyPath,
        privateKeyPath: raw.privateKeyPath,
        encryptOutputFormat: raw.encryptOutputFormat,
        encryptOutputBlockSize: raw.encryptOutputBlockSize
    }

    return <HieraEyamlConfiguration>convertible;
}