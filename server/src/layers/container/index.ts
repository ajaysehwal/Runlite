import fs from "fs/promises";
import path from "path";
import { log } from "../../services/logging";
import { v4 as uuidv4 } from "uuid";
import { Payload } from "../../types";
import Docker from "dockerode";
import { Language } from "../../types";
import os from "os";
import tar from "tar-fs";
interface ContainerConfig {
  image: string;
  cmd: string;
  fileName?: string;
}

export class Containerizer {
  private docker: Docker;
  private CODE_DIR: string = "/code";
  constructor() {
    this.docker = new Docker();
  }
  async start(payload: Payload) {
    const fileId = uuidv4();
    const extension = this.getFileExtension(payload.lang);
    const file = `${fileId}.${extension}`;
    let container: Docker.Container | null = null;
    const containerConfig = this.getContainerConfig(payload.lang);
    try {
      await this.pullImage(containerConfig.image);
      container = await this.docker.createContainer(
        await this.createConfig(containerConfig.image, [
          containerConfig.cmd,
          file,
        ])
      );
      const tempDir = os.tmpdir();
      const tempPath = path.join(tempDir, file);
      log.info(`File written successfully at: ${tempPath}`);

      await fs.writeFile(tempPath, payload.syntax);
      const tarStream = tar.pack(tempDir, {
        entries: [file],
      });
      await container.putArchive(tarStream, { path: "/code" });
      log.info("Code written to container");
      await fs.unlink(tempPath);
      return container;
    } catch (error) {
      log.error(
        `Error during container execution: ${(error as Error).message}`
      );
      throw error;
    }
  }
  async pullImage(image: string) {
    const images = await this.docker.listImages({
      filters: { reference: [image] },
    });
    if (images.length === 0) {
      log.info("Image not found, start pulling from docker hub...");
      await new Promise((resolve, reject) => {
        this.docker.pull(image, (err: any, stream: any) => {
          if (err) reject(err);
          this.docker.modem.followProgress(stream, (err, output) => {
            if (err) reject(err);
            resolve(output);
          });
        });
      });
    } else {
      log.info("Image found, use it directly...");
    }
  }
  private async createConfig(Image: string, Cmd: string[]) {
    return {
      Image,
      Cmd,
      HostConfig: {
        Memory: 256 * 1024 * 1024,
        CpuQuota: 100000,
        NetworkMode: "none",
      },
      WorkingDir: this.CODE_DIR,
      name: `sandbox-${uuidv4()}`,
      Tty: false,
      AttachStderr: true,
      AttachStdout: true,
    };
  }
  private getContainerConfig(language: Language): ContainerConfig {
    const configs: Record<Language, ContainerConfig> = {
      java: {
        image: "openjdk:17-slim",
        cmd: "bash",
      },
      javascript: { image: "node:14", cmd: "node" },
      typescript: {
        image: "node:14",
        cmd: "npx tsc && node",
      },
      python: { image: "python:3.9-slim", cmd: "python" },
      cpp: {
        image: "gcc:latest",
        cmd: "bash",
      },
    };

    const config = configs[language];
    if (!config) {
      throw new Error(`Unsupported language: ${language}`);
    }
    return config;
  }

  private getFileExtension(language: string): string {
    const extensions: { [key: string]: string } = {
      python: "py",
      javascript: "js",
      java: "java",
      cpp: "cpp",
      go: "go",
      csharp: "cs",
      typescript: "ts",
    };
    return extensions[language.toLowerCase()] || "txt";
  }
  async cleanup(filePath: string, compiledPath?: string): Promise<void> {
    try {
      await fs.unlink(filePath);
      log.info(`File deleted: ${filePath}`);
      if (compiledPath) {
        await fs.unlink(compiledPath);
        log.info(`Compiled file deleted: ${compiledPath}`);
      }
    } catch (err) {
      log.error(`Cleanup error: ${(err as Error).message}`);
    }
  }
}
