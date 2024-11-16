"use client";
import React from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import Navbar from "@/components/navbar";
import Pricing from "@/components/pricing";
import Hero from "@/components/hero";
import { ScrollArea } from "@/components/ui/scroll-area";
import WorkflowAnimation from "@/components/workflow";
import FeaturesSection from "@/components/featureSection";

const fadeInUp = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 },
};

const Home: React.FC = () => {
  return (
    <ScrollArea className="min-h-screen bg-white text-gray-900">
      <Navbar />
      <main className="mx-auto px-4 sm:px-6 lg:px-8 w-full">
        <Hero />
        <WorkflowAnimation />
        <FeaturesSection />
        <Pricing />
        <motion.section
          className="mt-32 mb-16"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.2 }}
          variants={fadeInUp}
        >
          <Card className="bg-gradient-to-r from-blue-600 to-blue-400 border-none text-white overflow-hidden relative">
            <motion.div
              className="absolute inset-0 bg-blue-600 opacity-20"
              animate={{
                scale: [1, 1.1, 1],
                rotate: [0, 5, 0],
              }}
              transition={{
                duration: 10,
                repeat: Infinity,
                ease: "easeInOut",
              }}
            />
            <CardContent className="relative z-10 py-12">
              <h3 className="text-4xl font-bold mb-6 text-center">
                Ready to get started?
              </h3>
              <p className="text-center mb-8 text-lg">
                Sign up now and get 10,000 free API calls.
              </p>
              <form className="flex flex-col sm:flex-row gap-4 justify-center max-w-2xl mx-auto">
                <Input
                  type="email"
                  placeholder="Enter your email"
                  className="bg-white/20 text-white placeholder-white/70 border-white/30 focus:border-white"
                />
                <Button
                  type="submit"
                  className="bg-white text-blue-600 hover:bg-blue-100 transition-colors duration-300"
                >
                  Start Coding Now
                </Button>
              </form>
            </CardContent>
          </Card>
        </motion.section>
      </main>

      <footer className="container mx-auto py-8 text-center text-gray-600">
        <p>&copy; 2024 Runlite. All rights reserved.</p>
      </footer>
    </ScrollArea>
  );
};

export default Home;
