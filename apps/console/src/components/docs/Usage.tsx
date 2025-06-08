import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { CodeBlock } from "./CodeBlock";
import { DocLayout } from "./DocLayout";
import { Settings, FileCode, Layers, Info, ArrowRight } from "lucide-react";
import { cn } from "@/lib/utils";

const examples = [
  {
    title: "Custom Execution Options",
    description: "Customize the execution environment with additional options:",
    icon: <Settings className="w-5 h-5 text-purple-500" />,
    code: {
      language: "json",
      content: `{
  "language": "python",
  "code": "import sys\\nprint(sys.version)",
  "options": {
    "timeout": 10,
    "memory_limit": 256,
    "use_cache": false
  }
}`,
    },
  },
  {
    title: "File I/O Operations",
    description:
      "Include file content for languages that support file operations:",
    icon: <FileCode className="w-5 h-5 text-blue-500" />,
    code: {
      language: "json",
      content: `{
  "language": "python",
  "code": "with open('input.txt', 'r') as f:\\n    print(f.read())",
  "files": [
    {
      "name": "input.txt",
      "content": "Hello from a file!"
    }
  ]
}`,
    },
  },
  {
    title: "Batch Execution",
    description: "Execute multiple code snippets in a single request:",
    icon: <Layers className="w-5 h-5 text-green-500" />,
    code: {
      language: "json",
      content: `{
  "batch": [
    {
      "language": "python",
      "code": "print('Hello from Python')"
    },
    {
      "language": "javascript",
      "code": "console.log('Hello from JavaScript')"
    }
  ]
}`,
    },
  },
];

const tips = [
  "Use batch execution for running tests across multiple languages",
  "Set appropriate timeouts for long-running operations",
  "Implement proper error handling for each execution mode",
  "Monitor resource usage with the provided metrics",
];

export default function Usage() {
  return (
    <DocLayout>
      <div className="space-y-8">
        <div className="flex items-start gap-3">
          <Settings className="w-8 h-8 text-blue-500 mt-1" />
          <div>
            <h1 className="text-3xl font-bold mb-4">Advanced Usage</h1>
            <p className="text-gray-700 dark:text-gray-300 text-lg leading-relaxed">
              Explore advanced features of the Runlite API to customize
              execution environments and handle complex scenarios. Learn how to
              leverage our powerful options for your specific needs.
            </p>
          </div>
        </div>

        <div className="space-y-8">
          {examples.map((example, index) => (
            <section key={index} className="space-y-4">
              <Card className="border-2 hover:border-blue-200 dark:hover:border-blue-800 transition-colors">
                <CardHeader>
                  <div className="flex items-center gap-2">
                    <div className="p-2 bg-gray-100 dark:bg-gray-800 rounded-lg">
                      {example.icon}
                    </div>
                    <CardTitle>{example.title}</CardTitle>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <p className="text-gray-700 dark:text-gray-300">
                    {example.description}
                  </p>
                  <CodeBlock
                    language={example.code.language}
                    code={example.code.content}
                    showLineNumbers
                  />
                </CardContent>
              </Card>
            </section>
          ))}
        </div>

        <Card
          className={cn(
            "border-l-4 border-blue-500",
            "bg-blue-50 dark:bg-blue-900/20"
          )}
        >
          <CardHeader>
            <div className="flex items-center gap-2">
              <Info className="w-5 h-5 text-blue-500" />
              <CardTitle className="text-blue-900 dark:text-blue-100">
                Pro Tips
              </CardTitle>
            </div>
          </CardHeader>
          <CardContent>
            <ul className="space-y-3">
              {tips.map((tip, index) => (
                <li
                  key={index}
                  className="flex items-start gap-2 text-blue-800 dark:text-blue-200"
                >
                  <ArrowRight className="w-4 h-4 mt-1 flex-shrink-0" />
                  <span>{tip}</span>
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>
      </div>
    </DocLayout>
  );
}
