"use client";

import React, { Suspense } from "react";
import { useEditor } from "@/hooks/useEditor";
import {
  setLanguage,
  setTheme,
  setResponse,
  setLoading,
} from "@/store/slices/editor.slice";
import { DEFAULT_THEME, DEFAULT_LANGUAGE, LanguageToCode } from "@/constants";
import { Language, Status, Theme } from "@/types";
import axios, { AxiosError } from "axios";
import { Check, ChevronsUpDown, Loader2, Play, Code2, Sun } from "lucide-react";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useSelector } from "react-redux";
import { RootState } from "@/store";
import { cn } from "@/lib/utils";
import ApiInput from "./ApiKeyInput";

// Types
interface SelectorProps {
  value: string;
  onChange: (value: string) => void;
  options: readonly string[];
  label: string;
}

interface LanguageOption {
  label: string;
  value: string;
}

const SelectorSkeleton: React.FC = () => <Skeleton className="w-[120px] h-9" />;

const ButtonSkeleton: React.FC = () => <Skeleton className="w-[100px] h-9" />;

const BasicSelector: React.FC<SelectorProps> = ({
  value,
  onChange,
  options,
  label,
}) => (
  <Select onValueChange={onChange} value={value}>
    <SelectTrigger
      className={cn(
        "h-9",
        "bg-transparent",
        "border border-slate-200 dark:border-slate-700",
        "hover:bg-slate-100/50 dark:hover:bg-slate-800/50",
        "transition-colors duration-150"
      )}
    >
      <Sun className="w-4 h-4 mr-2 text-slate-500 dark:text-slate-400" />
      <SelectValue placeholder={`Select ${label}`} />
    </SelectTrigger>
    <SelectContent className="outline-none">
      {options.map((option) => (
        <SelectItem key={option} value={option} className="cursor-pointer">
          {option.charAt(0).toUpperCase() + option.slice(1)}
        </SelectItem>
      ))}
    </SelectContent>
  </Select>
);

const LanguageSelector: React.FC<SelectorProps> = ({
  value,
  onChange,
  options,
  label,
}) => {
  const [open, setOpen] = React.useState(false);

  const languageOptions: LanguageOption[] = options.map((option) => ({
    label: option.charAt(0).toUpperCase() + option.slice(1),
    value: option,
  }));

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className={cn(
            "h-9 justify-between",
            "bg-transparent",
            "border border-slate-200 dark:border-slate-700",
            "hover:bg-slate-100/50 dark:hover:bg-slate-800/50",
            "transition-colors duration-150"
          )}
        >
          <div className="flex items-center gap-2">
            <Code2 className="w-4 h-4 text-slate-500 dark:text-slate-400" />
            <span className="truncate">
              {value
                ? languageOptions.find((lang) => lang.value === value)?.label
                : `Select ${label}...`}
            </span>
          </div>
          <ChevronsUpDown className="h-4 w-4 shrink-0 text-slate-500 dark:text-slate-400" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="p-0 bg-white dark:bg-slate-900">
        <Command>
          <CommandInput placeholder={`Search ${label}...`} className="h-9" />
          <CommandList>
            <CommandEmpty>No {label} found.</CommandEmpty>
            <CommandGroup>
              {languageOptions.map((lang) => (
                <CommandItem
                  key={lang.value}
                  value={lang.value}
                  onSelect={(currentValue) => {
                    onChange(currentValue === value ? "" : currentValue);
                    setOpen(false);
                  }}
                  className="cursor-pointer"
                >
                  <Check
                    className={cn(
                      "mr-2 h-4 w-4",
                      value === lang.value ? "opacity-100" : "opacity-0"
                    )}
                  />
                  {lang.label}
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
};

const RunButton: React.FC<{ onClick: () => void; isLoading: boolean }> = ({
  onClick,
  isLoading,
}) => (
  <Button
    variant="default"
    size="sm"
    disabled={isLoading}
    onClick={onClick}
    className={cn(
      "bg-green-500 hover:bg-green-600 text-white",
      "h-9 px-6",
      "transition-colors duration-150",
      "disabled:opacity-50 disabled:cursor-not-allowed",
      "font-medium"
    )}
  >
    {isLoading ? (
      <>
        <Loader2 className="w-4 h-4 animate-spin mr-2" />
        Running
      </>
    ) : (
      <>
        <Play className="w-4 h-4 mr-2" />
        Run
      </>
    )}
  </Button>
);

// Main Header Component
export const Header: React.FC = () => {
  const { theme, language, dispatch, code, isLoading } = useEditor();
  const { currentkey } = useSelector((state: RootState) => state.keys);

  const handleThemeChange = (value: string) =>
    dispatch(setTheme(value as Theme));
  const handleLanguageChange = (value: string) =>
    dispatch(setLanguage(value as Language));

  const runCode = async () => {
    dispatch(setResponse(null));
    dispatch(setLoading(true));

    try {
      const { data } = await axios.post(
        `${process.env.NEXT_PUBLIC_COMPILER_SERVER}/v1/run`,
        {
          syntax: code,
          lang: LanguageToCode[language],
        },
        {
          headers: {
            Authorization: `Bearer ${currentkey}`,
          },
        }
      );
      dispatch(setResponse(data));
    } catch (error) {
      const errorMessage =
        ((error as AxiosError).response?.data as { error: string })?.error ||
        "Something went wrong please try again later";

      dispatch(
        setResponse({
          error: errorMessage,
          status: Status.Failed,
        })
      );
      console.error("Error running code:", error);
    } finally {
      dispatch(setLoading(false));
    }
  };

  return (
    <div className="w-full border-b border-slate-200 dark:border-slate-800">
      <div className="flex items-center h-14 px-4">
        <div className="flex items-center space-x-2">
          <Suspense fallback={<SelectorSkeleton />}>
            <BasicSelector
              value={theme}
              onChange={handleThemeChange}
              options={DEFAULT_THEME}
              label="theme"
            />
          </Suspense>
          <Suspense fallback={<SelectorSkeleton />}>
            <LanguageSelector
              value={language}
              onChange={handleLanguageChange}
              options={DEFAULT_LANGUAGE}
              label="language"
            />
          </Suspense>
          <Suspense fallback={<ButtonSkeleton />}>
            <RunButton onClick={runCode} isLoading={isLoading} />
          </Suspense>
        </div>
        <div className="flex-1" />
        <ApiInput />
      </div>
    </div>
  );
};

export default Header;
