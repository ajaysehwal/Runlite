import React, { useEffect, useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Code, Braces, Copy, Check, Loader2 } from "lucide-react";
import { Light as SyntaxHighlighter } from "react-syntax-highlighter";
import json from "react-syntax-highlighter/dist/esm/languages/hljs/json";
import { docco } from "react-syntax-highlighter/dist/esm/styles/hljs";
import { atomOneDark } from "react-syntax-highlighter/dist/esm/styles/hljs";
import { useTheme } from "next-themes";
import { useEditor } from "@/hooks/useEditor";
import { Status } from "@/types";
import { STATUS_CONFIG, COPY_TIMEOUT, INITIAL_LOAD_DELAY } from "@/constants";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";

SyntaxHighlighter.registerLanguage("json", json);

const customTheme = {
  light: {
    ...docco,
    hljs: {
      ...docco.hljs,
      background: "transparent",
      color: "#1e293b", // slate-800
    },
    "hljs-comment": { color: "#64748b" }, // slate-500
    "hljs-keyword": { color: "#2563eb" }, // blue-600
    "hljs-string": { color: "#16a34a" }, // green-600
    "hljs-number": { color: "#9333ea" }, // purple-600
    "hljs-function": { color: "#0891b2" }, // cyan-600
    "hljs-title": { color: "#0891b2" }, // cyan-600
    "hljs-params": { color: "#1e293b" }, // slate-800
    "hljs-built_in": { color: "#2563eb" }, // blue-600
  },
  dark: {
    ...atomOneDark,
    hljs: {
      ...atomOneDark.hljs,
      background: "transparent",
      color: "#e2e8f0", // slate-200
    },
    "hljs-comment": { color: "#64748b" }, // slate-500
    "hljs-keyword": { color: "#60a5fa" }, // blue-400
    "hljs-string": { color: "#4ade80" }, // green-400
    "hljs-number": { color: "#c084fc" }, // purple-400
    "hljs-function": { color: "#22d3ee" }, // cyan-400
    "hljs-title": { color: "#22d3ee" }, // cyan-400
    "hljs-params": { color: "#e2e8f0" }, // slate-200
    "hljs-built_in": { color: "#60a5fa" }, // blue-400
  },
};

const StatusBadge: React.FC<{ status: Status }> = ({ status }) => {
  const { color, tooltip } = STATUS_CONFIG[status] || {
    color: "bg-slate-200 dark:bg-slate-700",
    tooltip: "Unknown status",
  };

  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger>
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.2 }}
          >
            <Badge
              className={cn(
                "capitalize transition-all duration-200",
                "text-xs px-2.5 py-1 font-medium",
                color
              )}
            >
              {status}
            </Badge>
          </motion.div>
        </TooltipTrigger>
        <TooltipContent
          side="bottom"
          className={cn(
            "px-3 py-1.5",
            "text-slate-900 dark:text-slate-100",
            "border border-slate-200 dark:border-slate-800",
            "shadow-lg"
          )}
        >
          {tooltip}
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
};

const CopyButton: React.FC<{ content: string }> = ({ content }) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(content);
    setCopied(true);
    setTimeout(() => setCopied(false), COPY_TIMEOUT);
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ delay: 0.3 }}
      className="absolute top-2 right-2"
    >
      <Button
        variant="ghost"
        size="sm"
        onClick={handleCopy}
        className={cn(
          "h-8 px-2",
          "text-slate-500 dark:text-slate-400",
          "transition-colors duration-200"
        )}
      >
        {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
      </Button>
    </motion.div>
  );
};

const OutputContent: React.FC<{ content: string; language: string }> = ({
  content,
  language,
}) => {
  const { resolvedTheme } = useTheme();
  const theme = resolvedTheme === "dark" ? customTheme.dark : customTheme.light;

  return (
    <div className="relative h-full">
      <ScrollArea className="h-full">
        <div className={cn("min-h-full")}>
          <SyntaxHighlighter
            language={language}
            style={theme}
            customStyle={{
              fontSize: "0.875rem",
              padding: "1rem",
              height: "100%",
              lineHeight: "1.5",
            }}
            wrapLines={true}
            lineProps={{
              style: {
                wordBreak: "break-all",
                whiteSpace: "pre-wrap",
                padding: "1px 0",
              },
            }}
          >
            {content}
          </SyntaxHighlighter>
        </div>
      </ScrollArea>
      <CopyButton content={content} />
    </div>
  );
};

