import React, { Suspense, useState, useEffect } from "react";
import { useEditor } from "@/hooks/useEditor";
import {
  setLanguage,
  setTheme,
  setResponse,
  setLoading,
} from "@/store/slices/editor.slice";
import { DEFAULT_THEME, DEFAULT_LANGUAGE } from "@/constants";
import { Language, Theme } from "@/types";
import axios from "axios";
import { Loader, Play } from "lucide-react";

import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
const SelectorSkeleton: React.FC = () => (
  <Skeleton className="w-[140px] bg-gray-200 h-10 animate-pulse" />
);

const ButtonSkeleton: React.FC = () => (
  <Skeleton className="w-24 bg-gray-200 h-10 animate-pulse" />
);

export const Header: React.FC = () => {
  const { theme, language, dispatch, code, isLoading } = useEditor();
  const [isInitialLoading, setIsInitialLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setIsInitialLoading(false), 1000);
    return () => clearTimeout(timer);
  }, []);

  const handleThemeChange = (value: string) =>
    dispatch(setTheme(value as Theme));
  const handleLanguageChange = (value: string) =>
    dispatch(setLanguage(value as Language));

  const runCode = async () => {
    dispatch(setLoading(true));
    try {
      const { data } = await axios.post(
        `${process.env.NEXT_PUBLIC_COMPILER_SERVER}/v1`,
        {
          syntax: code,
          lang: language,
        },
        {
          headers: {
            Authorization:
              "Bearer ak_4c809760cf5b152f1514ae63cd24f1aa8d65f5e085c685231146cc67c21193d1",
          },
        }
      );
      dispatch(setResponse(data));
    } catch (error) {
      console.error("Error running code:", error);
    } finally {
      dispatch(setLoading(false));
    }
  };

  const renderContent = () => (
    <>
      <Suspense fallback={<SelectorSkeleton />}>
        <Selector
          value={theme}
          onChange={handleThemeChange}
          options={DEFAULT_THEME}
          label="theme"
        />
      </Suspense>
      <Suspense fallback={<SelectorSkeleton />}>
        <Selector
          value={language}
          onChange={handleLanguageChange}
          options={DEFAULT_LANGUAGE}
          label="language"
        />
      </Suspense>
      <Suspense fallback={<ButtonSkeleton />}>
        <Button
          variant="default"
          size="sm"
          onClick={runCode}
          className="bg-green-600 hover:bg-green-700 text-white font-semibold py-2 px-4 rounded-md transition-colors duration-200 flex items-center gap-2 whitespace-nowrap"
        >
          {isLoading ? (
            <Loader className="size-4 animate-spin" />
          ) : (
            <>
              <Play className="size-4" />
              Run
            </>
          )}
        </Button>
      </Suspense>
    </>
  );

  return (
    <ScrollArea className="w-full">
      <div className="flex items-center gap-2 p-1 bg-gray-100">
        {isInitialLoading ? (
          <div className="bg-gray-100 w-full flex gap-2 items-center p-1">
            <SelectorSkeleton />
            <SelectorSkeleton />
            <ButtonSkeleton />
          </div>
        ) : (
          renderContent()
        )}
      </div>
      <ScrollBar orientation="horizontal" />
    </ScrollArea>
  );
};

type SelectorProps = {
  value: string;
  onChange: (value: string) => void;
  options: readonly string[];
  label: string;
};

const Selector: React.FC<SelectorProps> = ({
  value,
  onChange,
  options,
  label,
}) => (
  <Select onValueChange={onChange} value={value}>
    <SelectTrigger className="w-[140px] bg-white">
      <SelectValue placeholder={`Select ${label}`} />
    </SelectTrigger>
    <SelectContent>
      {options.map((option) => (
        <SelectItem key={option} value={option}>
          {option.charAt(0).toUpperCase() + option.slice(1)}
        </SelectItem>
      ))}
    </SelectContent>
  </Select>
);
