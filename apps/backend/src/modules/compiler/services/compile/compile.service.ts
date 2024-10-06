import { RandomValueFactory } from '@backend/utilities';
import {
    BaseMessage,
    DateProcessor,
    DateTimeTypeEnum,
    InjectionType,
    ProgrammingLanguageEnum,
    RandomValueTypeEnum
} from '@full-stack-project/shared';
import { InjectQueue } from '@nestjs/bullmq';
import { Injectable } from '@nestjs/common';
import { Queue } from 'bullmq';
import Docker, { MountSettings, MountType } from 'dockerode';
import fs from 'fs';
import * as path from 'path';
import { CompilerResourceConfig, ProgrammingLanguageConfig } from '../../constants';
import {
    ICompileCodeResponse,
    ICompilerResourceConfig,
    ICompilerService,
    IProgrammingLanguageConfig
} from '../../interfaces';
import { ConfigFunctionForLanguages, ConfigFunctionWithSourceParsing } from '../../types';
import { CompileCodeValidator } from '../../validators';

const rootPath: string = path.resolve(process.env.PWD ?? process.cwd(), 'source-code');

@Injectable()
export class CompileService implements ICompilerService {
    private readonly dockerClient = new Docker();

    constructor(
        @InjectQueue(InjectionType.CompilerQueueService) private readonly compileQueue: Queue
    ) {}

    async compileCode(params: CompileCodeValidator): Promise<ICompileCodeResponse> {
        const uniqueId: string = RandomValueFactory(RandomValueTypeEnum.UUID) as string;
        let container;

        try {
            const resourceConfig: ICompilerResourceConfig = CompilerResourceConfig(
                params.ExecutionPower
            );

            const programmingLanguageConfig: IProgrammingLanguageConfig =
                this.getProgrammingLanguageConfig(params, uniqueId);

            if (!fs.existsSync(`${rootPath}/${uniqueId}`)) {
                await fs.promises.mkdir(`${rootPath}/${uniqueId}`, { recursive: true });
            }

            await fs.promises.writeFile(
                `${rootPath}/${uniqueId}/${programmingLanguageConfig.SourceCodeFileName}`,
                params.SourceCode
            );

            const mountConfig: MountSettings = rootPath.includes('app')
                ? {
                      Target: `/source-code`,
                      Source: 'source_code_volume',
                      Type: 'volume' as MountType
                  }
                : {
                      Target: `/source-code`,
                      Source: rootPath,
                      Type: 'bind' as MountType
                  };

            const containerOptions = {
                name: uniqueId,
                Image: programmingLanguageConfig.ContainerImage,
                Cmd: ['/bin/sh', '-c', programmingLanguageConfig.ExecutableCommand],
                HostConfig: {
                    Memory: resourceConfig.RAM,
                    NanoCpus: resourceConfig.CPU,
                    Mounts: [mountConfig]
                },
                Tty: false,
                NetworkDisabled: true,
                StopTimeout: params.TimeOut
            };

            container = await this.dockerClient.createContainer(containerOptions);
            await container.start();
            const markStartTime: Date = DateProcessor.DateTime();

            const result: { StatusCode: number } = await this.withTimeout(
                container.wait(),
                params.TimeOut
            );
            if (result.StatusCode !== 0) {
                const logs = await container.logs({ stdout: true, stderr: true });
                const errorLogs = this.cleanLogs(logs);
                const markEndTime: Date = DateProcessor.DateTime();

                return {
                    CompilerVersion: programmingLanguageConfig.ContainerImage,
                    CompilationStatus: BaseMessage.Error.ExecutionFailed,
                    ExecutionDetails: {
                        Output: null,
                        Errors: errorLogs,
                        ExecutionTime: DateProcessor.NicelyFormatMilliSeconds(
                            DateProcessor.GetDateTimeDifference(
                                DateTimeTypeEnum.MILLISECONDS,
                                markEndTime,
                                markStartTime
                            )
                        )
                    }
                };
            } else {
                const logs = await container.logs({
                    stdout: true,
                    stderr: true
                });
                const successLogs = this.cleanLogs(logs);
                const markEndTime: Date = DateProcessor.DateTime();

                return {
                    CompilerVersion: programmingLanguageConfig.ContainerImage,
                    CompilationStatus: BaseMessage.Success.SuccessGeneral,
                    ExecutionDetails: {
                        Output: successLogs,
                        Errors: null,
                        ExecutionTime: DateProcessor.NicelyFormatMilliSeconds(
                            DateProcessor.GetDateTimeDifference(
                                DateTimeTypeEnum.MILLISECONDS,
                                markEndTime,
                                markStartTime
                            )
                        )
                    }
                };
            }
        } finally {
            if (container) {
                await container.remove({ force: true });
            }
            if (fs.existsSync(`${rootPath}/${uniqueId}`)) {
                await fs.promises.rm(`${rootPath}/${uniqueId}`, { recursive: true, force: true });
            }
        }
    }

