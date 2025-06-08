import React from "react";
import { cn } from "@/lib/utils";

interface DocLayoutProps {
  children: React.ReactNode;
  className?: string;
}

export const DocLayout: React.FC<DocLayoutProps> = ({ children, className }) => {
  return (
    <div className={cn(
      "max-w-4xl mx-auto py-8 px-4 sm:px-6 lg:px-8",
      "prose prose-slate dark:prose-invert",
      "prose-headings:scroll-mt-20",
      "prose-h1:text-4xl prose-h1:font-bold prose-h1:mb-8",
      "prose-h2:text-3xl prose-h2:font-semibold prose-h2:mt-12 prose-h2:mb-6",
      "prose-h3:text-2xl prose-h3:font-semibold prose-h3:mt-8 prose-h3:mb-4",
      "prose-p:text-gray-700 dark:prose-p:text-gray-300 prose-p:leading-relaxed",
      "prose-a:text-blue-600 dark:prose-a:text-blue-400 prose-a:no-underline hover:prose-a:underline",
      "prose-code:text-sm prose-code:bg-gray-100 dark:prose-code:bg-gray-800 prose-code:px-1 prose-code:py-0.5 prose-code:rounded",
      "prose-pre:bg-gray-900 dark:prose-pre:bg-gray-800 prose-pre:text-gray-100 prose-pre:rounded-lg",
      className
    )}>
      {children}
    </div>
  );
}; 