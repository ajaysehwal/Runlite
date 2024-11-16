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
      description: "Execute code in 40+ programming languages",
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
      title: "RESTful API",
      description: "Easy integration with your existing workflow",
    },
  ];
const FeatureCard = ({ feature, index }:{feature:Feature,index:number}) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
    >
      <Card className="group relative overflow-hidden border-none bg-gradient-to-br from-white/90 to-white/50 backdrop-blur-md hover:shadow-2xl transition-all duration-500 h-full">
        {/* Decorative background elements */}
        <div className="absolute inset-0 bg-grid-black/5 -z-10" />
        <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 to-purple-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
        
        <CardHeader className="relative">
          <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-br from-blue-500/10 to-purple-500/10 rounded-full blur-2xl transform -translate-y-1/2 translate-x-1/2" />
          
          <motion.div
            whileHover={{ scale: 1.05 }}
            transition={{ type: "spring", stiffness: 300 }}
            className="relative mb-4 inline-block"
          >
            <div className="absolute inset-0 bg-blue-500/20 blur-xl rounded-full" />
            <feature.icon className="w-12 h-12 relative text-blue-600 transform group-hover:scale-110 group-hover:rotate-3 transition-transform duration-300" />
          </motion.div>
          
          <CardTitle className="text-2xl font-bold bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent">
            {feature.title}
          </CardTitle>
        </CardHeader>
        
        <CardContent>
          <p className="text-gray-600 leading-relaxed group-hover:text-gray-700 transition-colors duration-300">
            {feature.description}
          </p>
          
          {/* Subtle interaction indicator */}
          <div className="mt-6 flex items-center text-sm text-blue-600 font-medium opacity-0 group-hover:opacity-100 transform translate-y-2 group-hover:translate-y-0 transition-all duration-300">
            Learn more
            <svg
              className="w-4 h-4 ml-1 transform group-hover:translate-x-1 transition-transform duration-300"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
};

const FeaturesSection = () => {
  return (
    <motion.section
      className="py-24 px-4 sm:px-6 lg:px-8"
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.2 }}
    >
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-20"
        >
          <h2 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-gray-900 via-gray-800 to-gray-900 bg-clip-text text-transparent">
            Key Features
          </h2>
          <div className="mt-4 text-gray-600 max-w-2xl mx-auto">
            Discover the powerful features that make our platform stand out
          </div>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 md:gap-10">
          {features.map((feature, index) => (
            <FeatureCard key={index} feature={feature} index={index} />
          ))}
        </div>
      </div>
    </motion.section>
  );
};

export default FeaturesSection;