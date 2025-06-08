import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { CodeBlock } from "./CodeBlock";
import { DocLayout } from "./DocLayout";
import { Webhook, Shield, Bell, CheckCircle2, ArrowRight } from "lucide-react";
import { cn } from "@/lib/utils";

const setupSteps = [
  {
    title: "Access Dashboard",
    description: "Go to your Runlite dashboard",
    icon: <Bell className="w-5 h-5 text-blue-500" />,
  },
  {
    title: "Navigate to Webhooks",
    description: "Find the Webhooks section in your settings",
    icon: <Webhook className="w-5 h-5 text-purple-500" />,
  },
  {
    title: "Add New Webhook",
    description: "Click 'Add Webhook' and enter your endpoint URL",
    icon: <ArrowRight className="w-5 h-5 text-green-500" />,
  },
  {
    title: "Configure Events",
    description: "Select which events you want to subscribe to",
    icon: <CheckCircle2 className="w-5 h-5 text-yellow-500" />,
  },
];

const securityTips = [
  "Verify webhook signatures using the X-Runlite-Signature header",
  "Use HTTPS endpoints for secure webhook delivery",
  "Implement proper request timeout handling",
  "Store webhook logs for debugging purposes",
];

export default function Webhooks() {
  return (
    <DocLayout>
      <div className="space-y-8">
        <div className="flex items-start gap-3">
          <Webhook className="w-8 h-8 text-blue-500 mt-1" />
          <div>
            <h1 className="text-3xl font-bold mb-4">Webhooks</h1>
            <p className="text-gray-700 dark:text-gray-300 text-lg leading-relaxed">
              Runlite provides webhooks to notify your application about
              asynchronous events, such as long-running code execution
              completion. Learn how to set up and secure your webhook endpoints.
            </p>
          </div>
        </div>

        <section className="space-y-6">
          <h2 className="text-2xl font-semibold">Setting Up Webhooks</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {setupSteps.map((step, index) => (
              <Card
                key={index}
                className="border-2 hover:border-blue-200 dark:hover:border-blue-800 transition-colors"
              >
                <CardContent className="pt-6">
                  <div className="flex items-start gap-4">
                    <div className="p-2 bg-gray-100 dark:bg-gray-800 rounded-lg">
                      {step.icon}
                    </div>
                    <div>
                      <h3 className="font-semibold text-lg mb-1">
                        {step.title}
                      </h3>
                      <p className="text-gray-600 dark:text-gray-400">
                        {step.description}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>

        <section className="space-y-6">
          <h2 className="text-2xl font-semibold">Webhook Payload Example</h2>
          <p className="text-gray-700 dark:text-gray-300">
            When an event occurs, we&apos;ll send a POST request to your
            endpoint with a JSON payload:
          </p>
          <CodeBlock
            language="json"
            code={`{
  "event": "execution.completed",
  "execution_id": "exec_123456789",
  "status": "success",
  "output": "Hello, Runlite!\\n",
  "execution_time": 1.5,
  "timestamp": "2024-03-21T10:30:00Z",
  "environment": {
    "language": "python",
    "version": "3.8.1"
  }
}`}
            showLineNumbers
          />
        </section>

        <Card
          className={cn(
            "border-l-4 border-yellow-500",
            "bg-yellow-50 dark:bg-yellow-900/20"
          )}
        >
          <CardHeader>
            <div className="flex items-center gap-2">
              <Shield className="w-5 h-5 text-yellow-500" />
              <CardTitle className="text-yellow-900 dark:text-yellow-100">
                Security Best Practices
              </CardTitle>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <p className="text-yellow-800 dark:text-yellow-200">
                Ensure your webhook endpoints are secure and reliable by
                following these best practices:
              </p>
              <ul className="space-y-2">
                {securityTips.map((tip, index) => (
                  <li
                    key={index}
                    className="flex items-start gap-2 text-yellow-800 dark:text-yellow-200"
                  >
                    <ArrowRight className="w-4 h-4 mt-1 flex-shrink-0" />
                    <span>{tip}</span>
                  </li>
                ))}
              </ul>
            </div>
          </CardContent>
        </Card>

        <Card
          className={cn(
            "border-2 border-blue-100 dark:border-blue-900",
            "bg-blue-50 dark:bg-blue-900/20"
          )}
        >
          <CardContent className="p-4">
            <div className="flex items-start gap-3">
              <Bell className="w-5 h-5 text-blue-500 mt-1" />
              <div>
                <h3 className="font-medium text-blue-900 dark:text-blue-100 mb-2">
                  Available Webhook Events
                </h3>
                <ul className="grid grid-cols-1 md:grid-cols-2 gap-2">
                  {[
                    "execution.started",
                    "execution.completed",
                    "execution.failed",
                    "execution.timeout",
                    "system.maintenance",
                    "quota.exceeded",
                  ].map((event, index) => (
                    <li
                      key={index}
                      className="flex items-center gap-2 text-blue-800 dark:text-blue-200"
                    >
                      <div className="w-1.5 h-1.5 bg-blue-500 rounded-full" />
                      <code className="text-sm bg-blue-100 dark:bg-blue-800 px-2 py-0.5 rounded">
                        {event}
                      </code>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </DocLayout>
  );
}
