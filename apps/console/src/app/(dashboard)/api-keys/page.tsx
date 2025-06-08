"use client";
import React, { useState, useEffect, useCallback } from "react";
import { motion } from "framer-motion";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "@/store";
import { getKeys, deleteKey, generateKey } from "@/store/thunks/keys";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/hooks/useAuth";
import { ApiKeyTable } from "./components/ApiKeyTable";
import { CreateApiKeyDialog } from "./components/createApiDialog";
import { NewApiKeyDialog } from "./components/apikeyDialog";
import { Button } from "@/components/ui/button";
import { AlertTriangle, Plus, RefreshCcw } from "lucide-react";
import { Version } from "@/types/schema";

const APIManagement: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { keys, isLoading, error, generateLoad } = useSelector(
    (state: RootState) => state.keys
  );
  const { toast } = useToast();
  const { AuthLoad, user } = useAuth();
  const [newApiKey, setNewApiKey] = useState("");
  const [deletingKeys, setDeletingKeys] = useState<Record<string, boolean>>({});
  const [newKeyDialogOpen, setNewKeyDialogOpen] = useState(false);
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

  const handleGenerateKey = useCallback(
    async (apiForm: { name: string; desc: string; version: Version }) => {
      try {
        const result = await dispatch(generateKey(apiForm));
        if (generateKey.fulfilled.match(result)) {
          setCreateDialogOpen(false);
          setNewApiKey(result.payload.key);
          setNewKeyDialogOpen(true);
        }
      } catch (error) {
        toast({
          title: `${(error as Error).message}`,
          description: "Failed to create a new API key. Please try again.",
          variant: "destructive",
        });
      }
    },
    [dispatch, toast]
  );

  return (
    <div className="w-full max-w-7xl mx-auto px-4 py-8 space-y-8">
      <div className="flex flex-col gap-6">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-semibold text-gray-900 dark:text-gray-100">API Keys</h1>
          <div className="flex items-center gap-3">
            <CreateApiButton
              onClick={() => setCreateDialogOpen(true)}
              isLoading={generateLoad}
            />
            <RefreshButton
              onClick={() => dispatch(getKeys())}
              isLoading={isLoading}
            />
          </div>
        </div>
        <AlertSection />
      </div>
      <div className="bg-white dark:bg-gray-800 rounded-lg">
        <ApiKeyTable
          keys={keys}
          isLoading={isLoading}
          error={error}
          deletingKeys={deletingKeys}
          onDeleteKey={handleDeleteKey}
        />
      </div>
      <CreateApiKeyDialog
        open={createDialogOpen}
        onOpenChange={setCreateDialogOpen}
        onSubmit={handleGenerateKey}
        isLoading={generateLoad}
      />
      <NewApiKeyDialog
        open={newKeyDialogOpen}
        setOpen={setNewKeyDialogOpen}
        apiKey={newApiKey}
      />
    </div>
  );
};

const AlertSection: React.FC = () => (
  <div className="space-y-4">
    <motion.div
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg border border-blue-100 dark:border-blue-800"
    >
      <div className="flex gap-2 text-blue-700 dark:text-blue-300">
        <AlertTriangle className="h-5 w-5 flex-shrink-0" />
        <p className="text-sm">
          As an owner of this project, you can view and manage all API keys in this project.
        </p>
      </div>
    </motion.div>
    <motion.div
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay: 0.1 }}
      className="bg-red-50 dark:bg-red-900/20 p-4 rounded-lg border border-red-100 dark:border-red-800"
    >
      <div className="flex gap-2 text-red-700 dark:text-red-300">
        <AlertTriangle className="h-5 w-5 flex-shrink-0" />
        <p className="text-sm">
          Do not share your API key with others, or expose it in the browser or other client-side code. 
          In order to protect the security of your account, Runlite may also automatically disable any API key that has leaked publicly.
        </p>
      </div>
    </motion.div>
    <motion.p 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3, delay: 0.2 }}
      className="text-sm text-gray-600 dark:text-gray-400"
    >
      View usage per API key on the{" "}
      <a href="/usage" className="text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 hover:underline transition-colors">
        Usage page
      </a>
      .
    </motion.p>
  </div>
);

const CreateApiButton: React.FC<{
  onClick: () => void;
  isLoading: boolean;
}> = ({ onClick, isLoading }) => (
  <Button
    onClick={onClick}
    className="bg-blue-600 hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600 text-white transition-all duration-200 px-4 py-2 rounded-lg flex items-center gap-2 disabled:opacity-50"
    disabled={isLoading}
  >
    <Plus className="h-4 w-4" />
    <span>Create API Key</span>
  </Button>
);

const RefreshButton = ({
  onClick,
  isLoading,
}: {
  onClick: () => void;
  isLoading: boolean;
}) => {
  return (
    <Button
      variant="outline"
      size="default"
      onClick={onClick}
      disabled={isLoading}
      className="text-gray-600 dark:text-gray-300 hover:text-gray-700 dark:hover:text-gray-200 border border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-all duration-200 px-4 py-2 rounded-lg flex items-center gap-2 disabled:opacity-50"
    >
      <RefreshCcw
        size={16}
        className={`${isLoading ? "animate-spin" : ""} transition-transform duration-300`}
      />
      <span>Refresh</span>
    </Button>
  );
};

export default APIManagement;
