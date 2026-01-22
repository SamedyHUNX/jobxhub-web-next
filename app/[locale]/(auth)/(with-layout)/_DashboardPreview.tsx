"use client";

import { useTheme } from "next-themes";
import Image from "next/image";
import { useEffect, useState } from "react";
import dashboardImg from "@/public/assets/images/dashboard.jpg";

export default function DashboardPreview() {
  const { theme, resolvedTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  // Prevent hydration mismatch
  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    // Return a placeholder during SSR to avoid hydration mismatch
    return (
      <div className="auth-dashboard-preview absolute top-0 w-360 h-362.5" />
    );
  }

  return (
    <Image
      src={dashboardImg}
      alt="dashboard"
      width={1440}
      height={1450}
      className="auth-dashboard-preview absolute top-0"
    />
  );
}
