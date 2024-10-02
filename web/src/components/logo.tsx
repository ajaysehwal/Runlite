import React from "react";
import { motion } from "framer-motion";

const Logo = () => {
  const iconStyle = {
    width: "80px",
    height: "80px",
    margin: "20px",
  };

  const lightningVariants = {
    initial: { pathLength: 0, opacity: 0 },
    animate: {
      pathLength: 1,
      opacity: 1,
      transition: {
        pathLength: { duration: 0.5, ease: "easeInOut" },
        opacity: { duration: 0.2, ease: "easeIn" },
      },
    },
  };

  const circleVariants = {
    initial: { scale: 0.8, opacity: 0 },
    animate: {
      scale: 1,
      opacity: 1,
      transition: {
        duration: 0.3,
        ease: "easeOut",
        delay: 0.2,
      },
    },
  };

  return (
    <motion.svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 100 100"
      style={iconStyle}
      initial="initial"
      animate="animate"
    >
      <motion.circle
        cx="50"
        cy="50"
        r="45"
        fill="#f0f4f8"
        variants={circleVariants}
      />

      <motion.path
        d="M55 20 L30 50 L48 50 L45 80 L70 50 L52 50 Z"
        fill="none"
        stroke="#3498db"
        strokeWidth="4"
        strokeLinecap="round"
        strokeLinejoin="round"
        variants={lightningVariants}
      />
    </motion.svg>
  );
};

export default Logo;
