import React from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { ArrowRight, Code2, Zap } from "lucide-react";
import { BackgroundLines } from "@/components/ui/background-lines";
import { useRouter } from "next/navigation";

const fadeInUp = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.6,
      ease: "easeOut",
    },
  },
};

const scaleIn = {
  hidden: { opacity: 0, scale: 0.95 },
  visible: {
    opacity: 1,
    scale: 1,
    transition: {
      duration: 0.5,
      ease: "easeOut",
    },
  },
};

const staggerContainer = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.2,
      delayChildren: 0.1,
    },
  },
};

export default function Hero() {
  const router = useRouter();

  return (
    <motion.section
      className="relative min-h-screen w-full flex flex-col items-center justify-center overflow-hidden"
      initial="hidden"
      animate="visible"
      variants={staggerContainer}
    >
      {/* Gradient Background */}
      <div className="absolute inset-0 bg-gradient-to-b from-white via-blue-50/30 to-transparent dark:from-gray-900 dark:via-blue-950/10 dark:to-gray-900/90" />

      {/* Animated Lines Background */}
      <div className="absolute inset-0">
        <BackgroundLines className="!h-full">
          <div className="absolute inset-0 bg-gradient-to-tr from-blue-500/5 via-purple-500/5 to-pink-500/5" />
        </BackgroundLines>
      </div>

      {/* Decorative Elements */}
      <div className="absolute top-20 left-10 w-72 h-72 bg-blue-500/10 rounded-full blur-3xl animate-pulse" />
      <div className="absolute bottom-20 right-10 w-72 h-72 bg-purple-500/10 rounded-full blur-3xl animate-pulse delay-1000" />

      <div className="relative z-10 max-w-7xl mx-auto px-4 text-center">
        <motion.div variants={fadeInUp}>
          <div className="inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-blue-500/10 via-purple-500/10 to-blue-500/10 p-1 pl-2 pr-4 backdrop-blur-sm border border-white/10 shadow-xl mb-8">
            <span className="flex h-6 w-6 items-center justify-center rounded-full bg-blue-600 shadow-inner">
              <span className="h-2.5 w-2.5 rounded-full bg-white animate-pulse" />
            </span>
            <span className="text-sm font-medium bg-gradient-to-r from-gray-900 to-gray-600 dark:from-white dark:to-gray-300 bg-clip-text text-transparent">
              Trusted by Developers Worldwide
            </span>
          </div>
        </motion.div>

        <motion.div variants={fadeInUp} className="max-w-5xl mx-auto">
          <h1 className="text-5xl font-extrabold leading-tight tracking-tighter md:text-6xl lg:text-7xl mb-6">
            <span className="text-foreground dark:text-white">
              Cloud Code Execution
            </span>{" "}
            <span className="relative">
              <span className="absolute -inset-1 blur-2xl bg-gradient-to-r from-blue-600 via-purple-600 to-blue-700 opacity-20 dark:opacity-30" />
              <span className="relative bg-gradient-to-r from-blue-600 via-purple-600 to-blue-700 bg-clip-text text-transparent">
                Made Simple
              </span>
            </span>
          </h1>
        </motion.div>

        <motion.p
          variants={fadeInUp}
          className="mt-6 max-w-2xl mx-auto text-xl text-gray-600 dark:text-gray-300 leading-relaxed"
        >
          Harness our powerful APIs for seamless code execution across multiple
          languages. Accelerate your development with{" "}
          <span className="relative inline-block">
            <span className="absolute inset-0 bg-blue-500/20 blur-sm rounded-lg" />
            <span className="relative font-semibold text-blue-700 dark:text-blue-400">
              1000 free API calls
            </span>
          </span>{" "}
          to kickstart your journey.
        </motion.p>

        <motion.div
          variants={fadeInUp}
          className="mt-12 flex flex-col sm:flex-row justify-center items-center gap-4 z-20"
        >
          <Button
            size="lg"
            onClick={() => router.push("https://console.runlite.app/api-keys")}
            className="group relative bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-lg text-white transition-all shadow-xl hover:shadow-2xl hover:shadow-blue-500/20 w-full sm:w-auto overflow-hidden"
          >
            <span className="relative z-10 flex items-center justify-center">
              Get Your API Key
              <ArrowRight className="ml-2 transition-transform group-hover:translate-x-1" />
            </span>
            <div className="absolute inset-0 bg-gradient-to-r from-blue-600 via-purple-600 to-blue-600 opacity-0 group-hover:opacity-100 transition-opacity blur-xl" />
          </Button>

          <Button
            onClick={() => router.push("https://console.runlite.app/docs")}
            size="lg"
            variant="outline"
            className="group relative text-lg transition-all w-full sm:w-auto backdrop-blur-sm border-2 border-gray-200 dark:border-gray-800 hover:border-blue-500 dark:hover:border-blue-500"
          >
            <span className="relative z-10 flex items-center justify-center bg-gradient-to-r from-gray-900 to-gray-600 dark:from-white dark:to-gray-300 bg-clip-text text-transparent group-hover:from-blue-600 group-hover:to-blue-600">
              Explore Docs
              <Code2 className="ml-2 transition-transform group-hover:rotate-12" />
            </span>
          </Button>
        </motion.div>

        <motion.div
          variants={scaleIn}
          className="mt-16 inline-flex items-center gap-3 px-6 py-3 rounded-2xl bg-gradient-to-r from-yellow-500/5 via-yellow-500/10 to-yellow-500/5 backdrop-blur-sm border border-yellow-500/10"
        >
          <Zap className="h-5 w-5 text-yellow-600 dark:text-yellow-500" />
          <span className="text-base font-medium bg-gradient-to-r from-yellow-700 to-yellow-600 dark:from-yellow-500 dark:to-yellow-400 bg-clip-text text-transparent">
            Lightning-fast compilation across{" "}
            <span className="font-bold">20+ programming languages</span>
          </span>
        </motion.div>
      </div>
    </motion.section>
  );
}
