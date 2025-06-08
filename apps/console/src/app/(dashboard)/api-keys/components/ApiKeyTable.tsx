import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Skeleton } from "@/components/ui/skeleton";
import { CheckCircle, XCircle, Trash2, Loader } from "lucide-react";
import { ApiKey, Status, Version } from "@/types/schema";

interface ApiKeyTableProps {
  keys: ApiKey[];
  isLoading: boolean;
  error: string | null;
  deletingKeys: Record<string, boolean>;
  onDeleteKey: (keyId: string) => void;
}

const fadeInUp = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -20 },
};

export const ApiKeyTable: React.FC<ApiKeyTableProps> = ({
  keys,
  isLoading,
  error,
  deletingKeys,
  onDeleteKey,
}) => {
  const renderTableContent = () => {
    if (isLoading) {
      return Array(3)
        .fill(null)
        .map((_, index) => <SkeletonRow key={index} />);
    }
    const makeDateReadable = (timestamp: Date) => {
      const options: Intl.DateTimeFormatOptions = {
        year: "numeric",
        month: "short",
        day: "numeric",
      };
      return timestamp.toLocaleString("en-US", options);
    };
    if (error) {
      return (
        <TableRow>
          <TableCell colSpan={6} className="text-center text-red-500 dark:text-red-400">
            Error loading API keys. Please try again later.
          </TableCell>
        </TableRow>
      );
    }

    if (keys.length === 0) {
      return (
        <TableRow>
          <TableCell colSpan={6} className="text-center text-gray-500 dark:text-gray-400">
            No API keys found. Create one to get started.
          </TableCell>
        </TableRow>
      );
    }

    return keys.map((key: ApiKey) => (
      <motion.tr 
        key={key.id} 
        {...fadeInUp} 
        transition={{ duration: 0.2 }}
        className="border-b border-gray-100 dark:border-gray-700"
      >
        <TableCell className="font-medium text-gray-900 dark:text-gray-100">{key.name}</TableCell>
        <TableCell className="text-gray-600 dark:text-gray-300">{key.description}</TableCell>
        <TableCell className="text-gray-600 dark:text-gray-300">{key.version==Version.V1?"v1.0.0":""}</TableCell>
        <TableCell>
          <div className="flex items-center gap-1">
            {key.status === Status.ACTIVE ? (
              <div className="flex items-center gap-1 text-green-600 dark:text-green-400">
                <span>Active</span>
                <CheckCircle className="h-4 w-4" />
              </div>
            ) : (
              <div className="flex items-center gap-1 text-red-600 dark:text-red-400">
                <span>Inactive</span>
                <XCircle className="h-4 w-4" />
              </div>
            )}
          </div>
        </TableCell>
        <TableCell className="text-gray-600 dark:text-gray-300">{makeDateReadable(key.createdAt)}</TableCell>
        <TableCell>
          <Button
            variant="destructive"
            size="sm"
            onClick={() => onDeleteKey(key.id)}
            className="bg-white dark:bg-gray-800 text-red-500 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 border border-red-200 dark:border-red-800 hover:border-red-300 dark:hover:border-red-700 transition-colors"
            disabled={deletingKeys[key.id]}
          >
            {deletingKeys[key.id] ? (
              <Loader className="h-4 w-4 animate-spin" />
            ) : (
              <Trash2 className="h-4 w-4" />
            )}
          </Button>
        </TableCell>
      </motion.tr>
    ));
  };

  return (
    <motion.div
      initial="initial"
      animate="animate"
      exit="exit"
      variants={fadeInUp}
      className="w-full"
    >
      <ScrollArea className="h-[250px] rounded-md w-full">
        <Table>
          <TableHeader>
            <TableRow className="border-b border-gray-200 dark:border-gray-700">
              <TableHead className="text-gray-700 dark:text-gray-300">Name</TableHead>
              <TableHead className="text-gray-700 dark:text-gray-300">Description</TableHead>
              <TableHead className="text-gray-700 dark:text-gray-300">Version</TableHead>
              <TableHead className="text-gray-700 dark:text-gray-300">Status</TableHead>
              <TableHead className="text-gray-700 dark:text-gray-300">Created At</TableHead>
              <TableHead className="text-gray-700 dark:text-gray-300">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            <AnimatePresence>{renderTableContent()}</AnimatePresence>
          </TableBody>
        </Table>
      </ScrollArea>
    </motion.div>
  );
};

const SkeletonRow: React.FC = () => (
  <TableRow>
    <TableCell>
      <Skeleton className="h-4 w-[200px] bg-gray-200 dark:bg-gray-700" />
    </TableCell>
    <TableCell>
      <Skeleton className="h-4 w-[300px] bg-gray-200 dark:bg-gray-700" />
    </TableCell>
    <TableCell>
      <Skeleton className="h-4 w-[150px] bg-gray-200 dark:bg-gray-700" />
    </TableCell>
    <TableCell>
      <Skeleton className="h-4 w-[50px] bg-gray-200 dark:bg-gray-700" />
    </TableCell>
    <TableCell>
      <Skeleton className="h-8 w-[100px] bg-gray-200 dark:bg-gray-700" />
    </TableCell>
    <TableCell>
      <Skeleton className="h-4 w-[50px] bg-gray-200 dark:bg-gray-700" />
    </TableCell>
  </TableRow>
);
