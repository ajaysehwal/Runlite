import React from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Github } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { cn } from "@/lib/utils";

const SignInButtons = () => {
  const buttonVariants = {
    initial: { opacity: 0, y: 10 },
    animate: { opacity: 1, y: 0 },
    hover: { scale: 1.02, transition: { duration: 0.2 } },
    tap: { scale: 0.98, transition: { duration: 0.1 } },
  };

  const { githubSignIn, googleSignin } = useAuth();

  return (
    <div className="flex items-center gap-3">
      <motion.div 
        className="flex items-center gap-2"
        initial="initial"
        animate="animate"
        variants={{
          initial: { opacity: 0 },
          animate: {
            opacity: 1,
            transition: {
              staggerChildren: 0.1
            }
          }
        }}
      >
        <motion.div variants={buttonVariants}>
          <Button
            onClick={() => googleSignin()}
            size="sm"
            className={cn(
              "h-9 px-4 font-medium",
              "bg-[#4285F4] hover:bg-[#4285F4]/90 text-white",
              "border border-[#4285F4]/20",
              "shadow-[0_1px_2px_rgba(0,0,0,0.05)]",
              "transition-all duration-200"
            )}
          >
            <svg
              className="h-4 w-4 mr-2"
              aria-hidden="true"
              focusable="false"
              data-prefix="fab"
              data-icon="google"
              role="img"
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 488 512"
            >
              <path
                fill="currentColor"
                d="M488 261.8C488 403.3 391.1 504 248 504 110.8 504 0 393.2 0 256S110.8 8 248 8c66.8 0 123 24.5 166.3 64.9l-67.5 64.9C258.5 52.6 94.3 116.6 94.3 256c0 86.5 69.1 156.6 153.7 156.6 98.2 0 135-70.4 140.8-106.9H248v-85.3h236.1c2.3 12.7 3.9 24.9 3.9 41.4z"
              ></path>
            </svg>
            Sign in with Google
          </Button>
        </motion.div>
        <motion.div variants={buttonVariants}>
          <Button
            onClick={() => githubSignIn()}
            size="sm"
            className={cn(
              "h-9 px-4 font-medium",
              "bg-[#24292F] hover:bg-[#24292F]/90 text-white",
              "border border-[#24292F]/20",
              "shadow-[0_1px_2px_rgba(0,0,0,0.05)]",
              "transition-all duration-200"
            )}
          >
            <Github className="h-4 w-4 mr-2" />
            Sign in with GitHub
          </Button>
        </motion.div>
      </motion.div>
    </div>
  );
};

export default SignInButtons;
