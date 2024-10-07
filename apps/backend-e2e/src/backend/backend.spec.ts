import axios from 'axios';

describe('GET /api', () => {
    it('It should success checking root route', async () => {
        const res = await axios.get(`/api`);
        expect(res.status).toBe(200);
        expect(res.data.IsSuccess).toBe(true);
    });
});

describe('GET /api/health', () => {
    it('It should success checking health route', async () => {
        const res = await axios.get(`/api/health`);
        expect(res.status).toBe(200);
        expect(res.data.IsSuccess).toBe(true);
    });
});

describe('POST /api/compile/v1', () => {
    interface Program {
        sourceCode: string;
        expectedOutput: string;
        runTimeInput?: string;
    }

    const programs: Record<string, Program> = {
        CPP: {
            sourceCode:
                '#include <iostream>\nint main() { std::cout << "Hello, World!" << std::endl; return 0; }',
            expectedOutput: 'Hello, World!\n'
        },
        C: {
            sourceCode: '#include <stdio.h>\nint main() { printf("Hello, World!\\n"); return 0; }',
            expectedOutput: 'Hello, World!\n'
        },
        Java: {
            sourceCode:
                'public class HelloWorld { public static void main(String[] args) { System.out.println("Hello, World!"); } }',
            expectedOutput: 'Hello, World!\n'
        },
        Python: {
            sourceCode: 'print("Hello, World!")',
            expectedOutput: 'Hello, World!\n'
        },
        Go: {
            sourceCode: 'package main\nimport "fmt"\nfunc main() { fmt.Println("Hello, World!") }',
            expectedOutput: 'Hello, World!\n'
        },
        JavaScript: {
            sourceCode: 'console.log("Hello, World!");',
            expectedOutput: 'Hello, World!\n'
        },
        TypeScript: {
            sourceCode: 'console.log("Hello, World!");',
            expectedOutput: 'Hello, World!\n'
        },
        Kotlin: {
            sourceCode: 'fun main() { println("Hello, World!") }',
            expectedOutput: 'Hello, World!\n'
        },
        PHP: {
            sourceCode: '<?php echo "Hello, World!"; ?>',
            expectedOutput: 'Hello, World!'
        },
        CSharp: {
            sourceCode:
                'using System; class Program { static void Main() { Console.WriteLine("Hello, World!"); } }',
            expectedOutput: 'Hello, World!\n'
        },
        Swift: {
            sourceCode: 'print("Hello, World!")',
            expectedOutput: 'Hello, World!\n'
        },
        R: {
            sourceCode: 'cat("Hello, World!")',
            expectedOutput: 'Hello, World!'
        },
        Ruby: {
            sourceCode: 'puts "Hello, World!"',
            expectedOutput: 'Hello, World!\n'
        },
        Rust: {
            sourceCode: 'fn main() { println!("Hello, World!"); }',
            expectedOutput: 'Hello, World!\n'
        },
        Perl: {
            sourceCode: 'print "Hello, World!";',
            expectedOutput: 'Hello, World!'
        }
    };

    for (const [language, { sourceCode, expectedOutput }] of Object.entries(programs)) {
        it(`It should successfully compile ${language} Hello World program`, async () => {
            const payload = {
                SourceCode: sourceCode,
                ProgrammingLanguage: language,
                ExecutionPower: 'medium',
                TimeOut: 30,
                RunTimeInput: ''
            };

            const res = await axios.post(`/api/compile/v1`, payload);
            expect(res.status).toBe(201);
            expect(res.data.IsSuccess).toBe(true);
            expect(res.data.Data.ExecutionDetails.Output).toEqual(expectedOutput);
        }, 15000);
    }

    const sumPrograms: Record<string, Program> = {
        CPP: {
            sourceCode:
                '#include <iostream>\nint main() { int a, b; std::cin >> a >> b; std::cout << (a + b) << std::endl; return 0; }',
            runTimeInput: '1\n2',
            expectedOutput: '3\n'
        },
        C: {
            sourceCode:
                '#include <stdio.h>\nint main() { int a, b; scanf("%d %d", &a, &b); printf("%d\\n", a + b); return 0; }',
            runTimeInput: '1\n2',
            expectedOutput: '3\n'
        },
        Java: {
            sourceCode:
                'import java.util.Scanner;\npublic class Sum { public static void main(String[] args) { Scanner sc = new Scanner(System.in); int a = sc.nextInt(); int b = sc.nextInt(); System.out.println(a + b); } }',
            runTimeInput: '1\n2',
            expectedOutput: '3\n'
        },
        Python: {
            sourceCode: 'a = int(input())\nb = int(input())\nprint(a + b)',
            runTimeInput: '1\n2',
            expectedOutput: '3\n'
        },
        Go: {
            sourceCode:
                'package main\nimport "fmt"\nfunc main() { var a, b int; fmt.Scan(&a, &b); fmt.Println(a + b) }',
            runTimeInput: '1\n2',
            expectedOutput: '3\n'
        },
        JavaScript: {
            sourceCode:
                "const args = process.argv.slice(2);\n\nif (args.length !== 2) {\n  console.error('Please provide exactly two numbers as arguments.');\n  process.exit(1);\n}\n\nconst num1 = parseFloat(args[0]);\nconst num2 = parseFloat(args[1]);\n\nif (isNaN(num1) || isNaN(num2)) {\n  console.error('Both arguments must be valid numbers.');\n  process.exit(1);\n}\n\nconst sum = num1 + num2;\n\nconsole.log(sum);",
            runTimeInput: '1 2',
            expectedOutput: '3\n'
        },
        Kotlin: {
            sourceCode:
                'fun main() { val a = readLine()!!.toInt(); val b = readLine()!!.toInt(); println(a + b) }',
            runTimeInput: '1\n2',
            expectedOutput: '3\n'
        },
        PHP: {
            sourceCode: '<?php $a = (int)fgets(STDIN); $b = (int)fgets(STDIN); echo $a + $b;',
            runTimeInput: '1\n2',
            expectedOutput: '3'
        },
        CSharp: {
            sourceCode:
                'using System;\nclass Program { static void Main() { int a = int.Parse(Console.ReadLine()); int b = int.Parse(Console.ReadLine()); Console.WriteLine(a + b); } }',
            runTimeInput: '1\n2',
            expectedOutput: '3\n'
        },
        Swift: {
            sourceCode: 'let a = Int(readLine()!)!\nlet b = Int(readLine()!)!\nprint(a + b)',
            runTimeInput: '1\n2',
            expectedOutput: '3\n'
        },
        R: {
            sourceCode:
                'args <- commandArgs(trailingOnly = TRUE)\n\nif (length(args) == 2) {\n  num1 <- as.numeric(args[1])\n  num2 <- as.numeric(args[2])\n} else {\n  cat("Enter the first number: ")\n  num1 <- as.numeric(readLines(con = "stdin", n = 1))\n  \n  cat("Enter the second number: ")\n  num2 <- as.numeric(readLines(con = "stdin", n = 1))\n}\n\nif (is.na(num1) || is.na(num2)) {\n  cat("Both inputs must be valid numbers.\\n")\n} else {\n  sum <- num1 + num2\n  cat(sum)\n}',
            runTimeInput: '1 2',
            expectedOutput: '3'
        },
        Ruby: {
            sourceCode: 'a = gets.to_i\nb = gets.to_i\nputs a + b',
            runTimeInput: '1\n2',
            expectedOutput: '3\n'
        },
        Rust: {
            sourceCode:
                'use std::io::{self, BufRead};\nfn main() { let stdin = io::stdin(); let a: i32 = stdin.lock().lines().next().unwrap().unwrap().parse().unwrap(); let b: i32 = stdin.lock().lines().next().unwrap().unwrap().parse().unwrap(); println!("{}", a + b); }',
            runTimeInput: '1\n2',
            expectedOutput: '3\n'
        },
        Perl: {
            sourceCode: 'my $a = <STDIN>;\nmy $b = <STDIN>;\nprint $a + $b;',
            runTimeInput: '1\n2',
            expectedOutput: '3'
        }
    };

    for (const [language, { sourceCode, runTimeInput, expectedOutput }] of Object.entries(
        sumPrograms
    )) {
        it(`It should successfully compile ${language} Sum program`, async () => {
            const payload = {
                SourceCode: sourceCode,
                ProgrammingLanguage: language,
                ExecutionPower: 'medium',
                TimeOut: 30,
                RunTimeInput: runTimeInput
            };

            const res = await axios.post('/api/compile/v1', payload);
            expect(res.status).toBe(201);
            expect(res.data.IsSuccess).toBe(true);
            expect(res.data.Data.ExecutionDetails.Output).toEqual(expectedOutput);
        }, 15000);
    }
});
