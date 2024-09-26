"use client";

import React, { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Trash2,
  CheckCircle,
  XCircle,
  Loader,
  Plus,
  Copy,
  AlertTriangle,
} from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "@/store";
import { getKeys, deleteKey, generateKey } from "@/store/thunks/keys";
import { ApiKey, Status, Version } from "@prisma/client";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/hooks/useAuth";

import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription } from "@/components/ui/alert";
import {
  Select,
  SelectTrigger,
  SelectContent,
  SelectValue,
  SelectItem,
} from "@/components/ui/select";

const fadeInUp = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -20 },
};
const apiVersions = [
  {
    value: Version.v1,
    label: "Version 1",
    description: "Stable release with basic features",
  },
  // {
  //   value: "v2",
  //   label: "Version 2",
  //   description: "Enhanced performance and additional endpoints",
  // },
  // {
  //   value: "v3",
  //   label: "Version 3 (Beta)",
  //   description: "Latest features, may have breaking changes",
  // },
];

const SkeletonRow: React.FC = () => (
  <TableRow>
    <TableCell>
      <Skeleton className="h-4 w-[200px]" />
    </TableCell>
    <TableCell>
      <Skeleton className="h-4 w-[300px]" />
    </TableCell>
    <TableCell>
      <Skeleton className="h-4 w-[150px]" />
    </TableCell>
    <TableCell>
      <Skeleton className="h-4 w-[50px]" />
    </TableCell>
    <TableCell>
      <Skeleton className="h-8 w-[100px]" />
    </TableCell>
    <TableCell>
      <Skeleton className="h-4 w-[50px]" />
    </TableCell>
  </TableRow>
);

interface ApiDialogProps {
  open: boolean;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
  apiKey: string;
}

const ApiDialog: React.FC<ApiDialogProps> = ({ open, setOpen, apiKey }) => {
  const [copiedKey, setCopiedKey] = useState(false);
  const { toast } = useToast();

  const handleCopyKey = useCallback(() => {
    navigator.clipboard
      .writeText(apiKey)
      .then(() => {
        setCopiedKey(true);
        setTimeout(() => setCopiedKey(false), 2000);
      })
      .catch((err) => {
        console.error("Failed to copy API key:", err);
        toast({
          title: "Copy Failed",
          description: "Failed to copy the API key. Please try again.",
          variant: "destructive",
        });
      });
  }, [apiKey, toast]);

  return (
    <AnimatePresence>
      {open && (
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogContent className="sm:max-w-[425px] bg-white rounded-lg shadow-lg">
            <DialogHeader>
              <DialogTitle className="text-2xl font-bold text-gray-800">
                New API Key Created
              </DialogTitle>
              <DialogDescription className="text-gray-600">
                Please copy your new API key. It will only be shown once.
              </DialogDescription>
            </DialogHeader>
            <motion.div
              className="py-6"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
            >
              <div className="relative">
                <code className="bg-gray-100 p-4 rounded-lg block mb-4 text-sm font-mono break-all">
                  {apiKey}
                </code>
                <motion.div
                  className="absolute inset-0 bg-green-500 bg-opacity-20 flex items-center justify-center rounded-lg"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: copiedKey ? 1 : 0 }}
                  transition={{ duration: 0.3 }}
                >
                  <CheckCircle className="text-green-500 h-8 w-8" />
                </motion.div>
              </div>
              <Button
                onClick={handleCopyKey}
                className="w-full bg-blue-600 hover:bg-blue-700 text-white transition-colors duration-300"
              >
                <Copy className="mr-2 h-4 w-4" />
                {copiedKey ? "Copied!" : "Copy API Key"}
              </Button>
            </motion.div>
            <DialogFooter>
              <Button
                onClick={() => setOpen(false)}
                className="bg-gray-200 hover:bg-gray-300 text-gray-800 transition-colors duration-300"
              >
                Close
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}
    </AnimatePresence>
  );
};

