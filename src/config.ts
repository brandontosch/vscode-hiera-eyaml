import { WorkspaceConfiguration } from 'vscode';

export interface Config {
    eyamlPath: string;
    publicKeyPath: string;
}

abstract class ConfigImpl implements Config {
    eyamlPath: string;
    publicKeyPath: string;

    constructor(protected rawConfig: WorkspaceConfiguration) {
        this.loadAndValidate();
        // TODO: ensure this calls the overriden method
    }

    protected loadAndValidate(): void {
        this.eyamlPath = this.rawConfig.eyamlPath;
        // TODO: check if path is valid, if blank, default to eyaml
        this.publicKeyPath = this.rawConfig.publicKeyPath;
        // TODO: make sure not blank
    }
}

enum OutputFormat {
    Block,
    String
}

export interface EncryptConfig extends Config {
    outputFormat: OutputFormat;
    outputBlockSize: number;
}

export class EncryptConfigImpl extends ConfigImpl implements EncryptConfig {
    eyamlPath: string;
    publicKeyPath: string;
    outputFormat: OutputFormat;
    outputBlockSize: number;

    loadAndValidate(): void {
        super.loadAndValidate();
        this.outputFormat = this.rawConfig.outputFormat;
        // TODO: default to block if not specified
        this.outputBlockSize = this.rawConfig.outputBlockSize;
        // TODO: default to 74 if no value is specified
    }
}

export interface DecryptConfig extends Config {
    privateKeyPath: string;
}

export class DecryptConfigImpl extends ConfigImpl implements DecryptConfig {
    eyamlPath: string;
    publicKeyPath: string;
    privateKeyPath: string;

    loadAndValidate(): void {
        super.loadAndValidate();
        this.privateKeyPath = this.rawConfig.privateKeyPath;
        // TODO: ensure not blank
    }
}