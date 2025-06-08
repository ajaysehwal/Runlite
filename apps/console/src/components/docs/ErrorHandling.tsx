import React from "react";
import { Card, CardContent } from "../ui/card";
import { CodeBlock } from "./CodeBlock";
import { DocLayout } from "./DocLayout";
import { AlertTriangle, XCircle, Info } from "lucide-react";
import { cn } from "@/lib/utils";

const errorCodes = [
  {
    code: 400,
    title: "Bad Request",
    message: "Check your request parameters",
    icon: <Info className="w-5 h-5 text-blue-500" />,
  },
  {
    code: 401,
    title: "Unauthorized",
    message: "Invalid or missing API key",
    icon: <AlertTriangle className="w-5 h-5 text-yellow-500" />,
  },
  {
    code: 404,
    title: "Not Found",
    message: "Endpoint does not exist",
    icon: <XCircle className="w-5 h-5 text-red-500" />,
  },
  {
    code: 429,
    title: "Too Many Requests",
    message: "You've hit the rate limit",
    icon: <AlertTriangle className="w-5 h-5 text-orange-500" />,
  },
  {
    code: 500,
    title: "Internal Server Error",
    message: "Please contact support",
    icon: <XCircle className="w-5 h-5 text-red-500" />,
  },
];

export default function ErrorHandling() {
  return (
    <DocLayout>
      <div className="space-y-8">
        <div className="flex items-start gap-3">
          <AlertTriangle className="w-8 h-8 text-red-500 mt-1" />
          <div>
            <h1 className="text-3xl font-bold mb-4">Error Handling</h1>
            <p className="text-gray-700 dark:text-gray-300 text-lg leading-relaxed">
              Understanding and handling errors is crucial for building robust
              applications with the Runlite API. Learn about our error codes and
              best practices for error handling.
            </p>
          </div>
        </div>

        <section className="space-y-6">
          <h2 className="text-2xl font-semibold">Common Error Codes</h2>
          <div className="grid grid-cols-1 gap-4">
            {errorCodes.map((error) => (
              <Card
                key={error.code}
                className="border-2 hover:border-gray-200 dark:hover:border-gray-800 transition-colors"
              >
                <CardContent className="flex items-center gap-4 p-4">
                  <div className="p-2 bg-gray-100 dark:bg-gray-800 rounded-lg">
                    {error.icon}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-3">
                      <span className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                        {error.code}
                      </span>
                      <span className="text-lg font-medium text-gray-700 dark:text-gray-300">
                        {error.title}
                      </span>
                    </div>
                    <p className="text-gray-600 dark:text-gray-400 mt-1">
                      {error.message}
                    </p>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>

        <section className="space-y-6">
          <h2 className="text-2xl font-semibold">Error Response Format</h2>
          <p className="text-gray-700 dark:text-gray-300">
            All error responses follow a consistent JSON format, making it easy
            to handle errors in your application:
          </p>
          <CodeBlock
            language="json"
            code={`{
  "error": {
    "code": 400,
    "message": "Invalid 'language' parameter",
    "details": {
      "field": "language",
      "reason": "Unsupported language specified"
    }
  }
}`}
            showLineNumbers
          />

          <Card
            className={cn(
              "border-l-4 border-blue-500",
              "bg-blue-50 dark:bg-blue-900/20"
            )}
          >
            <CardContent className="p-4">
              <div className="flex items-start gap-3">
                <Info className="w-5 h-5 text-blue-500 mt-1" />
                <div className="space-y-2">
                  <h3 className="font-medium text-blue-900 dark:text-blue-100">
                    Best Practices for Error Handling
                  </h3>
                  <ul className="list-disc pl-4 space-y-1 text-blue-800 dark:text-blue-200">
                    <li>
                      Always check the error code and message in responses
                    </li>
                    <li>Implement proper error handling for all API calls</li>
                    <li>Log errors appropriately for debugging</li>
                    <li>Display user-friendly error messages in your UI</li>
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>
        </section>
      </div>
    </DocLayout>
  );
}
