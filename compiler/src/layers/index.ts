import Bull from "bull";
import { log } from "../services/logging";
import { CacheLayer } from "./cache";
import { QueueLayer } from "./queue";
import { Result, Payload, Language, ExecutionStatus } from "../types";
import { Sandbox } from "./sandbox";
import { Containerizer } from "./container";
import { LanguageCode } from "../constants";

export class Layers {
  private cacheLayer: CacheLayer;
  private queueLayer: QueueLayer;
  private containerizer: Containerizer;
  constructor() {
    this.cacheLayer = new CacheLayer();
    this.queueLayer = new QueueLayer("compyl-jobs");
    this.containerizer = new Containerizer();
    this.initializeJobQueue();
  }
  private initializeJobQueue(): void {
    this.queueLayer.startProcessing(this.processor.bind(this));
  }
  async startProcess(payload: Payload) {
    try {
      const cachedResult = await this.cacheLayer.isCached(payload);
      if (cachedResult) {
        return cachedResult;
      }
      const job = await this.queueLayer.addTask(payload);
      if (!job?.id) {
        throw new Error("Job ID is undefined");
      }
      return this.waitForJobAndCache(job.id, payload);
    } catch (error) {
      log.error("Error in starting process", (error as Error).message);
      throw error;
    }
  }
  private async waitForJobAndCache(
    jobId: Bull.JobId,
    payload: Payload
  ): Promise<Result | null> {
    try {
      const result = await this.queueLayer.waitforCompletion(jobId);
      if (!result) {
        return null;
      }
      if (result.status !== ExecutionStatus.InternalError) {
        await this.cacheLayer.cacheResult(payload, result);
      }
      return result;
    } catch (error) {
      log.error(
        "Error in waitForJobAndCache:",
        error instanceof Error ? error.message : String(error)
      );
      throw error;
    }
  }
  private async processor(job: Bull.Job<Payload>): Promise<Result> {
    try {
      const container = await this.containerizer.start(job.data);
      if (!container) {
        throw new Error("container not created");
      }
      const sandbox = new Sandbox(container);
      const result = await sandbox.execute();
      return { ...result, language: LanguageCode[job.data.lang] };
    } catch (error) {
      return {
        status: ExecutionStatus.InternalError,
        error: (error as Error).message,
        language: LanguageCode[job.data.lang],
      };
    }
  }
}
