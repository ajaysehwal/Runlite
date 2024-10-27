import Docker from "dockerode";
import { Response,Request } from "express";
export interface Result {
  status: ExecutionStatus;
  stdout?: string;
  stderr?: string;
  error?: string;
  executionTime?: number;
  resourceUsage?: ResourceUsage;
  language?: number;
  exitCode?: number | null;
  signal?: NodeJS.Signals | null;
  killedBySystem?: boolean;
  metrics?: {
    compilationTime: number;
    totalTime: number;
  };
  stats?: Docker.ContainerStats;
}

export interface ResourceUsage {
  memory: { peak: number; average: number };
  cpu: { peak: number; average: number };
}

export interface Payload {
  syntax: string;
  lang: Language;
}
export type Language =
  | "java"
  | "javascript"
  | "typescript"
  | "python"
  | "cpp"
  | "php"
  | "go"
  | "rust"
  | "ruby";

export enum Extension {
  python = "py",
  javascript = "js",
  java = "java",
  cpp = "cpp",
  go = "go",
  typescript = "ts",
  php = "php",
  rust = "rust",
  ruby = "rb",
}
export type Images =
  | "node:14"
  | "python:3.9-slim"
  | "openjdk:17-slim"
  | "gcc:latest";

export enum ExecutionStatus {
  Accepted = "Accepted",
  TimeLimitExceeded = "Time Limit Exceeded",
  MemoryLimitExceeded = "Memory Limit Exceeded",
  RuntimeError = "Runtime Error",
  InternalError = "Internal Error",
}

export enum versions {
  "v1.0.0",
}


export interface ApiResponse extends Response{
     isCached?:boolean
     apiKeyId?:string
}
export interface ApiRequest extends Request {
  userId?: string;
  apikeyId?:string
}