"use client";

import { useAuth } from "@/hooks/use-auth";
import { Button } from "./ui/button";
import { LogOutIcon } from "lucide-react";

export const SignOutButton = () => {
  const { signOut } = useAuth();
  return (
    <Button className="w-full" onClick={() => signOut()}>
      <LogOutIcon className="mr-1" /> Sign Out
    </Button>
  );
};
