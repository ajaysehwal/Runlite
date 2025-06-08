import React, { useState, useEffect } from "react";
import { motion, useScroll, useMotionValueEvent } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Menu, X, ExternalLink } from "lucide-react";
import Link from "next/link";
import { Logo } from "@/components/logo";
import GitHubStarButton from "@/components/githubStar";

const menuItems = [
  { name: "Features", href: "#features" },
  { name: "Pricing", href: "#pricing" },
  { name: "Docs", href: "https://console.runlite.app/docs", isExternal: true },
  {
    name: "Playground",
    href: "https://console.runlite.app/playground",
    isExternal: true,
  },
];

const NavbarItem = ({
  name,
  href,
  isExternal,
  onClick,
}: {
  name: string;
  href: string;
  isExternal?: boolean;
  onClick: () => void;
}) => (
  <motion.li
    whileHover={{ scale: 1.02 }}
    whileTap={{ scale: 0.98 }}
    className="relative"
  >
    <Link href={href} target={isExternal ? "_blank" : undefined}>
      <motion.div
        className="relative px-3 py-2 rounded-lg text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-all duration-300"
        onClick={onClick}
      >
        <span className="flex items-center gap-1.5 relative z-10">
          {name}
          {isExternal && (
            <ExternalLink className="w-3 h-3 opacity-50 group-hover:opacity-100 transition-opacity" />
          )}
        </span>
        <motion.div
          className="absolute inset-0 rounded-lg bg-white/0 dark:bg-white/0 transition-colors duration-300"
          whileHover={{
            backgroundColor: "rgba(255, 255, 255, 0.1)",
            backdropFilter: "blur(8px)",
          }}
        />
      </motion.div>
    </Link>
  </motion.li>
);

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [hidden, setHidden] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const { scrollY } = useScroll();

  useMotionValueEvent(scrollY, "change", (latest) => {
    const previous = scrollY.getPrevious();
    if (latest > 50) {
      setIsScrolled(true);
    } else {
      setIsScrolled(false);
    }
    if (!previous) return;
    if (latest > previous && latest > 150) {
      setHidden(true);
    } else {
      setHidden(false);
    }
  });

  const toggleMenu = () => setIsOpen(!isOpen);
  const closeMenu = () => setIsOpen(false);

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 768) {
        setIsOpen(false);
      }
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return (
    <motion.nav
      className="fixed top-0 left-0 right-0 z-50"
      initial={false}
      animate={hidden ? "hidden" : "visible"}
      variants={{
        visible: {
          opacity: 1,
          y: 0,
          backgroundColor: isScrolled
            ? "rgba(255, 255, 255, 0.5)"
            : "transparent",
          backdropFilter: isScrolled ? "blur(16px)" : "none",
        },
        hidden: {
          opacity: 0,
          y: "-100%",
          backgroundColor: "rgba(255, 255, 255, 0.5)",
          backdropFilter: "blur(16px)",
        },
      }}
      transition={{ duration: 0.3, ease: "easeInOut" }}
    >
      {/* Gradient Border - Only visible when scrolled */}
      <motion.div
        className="absolute bottom-0 left-0 right-0 h-[1px]"
        initial={{ opacity: 0 }}
        animate={{ opacity: isScrolled ? 1 : 0 }}
        transition={{ duration: 0.3 }}
      >
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-gray-200/20 dark:via-gray-700/20 to-transparent" />
      </motion.div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-20">
          <motion.div
            className="flex items-center"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <Link href="/" className="flex items-center group">
              <div className="relative">
                <div className="absolute inset-0 bg-gradient-to-r from-blue-500/20 via-purple-500/20 to-blue-500/20 blur-xl rounded-full opacity-0 group-hover:opacity-100 transition-all duration-500" />
                <Logo />
              </div>
              <h1 className="font-sans text-4xl font-bold bg-gradient-to-r from-gray-800 to-gray-600 dark:from-white dark:to-gray-200 text-transparent bg-clip-text p-2 transition-all duration-300 ease-in-out group-hover:from-blue-600 group-hover:to-purple-600">
                Run
                <span className="text-base bg-gradient-to-r from-blue-500 to-purple-500 bg-clip-text">
                  Lite
                </span>
              </h1>
            </Link>
          </motion.div>

          <div className="hidden md:block">
            <motion.ul
              className="flex items-center space-x-2"
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
            >
              {menuItems.map((item) => (
                <NavbarItem key={item.name} {...item} onClick={closeMenu} />
              ))}
            </motion.ul>
          </div>

          <div className="hidden md:flex items-center gap-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.3, delay: 0.1 }}
              className="relative group"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-blue-500/20 via-purple-500/20 to-blue-500/20 blur-xl rounded-full opacity-0 group-hover:opacity-100 transition-all duration-500" />
              <GitHubStarButton owner="ajaysehwal" repo="runlite" />
            </motion.div>
          </div>

          <motion.div
            className="md:hidden"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.3 }}
          >
            <Button
              variant="ghost"
              size="icon"
              onClick={toggleMenu}
              className="relative group"
              aria-label="Toggle menu"
            >
              <motion.div
                className="absolute inset-0 bg-gradient-to-r from-blue-500/10 via-purple-500/10 to-blue-500/10 rounded-full opacity-0 group-hover:opacity-100 transition-all duration-300"
                animate={{ scale: isOpen ? 1.1 : 1 }}
              />
              <motion.div
                animate={isOpen ? "open" : "closed"}
                variants={{
                  open: { rotate: 180, scale: 1 },
                  closed: { rotate: 0, scale: 1 },
                }}
                transition={{ duration: 0.3 }}
                className="relative"
              >
                {isOpen ? (
                  <X className="w-5 h-5" />
                ) : (
                  <Menu className="w-5 h-5" />
                )}
              </motion.div>
            </Button>
          </motion.div>
        </div>
      </div>

      <motion.div
        className="md:hidden overflow-hidden"
        initial="closed"
        animate={isOpen ? "open" : "closed"}
        variants={{
          open: {
            height: "auto",
            opacity: 1,
            backgroundColor: "rgba(255, 255, 255, 0.7)",
            backdropFilter: "blur(16px)",
          },
          closed: {
            height: 0,
            opacity: 0,
            backgroundColor: "rgba(255, 255, 255, 0.7)",
            backdropFilter: "blur(16px)",
          },
        }}
        transition={{ duration: 0.3, ease: "easeInOut" }}
      >
        <div className="px-4 py-3 space-y-1">
          {menuItems.map((item, index) => (
            <motion.div
              key={item.name}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1 }}
              className="block"
            >
              <Link
                href={item.href}
                target={item.isExternal ? "_blank" : undefined}
                className="flex items-center gap-2 px-3 py-2 rounded-lg text-gray-500 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white hover:bg-white/10 transition-all duration-300"
                onClick={closeMenu}
              >
                {item.name}
                {item.isExternal && (
                  <ExternalLink className="w-4 h-4 opacity-50" />
                )}
              </Link>
            </motion.div>
          ))}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: menuItems.length * 0.1 }}
            className="pt-2"
          >
            <GitHubStarButton owner="ajaysehwal" repo="runlite" />
          </motion.div>
        </div>
      </motion.div>
    </motion.nav>
  );
}
