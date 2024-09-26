import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Code, Server } from "lucide-react";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useEditor } from "@/hooks/useEditor";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "./ui/badge";
import { Result, Status } from "@/types";

const API_VERSIONS = ["v1", "v2"];

const LoadingAnimation: React.FC = () => (
  <div className="flex items-center justify-center space-x-2">
    {[0, 1, 2].map((index) => (
      <motion.div
        key={index}
        className="w-2 h-2 bg-blue-500 rounded-full"
        animate={{
          scale: [1, 1.5, 1],
          opacity: [0.7, 1, 0.7],
        }}
        transition={{
          duration: 1,
          repeat: Infinity,
          ease: "easeInOut",
          delay: index * 0.1,
        }}
      />
    ))}
  </div>
);

const ApiSettings: React.FC<{
  apiVersion: string;
  setApiVersion: (version: string) => void;
}> = ({ apiVersion, setApiVersion }) => (
  <motion.div
    className="w-full bg-gray-50 dark:bg-gray-800 p-3 shadow-sm"
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.5 }}
  >
    <h2 className="text-2xl font-bold mb-4 text-gray-900 dark:text-white">
      API Settings
    </h2>
    <div className="space-y-4">
      <div>
        <Label
          htmlFor="apiVersion"
          className="text-sm font-medium text-gray-700 dark:text-gray-300"
        >
          API Version
        </Label>
        <Select value={apiVersion} onValueChange={setApiVersion}>
          <SelectTrigger
            id="apiVersion"
            className="w-full bg-white dark:bg-gray-700 border-gray-300 dark:border-gray-600"
          >
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
      </div>
    </div>
  </motion.div>
);

const OutputTabs: React.FC<{ result: Result; isLoading: boolean }> = ({
  result,
  isLoading,
}) => {
  const [activeTab, setActiveTab] = useState("output");

  const getStatusColor = (status: Status) => {
    switch (status) {
      case Status.Accepted:
        return "bg-green-500";
      case Status.TimeLimitExceeded:
      case Status.MemoryLimitExceeded:
        return "bg-yellow-500";
      case Status.RuntimeError:
      case Status.InternalError:
        return "bg-red-500";
      default:
        return "bg-gray-500";
    }
  };

  return (
    <motion.div
      className="w-full bg-gray-50 dark:bg-gray-800 rounded-lg overflow-hidden"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.2 }}
    >
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <div className="bg-gray-50 dark:bg-gray-700 px-3 flex justify-between items-center">
          <TabsList className="bg-gray-200 dark:bg-gray-600">
            <TabsTrigger
              value="output"
              className="data-[state=active]:bg-white dark:data-[state=active]:bg-gray-800"
            >
              <Code className="w-4 h-4 mr-2" />
              Output
            </TabsTrigger>
            <TabsTrigger
              value="details"
              className="data-[state=active]:bg-white dark:data-[state=active]:bg-gray-800"
            >
              <Server className="w-4 h-4 mr-2" />
              Result format
            </TabsTrigger>
          </TabsList>
          <div className="flex items-center space-x-2">
            <AnimatePresence>
              {isLoading && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.8 }}
                  transition={{ duration: 0.3 }}
                >
                  <LoadingAnimation />
                </motion.div>
              )}
            </AnimatePresence>
            {!isLoading && (
              <Badge className={`capitalize ${getStatusColor(result.status)}`}>
                {result.status}
              </Badge>
            )}
            {isLoading && (
              <Badge className={`capitalize bg-gray-500`}>Running..</Badge>
            )}
          </div>
        </div>
        <div className="p-4">
          <TabsContent value="output" className="mt-0">
            <ScrollArea className="h-[350px] w-full rounded-md border border-gray-200 dark:border-gray-700">
              <pre
                className={`text-sm p-4 ${
                  result.stderr
                    ? "text-red-500"
                    : "text-gray-800 dark:text-gray-200"
                } whitespace-pre-wrap`}
              >
                <motion.code
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.5 }}
                >
                  {result.stdout || "No output available"}
                  {result.stderr}
                </motion.code>
              </pre>
            </ScrollArea>
          </TabsContent>
          <TabsContent value="details" className="mt-0">
            <ScrollArea className="h-[350px] w-full rounded-md border p-1 border-gray-200 dark:border-gray-700">
              <pre className="text-sm text-gray-800 dark:text-gray-200 whitespace-pre-wrap">
                <motion.code
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.5 }}
                >
                  {JSON.stringify(result, null, 2)}
                </motion.code>
              </pre>
            </ScrollArea>
          </TabsContent>
        </div>
      </Tabs>
    </motion.div>
  );
};

const Options: React.FC = () => {
  const { response, isLoading } = useEditor();
  const [apiVersion, setApiVersion] = useState<string>(API_VERSIONS[0]);

  return (
    <div>
      <ApiSettings apiVersion={apiVersion} setApiVersion={setApiVersion} />
      <OutputTabs result={response} isLoading={isLoading} />
    </div>
  );
};

export default Options;
