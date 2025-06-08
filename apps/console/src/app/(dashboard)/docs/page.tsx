"use client";
import React, { useState, useEffect } from "react";
import { Search, Menu, X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { sections } from "@/constants/docs";

const SIDEBAR_WIDTH = "280px";
const TOC_WIDTH = "240px";

const Documentation: React.FC = () => {
  const [activeSection, setActiveSection] = useState<string>(
    sections[0]?.id || ""
  );
  const [searchTerm, setSearchTerm] = useState("");
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [activeHeading, setActiveHeading] = useState("");
  const [isMounted, setIsMounted] = useState(false);
  const [windowWidth, setWindowWidth] = useState(1024);

  useEffect(() => {
    setIsMounted(true);
    setWindowWidth(window.innerWidth);
  }, []);

  useEffect(() => {
    if (!isMounted) return;

    const handleHashChange = () => {
      const hash = window.location.hash.slice(1);
      if (hash) {
        const validSection = sections.find((section) => section.id === hash);
        if (validSection) {
          setActiveSection(hash);
        } else {
          setActiveSection(sections[0]?.id || "");
          window.history.replaceState(null, "", `#${sections[0]?.id}`);
        }
      } else {
        setActiveSection(sections[0]?.id || "");
        window.history.replaceState(null, "", `#${sections[0]?.id}`);
      }
    };

    handleHashChange();
    window.addEventListener("hashchange", handleHashChange);
    return () => window.removeEventListener("hashchange", handleHashChange);
  }, [isMounted]);

  useEffect(() => {
    if (!isMounted) return;

    const handleResize = () => {
      const width = window.innerWidth;
      setWindowWidth(width);
      setIsMenuOpen(width >= 1024);
    };

    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, [isMounted]);

  useEffect(() => {
    if (!isMounted) return;

    const handleScroll = () => {
      const headings = document.querySelectorAll<HTMLElement>("h2[id], h3[id]");
      const scrollPosition = window.scrollY + 100;

      for (const heading of Array.from(headings)) {
        if (heading.offsetTop <= scrollPosition) {
          setActiveHeading(heading.id);
          const currentSection = window.location.hash.split("/")[0].slice(1);
          if (currentSection) {
            window.history.replaceState(
              null,
              "",
              `#${currentSection}/${heading.id}`
            );
          }
        }
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [isMounted]);

  const filteredSections = sections.filter((section) =>
    section.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleSectionChange = (sectionId: string) => {
    if (!isMounted) return;
    setActiveSection(sectionId);
    window.history.pushState(null, "", `#${sectionId}`);
    setIsMenuOpen(false);
  };

  const handleSubheadingClick = (sectionId: string, subheadingId: string) => {
    if (!isMounted) return;
    window.history.pushState(null, "", `#${sectionId}/${subheadingId}`);
    document
      .getElementById(subheadingId)
      ?.scrollIntoView({ behavior: "smooth" });
  };

  const SideNav: React.FC = () => (
    <motion.nav
      animate={{ x: 0 }}
      exit={{ x: -300 }}
      transition={{ type: "spring", stiffness: 300, damping: 30 }}
      className="fixed z-40 h-screen border-r border-gray-200 dark:border-gray-800"
      style={{ width: SIDEBAR_WIDTH }}
    >
      <ScrollArea className="h-full pb-8">
        <div className="space-y-5 p-6">
          <div className="flex items-center justify-between">
            <Button
              variant="ghost"
              size="icon"
              className="lg:hidden text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200"
              onClick={() => setIsMenuOpen(false)}
            >
              <X className="h-5 w-5" />
            </Button>
          </div>

          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 dark:text-gray-500 h-4 w-4" />
            <Input
              type="text"
              placeholder="Search documentation..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-9 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-gray-900 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-500 focus:ring-blue-500 dark:focus:ring-blue-400 focus:border-blue-500 dark:focus:border-blue-400"
            />
          </div>

          <div className="space-y-1">
            {filteredSections.map((section) => (
              <div key={section.id} className="space-y-1">
                <Button
                  variant="ghost"
                  className={`w-full justify-start text-left group transition-colors rounded-lg ${
                    activeSection === section.id
                      ? "bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400"
                      : "hover:bg-gray-50 dark:hover:bg-gray-800 text-gray-700 dark:text-gray-300"
                  }`}
                  onClick={() => handleSectionChange(section.id)}
                >
                  <section.icon
                    className={`mr-2 h-4 w-4 transition-colors ${
                      activeSection === section.id
                        ? "text-blue-600 dark:text-blue-400"
                        : "text-gray-400 dark:text-gray-500 group-hover:text-gray-700 dark:group-hover:text-gray-300"
                    }`}
                  />
                  <span className="truncate">{section.title}</span>
                </Button>
              </div>
            ))}
          </div>
        </div>
      </ScrollArea>
    </motion.nav>
  );

  const TableOfContents: React.FC = () => {
    const currentSection = sections.find((s) => s.id === activeSection);

    return (
      <div
        className="hidden xl:block fixed right-0 h-screen  border-l border-gray-200 dark:border-gray-800"
        style={{ width: TOC_WIDTH }}
      >
        <div className="p-6">
          <h3 className="font-medium mb-4 text-sm text-gray-500 dark:text-gray-400 uppercase tracking-wider">
            On this page
          </h3>
          <div className="space-y-1">
            {currentSection?.subheadings?.map((subheading) => (
              <Button
                key={subheading.id}
                variant="ghost"
                size="sm"
                className={`w-full justify-start text-left transition-colors rounded-lg ${
                  activeHeading === subheading.id
                    ? "text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-900/20"
                    : "text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-800"
                }`}
                onClick={() =>
                  handleSubheadingClick(currentSection.id, subheading.id)
                }
              >
                {subheading.title}
              </Button>
            ))}
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="flex min-h-screen">
      <Button
        variant="outline"
        size="icon"
        className="lg:hidden fixed top-4 left-4 z-50 border border-gray-200 dark:border-gray-700 shadow-sm hover:bg-gray-50 dark:hover:bg-gray-700"
        onClick={() => setIsMenuOpen(true)}
      >
        <Menu className="h-5 w-5 text-gray-700 dark:text-gray-300" />
      </Button>

      {isMenuOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-gray-900/20 dark:bg-gray-900/50 backdrop-blur-sm z-30 lg:hidden"
          onClick={() => setIsMenuOpen(false)}
        />
      )}

      <AnimatePresence mode="wait">
        {(isMenuOpen || windowWidth >= 1024) && <SideNav />}
      </AnimatePresence>

      <main
        className="flex-1 min-h-screen"
        style={{
          marginLeft: windowWidth >= 1024 ? SIDEBAR_WIDTH : "0",
          marginRight: windowWidth >= 1280 ? TOC_WIDTH : "0",
        }}
      >
        <div className="max-w-3xl mx-auto px-6 py-12">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeSection}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="prose prose-gray dark:prose-invert max-w-none prose-headings:scroll-mt-28 prose-headings:font-semibold prose-h1:text-3xl prose-h2:text-2xl prose-h3:text-xl prose-h4:text-lg prose-img:rounded-lg prose-img:shadow-md"
            >
              {sections.map(
                (section) =>
                  section.id === activeSection && (
                    <div key={section.id}>{section.content}</div>
                  )
              )}
            </motion.div>
          </AnimatePresence>
        </div>
      </main>

      <TableOfContents />
    </div>
  );
};

export default Documentation;
