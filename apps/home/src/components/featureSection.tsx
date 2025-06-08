import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Code, Zap, Shield, Globe, Server, Users } from "lucide-react";

interface Feature {
  icon: React.ElementType;
  title: string;
  description: string;
}

const features: Feature[] = [
  {
    icon: Globe,
    title: "Multi-Language Support",
    description:
      "Execute code seamlessly in 40+ programming languages with native performance",
  },
  {
    icon: Zap,
    title: "Lightning Fast",
    description:
      "Get results in milliseconds with our optimized execution engine",
  },
  {
    icon: Shield,
    title: "Secure Execution",
    description:
      "Run code in isolated containers with military-grade security measures",
  },
  {
    icon: Server,
    title: "Scalable Infrastructure",
    description:
      "Auto-scaling infrastructure handling millions of requests with 99.9% uptime",
  },
  {
    icon: Users,
    title: "Team Collaboration",
    description:
      "Manage API access and monitor usage across your entire organization",
  },
  {
    icon: Code,
    title: "RESTful API",
    description:
      "Simple, well-documented API that integrates with any tech stack",
  },
];

const FeatureCard = ({
  feature,
  index,
}: {
  feature: Feature;
  index: number;
}) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
    >
      <Card className="group relative overflow-hidden border-none bg-gradient-to-br from-white/95 to-white/90 dark:from-gray-900/90 dark:to-gray-900/80 backdrop-blur-xl hover:shadow-2xl transition-all duration-500 h-full">
        <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 via-purple-500/5 to-pink-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
        <div className="absolute inset-0 bg-grid-black/[0.02] dark:bg-grid-white/[0.02]" />

        <CardHeader className="relative pb-4">
          <motion.div
            whileHover={{ scale: 1.05 }}
            transition={{ type: "spring", stiffness: 300 }}
            className="relative mb-4 inline-block"
          >
            <div className="p-3 rounded-xl ">
              <feature.icon className="w-8 h-8 text-blue-600 dark:text-blue-400 transform group-hover:scale-110 transition-transform duration-300" />
            </div>
          </motion.div>

          <CardTitle className="text-2xl font-bold bg-gradient-to-br from-gray-900 to-gray-600 dark:from-white dark:to-gray-300 bg-clip-text text-transparent">
            {feature.title}
          </CardTitle>
        </CardHeader>

        <CardContent>
          <p className="text-gray-600 dark:text-gray-300 leading-relaxed group-hover:text-gray-900 dark:group-hover:text-white transition-colors duration-300">
            {feature.description}
          </p>

          <motion.div
            initial={{ opacity: 0, y: 10 }}
            whileHover={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.2 }}
            className="mt-6 flex items-center text-sm text-blue-600 dark:text-blue-400 font-medium"
          >
            Learn more
            <svg
              className="w-4 h-4 ml-1 transform group-hover:translate-x-1 transition-transform duration-300"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 5l7 7-7 7"
              />
            </svg>
          </motion.div>
        </CardContent>
      </Card>
    </motion.div>
  );
};

const FeaturesSection = () => {
  return (
    <motion.section
      className="py-24 px-4 sm:px-6 lg:px-8 relative overflow-hidden"
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.2 }}
    >
      {/* Background decorative elements */}
      <div className="absolute inset-0 bg-gradient-to-br from-blue-50/50 to-purple-50/50 dark:from-blue-950/30 dark:to-purple-950/30 -z-10" />
      <div className="absolute inset-0 bg-grid-black/[0.02] dark:bg-grid-white/[0.02] -z-10" />

      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-20"
        >
          <h2 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-gray-900 via-gray-700 to-gray-900 dark:from-white dark:via-gray-300 dark:to-white bg-clip-text text-transparent mb-6">
            Powerful Features
          </h2>
          <div className="mt-4 text-gray-600 dark:text-gray-300 max-w-2xl mx-auto text-lg">
            Experience the next generation of cloud code execution with our
            cutting-edge features
          </div>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 lg:gap-12">
          {features.map((feature, index) => (
            <FeatureCard key={index} feature={feature} index={index} />
          ))}
        </div>
      </div>
    </motion.section>
  );
};

export default FeaturesSection;
