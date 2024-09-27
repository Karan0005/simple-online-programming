import {
    ExecutionPowerEnum,
    ProgrammingLanguageEnum,
    TimeOutEnum
} from '@full-stack-project/shared';
import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsString, MaxLength, MinLength } from 'class-validator';

export class CompileCodeValidator {
    @IsString({ message: 'SourceCode must be a string' })
    @ApiProperty({
        description: 'Source code provided by the user to be compiled',
        maxLength: 10000
    })
    @MinLength(1, { message: 'SourceCode must not be empty' })
    @MaxLength(10000, { message: 'SourceCode is too long' })
    SourceCode!: string;

    @ApiProperty({
        description: 'Programming language to compile the source code',
        enum: ProgrammingLanguageEnum
    })
    @IsEnum(ProgrammingLanguageEnum, {
        message: 'Invalid ProgrammingLanguage. Supported languages: CPP, C, Java, Python, etc.'
    })
    ProgrammingLanguage!: ProgrammingLanguageEnum;

    @ApiProperty({
        description: 'Execution power to use for compiling the code',
        enum: ExecutionPowerEnum
    })
    @IsEnum(ExecutionPowerEnum, {
        message: 'Invalid ExecutionPower. Must be one of: low, medium, high, extreme.'
    })
    ExecutionPower!: ExecutionPowerEnum;

    @ApiProperty({
        description: 'Timeout in seconds for the code compilation',
        enum: TimeOutEnum
    })
    @IsEnum(TimeOutEnum, { message: 'Invalid TimeOut. Must be one of: 10, 20, or 30.' })
    TimeOut!: TimeOutEnum;
}