const LoadingAnimation: React.FC = () => (
  <div className="flex items-center gap-2">
    <Loader2 className="w-4 h-4 text-blue-500 dark:text-blue-400 animate-spin" />
    <span className="text-sm text-slate-600 dark:text-slate-400 font-medium">
      Processing...
    </span>
  </div>
);

const OutputSkeleton: React.FC = () => (
  <div className="space-y-3 p-4">
    {[...Array(5)].map((_, index) => (
      <Skeleton
        key={index}
        className={cn(
          "h-4",
          `w-${["full", "3/4", "5/6", "2/3", "4/5"][index]}`,
          "bg-slate-100 dark:bg-slate-800"
        )}
      />
    ))}
  </div>
);

export const OutputBox: React.FC = () => {
  const { response, isLoading } = useEditor();
  const [initialLoad, setInitialLoad] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setInitialLoad(false), INITIAL_LOAD_DELAY);
    return () => clearTimeout(timer);
  }, []);

  const tabContent = useMemo(
    () => ({
      output: `${response?.stdout} \n ${response?.stderr}`.includes("undefined")
        ? "No output available"
        : `${response?.stdout} \n ${response?.stderr}` ||
          response?.error ||
          "No output available",
      details: JSON.stringify(response, null, 2),
    }),
    [response]
  );

  const renderContent = (content: string, language: string) => (
    <AnimatePresence mode="wait">
      {isLoading ? (
        <motion.div
          key="loading"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="h-full"
        >
          <OutputSkeleton />
        </motion.div>
      ) : (
        <motion.div
          key="content"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          transition={{ duration: 0.2 }}
          className="h-full"
        >
          <OutputContent content={content} language={language} />
        </motion.div>
      )}
    </AnimatePresence>
  );

  return (
    <motion.div
      className={cn("h-[92vh] overflow-hidden", "shadow-sm")}
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <Tabs defaultValue="output" className="flex h-full flex-col">
        <div
          className={cn(
            "flex h-14 items-center justify-between px-4",
            "border-b border-slate-200 dark:border-slate-800",
            "backdrop-blur-sm"
          )}
        >
          <TabsList className={cn("h-9", "p-1 gap-1")}>
            <TabsTrigger
              value="output"
              className={cn(
                "flex items-center gap-2",
                "h-7 px-3",
                "data-[state=active]:bg-slate-100 dark:data-[state=active]:bg-slate-800",
                "data-[state=active]:text-slate-900 dark:data-[state=active]:text-slate-100",
                "transition-colors duration-200"
              )}
            >
              <Code className="w-4 h-4" />
              Output
            </TabsTrigger>
            <TabsTrigger
              value="details"
              className={cn(
                "flex items-center gap-2",
                "h-7 px-3",
                "data-[state=active]:bg-slate-100 dark:data-[state=active]:bg-slate-800",
                "data-[state=active]:text-slate-900 dark:data-[state=active]:text-slate-100",
                "transition-colors duration-200"
              )}
            >
              <Braces className="w-4 h-4" />
              JSON
            </TabsTrigger>
          </TabsList>

          <AnimatePresence>
            {!initialLoad && (
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.8 }}
                transition={{ duration: 0.2 }}
              >
                {isLoading ? (
                  <LoadingAnimation />
                ) : (
                  <StatusBadge status={response?.status as Status} />
                )}
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        <div className="flex-1 overflow-hidden">
          <TabsContent value="output" className="h-full mt-0 p-0">
            {renderContent(tabContent.output, "plaintext")}
          </TabsContent>
          <TabsContent value="details" className="h-full mt-0 p-0">
            {renderContent(tabContent.details, "json")}
          </TabsContent>
        </div>
      </Tabs>
    </motion.div>
  );
};
