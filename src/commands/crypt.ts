import { WorkspaceConfiguration } from 'vscode';
import * as config from '../config';
import * as exec from './exec';

export namespace commands {

    export enum CryptKind {
        Encrypt,
        Decrypt
    }

    export interface CryptCommand {
        execute(input: string): Promise<string>;
        prepareOutput(output: string): string;
    }

    export function getInstance(cryptKind: CryptKind, rawConfig: WorkspaceConfiguration, execCommand: exec.commands.ExecCommand): CryptCommand {
        switch (cryptKind) {
            case CryptKind.Decrypt:
                const decryptConfig = new config.DecryptConfigImpl(rawConfig);
                decryptConfig.loadAndValidate();
                return new DecryptCommand(decryptConfig, execCommand);
            case CryptKind.Encrypt:
                const encryptConfig = new config.EncryptConfigImpl(rawConfig);
                encryptConfig.loadAndValidate();
                return new EncryptCommand(encryptConfig, execCommand);
        }
    }

    abstract class CryptCommandImpl implements CryptCommand {
        constructor(
            protected readonly currentConfig: config.Config,
            protected readonly execCommand: exec.commands.ExecCommand
        ) { }

        protected abstract buildExecString(): string;

        protected prepareInput(input: string): string {
            return input;
        }

        public prepareOutput(output: string): string {
            return output.trim();
        }

        public execute(input: string): Promise<string> {
            const execString = this.buildExecString();
            const preparedInput = this.prepareInput(input);
            return this.execCommand.execute(execString, preparedInput);
        }
    }

    class DecryptCommand extends CryptCommandImpl {
        constructor(
            protected readonly currentConfig: config.DecryptConfig,
            protected readonly execCommand: exec.commands.ExecCommand
        ) {
            super(currentConfig, execCommand);
        }

        protected buildExecString(): string {
            return `${this.currentConfig.eyamlPath} decrypt --stdin --pkcs7-public-key "${this.currentConfig.publicKeyPath}" --pkcs7-private-key "${this.currentConfig.privateKeyPath}"`;
        }

        protected prepareInput(input: string): string {
            return this.removeAll(input, ['\r', '\n']);
        }

        removeAll(source: string, removes: string[]): string {
            var result = source;

            removes.forEach((remove) => {
                while (result.indexOf(remove) != -1) {
                    result = result.replace(remove, "");
                }
            });

            return result;
        }
    }

    class EncryptCommand extends CryptCommandImpl {
        constructor(
            protected readonly currentConfig: config.EncryptConfig,
            protected readonly execCommand: exec.commands.ExecCommand
        ) {
            super(currentConfig, execCommand);
        }

        protected buildExecString(): string {
            return `${this.currentConfig.eyamlPath} encrypt -o ${this.currentConfig.outputFormat} --stdin --pkcs7-public-key "${this.currentConfig.publicKeyPath}"`;
        }

        public prepareOutput(output: string): string {
            switch (this.currentConfig.outputFormat) {
                case config.OutputFormat.Block:
                    let preparedOutput = "";

                    for (let i = 0; i < output.length; i += this.currentConfig.outputBlockSize) {
                        preparedOutput += output.substring(i, i + this.currentConfig.outputBlockSize) + "\n";
                    }

                    return super.prepareOutput(preparedOutput);
                default:
                    return super.prepareOutput(output);
            }
        }
    }
}