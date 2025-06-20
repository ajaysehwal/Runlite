import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Loader2 } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectTrigger,
  SelectContent,
  SelectValue,
  SelectItem,
} from "@/components/ui/select";
import { apiVersions } from "@/constants";
import { Version } from "@/types/schema";

interface CreateApiKeyDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (apiForm: { name: string; desc: string; version: Version }) => void;
  isLoading: boolean;
}

export const CreateApiKeyDialog: React.FC<CreateApiKeyDialogProps> = ({
  open,
  onOpenChange,
  onSubmit,
  isLoading,
}) => {
  const [apiForm, setApiForm] = useState<{
    name: string;
    desc: string;
    version: Version;
  }>({
    name: "",
    desc: "",
    version: Version.V1,
  });

  const handleSubmit = () => {
    onSubmit(apiForm);
    setApiForm({ name: "", desc: "", version: Version.V1 });
  };

  return (
    <AnimatePresence>
      {open && (
        <Dialog open={open} onOpenChange={onOpenChange}>
          <DialogContent className="sm:max-w-[425px] bg-white dark:bg-gray-800 rounded-lg shadow-xl border-none">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 20 }}
              transition={{ duration: 0.3 }}
            >
              <DialogHeader>
                <DialogTitle className="text-2xl font-bold text-gray-900 dark:text-gray-100">
                  Create New API
                </DialogTitle>
                <DialogDescription className="text-gray-500 dark:text-gray-400">
                  Fill in the details for your new API.
                </DialogDescription>
              </DialogHeader>
              <div className="grid gap-6 py-4">
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label
                    htmlFor="name"
                    className="text-right text-sm font-medium text-gray-700 dark:text-gray-300"
                  >
                    Name
                  </Label>
                  <Input
                    id="name"
                    value={apiForm.name}
                    onChange={(e) =>
                      setApiForm({ ...apiForm, name: e.target.value })
                    }
                    className="col-span-3 bg-gray-50 dark:bg-gray-900 border-gray-200 dark:border-gray-700 rounded-md focus:ring-blue-500 dark:focus:ring-blue-400 focus:border-blue-500 dark:focus:border-blue-400 text-gray-900 dark:text-gray-100"
                  />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label
                    htmlFor="description"
                    className="text-right text-sm font-medium text-gray-700 dark:text-gray-300"
                  >
                    Description{" "}
                    <span className="text-[10px] text-gray-400 dark:text-gray-500">
                      (optional)
                    </span>
                  </Label>
                  <Input
                    id="description"
                    value={apiForm.desc}
                    onChange={(e) =>
                      setApiForm({ ...apiForm, desc: e.target.value })
                    }
                    className="col-span-3 bg-gray-50 dark:bg-gray-900 border-gray-200 dark:border-gray-700 rounded-md focus:ring-blue-500 dark:focus:ring-blue-400 focus:border-blue-500 dark:focus:border-blue-400 text-gray-900 dark:text-gray-100"
                  />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label
                    htmlFor="version"
                    className="text-right text-sm font-medium text-gray-700 dark:text-gray-300"
                  >
                    Version
                  </Label>
                  <Select
                    value={apiForm.version}
                    onValueChange={(value: string) =>
                      setApiForm({ ...apiForm, version: value as Version })
                    }
                  >
                    <SelectTrigger className="col-span-3 bg-gray-50 dark:bg-gray-900 border-gray-200 dark:border-gray-700 rounded-md focus:ring-blue-500 dark:focus:ring-blue-400 focus:border-blue-500 dark:focus:border-blue-400 text-gray-900 dark:text-gray-100">
                      <SelectValue placeholder="Select API version" />
                    </SelectTrigger>
                    <SelectContent className="bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700">
                      {apiVersions.map((version) => (
                        <SelectItem
                          key={version.value}
                          value={version.value}
                          className="text-gray-900 dark:text-gray-100"
                        >
                          <span className="font-medium">{version.label}</span>
                          <span className="text-sm text-gray-500 dark:text-gray-400 block">
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
                  onClick={handleSubmit}
                  className="bg-blue-600 hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600 text-white transition-colors duration-200 ease-in-out disabled:opacity-50"
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      className="flex items-center"
                    >
                      <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                      Creating...
                    </motion.div>
                  ) : (
                    "Create API"
                  )}
                </Button>
              </DialogFooter>
            </motion.div>
          </DialogContent>
        </Dialog>
      )}
    </AnimatePresence>
  );
};

export default CreateApiKeyDialog;
