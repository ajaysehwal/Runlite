"use client";

import React from "react";
import { usePathname } from "next/navigation";
import Link from "next/link";
import { Tooltip, TooltipContent, TooltipTrigger } from "./ui/tooltip";
import { Button } from "./ui/button";
import {
  Book,
  ChartNoAxesColumn,
  KeyRound,
  LifeBuoy,
  Terminal,
  ScrollText,
} from "lucide-react";
import { Logo } from "./logo";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";

interface NavItem {
  icon: React.ReactNode;
  label: string;
  href: string;
}

const mainNavItems: NavItem[] = [
  {
    icon: <Terminal className="size-4" />,
    label: "Playground",
    href: "/playground",
  },
  {
    icon: <KeyRound className="size-4" />,
    label: "API Keys",
    href: "/api-keys",
  },
  {
    icon: <Book className="size-4" />,
    label: "Documentation",
    href: "/docs",
  },
  {
    icon: <ChartNoAxesColumn className="size-4" />,
    label: "Usage",
    href: "/usage",
  },
  {
    icon: <ScrollText className="size-4" />,
    label: "Events Logs",
    href: "/logs",
  },
];

const bottomNavItems: NavItem[] = [
  {
    icon: <LifeBuoy className="size-4" />,
    label: "Help",
    href: "/help",
  },
];

const NavButton: React.FC<NavItem & { isActive: boolean }> = ({
  icon,
  label,
  href,
  isActive,
}) => (
  <Tooltip>
    <TooltipTrigger asChild>
      <Button
        variant="ghost"
        size="icon"
        className={cn(
          "relative h-9 w-9 rounded-lg",
          "transition-all duration-200",
          isActive &&
            "after:absolute after:right-0 after:h-4 after:w-0.5 after:translate-x-1 after:rounded-full after:bg-blue-500",
          isActive
            ? "bg-blue-50 text-blue-600 dark:bg-blue-950/50 dark:text-blue-400"
            : "text-slate-600 hover:bg-slate-100 dark:text-slate-400 dark:hover:bg-slate-800"
        )}
        aria-label={label}
        asChild
      >
        <Link href={href}>
          {isActive ? (
            <motion.div
              initial={{ scale: 0.8 }}
              animate={{ scale: 1 }}
              transition={{ duration: 0.2 }}
            >
              {icon}
            </motion.div>
          ) : (
            icon
          )}
        </Link>
      </Button>
    </TooltipTrigger>
    <TooltipContent
      side="right"
      sideOffset={8}
      className={cn(
        "rounded-lg px-3 py-1.5",
        "bg-white/95 text-sm font-medium text-slate-900",
        "dark:bg-slate-900/95 dark:text-slate-100",
        "border border-slate-200/50 dark:border-slate-700/50",
        "shadow-lg backdrop-blur-sm"
      )}
    >
      {label}
    </TooltipContent>
  </Tooltip>
);

export default function Sidebar() {
  const pathname = usePathname();

  return (
    <aside
      className={cn(
        "fixed inset-y-0 left-0 z-20",
        "flex h-full w-14",
        "flex-col",
        "backdrop-blur-sm"
      )}
    >
      <div className="flex h-14 items-center justify-center border-b border-slate-200 dark:border-slate-800">
        <Button
          variant="ghost"
          size="icon"
          aria-label="Home"
          className={cn(
            "h-9 w-9 rounded-lg",
            "hover:bg-slate-100 dark:hover:bg-slate-800",
            "transition-colors duration-200"
          )}
          asChild
        >
          <Link href="/">
            <Logo />
          </Link>
        </Button>
      </div>
      <nav className="flex flex-1 flex-col gap-2 p-2">
        {mainNavItems.map((item) => (
          <NavButton
            key={item.href}
            {...item}
            isActive={pathname === item.href}
          />
        ))}
      </nav>
      <nav className="flex flex-col gap-2 p-2 pb-4">
        {bottomNavItems.map((item) => (
          <NavButton
            key={item.href}
            {...item}
            isActive={pathname === item.href}
          />
        ))}
      </nav>
    </aside>
  );
}
