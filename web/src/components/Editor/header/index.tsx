import React from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useEditor } from "@/hooks/useEditor";
import {
  setLanguage,
  setTheme,
  setResponse,
  setLoading,
} from "@/store/slices/editor.slice";
import { DEFAULT_THEME, DEFAULT_LANGUAGE } from "@/constants";
import { Button } from "@/components/ui/button";
import { Loader, Play } from "lucide-react";
import { Language, Theme } from "@/types";
import axios from "axios";
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
    <SelectTrigger className="w-[180px] bg-white">
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

export const EditorHeader: React.FC = () => {
  const { theme, language, dispatch, code, isLoading } = useEditor();

  const handleThemeChange = (value: string) => {
    dispatch(setTheme(value as Theme));
  };

  const handleLanguageChange = (value: string) => {
    dispatch(setLanguage(value as Language));
  };
  const runCode = async () => {
    dispatch(setLoading(true));
    try {
      const { data } = await axios.post("http://localhost:8000/v1", {
        syntax: code,
        lang: language,
      });
      console.log(data);
      dispatch(setLoading(false));
      dispatch(setResponse(data));
    } catch (error) {
      dispatch(setLoading(false));
      console.log(error);
    }
  };
  return (
    <div className="flex items-center gap-2 p-1 bg-gray-50">
      <Selector
        value={theme}
        onChange={handleThemeChange}
        options={DEFAULT_THEME}
        label="theme"
      />
      <Selector
        value={language}
        onChange={handleLanguageChange}
        options={DEFAULT_LANGUAGE}
        label="language"
      />
      <Button
        variant="default"
        size="sm"
        onClick={() => runCode()}
        className="bg-green-600 hover:bg-green-700 text-white font-semibold py-2 px-4 rounded-md transition-colors duration-200 flex items-center gap-2"
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
    </div>
  );
};

export default EditorHeader;
