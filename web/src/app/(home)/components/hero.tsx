import React from "react";
import RetroGrid from "@/components/ui/retro-grid";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import {ArrowRight} from "lucide-react";
const fadeInUp = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 },
};
export default function Hero() {
  return (
    <motion.section
      className="relative flex h-[600px] w-full flex-col items-center justify-center overflow-hidden rounded-lg bg-background mb-32"
      initial="hidden"
      animate="visible"
      variants={{ visible: { transition: { staggerChildren: 0.3 } } }}
    >
      <motion.span
        className="pointer-events-none z-10 whitespace-pre-wrap bg-gradient-to-b from-[#007bff] via-[#0056b3] to-[#004085] bg-clip-text text-center text-6xl font-bold leading-none tracking-tighter text-transparent"
        variants={fadeInUp}
      >
        Compile Code with Confidence
      </motion.span>
      <motion.p
        className="text-xl mt-6 text-foreground max-w-2xl mx-auto text-center z-10"
        variants={fadeInUp}
      >
        Powerful APIs for seamless code execution across multiple languages. Get
        started with 10,000 free API calls.
      </motion.p>
      <motion.div
        variants={fadeInUp}
        className="flex flex-col sm:flex-row justify-center space-y-4 sm:space-y-0 sm:space-x-4 mt-8 z-10"
      >
        <Button
          size="lg"
          className="text-lg px-8 py-4 bg-[#3147d4] text-white hover:bg-[#4448d5]"
        >
          Get API Key <ArrowRight className="ml-2" />
        </Button>
        <Button
          size="lg"
          variant="outline"
          className="text-lg px-8 py-4 text-[#3046ea] border-[#4452ea]"
        >
          View Docs
        </Button>
      </motion.div>
      <RetroGrid />
    </motion.section>
  );
}
