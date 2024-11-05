"use client";

import React from "react";
import { usePathname } from "next/navigation";
import Link from "next/link";
import { Tooltip, TooltipContent, TooltipTrigger } from "./ui/tooltip";
import { Button } from "./ui/button";
import {
  Book,
  ChartNoAxesColumn,
  LockKeyhole,
  LifeBuoy,
  // Settings2,
  SquareTerminal,
  // SquareUser,
  Logs
} from "lucide-react";
import { Logo } from "./logo";

interface NavItem {
  icon: React.ReactNode;
  label: string;
  href: string;
}

const mainNavItems: NavItem[] = [
  {
    icon: <SquareTerminal className="size-5" />,
    label: "Playground",
    href: "/playground",
  },

  {
    icon: <LockKeyhole className="size-5" />,
    label: "API Keys",
    href: "/api-keys",
  },
  { icon: <Book className="size-5" />, label: "Documentation", href: "/docs" },
  {
    icon: <ChartNoAxesColumn className="size-5" />,
    label: "Usage",
    href: "/usage",
  },
  {
    icon: <Logs  className="size-5" />,
    label: "Events Logs",
    href: "/logs",
  },
  // {
  //   icon: <Settings2 className="size-5" />,
  //   label: "Settings",
  //   href: "/settings",
  // },
];

const bottomNavItems: NavItem[] = [
  { icon: <LifeBuoy className="size-5" />, label: "Help", href: "/help" },
  // {
  //   icon: <SquareUser className="size-5" />,
  //   label: "Account",
  //   href: "/account",
  // },
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
      className={`
        rounded-lg transition-all duration-200 ease-in-out
        ${isActive 
          ? "bg-[rgb(63,132,246)] text-white shadow-lg backdrop-blur-sm hover:bg-blue-400 hover:text-gray-100" 
          : "text-gray-600 hover:bg-white/10 hover:text-gray-500"
        }
      `}
      aria-label={label}
      asChild
    >
      <Link href={href}>{icon}</Link>
    </Button>
  </TooltipTrigger>
  <TooltipContent 
    side="right" 
    sideOffset={5}
    className="bg-white/90 backdrop-blur-sm"
  >
    {label}
  </TooltipContent>
</Tooltip>

);

export default function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="fixed inset-y-0 left-0 z-20 flex h-full w-16 flex-col  bg-white">
      <div className="border-b p-2">
      <Button 
          variant="ghost" 
          size="icon" 
          aria-label="Home" 
          className="w-full bg-white/10 hover:bg-white/20 transition-colors"
          asChild
        >
          <Link href="/">
            <Logo />
          </Link>
        </Button>
      </div>
      <nav className="grid gap-1 p-2">
        {mainNavItems.map((item) => (
          <NavButton
            key={item.href}
            {...item}
            isActive={pathname === item.href}
          />
        ))}
      </nav>
      <nav className="mt-auto grid gap-1 p-2">
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
