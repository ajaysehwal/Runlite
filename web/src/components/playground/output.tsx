import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Code, Braces, Copy, Check } from "lucide-react";
import { Light as SyntaxHighlighter } from "react-syntax-highlighter";
import json from "react-syntax-highlighter/dist/esm/languages/hljs/json";
import { atomOneDark } from "react-syntax-highlighter/dist/esm/styles/hljs";
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

SyntaxHighlighter.registerLanguage("json", json);

interface StatusBadgeProps {
  status: Status;
}

interface OutputContentProps {
  content: string;
  language: string;
}

const StatusBadge: React.FC<StatusBadgeProps> = ({ status }) => {
  const { color, tooltip } = STATUS_CONFIG[status] || {
    color: "bg-gray-500",
    tooltip: "Unknown status",
  };

  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger>
          <Badge
            className={`capitalize ${color} transition-all duration-300 hover:opacity-80 text-xs`}
          >
            {status}
          </Badge>
        </TooltipTrigger>
        <TooltipContent side="bottom">{tooltip}</TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
};

const OutputContent: React.FC<OutputContentProps> = ({ content, language }) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(content);
    setCopied(true);
    setTimeout(() => setCopied(false), COPY_TIMEOUT);
  };

  return (
    <div className="relative">
      <ScrollArea className="h-[82vh] w-full bg-[rgb(40,44,52)]">
        <SyntaxHighlighter
          language={language}
          style={atomOneDark}
          customStyle={{
            backgroundColor: "transparent",
            fontSize: "0.875rem",
          }}
          wrapLines={true}
          lineProps={{
            style: { wordBreak: "break-all", whiteSpace: "pre-wrap" },
          }}
        >
          {content}
        </SyntaxHighlighter>
      </ScrollArea>

      <Button
        variant="ghost"
        size="icon"
        onClick={handleCopy}
        className="absolute top-0 right-0 text-gray-500 hover:bg-[rgb(40,44,52)] hover:text-gray-600 dark:text-gray-400 dark:hover:text-gray-200"
      >
        {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
      </Button>
    </div>
  );
};

const OutputSkeleton: React.FC = () => (
  <div className="space-y-2 p-4">
    {[...Array(5)].map((_, index) => (
      <Skeleton
        key={index}
        className={`h-4 w-${
          ["full", "3/4", "5/6", "2/3", "4/5"][index]
        } bg-gray-600`}
      />
    ))}
  </div>
);

const LoadingAnimation: React.FC = () => (
  <div className="flex items-center justify-center space-x-1">
    {[0, 1, 2].map((index) => (
      <motion.div
        key={index}
        className="w-1.5 h-1.5 bg-blue-500 rounded-full"
        animate={{
          scale: [1, 1.5, 1],
          opacity: [0.7, 1, 0.7],
        }}
        transition={{
          duration: 0.8,
          repeat: Infinity,
          ease: "easeInOut",
          delay: index * 0.1,
        }}
      />
    ))}
  </div>
);

const SkeletonHeader: React.FC = () => (
  <div className="flex justify-between items-center bg-gray-100 dark:bg-gray-800 px-4 py-2">
    <div className="flex gap-2">
      <Skeleton className="w-[74px] h-10 animate-pulse bg-gray-200" />
      <Skeleton className="w-[74px] h-10 animate-pulse bg-gray-200" />
    </div>
    <Skeleton className="w-12 h-6 animate-pulse bg-gray-200" />
  </div>
);

export const OutputBox: React.FC = () => {
  const { response, isLoading } = useEditor();
  const [initialLoad, setInitialLoad] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setInitialLoad(false), INITIAL_LOAD_DELAY);
    return () => clearTimeout(timer);
  }, []);

  const renderContent = (content: string, language: string) =>
    isLoading ? (
      <OutputSkeleton />
    ) : (
      <OutputContent content={content} language={language} />
    );

  return (
    <motion.div
      className="bg-[rgb(40,44,52)] dark:bg-gray-800"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <Tabs defaultValue="output" className="w-full">
        {initialLoad ? (
          <SkeletonHeader />
        ) : (
          <div className="flex justify-between items-center bg-gray-100 dark:bg-gray-800 px-4 py-2">
            <TabsList>
              <TabsTrigger
                value="output"
                className="flex items-center data-[state=active]:bg-white data-[state=active]:shadow-sm"
              >
                <Code className="w-4 h-4 mr-2" />
                Output
              </TabsTrigger>
              <TabsTrigger
                value="details"
                className="flex items-center data-[state=active]:bg-white data-[state=active]:shadow-sm"
              >
                <Braces className="w-4 h-4 mr-2" />
                JSON
              </TabsTrigger>
            </TabsList>

            {isLoading ? (
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.8 }}
                transition={{ duration: 0.2 }}
              >
                <LoadingAnimation />
              </motion.div>
            ) : (
              <StatusBadge status={response.status} />
            )}
          </div>
        )}

        <div className="bg-[rgb(40,44,52)] dark:bg-gray-900 h-[82vh]">
          <TabsContent value="output">
            {renderContent(
              response.stdout || response.stderr || "No output available",
              "plaintext"
            )}
          </TabsContent>
          <TabsContent value="details">
            {renderContent(JSON.stringify(response, null, 2), "json")}
          </TabsContent>
        </div>
      </Tabs>
    </motion.div>
  );
};
