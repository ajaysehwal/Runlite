"use client";
import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import {
  ArrowRight,
  Code,
  Zap,
  Shield,
  Globe,
  Server,
  Users,
} from "lucide-react";

const fadeIn = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 },
};
type CodeLanguage = "python" | "javascript" | "java";

const codeExamples: Record<CodeLanguage, string> = {
  python: `print("Hello, World!")
result = [x for x in range(10) if x % 2 == 0]
print(result)`,
  javascript: `console.log("Hello, World!");
const result = Array.from({length: 10}, (_, i) => i).filter(x => x % 2 === 0);
console.log(result);`,
  java: `public class HelloWorld {
    public static void main(String[] args) {
        System.out.println("Hello, World!");
        IntStream.range(0, 10)
                 .filter(x -> x % 2 == 0)
                 .forEach(System.out::println);
    }
}`,
};
export default function Home() {
  const [activeTab, setActiveTab] = useState<CodeLanguage>("python");

  return (
    <div className="min-h-screen bg-white text-gray-800">
      <nav className="container mx-auto py-6">
        <div className="flex justify-between items-center">
          <motion.div
            className="flex items-center space-x-2"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
          >
            <Code size={32} className="text-blue-600" />
            <h1 className="text-2xl font-bold text-blue-600">CodeCompileAPI</h1>
          </motion.div>
          <motion.div
            className="space-x-4"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
          >
            <Button
              variant="ghost"
              className="text-gray-600 hover:text-blue-600"
            >
              Features
            </Button>
            <Button
              variant="ghost"
              className="text-gray-600 hover:text-blue-600"
            >
              Pricing
            </Button>
            <Button
              variant="ghost"
              className="text-gray-600 hover:text-blue-600"
            >
              Docs
            </Button>
            <Button variant="outline" className="text-blue-600 border-blue-600">
              Log In
            </Button>
            <Button className="bg-blue-600 text-white hover:bg-blue-700">
              Sign Up
            </Button>
          </motion.div>
        </div>
      </nav>

      <main className="container mx-auto mt-20">
        <motion.section
          className="text-center"
          initial="hidden"
          animate="visible"
          transition={{ staggerChildren: 0.3 }}
        >
          <motion.h2
            className="text-5xl font-bold mb-6 text-gray-800"
            variants={fadeIn}
          >
            Streamline Your Code Compilation
          </motion.h2>
          <motion.p className="text-xl mb-8 text-gray-600" variants={fadeIn}>
            Powerful APIs for seamless code execution across multiple languages.
          </motion.p>
          <motion.div
            variants={fadeIn}
            className="flex justify-center space-x-4"
          >
            <Button
              size="lg"
              className="text-lg px-8 py-4 bg-blue-600 text-white hover:bg-blue-700"
            >
              Get Started <ArrowRight className="ml-2" />
            </Button>
            <Button
              size="lg"
              variant="outline"
              className="text-lg px-8 py-4 text-blue-600 border-blue-600"
            >
              View Docs
            </Button>
          </motion.div>
        </motion.section>

        <motion.section
          className="mt-32"
          initial="hidden"
          animate="visible"
          transition={{ staggerChildren: 0.2 }}
        >
          <motion.h3
            className="text-3xl font-semibold mb-12 text-center text-gray-800"
            variants={fadeIn}
          >
            Key Features
          </motion.h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                icon: Globe,
                title: "Multi-Language Support",
                description: "Compile code in over 40 programming languages",
              },
              {
                icon: Zap,
                title: "Lightning Fast",
                description: "Get results in milliseconds",
              },
              {
                icon: Shield,
                title: "Secure Execution",
                description: "Run code in isolated environments",
              },
              {
                icon: Server,
                title: "Scalable Infrastructure",
                description: "Handle millions of requests effortlessly",
              },
              {
                icon: Users,
                title: "Team Collaboration",
                description: "Manage API access across your organization",
              },
              {
                icon: Code,
                title: "Customizable Workflows",
                description:
                  "Integrate seamlessly with your development process",
              },
            ].map((feature, index) => (
              <motion.div key={index} variants={fadeIn}>
                <Card className="border-none shadow-lg hover:shadow-xl transition-shadow duration-300">
                  <CardHeader>
                    <feature.icon className="w-12 h-12 mb-4 text-blue-600" />
                    <CardTitle className="text-xl text-gray-800">
                      {feature.title}
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-gray-600">{feature.description}</p>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </motion.section>

        <motion.section
          className="mt-32"
          initial="hidden"
          animate="visible"
          transition={{ staggerChildren: 0.2 }}
        >
          <motion.h3
            className="text-3xl font-semibold mb-12 text-center text-gray-800"
            variants={fadeIn}
          >
            See It In Action
          </motion.h3>
          <motion.div variants={fadeIn}>
            <Tabs
              value={activeTab}
              onValueChange={(value) => setActiveTab(value as CodeLanguage)}
              className="w-full max-w-3xl mx-auto"
            >
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="python">Python</TabsTrigger>
                <TabsTrigger value="javascript">JavaScript</TabsTrigger>
                <TabsTrigger value="java">Java</TabsTrigger>
              </TabsList>
              <div className="mt-4 p-4 bg-gray-100 rounded-lg">
                <AnimatePresence mode="wait">
                  <motion.div
                    key={activeTab}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    transition={{ duration: 0.2 }}
                  >
                    <pre className="text-sm text-gray-800">
                      <code>{codeExamples[activeTab]}</code>
                    </pre>
                  </motion.div>
                </AnimatePresence>
              </div>
            </Tabs>
          </motion.div>
        </motion.section>

        <motion.section
          className="mt-32"
          initial="hidden"
          animate="visible"
          transition={{ staggerChildren: 0.2 }}
        >
          <motion.h3
            className="text-3xl font-semibold mb-12 text-center text-gray-800"
            variants={fadeIn}
          >
            Flexible Pricing
          </motion.h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                title: "Starter",
                price: "$49",
                features: [
                  "100,000 API calls/month",
                  "10 concurrent requests",
                  "Community support",
                  "Basic analytics",
                ],
              },
              {
                title: "Pro",
                price: "$199",
                features: [
                  "1,000,000 API calls/month",
                  "100 concurrent requests",
                  "Priority support",
                  "Advanced analytics",
                  "Custom integrations",
                ],
              },
              {
                title: "Enterprise",
                price: "Custom",
                features: [
                  "Unlimited API calls",
                  "Unlimited concurrent requests",
                  "24/7 dedicated support",
                  "Full infrastructure control",
                  "On-premise deployment option",
                ],
              },
            ].map((plan, index) => (
              <motion.div key={index} variants={fadeIn}>
                <Card className="h-full flex flex-col border-2 border-gray-200 hover:border-blue-600 transition-colors duration-300">
                  <CardHeader>
                    <CardTitle className="text-2xl text-gray-800">
                      {plan.title}
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="flex-grow">
                    <p className="text-4xl font-bold mb-6 text-blue-600">
                      {plan.price}
                    </p>
                    <ul className="space-y-2">
                      {plan.features.map((feature, i) => (
                        <li key={i} className="flex items-center text-gray-600">
                          <ArrowRight className="mr-2 h-4 w-4 text-blue-600" />
                          <span>{feature}</span>
                        </li>
                      ))}
                    </ul>
                  </CardContent>
                  <div className="p-6 mt-auto">
                    <Button className="w-full bg-blue-600 text-white hover:bg-blue-700">
                      Choose Plan
                    </Button>
                  </div>
                </Card>
              </motion.div>
            ))}
          </div>
        </motion.section>

        <motion.section
          className="mt-32"
          initial="hidden"
          animate="visible"
          variants={fadeIn}
        >
          <Card className="bg-gray-100 border-none">
            <CardContent className="pt-6">
              <h3 className="text-3xl font-semibold mb-4 text-center text-gray-800">
                Ready to get started?
              </h3>
              <p className="text-center mb-6 text-gray-600">
                Sign up now and get 10,000 free API calls.
              </p>
              <form className="flex flex-col md:flex-row gap-4 justify-center">
                <Input
                  type="email"
                  placeholder="Enter your email"
                  className="max-w-sm"
                />
                <Button
                  type="submit"
                  className="bg-blue-600 text-white hover:bg-blue-700"
                >
                  Start Coding Now
                </Button>
              </form>
            </CardContent>
          </Card>
        </motion.section>
      </main>

      <footer className="container mx-auto mt-32 py-8 text-center text-gray-600">
        <p>&copy; 2024 CodeCompileAPI. All rights reserved.</p>
      </footer>
    </div>
  );
}
