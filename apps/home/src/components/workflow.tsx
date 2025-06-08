import React, { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import {
  Code,
  Database,
  Box,
  Play,
  ListEnd,
  CheckCircle2,
  Zap,
} from "lucide-react";

interface Step {
  icon: React.ReactNode;
  label: string;
  description: string;
  color: string;
}

const steps: Step[] = [
  {
    icon: <Database className="w-6 h-6" />,
    label: "Smart Caching",
    description:
      "Instant results from our distributed cache system for previously executed code",
    color: "from-purple-500 to-purple-600",
  },
  {
    icon: <ListEnd className="w-6 h-6" />,
    label: "Queue Management",
    description:
      "Efficient request handling with intelligent load balancing and prioritization",
    color: "from-blue-500 to-blue-600",
  },
  {
    icon: <Box className="w-6 h-6" />,
    label: "Secure Sandbox",
    description:
      "Military-grade isolation for safe code execution in containerized environments",
    color: "from-green-500 to-green-600",
  },
  {
    icon: <Play className="w-6 h-6" />,
    label: "Fast Execution",
    description:
      "Lightning-fast code compilation with optimized runtime environments",
    color: "from-orange-500 to-orange-600",
  },
];

const TerminalWindow = ({
  title,
  children,
  variant = "dark",
}: {
  title: string;
  children: React.ReactNode;
  variant?: "dark" | "light";
}) => (
  <div
    className={`rounded-xl overflow-hidden shadow-2xl ${
      variant === "dark" ? "bg-gray-900" : "bg-white"
    } backdrop-blur-xl border border-gray-800/10`}
  >
    <div
      className={`px-4 py-3 flex items-center ${
        variant === "dark" ? "bg-gray-800/50" : "bg-gray-50"
      }`}
    >
      <div className="flex space-x-2">
        <div className="w-3 h-3 rounded-full bg-red-500/80 backdrop-blur-xl"></div>
        <div className="w-3 h-3 rounded-full bg-yellow-500/80 backdrop-blur-xl"></div>
        <div className="w-3 h-3 rounded-full bg-green-500/80 backdrop-blur-xl"></div>
      </div>
      <div
        className={`ml-4 text-sm font-medium ${
          variant === "dark" ? "text-gray-300" : "text-gray-600"
        }`}
      >
        {title}
      </div>
    </div>
    <div
      className={`p-4 font-mono text-sm ${
        variant === "dark" ? "text-gray-300" : "text-gray-800"
      }`}
    >
      {children}
    </div>
  </div>
);

const WorkflowAnimation = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start center", "end center"],
  });

  const beamProgress = useTransform(scrollYProgress, [0, 1], ["0%", "100%"]);
  const beamOpacity = useTransform(
    scrollYProgress,
    [0, 0.1, 0.9, 1],
    [0, 1, 1, 0]
  );

  return (
    <div
      ref={containerRef}
      className="min-h-screen py-24 w-full bg-gradient-to-b from-white to-blue-50/30 dark:from-gray-900 dark:to-gray-900/90 relative overflow-hidden"
    >
      {/* Background Decorative Elements */}
      <div className="absolute inset-0 bg-grid-black/[0.02] dark:bg-grid-white/[0.02] -z-10" />
      <div className="absolute top-0 left-1/4 w-72 h-72 bg-purple-500/10 rounded-full blur-3xl animate-pulse" />
      <div className="absolute bottom-0 right-1/4 w-72 h-72 bg-blue-500/10 rounded-full blur-3xl animate-pulse delay-1000" />

      <div className="max-w-6xl mx-auto px-4 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-20"
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-blue-500/10 via-purple-500/10 to-blue-500/10 p-1 pl-2 pr-4 backdrop-blur-sm border border-white/10 shadow-xl mb-6"
          >
            <span className="flex h-6 w-6 items-center justify-center rounded-full bg-blue-600 shadow-inner">
              <Zap className="h-3 w-3 text-white" />
            </span>
            <span className="text-sm font-medium bg-gradient-to-r from-gray-900 to-gray-600 dark:from-white dark:to-gray-300 bg-clip-text text-transparent">
              How It Works
            </span>
          </motion.div>

          <h2 className="text-4xl md:text-5xl font-bold mb-6 bg-gradient-to-r from-gray-900 via-gray-800 to-gray-900 dark:from-white dark:via-gray-300 dark:to-white bg-clip-text text-transparent">
            Code Execution Pipeline
          </h2>
          <p className="text-gray-600 dark:text-gray-300 max-w-2xl mx-auto text-lg">
            Experience seamless code execution with our advanced compilation
            platform. Secure, efficient, and lightning-fast results in
            milliseconds.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 gap-20">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="group"
          >
            <TerminalWindow title="Input Request">
              <div className="flex items-center text-green-400 mb-2">
                <Code className="w-4 h-4 mr-2" />
                <span className="mr-2">$</span>
                <motion.span
                  initial={{ width: 0 }}
                  animate={{ width: "auto" }}
                  transition={{ duration: 1, delay: 0.5 }}
                  className="overflow-hidden whitespace-nowrap"
                >
                  curl -X POST https://api.runlite.app/v1/execute
                </motion.span>
              </div>
              <div className="text-white bg-gray-800/50 p-4 rounded-lg backdrop-blur-sm">
                {`{
  "language": "python",
  "code": "def fibonacci(n):
    if n <= 1:
        return n
    return fibonacci(n-1) + fibonacci(n-2)

for i in range(5):
    print(fibonacci(i))"
}`}
              </div>
            </TerminalWindow>
          </motion.div>

          <div className="relative">
            <motion.div
              className="absolute left-1/2 transform -translate-x-1/2 w-1 h-full"
              style={{ opacity: beamOpacity }}
            >
              <div className="h-full w-full bg-gradient-to-b from-blue-400/50 via-purple-400/50 to-blue-400/50 rounded-full shadow-lg backdrop-blur-sm">
                <motion.div
                  className="absolute top-0 left-1/2 transform -translate-x-1/2 w-4 h-4 bg-blue-500 rounded-full shadow-lg"
                  style={{ top: beamProgress }}
                >
                  <div className="absolute inset-0 bg-blue-400 rounded-full animate-ping" />
                  <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-2 h-2 bg-white rounded-full" />
                </motion.div>
              </div>
            </motion.div>

            <div className="relative z-10 space-y-24">
              {steps.map((step, index) => (
                <motion.div
                  key={step.label}
                  initial={{ opacity: 0, x: index % 2 === 0 ? -20 : 20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  className="flex justify-center"
                >
                  <div className="group bg-white dark:bg-gray-800 rounded-xl p-6 shadow-xl backdrop-blur-xl border border-gray-200/50 dark:border-gray-700/50 w-96 relative flex items-start hover:shadow-2xl transition-all duration-300">
                    <div
                      className={`bg-gradient-to-br ${step.color} rounded-lg p-3 mr-4 shadow-lg group-hover:scale-110 transition-transform duration-300`}
                    >
                      <div className="text-white">{step.icon}</div>
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold mb-2 bg-gradient-to-r from-gray-900 to-gray-700 dark:from-white dark:to-gray-300 bg-clip-text text-transparent">
                        {step.label}
                      </h3>
                      <p className="text-gray-600 dark:text-gray-300 text-sm leading-relaxed">
                        {step.description}
                      </p>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.4 }}
            className="group"
          >
            <TerminalWindow title="Response">
              <div className="flex items-center text-green-400 mb-2">
                <CheckCircle2 className="w-4 h-4 mr-2" />
                <span>Response received in 42ms</span>
              </div>
              <div className="text-white bg-gray-800/50 p-4 rounded-lg backdrop-blur-sm">
                {`{
  "status": "success",
  "execution_time": "42ms",
  "output": [
    "0",
    "1",
    "1",
    "2",
    "3"
  ],
  "memory_used": "2.1MB"
}`}
              </div>
            </TerminalWindow>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default WorkflowAnimation;
