import React, { useState, useEffect } from "react";
import { motion, useScroll, useMotionValueEvent } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Menu, X } from "lucide-react";
import Link from "next/link";
import { Logo } from "@/components/logo";
import GitHubStarButton from "@/components/githubStar";

const menuItems = [
  { name: "Features", href: "#features" },
  { name: "Pricing", href: "#pricing" },
  { name: "Docs", href: "https://console.runlite.app/docs" },
  { name: "Playground", href: "https://console.runlite.app/playground" },
];

const NavbarItem = ({
  name,
  href,
  onClick,
}: {
  name: string;
  href: string;
  onClick: () => void;
}) => (
  <motion.li
    whileHover={{ scale: 1.05 }}
    whileTap={{ scale: 0.95 }}
    className="relative"
  >
    <Link href={href}>
      <p
        className="text-gray-600 hover:text-blue-600 transition-colors duration-200 py-2"
        onClick={onClick}
      >
        {name}
        <motion.span
          className="absolute bottom-0 left-0 w-full h-0.5 bg-blue-600"
          initial={{ scaleX: 0 }}
          whileHover={{ scaleX: 1 }}
          transition={{ duration: 0.2 }}
        />
      </p>
    </Link>
  </motion.li>
);

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [hidden, setHidden] = useState(false);
  const { scrollY } = useScroll();

  useMotionValueEvent(scrollY, "change", (latest) => {
    const previous = scrollY.getPrevious();
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
      className="fixed top-0 left-0 right-0 bg-transparent backdrop-blur-md z-50"
      initial={false}
      animate={hidden ? "hidden" : "visible"}
      transition={{ duration: 0.35, ease: "easeInOut" }}
      variants={{
        visible: { opacity: 1, y: 0 },
        hidden: { opacity: 0, y: "-100%" },
      }}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <motion.div
            className="flex items-center"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <Link href="/" className="flex items-center">
              <Logo />
              <h1 className="font-sans text-4xl font-bold bg-gradient-to-r from-gray-600 to-gray-700 text-transparent bg-clip-text p-2 transition-all duration-300 ease-in-out hover:from-blue-600 hover:to-blue-800">
                Run
                <span className="relative">
                  <span className="absolute top-1 left-0 text-sm text-blue-400 transform -rotate-12">
                    Lite
                  </span>
                </span>
              </h1>
            </Link>
          </motion.div>

          <div className="hidden md:block">
            <ul className="max-w-fit mx-auto border border-transparent dark:border-white/[0.2] rounded-full dark:bg-black bg-white px-5 py-1 flex  items-center justify-center space-x-4 shadow-[0px_2px_3px_-1px_rgba(0,0,0,0.1),0px_1px_0px_0px_rgba(25,28,33,0.02),0px_0px_0px_1px_rgba(25,28,33,0.08)] ">
              {menuItems.map((item) => (
                <NavbarItem key={item.name} {...item} onClick={closeMenu} />
              ))}
            </ul>
          </div>

          <div className="hidden md:flex items-center gap-3">
            <GitHubStarButton owner="ajaysehwal" repo="runlite" />
          </div>

          <div className="md:hidden">
            <Button
              variant="ghost"
              size="icon"
              onClick={toggleMenu}
              aria-label="Toggle menu"
            >
              {isOpen ? <X /> : <Menu />}
            </Button>
          </div>
        </div>
      </div>

      <motion.div
        className="md:hidden"
        initial="closed"
        animate={isOpen ? "open" : "closed"}
        variants={{
          open: { opacity: 1, height: "auto" },
          closed: { opacity: 0, height: 0 },
        }}
      >
        <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3 bg-white shadow-lg">
          {menuItems.map((item) => (
            <a
              key={item.name}
              href={item.href}
              className="text-gray-600 hover:text-blue-600 block px-3 py-2 rounded-md text-base font-medium"
              onClick={closeMenu}
            >
              {item.name}
            </a>
          ))}
        </div>
      </motion.div>
    </motion.nav>
  );
}
