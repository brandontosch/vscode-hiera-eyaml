import { exec } from 'child_process';

export namespace commands {
    export interface ExecCommand {
        execute(command: string, input: string): Promise<string>;
    }

    export class ExecCommandImpl implements ExecCommand {
        execute(command: string, input: string): Promise<string> {
            return new Promise<string>((resolve, reject) => {
                const child = exec(command, {
                    encoding: 'utf8',
                    maxBuffer: 1024 * 1024,
                }, (error, stdout, stderr) => {
                    if (error) {
                        reject(stderr);
                    } else {
                        resolve(stdout);
                    }
                });

                child.stdin.write(input);
                child.stdin.end();
            });
        }
    }
}