import React from "react";
import { Card, CardContent } from "../ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../ui/tabs";
import { Button } from "../ui/button";
import { DocLayout } from "./DocLayout";
import { Zap, Rocket, Lock, Clock, Terminal, ChevronRight } from "lucide-react";
  
const features = [
  {
    icon: <Terminal className="w-5 h-5 text-purple-500" />,
    title: "Multi-Language Support",
    description: "Execute code in 30+ programming languages",
  },
  {
    icon: <Zap className="w-5 h-5 text-yellow-500" />,
    title: "Lightning Fast",
    description: "Blazing fast compilation and execution times",
  },
  {
    icon: <Lock className="w-5 h-5 text-green-500" />,
    title: "Secure Execution",
    description: "Isolated environments for safe code execution",
  },
  {
    icon: <Clock className="w-5 h-5 text-blue-500" />,
    title: "Real-time Updates",
    description: "Live execution status and detailed reporting",
  },
];

export default function Introduction() {
  return (
    <DocLayout>
      <div className="space-y-8">
        <div className="flex items-start gap-3">
          <Rocket className="w-8 h-8 text-blue-500 mt-1" />
          <div>
            <h1 className="text-3xl font-bold mb-4">Welcome to Runlite API</h1>
            <p className="text-gray-700 dark:text-gray-300 text-lg leading-relaxed">
              Runlite provides a lightning-fast solution for compiling and
              executing code across multiple programming languages. Perfect for
              building online IDEs, coding education platforms, or integrating
              code execution into your applications.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {features.map((feature, index) => (
            <Card
              key={index}
              className="border-2 hover:border-blue-200 dark:hover:border-blue-800 transition-colors"
            >
              <CardContent className="pt-6">
                <div className="flex items-start gap-4">
                  <div className="p-2 bg-gray-100 dark:bg-gray-800 rounded-lg">
                    {feature.icon}
                  </div>
                  <div>
                    <h3 className="font-semibold text-lg mb-1">
                      {feature.title}
                    </h3>
                    <p className="text-gray-600 dark:text-gray-400">
                      {feature.description}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        <section className="space-y-6">
          <h2 className="text-2xl font-semibold">Getting Started</h2>
          <Tabs defaultValue="signup" className="w-full">
            <TabsList className="w-full justify-start space-x-2">
              <TabsTrigger
                value="signup"
                className="data-[state=active]:bg-blue-50 dark:data-[state=active]:bg-blue-900/20"
              >
                1. Sign Up
              </TabsTrigger>
              <TabsTrigger
                value="apikey"
                className="data-[state=active]:bg-blue-50 dark:data-[state=active]:bg-blue-900/20"
              >
                2. Get API Key
              </TabsTrigger>
              <TabsTrigger
                value="request"
                className="data-[state=active]:bg-blue-50 dark:data-[state=active]:bg-blue-900/20"
              >
                3. Make Request
              </TabsTrigger>
            </TabsList>

            <div className="mt-6">
              <TabsContent value="signup" className="space-y-4">
                <h3 className="font-medium text-lg">Create Your Account</h3>
                <p className="text-gray-700 dark:text-gray-300">
                  Start by creating your Runlite account to access all features
                  and get your API key.
                </p>
                <Button className="flex items-center gap-2">
                  Sign Up Now
                  <ChevronRight className="w-4 h-4" />
                </Button>
              </TabsContent>

              <TabsContent value="apikey" className="space-y-4">
                <h3 className="font-medium text-lg">Generate API Key</h3>
                <p className="text-gray-700 dark:text-gray-300">
                  Once logged in, navigate to the API Settings in your dashboard
                  to generate your API key.
                </p>
                <Button variant="outline" className="flex items-center gap-2">
                  View API Settings
                  <ChevronRight className="w-4 h-4" />
                </Button>
              </TabsContent>

              <TabsContent value="request" className="space-y-4">
                <h3 className="font-medium text-lg">Make Your First Request</h3>
                <p className="text-gray-700 dark:text-gray-300">
                  Follow our quick start guide to make your first API request
                  and start executing code.
                </p>
                <Button variant="outline" className="flex items-center gap-2">
                  <a href="#quickstart">View Quick Start Guide</a>
                  <ChevronRight className="w-4 h-4" />
                </Button>
              </TabsContent>
            </div>
          </Tabs>
        </section>
      </div>
    </DocLayout>
  );
}
