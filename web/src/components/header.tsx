"use client";
import React from "react";
import { usePathname } from "next/navigation";
import { useAuth } from "@/hooks/useAuth";
import SignInButtons from "./signInButton";
import ConfigurationDrawer from "./ConfigurationDrawer";
import Account from "./Account";

const Header: React.FC = () => {
  const { user } = useAuth();
  const pathname = usePathname();

  const getHeading = (page: string): string => {
    const headings: { [key: string]: string } = {
      "/playground": "Playground",
      "/api-keys": "API",
      "/docs": "Documentation",
      "/usage": "Usage",
    };
    return headings[page] || "Dashboard";
  };

  return (
    <header className="sticky top-0 z-10 flex h-[57px] items-center gap-1 border-b bg-background px-4 justify-between">
      <h1 className="text-xl font-semibold">{getHeading(pathname)}</h1>
      <div className="flex items-center gap-4">
        <ConfigurationDrawer />
        {user ? <Account user={user} /> : <SignInButtons />}
      </div>
    </header>
  );
};

export default Header;
