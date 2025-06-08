import React from "react";
import { CodeBlock } from "./CodeBlock";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { DocLayout } from "./DocLayout";
import { Gauge, Clock, Building2, AlertCircle, Zap } from "lucide-react";
import { cn } from "@/lib/utils";

const rateLimitTiers = [
  {
    name: "Basic",
    limit: "100 requests/minute",
    icon: <Zap className="w-5 h-5 text-blue-500" />,
    features: [
      "Standard execution time",
      "Basic error reporting",
      "Community support",
    ],
  },
  {
    name: "Pro",
    limit: "500 requests/minute",
    icon: <Gauge className="w-5 h-5 text-purple-500" />,
    features: [
      "Extended execution time",
      "Detailed error reporting",
      "Priority support",
    ],
  },
  {
    name: "Enterprise",
    limit: "Custom limits available",
    icon: <Building2 className="w-5 h-5 text-green-500" />,
    features: [
      "Custom execution limits",
      "Advanced monitoring",
      "Dedicated support",
    ],
  },
];

export default function Limits() {
  return (
    <DocLayout>
      <div className="space-y-8">
        <div className="flex items-start gap-3">
          <Clock className="w-8 h-8 text-blue-500 mt-1" />
          <div>
            <h1 className="text-3xl font-bold mb-4">Rate Limits</h1>
            <p className="text-gray-700 dark:text-gray-300 text-lg leading-relaxed">
              To ensure fair usage and maintain service quality, Runlite
              implements rate limiting on API requests. Choose the tier that
              best fits your needs.
            </p>
          </div>
        </div>

        <section className="space-y-6">
          <h2 className="text-2xl font-semibold">Rate Limit Tiers</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {rateLimitTiers.map((tier) => (
              <Card
                key={tier.name}
                className="border-2 hover:border-blue-200 dark:hover:border-blue-800 transition-colors"
              >
                <CardHeader>
                  <div className="flex items-center gap-2">
                    <div className="p-2 bg-gray-100 dark:bg-gray-800 rounded-lg">
                      {tier.icon}
                    </div>
                    <CardTitle>{tier.name}</CardTitle>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="text-lg font-semibold text-blue-600 dark:text-blue-400">
                      {tier.limit}
                    </div>
                    <ul className="space-y-2">
                      {tier.features.map((feature, index) => (
                        <li
                          key={index}
                          className="flex items-center gap-2 text-gray-700 dark:text-gray-300"
                        >
                          <div className="w-1.5 h-1.5 bg-blue-500 rounded-full" />
                          {feature}
                        </li>
                      ))}
                    </ul>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>

        <section className="space-y-6">
          <h2 className="text-2xl font-semibold">Rate Limit Headers</h2>
          <p className="text-gray-700 dark:text-gray-300">
            When making requests, you&apos;ll receive the following headers to
            help you track your rate limit usage:
          </p>
          <CodeBlock
            language="plaintext"
            code={`X-RateLimit-Limit: 100
X-RateLimit-Remaining: 87
X-RateLimit-Reset: 1623456789`}
            showLineNumbers
          />
        </section>

        <Card
          className={cn(
            "border-l-4 border-yellow-500",
            "bg-yellow-50 dark:bg-yellow-900/20"
          )}
        >
          <CardContent className="p-4">
            <div className="flex items-start gap-3">
              <AlertCircle className="w-5 h-5 text-yellow-500 mt-1" />
              <div className="space-y-2">
                <h3 className="font-medium text-yellow-900 dark:text-yellow-100">
                  Handling Rate Limits
                </h3>
                <div className="space-y-3 text-yellow-800 dark:text-yellow-200">
                  <p>
                    When you exceed your rate limit, you&apos;ll receive a 429
                    Too Many Requests response. To handle this gracefully:
                  </p>
                  <ul className="list-disc pl-4 space-y-1">
                    <li>Implement exponential backoff in your requests</li>
                    <li>Monitor your rate limit headers proactively</li>
                    <li>Cache responses when possible</li>
                    <li>
                      Consider upgrading your plan if you consistently hit
                      limits
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </DocLayout>
  );
}
