import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Code, Braces, Settings, Copy, Check } from "lucide-react";
import { useEditor } from "@/hooks/useEditor";
import { Result, Status } from "@/types";
import { API_VERSIONS } from "@/constants";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Button } from "@/components/ui/button";

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

interface ApiSettingsProps {
  apiVersion: string;
  setApiVersion: (version: string) => void;
}

const ApiSettings: React.FC<ApiSettingsProps> = ({
  apiVersion,
  setApiVersion,
}) => (
  <motion.div
    className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-3"
    initial={{ opacity: 0, y: -10 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.3 }}
  >
    <div className="flex items-center mb-2">
      <Settings className="w-4 h-4 mr-2 text-gray-600 dark:text-gray-300" />
      <h2 className="text-sm font-semibold">API Settings</h2>
    </div>
    <Label htmlFor="apiVersion" className="text-xs mb-1 block">
      API Version
    </Label>
    <Select value={apiVersion} onValueChange={setApiVersion}>
      <SelectTrigger id="apiVersion" className="w-full text-xs">
        <SelectValue placeholder="Select API version" />
      </SelectTrigger>
      <SelectContent>
        {API_VERSIONS.map((version) => (
          <SelectItem key={version} value={version}>
            {version}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  </motion.div>
);

const statusConfig = {
  [Status.Idle]: {
    color: "bg-gray-400",
    tooltip: "Waiting to execute",
  },
  [Status.Accepted]: {
    color: "bg-green-500",
    tooltip: "Code executed successfully",
  },
  [Status.TimeLimitExceeded]: {
    color: "bg-yellow-500",
    tooltip: "Execution time exceeded the limit",
  },
  [Status.MemoryLimitExceeded]: {
    color: "bg-yellow-500",
    tooltip: "Memory usage exceeded the limit",
  },
  [Status.RuntimeError]: {
    color: "bg-red-500",
    tooltip: "An error occurred during execution",
  },
  [Status.InternalError]: {
    color: "bg-red-500",
    tooltip: "An internal server error occurred",
  },
};

interface StatusBadgeProps {
  status: Status;
}

const StatusBadge: React.FC<StatusBadgeProps> = ({ status }) => {
  const { color, tooltip } = statusConfig[status] || {
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
        <TooltipContent>{tooltip}</TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
};

interface OutputTabsProps {
  result: Result;
  isLoading: boolean;
}

const OutputTabs: React.FC<OutputTabsProps> = ({ result, isLoading }) => {
  const [activeTab, setActiveTab] = useState("output");
  const [copied, setCopied] = useState(false);

  const handleCopy = (content: string) => {
    navigator.clipboard.writeText(content);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const renderContent = (content: string) => (
    <ScrollArea className="h-[450px] w-full rounded-md relative">
      {isLoading ? (
        <div className="space-y-2 p-2">
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-3/4" />
          <Skeleton className="h-4 w-5/6" />
        </div>
      ) : (
        <>
          <motion.pre
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.3 }}
            className={`text-sm whitespace-pre-wrap p-2 ${
              result.stderr
                ? "text-red-500"
                : "text-gray-800 dark:text-gray-200"
            }`}
          >
            <code>{content}</code>
          </motion.pre>
          <motion.div
            className="absolute top-1 right-1"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
          >
            <Button
              variant="ghost"
              size="sm"
              onClick={() => handleCopy(content)}
              className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
            >
              {copied ? (
                <Check className="w-3 h-3" />
              ) : (
                <Copy className="w-3 h-3" />
              )}
            </Button>
          </motion.div>
        </>
      )}
    </ScrollArea>
  );

  return (
    <motion.div
      className="bg-white dark:bg-gray-800 rounded-lg shadow-sm overflow-hidden h-full"
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <div className="flex justify-between items-center bg-gray-50 dark:bg-gray-700 px-3 py-2">
        <div className="flex space-x-2">
          <Button
            variant={activeTab === "output" ? "secondary" : "ghost"}
            size="sm"
            onClick={() => setActiveTab("output")}
            className="text-xs flex items-center"
          >
            <Code className="w-3 h-3 mr-1" />
            Output
          </Button>
          <Button
            variant={activeTab === "details" ? "secondary" : "ghost"}
            size="sm"
            onClick={() => setActiveTab("details")}
            className="text-xs flex items-center"
          >
            <Braces className="w-3 h-3 mr-1" />
            JSON
          </Button>
        </div>
        <AnimatePresence>
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
            <StatusBadge status={result.status} />
          )}
        </AnimatePresence>
      </div>
      <div className="h-[calc(100%-36px)]">
        {activeTab === "output" &&
          renderContent(
            result.stdout || result.stderr || "No output available"
          )}
        {activeTab === "details" &&
          renderContent(JSON.stringify(result, null, 2))}
      </div>
    </motion.div>
  );
};

export const OutputBox: React.FC = () => {
  const { response, isLoading } = useEditor();
  const [apiVersion, setApiVersion] = useState<string>(API_VERSIONS[0]);
  const [isInitialLoading, setIsInitialLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setIsInitialLoading(false), 500);
    return () => clearTimeout(timer);
  }, []);

  if (isInitialLoading) {
    return (
      <div className="space-y-4 h-full">
        <Skeleton className="h-[60px] w-full" />
        <Skeleton className="h-[calc(100%-76px)] w-full" />
      </div>
    );
  }

  return (
    <motion.div
      className="space-y-2 h-full"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <ApiSettings apiVersion={apiVersion} setApiVersion={setApiVersion} />
      <div className="h-[calc(100%-76px)]">
        <OutputTabs result={response} isLoading={isLoading} />
      </div>
    </motion.div>
  );
};
