"use client";
import React from "react";
import { motion } from "framer-motion";
import { Card, CardHeader, CardContent, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Check, Zap } from "lucide-react";
import { useRouter } from "next/navigation";

interface PricingFeature {
  text: string;
  highlighted?: boolean;
}

interface PricingPlan {
  title: string;
  price: string;
  subtitle: string;
  features: PricingFeature[];
  cta: string;
  popular?: boolean;
}

const fadeInUp = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 },
};

export default function Pricing() {
  const router = useRouter();
  const pricingPlans: PricingPlan[] = [
    {
      title: "Basic",
      subtitle: "Perfect for testing and small projects",
      price: "$0",
      features: [
        { text: "1,000 API calls per month" },
        { text: "100 request per day" },
        { text: "Community support" },
        { text: "Basic analytics dashboard" },
        { text: "99.9% uptime SLA" },
        { text: "Unlimited cached requests", highlighted: true },
      ],
      cta: "Get Started",
    },
    {
      title: "Pro",
      subtitle: "Ideal for growing businesses",
      price: "$49",
      popular: true,
      features: [
        { text: "1,000,000 API calls per month" },
        { text: "100 concurrent requests" },
        { text: "Priority email support" },
        { text: "Advanced analytics & reporting" },
        { text: "Custom rate limiting", highlighted: true },
        { text: "API key management", highlighted: true },
      ],
      cta: "Start Free Trial",
    },
    {
      title: "Enterprise",
      subtitle: "For large-scale applications",
      price: "Custom",
      features: [
        { text: "Unlimited API calls" },
        { text: "Unlimited concurrent requests" },
        { text: "24/7 dedicated support" },
        { text: "Full infrastructure control" },
        { text: "On-premise deployment", highlighted: true },
        { text: "Custom SLA", highlighted: true },
      ],
      cta: "Contact Sales",
    },
  ];

  return (
    <motion.section
      className="py-24 relative overflow-hidden"
      initial="hidden"
      animate="visible"
      variants={{ visible: { transition: { staggerChildren: 0.2 } } }}
    >
      {/* Background Elements */}
      <div className="absolute inset-0 bg-gradient-to-b from-white to-blue-50/30 dark:from-gray-900 dark:to-gray-900/90" />
      <div className="absolute inset-0 bg-grid-black/[0.02] dark:bg-grid-white/[0.02]" />

      <div className="container mx-auto px-4 relative">
        <motion.div className="text-center mb-16" variants={fadeInUp}>
          <h2 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-gray-900 via-gray-700 to-gray-900 dark:from-white dark:via-gray-300 dark:to-white bg-clip-text text-transparent mb-6">
            Simple, Transparent Pricing
          </h2>
          <p className="text-gray-600 dark:text-gray-300 text-lg max-w-2xl mx-auto">
            Choose the perfect plan for your needs. All plans include our core
            features, plus specific benefits designed to help you achieve your
            goals.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {pricingPlans.map((plan, index) => (
            <motion.div key={index} variants={fadeInUp}>
              <Card
                className={`h-full flex flex-col relative overflow-hidden backdrop-blur-xl border-gray-200/50 dark:border-gray-700/50 transition-all duration-300 ${
                  plan.popular
                    ? "border-blue-500/50 shadow-xl scale-105 bg-white/90 dark:bg-gray-900/90"
                    : "hover:border-blue-300/50 bg-white/80 dark:bg-gray-900/80 hover:shadow-lg"
                }`}
              >
                {plan.popular && (
                  <div className="absolute top-4 right-4">
                    <Badge className="bg-blue-500/90 backdrop-blur-xl text-white border-blue-400/20">
                      <Zap className="w-3 h-3 mr-1" />
                      Most Popular
                    </Badge>
                  </div>
                )}
                <CardHeader>
                  <CardTitle className="text-2xl font-bold bg-gradient-to-br from-gray-900 to-gray-600 dark:from-white dark:to-gray-300 bg-clip-text text-transparent">
                    {plan.title}
                  </CardTitle>
                  <p className="text-gray-500 dark:text-gray-400 mt-1">
                    {plan.subtitle}
                  </p>
                </CardHeader>
                <CardContent className="flex-grow">
                  <div className="mb-6">
                    <span className="text-4xl font-bold bg-gradient-to-br from-gray-900 to-gray-700 dark:from-white dark:to-gray-200 bg-clip-text text-transparent">
                      {plan.price}
                    </span>
                    {plan.price !== "Custom" && (
                      <span className="text-gray-500 dark:text-gray-400 ml-2">
                        /month
                      </span>
                    )}
                  </div>
                  <ul className="space-y-3 mb-6">
                    {plan.features.map((feature, i) => (
                      <li
                        key={i}
                        className={`flex items-start ${
                          feature.highlighted
                            ? "text-gray-900 dark:text-white"
                            : "text-gray-600 dark:text-gray-300"
                        }`}
                      >
                        <Check
                          className={`mr-2 h-5 w-5 mt-0.5 ${
                            feature.highlighted
                              ? "text-blue-500"
                              : "text-gray-400 dark:text-gray-500"
                          }`}
                        />
                        <span>{feature.text}</span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
                <div className="p-6 mt-auto">
                  <Button
                    onClick={
                      plan.title === "Basic"
                        ? () => router.push("/playground")
                        : () => {}
                    }
                    className={`w-full h-11 text-sm font-medium transition-all duration-300 ${
                      index === 0
                        ? "bg-white hover:bg-gray-50 border-2 border-gray-200 text-gray-700 dark:bg-gray-800 dark:hover:bg-gray-700 dark:border-gray-700 dark:text-gray-200"
                        : plan.popular
                          ? "bg-blue-500 text-white hover:bg-blue-600 shadow-lg shadow-blue-500/20"
                          : "bg-gray-900 text-white hover:bg-gray-800 dark:bg-white dark:text-gray-900 dark:hover:bg-gray-100"
                    }`}
                  >
                    {plan.cta}
                  </Button>
                </div>
              </Card>
            </motion.div>
          ))}
        </div>

        <motion.div className="mt-16 text-center" variants={fadeInUp}>
          <p className="text-gray-600 dark:text-gray-300">
            All plans include our core features:
            <span className="font-medium text-gray-900 dark:text-white">
              {" "}
              API Documentation, SSL Encryption, Rate Limiting, and CORS Support
            </span>
          </p>
        </motion.div>
      </div>
    </motion.section>
  );
}
