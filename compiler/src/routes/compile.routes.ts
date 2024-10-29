import { NextFunction } from "express";
import BaseRoute from ".";
import { CodeToLanguage } from "../constants";
import { Layers } from "../layers";
import { ApiRequest, ApiResponse, Language } from "../types";
import { z } from "zod";
import { log } from "../services";

interface ProcessRequest {
  syntax: string;
  lang: number;
}

export class v1 extends BaseRoute {
  private readonly layers: Layers;
  private readonly requestSchema = z.object({
    syntax: z.string().min(1, "Syntax cannot be empty"),
    lang: z.number().int().min(0, "Invalid language code"),
  });

  constructor() {
    super("/v1/run");
    this.layers = new Layers();
  }

  protected initRoutes(): void {
    this.router.post(
      this.path,
      this.requestGuard.validateRequest,
      this.processRequest.bind(this),
    );
  }
  private async processRequest(
    req: ApiRequest,
    res: ApiResponse,
    next: NextFunction
  ): Promise<void> {
    try {
      if (!req.apikeyId) {
        throw new Error("Missing API key");
      }
      res.apiKeyId = req.apikeyId;
      const validatedBody = await this.validateRequestBody(req.body);
      if (!validatedBody) {
        res.status(400).send({ error: "Invalid request body" });
        return;
      }
      const language = this.getLanguage(validatedBody.lang) as Language;
      if (!language) {
        res.status(400).send({
          error: `Unsupported language code: ${validatedBody.lang}`,
          supportedLanguages: Object.keys(CodeToLanguage),
        });
        return;
      }
      const result = await this.processCodeSyntax(
        validatedBody.syntax,
        language,
        res
      );

      res.status(200).send(result);
      this.requestGuard.onRequestFinish(req, res, next);
    } catch (error) {
      log.error("Error processing request", {
        error,
        path: req.path,
        method: req.method,
        apiKeyId: req.apikeyId,
      });

      next(error);
    }
  }
  private async validateRequestBody(
    body: unknown
  ): Promise<ProcessRequest | null> {
    try {
      const validated = await this.requestSchema.parseAsync(body);
      return {
        syntax: validated.syntax.trim(),
        lang: validated.lang,
      };
    } catch (error) {
      log.error("Request validation failed", { error });
      return null;
    }
  }
  private getLanguage(langCode: number): Language | null {
    const language = CodeToLanguage[langCode];
    if (!language) {
      log.warn("Unsupported language code", { langCode });
      return null;
    }
    return language;
  }
  private async processCodeSyntax(
    syntax: string,
    language: Language,
    res: ApiResponse
  ) {
    try {
      const result = await this.layers.startProcess(
        {
          syntax,
          lang: language,
        },
        res
      );

      if (!result) {
        throw new Error("Processing failed");
      }

      return result;
    } catch (error) {
      log.error("Error processing code syntax", {
        error,
        language,
        syntaxLength: syntax.length,
      });
      throw error;
    }
  }
}
