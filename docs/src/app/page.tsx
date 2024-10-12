"use client";
import React, { useState, useEffect, useRef, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Search, Menu, X, ExternalLink } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Logo } from "@/components/Logo";
import { sections, Subheading, Section } from "@/constants/sections";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { ScrollArea } from "@/components/ui/scroll-area";
const Documentation: React.FC = () => {
  const [activeSection, setActiveSection] = useState<string>("introduction");
  const [activeSubheading, setActiveSubheading] = useState<string>("");
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [isMenuOpen, setIsMenuOpen] = useState<boolean>(false);
  const contentRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const hash = window.location.hash.replace("#", "");
    if (hash && sections.some((section) => section.id === hash)) {
      setActiveSection(hash);
    }
  }, []);

  useEffect(() => {
    const handleResize = () => {
      setIsMenuOpen(window.innerWidth >= 1024);
    };

    window.addEventListener("resize", handleResize);
    handleResize();

    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const handleScroll = useCallback(() => {
    if (contentRef.current) {
      const subheadings =
        contentRef.current.querySelectorAll<HTMLElement>("h2, h3, h4, h5, h6");
      for (let i = subheadings.length - 1; i >= 0; i--) {
        const subheading = subheadings[i];
        if (subheading.getBoundingClientRect().top <= 100) {
          setActiveSubheading(subheading.id);
          break;
        }
      }
    }
  }, []);

  useEffect(() => {
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [handleScroll]);

  const filteredSections = sections.filter((section) =>
    section.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const Sidebar: React.FC = () => (
    <motion.nav
      className="w-80 bg-white dark:bg-gray-900  overflow-y-auto fixed lg:sticky top-0 left-0 bottom-0 z-40 shadow-lg"
      initial={{ x: -300 }}
      animate={{ x: 0 }}
      transition={{ duration: 0.3, ease: "easeInOut" }}
    >
      <ScrollArea className="h-screen">
        <div className="p-6">
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center gap-3">
              <Logo />
              <h1 className="text-2xl font-bold text-gray-700">
                Runlite
              </h1>
            </div>
            <Button
              variant="ghost"
              size="icon"
              className="lg:hidden text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
              onClick={() => setIsMenuOpen(false)}
            >
              <X size={24} />
            </Button>
          </div>
          <div className="relative mb-8">
            <Search
              className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
              size={18}
            />
            <Input
              type="text"
              placeholder="Search documentation..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 bg-gray-100 dark:bg-gray-800 border-0 focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <Accordion type="single" collapsible className="w-full">
            {filteredSections.map((section) => (
              <AccordionItem value={section.id} key={section.id}>
                <AccordionTrigger className="hover:no-underline">
                  <div className="flex items-center">
                    <section.icon
                      className="mr-3 flex-shrink-0 text-blue-500"
                      size={18}
                    />
                    <span className="truncate flex-grow">{section.title}</span>
                  </div>
                </AccordionTrigger>
                <AccordionContent>
                  <div className="ml-6 space-y-1">
                    {section.subheadings?.map((subheading: Subheading) => (
                      <SubheadingItem
                        key={subheading.id}
                        subheading={subheading}
                      />
                    ))}
                  </div>
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>
      </ScrollArea>
    </motion.nav>
  );

  const SubheadingItem: React.FC<{ subheading: Subheading }> = ({
    subheading,
  }) => (
    <Button
      variant="ghost"
      className={`w-full justify-start py-1 px-3 text-sm text-left transition-all duration-200 ease-in-out ${
        activeSubheading === subheading.id
          ? "text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-900"
          : "text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-800"
      }`}
      onClick={() => {
        const element = document.getElementById(subheading.id);
        if (element) {
          element.scrollIntoView({ behavior: "smooth" });
        }
        setIsMenuOpen(false);
      }}
    >
      {subheading.title}
    </Button>
  );

  const TableOfContents: React.FC = () => (
    <div className="hidden xl:block w-64 p-6 sticky top-0 h-screen overflow-y-auto">
      <h3 className="text-lg font-semibold mb-4 text-gray-700 dark:text-gray-300">
        On this page
      </h3>
      <nav className="space-y-2">
        {sections
          .find((section) => section.id === activeSection)
          ?.subheadings?.map((subheading) => (
            <a
              key={subheading.id}
              href={`#${subheading.id}`}
              className={`block py-1 px-3 text-sm rounded transition-colors duration-200 ${
                activeSubheading === subheading.id
                  ? "bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300"
                  : "text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800"
              }`}
              onClick={(e) => {
                e.preventDefault();
                const element = document.getElementById(subheading.id);
                if (element) {
                  element.scrollIntoView({ behavior: "smooth" });
                }
              }}
            >
              {subheading.title}
            </a>
          ))}
      </nav>
    </div>
  );

  return (
    <div className="flex flex-col lg:flex-row min-h-screen bg-gray-50 dark:bg-gray-900">
      <Sidebar />
      <main className="flex-grow p-6 lg:p-12">
        <Button
          variant="outline"
          size="icon"
          className="lg:hidden fixed top-4 left-4 z-50 bg-white dark:bg-gray-800 shadow-md"
          onClick={() => setIsMenuOpen(!isMenuOpen)}
        >
          <Menu />
        </Button>
        <AnimatePresence mode="wait">
          <motion.div
            key={activeSection}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
            className="max-w-4xl mx-auto bg-white dark:bg-gray-800 rounded-lg shadow-lg p-8 lg:p-12"
            ref={contentRef}
          >
            {sections.map(
              (section) =>
                section.id === activeSection && (
                  <div key={section.id}>
                    <h2 className="text-3xl font-bold text-gray-800 dark:text-gray-100 mb-6 flex items-center">
                      <section.icon
                        className="mr-4 text-blue-600 dark:text-blue-400"
                        size={32}
                      />
                      {section.title}
                    </h2>
                    <div className="prose prose-lg dark:prose-invert max-w-none">
                      {section.content}
                    </div>
                    <div className="mt-12 pt-6 border-t border-gray-200 dark:border-gray-700">
                      <Button variant="outline" className="text-sm">
                        Edit this page on GitHub
                        <ExternalLink className="ml-2" size={14} />
                      </Button>
                    </div>
                  </div>
                )
            )}
          </motion.div>
        </AnimatePresence>
      </main>
      <TableOfContents />
    </div>
  );
};

export default Documentation;
