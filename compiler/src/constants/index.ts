export const LanguageCode: { [key: string]: number } = {
  javascript: 78,
  java: 58,
  cpp: 90,
  python: 80,
  go: 88,
  typescript: 70,
  ruby: 83,
  php: 30,
  rust: 20,
} as const;

export const containerConfig = {
  java: {
    image: "openjdk:17-slim",
    cmd: (file: string, output?: string) => [
      "sh",
      "-c",
      `javac ${file} && java ${output}`,
    ],
  },
  javascript: {
    image: "node:14",
    cmd: (file: string) => ["node", file],
  },
  typescript: {
    image: "ajaysehwal81/ts-run",
    cmd: (file: string, output?: string) => [
      "sh",
      "-c",
      `tsc ${file} && node ${output}.js`,
    ],
  },
  python: {
    image: "python:3.9-slim",
    cmd: (file: string) => ["python", file],
  },
  php: {
    image: "php:latest",
    cmd: (file: string) => ["sh", "-c", `php ${file}`],
  },
  ruby: {
    image: "ruby:latest",
    cmd: (file: string) => ["sh", "-c", `ruby ${file}`],
  },
  go: {
    image: "golang:latest",
    cmd: (file: string) => ["sh", "-c", `go run ${file}`],
  },
  rust: {
    image: "rust:latest",
    cmd: (file: string, output?: string) => [
      "sh",
      "-c",
      `rustc ${file} && ./${output}`,
    ],
  },
  cpp: {
    image: "gcc:latest",
    cmd: (file: string, output?: string) => [
      "sh",
      "-c",
      `g++ -o ${output} ${file} && ./${output}`,
    ],
  },
} as const;
