import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { CodeBlock } from "./CodeBlock";
import { DocLayout } from "./DocLayout";
import { Key, Shield, AlertTriangle } from "lucide-react";
import { cn } from "@/lib/utils";

export default function Authentication() {
  return (
    <DocLayout>
      <div className="space-y-6">
        <div className="flex items-start gap-3">
          <Shield className="w-8 h-8 text-blue-500 mt-1" />
          <div>
            <h1 className="text-3xl font-bold mb-4">Authentication</h1>
            <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
              All requests to the Runlite API must be authenticated using an API key.
              Your API key is your unique identifier and should be kept confidential.
            </p>
          </div>
        </div>

        <Card className="border-2 border-blue-100 dark:border-blue-900">
          <CardHeader>
            <div className="flex items-center gap-2">
              <Key className="w-5 h-5 text-blue-500" />
              <CardTitle>Obtaining Your API Key</CardTitle>
            </div>
          </CardHeader>
          <CardContent>
            <ol className="list-decimal pl-6 space-y-3">
              <li className="text-gray-700 dark:text-gray-300">Log in to your Runlite account</li>
              <li className="text-gray-700 dark:text-gray-300">Navigate to API Settings in your dashboard</li>
              <li className="text-gray-700 dark:text-gray-300">Click &quot;Generate New API Key&quot;</li>
              <li className="text-gray-700 dark:text-gray-300">Copy and securely store your new API key</li>
            </ol>
          </CardContent>
        </Card>

        <section className="space-y-4">
          <h2 className="text-2xl font-semibold">Using Your API Key</h2>
          <p className="text-gray-700 dark:text-gray-300">
            Include your API key in the Authorization header of each request:
          </p>
          <CodeBlock
            language="bash"
            code={`curl -H "Authorization: Bearer YOUR_API_KEY" \\
-H "Content-Type: application/json" \\
-X POST \\
-d '{"language": "python", "code": "print('Hello, Runlite!')"}' \\
https://api.runlite.app/v1/execute`}
            showLineNumbers
          />
        </section>

        <Card className={cn(
          "border-l-4 border-yellow-500",
          "bg-yellow-50 dark:bg-yellow-900/20"
        )}>
          <CardHeader>
            <div className="flex items-center gap-2">
              <AlertTriangle className="w-5 h-5 text-yellow-500" />
              <CardTitle className="text-yellow-800 dark:text-yellow-400">Security Best Practices</CardTitle>
            </div>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2 text-yellow-800 dark:text-yellow-200">
              <li>Never share your API key or expose it in client-side code</li>
              <li>Rotate your API keys periodically for enhanced security</li>
              <li>Use environment variables to store API keys in your applications</li>
              <li>Monitor your API key usage for any suspicious activity</li>
            </ul>
          </CardContent>
        </Card>
      </div>
    </DocLayout>
  );
}
