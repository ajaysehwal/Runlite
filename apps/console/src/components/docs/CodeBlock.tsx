import { Check, Copy, Terminal } from "lucide-react";
import { useState } from "react";
import { cn } from "@/lib/utils";

interface CodeBlockProps {
  language: string;
  code: string;
  showLineNumbers?: boolean;
  className?: string;
}

export const CodeBlock: React.FC<CodeBlockProps> = ({
  language,
  code,
  showLineNumbers = false,
  className
}) => {
  const [copied, setCopied] = useState(false);

  const copyCode = async () => {
    try {
      await navigator.clipboard.writeText(code);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error("Failed to copy code:", err);
    }
  };

  return (
    <div className={cn(
      "relative mt-4 mb-6 group rounded-lg overflow-hidden",
      "border border-gray-200 dark:border-gray-800",
      className
    )}>
      {/* Header */}
      <div className={cn(
        "flex items-center justify-between px-4 py-2",
        "bg-gray-100 dark:bg-gray-800",
        "border-b border-gray-200 dark:border-gray-700"
      )}>
        <div className="flex items-center gap-2">
          <Terminal className="w-4 h-4 text-gray-500 dark:text-gray-400" />
          <span className="text-sm font-medium text-gray-600 dark:text-gray-300">
            {language.toUpperCase()}
          </span>
        </div>
        <button
          onClick={copyCode}
          className={cn(
            "flex items-center gap-1.5 px-2 py-1 rounded text-xs font-medium",
            "transition-colors duration-200",
            "hover:bg-gray-200 dark:hover:bg-gray-700",
            copied ? "text-green-600 dark:text-green-400" : "text-gray-500 dark:text-gray-400"
          )}
        >
          {copied ? (
            <>
              <Check className="w-3.5 h-3.5" />
              Copied!
            </>
          ) : (
            <>
              <Copy className="w-3.5 h-3.5" />
              Copy code
            </>
          )}
        </button>
      </div>

      {/* Code block */}
      <pre className={cn(
        "p-4 m-0 overflow-x-auto",
        "bg-gray-50 dark:bg-gray-900",
        "text-sm font-mono",
        showLineNumbers && "line-numbers"
      )}>
        <code className={`language-${language}`}>{code}</code>
      </pre>
    </div>
  );
};