const APIManagement: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { keys, isLoading, error, generateLoad } = useSelector(
    (state: RootState) => state.keys
  );
  const { toast } = useToast();
  const { AuthLoad, user } = useAuth();
  const [newApiKey, setNewApiKey] = useState("");
  const [deletingKeys, setDeletingKeys] = useState<Record<string, boolean>>({});
  const [isNewKeyDialogOpen, setIsNewKeyDialogOpen] = useState(false);
  const [apiForm, setApiForm] = useState({
    name: "",
    desc: "",
    version: Version.v1,
  });
  const [createDialogOpen, setCreateDialogOpen] = useState(false);

  useEffect(() => {
    if (user && !AuthLoad) {
      dispatch(getKeys());
    }
  }, [dispatch, AuthLoad, user]);

  const handleDeleteKey = useCallback(
    async (keyId: string) => {
      setDeletingKeys((prev) => ({ ...prev, [keyId]: true }));
      try {
        await dispatch(deleteKey(keyId));
        toast({
          title: "API Key Deleted",
          description: "The API key has been successfully deleted.",
        });
      } catch (error) {
        toast({
          title: `${(error as Error).message}`,
          description: "Failed to delete the API key. Please try again.",
          variant: "destructive",
        });
      } finally {
        setDeletingKeys((prev) => ({ ...prev, [keyId]: false }));
      }
    },
    [dispatch, toast]
  );

  const handleGenerateKey = useCallback(async () => {
    try {
      const result = await dispatch(generateKey(apiForm));
      if (generateKey.fulfilled.match(result)) {
        setCreateDialogOpen(false);
        setNewApiKey(result.payload.key);
        setIsNewKeyDialogOpen(true);
        setApiForm({ name: "", desc: "", version: Version.v1 });
      }
    } catch (error) {
      toast({
        title: `${(error as Error).message}`,
        description: "Failed to create a new API key. Please try again.",
        variant: "destructive",
      });
    }
  }, [dispatch, apiForm, toast]);

  const renderTableContent = () => {
    if (isLoading) {
      return Array(3)
        .fill(null)
        .map((_, index) => <SkeletonRow key={index} />);
    }

    if (error) {
      return (
        <TableRow>
          <TableCell colSpan={6} className="text-center text-red-500">
            Error loading API keys. Please try again later.
          </TableCell>
        </TableRow>
      );
    }

    if (keys.length === 0) {
      return (
        <TableRow>
          <TableCell colSpan={6} className="text-center">
            No API keys found. Create one to get started.
          </TableCell>
        </TableRow>
      );
    }

    return keys.map((key: ApiKey) => (
      <motion.tr key={key.id} {...fadeInUp} transition={{ duration: 0.2 }}>
        <TableCell className="font-medium">{key.name}</TableCell>
        <TableCell>{key.desc}</TableCell>
        <TableCell>
          <code className="bg-gray-100 px-2 py-1 rounded">
            {key.key.slice(0, 10)}...
          </code>
        </TableCell>
        <TableCell>{key.version}</TableCell>
        <TableCell className="flex gap-1 items-center">
          {key.status === Status.ACTIVE ? (
            <>
              Active
              <CheckCircle className="h-5 w-5 text-green-500" />
            </>
          ) : (
            <>
              Deactive <XCircle className="h-5 w-5 text-red-500" />
            </>
          )}
        </TableCell>
        <TableCell>
          <Button
            variant="destructive"
            size="sm"
            onClick={() => handleDeleteKey(key.id)}
            className="bg-white text-red-500 hover:bg-white hover:border-red-400 border"
            disabled={deletingKeys[key.id]}
          >
            {deletingKeys[key.id] ? (
              <>
                <Loader className="h-4 w-4 animate-spin" />
              </>
            ) : (
              <>
                <Trash2 className="h-4 w-4" />
              </>
            )}
          </Button>
        </TableCell>
      </motion.tr>
    ));
  };

  return (
    <Card className="mx-auto max-w-7xl border-none shadow-none">
      <CardHeader>
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <Alert variant="default" className="mb-4">
            <AlertTriangle className="h-4 w-4" />
            <AlertDescription>
              As an owner of this project, you can view and manage all API keys
              in this project.
            </AlertDescription>
          </Alert>
          <Alert variant="destructive">
            <AlertTriangle className="h-4 w-4" />
            <AlertDescription>
              Do not share your API key with others, or expose it in the browser
              or other client-side code. In order to protect the security of
              your account, Compyl may also automatically disable any API key
              that has leaked publicly.
            </AlertDescription>
          </Alert>
          <p className="mt-4 text-sm text-gray-600">
            View usage per API key on the{" "}
            <a href="/usage" className="text-blue-600 hover:underline">
              Usage page
            </a>
            .
          </p>
        </motion.div>
        <motion.div className="ml-auto" {...fadeInUp}>
          <Dialog open={createDialogOpen} onOpenChange={setCreateDialogOpen}>
            <DialogTrigger asChild>
              <Button className="bg-green-600 hover:bg-green-700 text-white">
                <Plus className="mr-2 h-4 w-4" /> Create New API
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px] bg-white">
              <DialogHeader>
                <DialogTitle>Create New API</DialogTitle>
                <DialogDescription>
                  Fill in the details for your new API.
                </DialogDescription>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="name" className="text-right">
                    Name
                  </Label>
                  <Input
                    id="name"
                    value={apiForm.name}
                    onChange={(e) =>
                      setApiForm({ ...apiForm, name: e.target.value })
                    }
                    className="col-span-3"
                  />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="description" className="text-right">
                    Description{" "}
                    <span className="text-[10px] text-gray-400">
                      (optional)
                    </span>
                  </Label>
                  <Input
                    id="description"
                    value={apiForm.desc}
                    onChange={(e) =>
                      setApiForm({ ...apiForm, desc: e.target.value })
                    }
                    className="col-span-3"
                  />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="version" className="text-right">
                    Version
                  </Label>
                  <Select
                    value={apiForm.version}
                    onValueChange={(value: string) =>
                      setApiForm({ ...apiForm, version: value as Version })
                    }
                  >
                    <SelectTrigger className="col-span-3">
                      <SelectValue placeholder="Select API version" />
                    </SelectTrigger>
                    <SelectContent>
                      {apiVersions.map((version) => (
                        <SelectItem key={version.value} value={version.value}>
                          <span className="font-medium">{version.label}</span>
                          <span className="text-sm text-gray-500 block">
                            {version.description}
                          </span>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <DialogFooter>
                <Button
                  onClick={handleGenerateKey}
                  className="bg-green-600 hover:bg-green-700 text-white"
                  disabled={generateLoad}
                >
                  {generateLoad ? (
                    <>
                      <Loader className="h-4 w-4 mr-1 animate-spin" />{" "}
                      Creating...
                    </>
                  ) : (
                    "Create API"
                  )}
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </motion.div>
      </CardHeader>
      <CardContent>
        <motion.div
          initial="initial"
          animate="animate"
          exit="exit"
          variants={fadeInUp}
        >
          <ScrollArea className="h-[250px] rounded-md w-full">
            <Table className="w-full">
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Description</TableHead>
                  <TableHead>Key</TableHead>
                  <TableHead>Version</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                <AnimatePresence>{renderTableContent()}</AnimatePresence>
              </TableBody>
            </Table>
          </ScrollArea>
        </motion.div>
      </CardContent>
      <ApiDialog
        open={isNewKeyDialogOpen}
        setOpen={setIsNewKeyDialogOpen}
        apiKey={newApiKey}
      />
    </Card>
  );
};

export default APIManagement;