    async compileCodeUsingQueue(
        params: CompileCodeValidator
    ): Promise<{ JobId: string | undefined }> {
        const job = await this.compileQueue.add(params.ProgrammingLanguage, params);
        return { JobId: job.id };
    }

    async getCompileJobStatus(jobId: string): Promise<ICompileCodeResponse | undefined> {
        const job = await this.compileQueue.getJob(jobId);
        if (job) {
            const isCompleted = await job.isCompleted();
            if (isCompleted) {
                return job.returnvalue;
            }
        }
    }

    private readonly getProgrammingLanguageConfig = (
        params: CompileCodeValidator,
        uniqueId: string
    ): IProgrammingLanguageConfig => {
        const configMap: {
            [key: string]: ConfigFunctionForLanguages | ConfigFunctionWithSourceParsing;
        } = {
            CPP: ProgrammingLanguageConfig.CPP,
            C: ProgrammingLanguageConfig.C,
            Java: ProgrammingLanguageConfig.Java,
            Python: ProgrammingLanguageConfig.Python,
            Go: ProgrammingLanguageConfig.Go,
            JavaScript: ProgrammingLanguageConfig.JavaScript,
            PHP: ProgrammingLanguageConfig.PHP,
            CSharp: ProgrammingLanguageConfig.CSharp,
            Swift: ProgrammingLanguageConfig.Swift,
            R: ProgrammingLanguageConfig.R,
            Ruby: ProgrammingLanguageConfig.Ruby,
            Rust: ProgrammingLanguageConfig.Rust,
            Perl: ProgrammingLanguageConfig.Perl,
            Kotlin: ProgrammingLanguageConfig.Kotlin,
            TypeScript: ProgrammingLanguageConfig.TypeScript
        };

        const configFunction = configMap[params.ProgrammingLanguage];

        // Define categories for easy mapping
        const sourceParsingLanguages = [
            ProgrammingLanguageEnum.Java,
            ProgrammingLanguageEnum.Kotlin
        ];

        // Check which type of function to call based on the programming language
        if (sourceParsingLanguages.includes(params.ProgrammingLanguage)) {
            return (configFunction as ConfigFunctionWithSourceParsing)(
                uniqueId,
                params.RunTimeInput,
                params.SourceCode
            );
        }

        // Default case for other languages
        return (configFunction as ConfigFunctionForLanguages)(uniqueId, params.RunTimeInput);
    };

    // Function to add timeout handling to promises
    private withTimeout<T>(promise: Promise<T>, timeout: number): Promise<T> {
        return new Promise((resolve, reject) => {
            const timer = setTimeout(() => {
                reject(
                    new Error(
                        `The execution is taking longer than expected (${timeout} seconds). Please wait or try again later.`
                    )
                );
            }, timeout * 1000);

            promise
                .then((res) => {
                    clearTimeout(timer);
                    resolve(res);
                })
                .catch((error: Error) => {
                    clearTimeout(timer);
                    reject(error);
                });
        });
    }

    private cleanLogs(rawLogs: Buffer): string {
        return rawLogs
            .toString('utf-8')
            .split('\n')
            .map((line) => {
                return line.slice(8);
            })
            .join('\n');
    }
}
