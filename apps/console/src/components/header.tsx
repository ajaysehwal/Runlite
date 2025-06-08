"use client";

import React from "react";
import { usePathname } from "next/navigation";
import { useAuth } from "@/hooks/useAuth";
import SignInButtons from "./signInButton";
import ConfigurationDrawer from "./ConfigurationDrawer";
import Account from "./Account";
import { ModeToggle } from "./ThemeToggle";
import { cn } from "@/lib/utils";
import { Code2, LayoutDashboard, Key, FileText, Activity, History } from "lucide-react";

const Header = () => {
  const { user } = useAuth();
  const pathname = usePathname();

  const getHeadingInfo = (page: string): { title: string; icon: React.ReactNode } => {
    const headings: { [key: string]: { title: string; icon: React.ReactNode } } = {
      "/playground": {
        title: "Playground",
        icon: <Code2 className="w-5 h-5 text-blue-500 dark:text-blue-400" />,
      },
      "/api-keys": {
        title: "API Keys",
        icon: <Key className="w-5 h-5 text-blue-500 dark:text-blue-400" />,
      },
      "/docs": {
        title: "Documentation",
        icon: <FileText className="w-5 h-5 text-blue-500 dark:text-blue-400" />,
      },
      "/usage": {
        title: "Usage",
        icon: <Activity className="w-5 h-5 text-blue-500 dark:text-blue-400" />,
      },
      "/logs": {
        title: "Events Logs",
        icon: <History className="w-5 h-5 text-blue-500 dark:text-blue-400" />,
      },
    };
    return (
      headings[page] || {
        title: "Dashboard",
        icon: <LayoutDashboard className="w-5 h-5 text-blue-500 dark:text-blue-400" />,
      }
    );
  };

  const headingInfo = getHeadingInfo(pathname);

  return (
    <header 
      className={cn(
        "sticky top-0 z-50",
        "h-14 px-6",
        "border-b border-slate-200 dark:border-slate-800",
        "backdrop-blur-sm",
        "flex items-center justify-between",
        "transition-colors duration-200"
      )}
    >
      <div className="flex items-center gap-2">
        {headingInfo.icon}
        <h1 className="text-lg font-medium text-slate-800 dark:text-slate-200">
          {headingInfo.title}
        </h1>
      </div>

      <div className="flex items-center gap-3">
        <div className="hidden md:flex items-center">
          <ConfigurationDrawer />
        </div>
        {user ? (
          <Account user={user} />
        ) : (
          <div className="flex items-center gap-2">
            <SignInButtons />
          </div>
        )}
        <div className="w-px h-6 bg-slate-200 dark:bg-slate-800" />
        <ModeToggle />
      </div>
    </header>
  );
};

export default Header;
