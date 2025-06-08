import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { CodeBlock } from "./CodeBlock";
import { DocLayout } from "./DocLayout";
import { Rocket, CheckCircle2, ArrowRight } from "lucide-react";
import { cn } from "@/lib/utils";

const steps = [
  {
    title: "Prepare Your Request",
    description: "Create a POST request to our API endpoint:",
    code: {
      language: "plaintext",
      content: "https://api.runlite.app/v1",
    },
  },
  {
    title: "Set Headers",
    description: "Include these headers in your request:",
    code: {
      language: "plaintext",
      content: `Authorization: Bearer YOUR_API_KEY
Content-Type: application/json`,
    },
  },
  {
    title: "Prepare Request Body",
    description:
      "Your request body should be a JSON object with the following structure:",
    code: {
      language: "json",
      content: `{
  "lang": "1078",  // Language ID for Python
  "syntax": "print('Hello, Runlite!')"
}`,
    },
  },
  {
    title: "Send the Request",
    description: "Here's an example using cURL:",
    code: {
      language: "bash",
      content: `curl -X POST \\
-H "Authorization: Bearer YOUR_API_KEY" \\
-H "Content-Type: application/json" \\
-d '{"language": "python", "code": "print(&apos;Hello, Runlite!&apos;)"}' \\
https://api.runlite.app/v1/execute`,
    },
  },
  {
    title: "Interpret the Response",
    description: "You'll receive a JSON response with the execution result:",
    code: {
      language: "json",
      content: `{
  "output": "Hello, Runlite!\\n",
  "errors": null,
  "execution_time": 0.0054
}`,
    },
  },
];

export default function QuickStart() {
  return (
    <DocLayout>
      <div className="space-y-8">
        <div className="flex items-start gap-3">
          <Rocket className="w-8 h-8 text-blue-500 mt-1" />
          <div>
            <h1 className="text-3xl font-bold mb-4">Quick Start Guide</h1>
            <p className="text-gray-700 dark:text-gray-300 text-lg leading-relaxed">
              Get started with Runlite API in just a few steps. This guide will
              walk you through making your first API request to compile and
              execute code.
            </p>
          </div>
        </div>

        <div className="space-y-8">
          {steps.map((step, index) => (
            <section key={index} className="relative">
              {index !== steps.length - 1 && (
                <div className="absolute left-6 top-16 bottom-0 w-px bg-blue-200 dark:bg-blue-800" />
              )}
              <div className="flex gap-4">
                <div className="relative z-10 flex items-center justify-center w-12 h-12 rounded-full bg-blue-100 dark:bg-blue-900">
                  <div className="flex items-center justify-center w-8 h-8 rounded-full bg-blue-500">
                    <span className="text-white font-semibold">
                      {index + 1}
                    </span>
                  </div>
                </div>
                <div className="flex-1 space-y-4">
                  <h2 className="text-2xl font-semibold">{step.title}</h2>
                  <p className="text-gray-700 dark:text-gray-300">
                    {step.description}
                  </p>
                  <CodeBlock
                    language={step.code.language}
                    code={step.code.content}
                    showLineNumbers
                  />
                </div>
              </div>
            </section>
          ))}
        </div>

        <Card
          className={cn(
            "border-2 border-green-100 dark:border-green-900",
            "bg-green-50 dark:bg-green-900/20"
          )}
        >
          <CardHeader>
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-5 h-5 text-green-500" />
              <CardTitle className="text-green-800 dark:text-green-200">
                Success! What&apos;s Next?
              </CardTitle>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <p className="text-green-800 dark:text-green-200">
                You&apos;ve successfully made your first request to the Runlite
                API! Here are some next steps:
              </p>
              <ul className="space-y-2">
                {[
                  "Explore supported languages and their features",
                  "Learn about error handling and best practices",
                  "Check out advanced usage examples",
                  "Review rate limits and pricing plans",
                ].map((item, index) => (
                  <li
                    key={index}
                    className="flex items-center gap-2 text-green-800 dark:text-green-200"
                  >
                    <ArrowRight className="w-4 h-4" />
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          </CardContent>
        </Card>
      </div>
    </DocLayout>
  );
}
