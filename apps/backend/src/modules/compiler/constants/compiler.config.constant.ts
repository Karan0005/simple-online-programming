import { ExecutionPowerEnum } from '@full-stack-project/shared';
import { ICompilerResourceConfig, IProgrammingLanguageConfig } from '../interfaces';

export const ProgrammingLanguageConfig = {
    CPP: (uniqueId: string, runTimeInputs: string): IProgrammingLanguageConfig => {
        return {
            ContainerImage: 'gcc:14.2.0',
            SourceCodeFileName: 'Main.cpp',
            ExecutableCommand: `g++ /source-code/${uniqueId}/Main.cpp -o /source-code/${uniqueId}/Main && echo "${runTimeInputs}" | /source-code/${uniqueId}/Main`
        };
    },
    C: (uniqueId: string, runTimeInputs: string): IProgrammingLanguageConfig => {
        return {
            ContainerImage: 'gcc:14.2.0',
            SourceCodeFileName: 'Main.c',
            ExecutableCommand: `gcc /source-code/${uniqueId}/Main.c -o /source-code/${uniqueId}/Main && echo "${runTimeInputs}" | /source-code/${uniqueId}/Main`
        };
    },
    Java: (
        uniqueId: string,
        runTimeInputs: string,
        sourceCode: string
    ): IProgrammingLanguageConfig => {
        const classNamesWithMain = [];
        const classPattern = /class\s+(\w+)/g;
        const mainMethodPattern = /public\s+static\s+void\s+main\s*\(String\[\]\s+args\)/;

        let match;
        while ((match = classPattern.exec(sourceCode)) !== null) {
            const className = match[1];
            const classRegex = new RegExp(`class ${className}.*?${mainMethodPattern.source}`, 's');

            if (classRegex.test(sourceCode)) {
                classNamesWithMain.push(className);
            }
        }

        if (classNamesWithMain.length === 0) {
            throw new Error(
                'Main method not found in class. Please define the main method as:\npublic static void main(String[] args)'
            );
        }

        const className = classNamesWithMain[0];

        return {
            ContainerImage: 'openjdk:18-jdk',
            SourceCodeFileName: `${className}.java`,
            ExecutableCommand: `javac /source-code/${uniqueId}/${className}.java && echo "${runTimeInputs}" | java -cp /source-code/${uniqueId}/ ${className}`
        };
    },
    Python: (uniqueId: string, runTimeInputs: string): IProgrammingLanguageConfig => {
        return {
            ContainerImage: 'python:3.12.5',
            SourceCodeFileName: `Main.py`,
            ExecutableCommand: `echo "${runTimeInputs}" | python /source-code/${uniqueId}/Main.py`
        };
    },
    Go: (uniqueId: string, runTimeInputs: string): IProgrammingLanguageConfig => {
        return {
            ContainerImage: 'golang:1.23.0',
            SourceCodeFileName: 'Main.go',
            ExecutableCommand: `echo "${runTimeInputs}" | go run /source-code/${uniqueId}/Main.go`
        };
    },
    JavaScript: (uniqueId: string, runTimeInputs: string): IProgrammingLanguageConfig => {
        return {
            ContainerImage: 'node:22.8.0',
            SourceCodeFileName: 'Main.js',
            ExecutableCommand: `node /source-code/${uniqueId}/Main.js ${runTimeInputs}`
        };
    },
    PHP: (uniqueId: string, runTimeInputs: string): IProgrammingLanguageConfig => {
        return {
            ContainerImage: 'php:8.3.11',
            SourceCodeFileName: 'Main.php',
            ExecutableCommand: `echo "${runTimeInputs}" | php /source-code/${uniqueId}/Main.php`
        };
    },
    CSharp: (uniqueId: string, runTimeInputs: string): IProgrammingLanguageConfig => {
        return {
            ContainerImage: 'mcr.microsoft.com/dotnet/sdk:8.0.401',
            SourceCodeFileName: 'Program.cs.bak',
            ExecutableCommand: `
                dotnet new console -o /source-code/${uniqueId} --force > /dev/null &&
                cp /source-code/${uniqueId}/Program.cs.bak /source-code/${uniqueId}/Program.cs > /dev/null &&
                if ! dotnet build /source-code/${uniqueId} > build.log 2>&1; then
                    grep -i "error" build.log | sort -u
                else
                    echo "${runTimeInputs}" | dotnet /source-code/${uniqueId}/bin/Debug/net8.0/${uniqueId}.dll
                fi
            `
        };
    },
    Swift: (uniqueId: string, runTimeInputs: string): IProgrammingLanguageConfig => {
        return {
            ContainerImage: 'swift:5.10.1',
            SourceCodeFileName: 'Main.swift',
            ExecutableCommand: `swiftc /source-code/${uniqueId}/Main.swift -o /source-code/${uniqueId}/Main && echo "${runTimeInputs}" | /source-code/${uniqueId}/Main`
        };
    },
    R: (uniqueId: string, runTimeInputs: string): IProgrammingLanguageConfig => {
        return {
            ContainerImage: 'r-base:4.4.1',
            SourceCodeFileName: 'Main.R',
            ExecutableCommand: `Rscript /source-code/${uniqueId}/Main.R ${runTimeInputs}`
        };
    },
    Ruby: (uniqueId: string, runTimeInputs: string): IProgrammingLanguageConfig => {
        return {
            ContainerImage: 'ruby:3.3.4',
            SourceCodeFileName: 'Main.rb',
            ExecutableCommand: `echo "${runTimeInputs}" | ruby /source-code/${uniqueId}/Main.rb`
        };
    },
    Rust: (uniqueId: string, runTimeInputs: string): IProgrammingLanguageConfig => {
        return {
            ContainerImage: 'rust:1.80.1',
            SourceCodeFileName: 'Main.rs',
            ExecutableCommand: `rustc /source-code/${uniqueId}/Main.rs -o /source-code/${uniqueId}/Main && echo "${runTimeInputs}" | /source-code/${uniqueId}/Main`
        };
    },
    Perl: (uniqueId: string, runTimeInputs: string): IProgrammingLanguageConfig => {
        return {
            ContainerImage: 'perl:5.40.0',
            SourceCodeFileName: 'Main.pl',
            ExecutableCommand: `echo "${runTimeInputs}" | perl /source-code/${uniqueId}/Main.pl`
        };
    },
    Kotlin: (
        uniqueId: string,
        runTimeInputs: string,
        sourceCode: string
    ): IProgrammingLanguageConfig => {
        const mainMethodPattern = /fun\s+main\s*\(\s*.*?\s*\)/;

        if (!mainMethodPattern.test(sourceCode)) {
            throw new Error('Main method not found, please define the main method as:\nfun main()');
        }

        const classOrObjectPattern = /(class|object)\s+(\w+)/g;

        let match;
        const classNamesWithMain = [];

        while ((match = classOrObjectPattern.exec(sourceCode)) !== null) {
            const [kind, name] = match;

            const classOrObjectRegex = new RegExp(
                `${kind} ${name}.*?${mainMethodPattern.source}`,
                's'
            );

            if (classOrObjectRegex.test(sourceCode)) {
                classNamesWithMain.push(name);
            }
        }

        const className = classNamesWithMain.length > 0 ? classNamesWithMain[0] : 'Main';

        return {
            ContainerImage: 'openjdk:kotlin',
            SourceCodeFileName: `${className}.kt`,
            ExecutableCommand: `
                kotlinc /source-code/${uniqueId}/${className}.kt -no-reflect -d /source-code/${uniqueId}/${className}.jar &&
                echo "${runTimeInputs}" | kotlin -classpath /source-code/${uniqueId}/${className}.jar ${className}Kt`
        };
    },
    TypeScript: (uniqueId: string, runTimeInputs: string): IProgrammingLanguageConfig => {
        return {
            ContainerImage: 'nodejs:typescript',
            SourceCodeFileName: 'Main.ts',
            ExecutableCommand: `tsc /source-code/${uniqueId}/Main.ts && node /source-code/${uniqueId}/Main.js ${runTimeInputs}`
        };
    }
};

export const CompilerResourceConfig = (execution: ExecutionPowerEnum): ICompilerResourceConfig => {
    switch (execution) {
        case ExecutionPowerEnum.LOW: {
            return {
                RAM: 268435456, //256mb RAM
                CPU: 1000000000 //1 CPU
            };
        }
        case ExecutionPowerEnum.MEDIUM: {
            return {
                RAM: 536870912, //512mb RAM
                CPU: 2000000000 //2 CPU
            };
        }
        case ExecutionPowerEnum.HIGH: {
            return {
                RAM: 1073741824, //1gb RAM
                CPU: 4000000000 //4 CPU
            };
        }
        case ExecutionPowerEnum.EXTREME: {
            return {
                RAM: 8589934592, //8gb RAM
                CPU: 8000000000 //8 CPU
            };
        }
        default: {
            return {
                RAM: 268435456, //256mb RAM
                CPU: 1000000000 //1 CPU
            };
        }
    }
};
