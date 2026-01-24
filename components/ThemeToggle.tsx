"use client";

import { useTheme } from "next-themes";
import { Moon, Sun } from "lucide-react";
import { useEffect, useState } from "react";

export default function ThemeToggle() {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return <div className="h-8 w-8" />;
  }

  const themes = [
    { name: "light", icon: Sun, label: "Light" },
    { name: "dark", icon: Moon, label: "Dark" },
    // { name: "system", icon: Monitor, label: "System" },
  ];

  const currentIndex = themes.findIndex((t) => t.name === theme);
  const nextTheme = themes[(currentIndex + 1) % themes.length];

  return (
    <button
      onClick={() => setTheme(nextTheme.name)}
      className="h-8 w-8 flex items-center justify-center rounded-md text-yellow-400  transition-colors"
      aria-label={`Switch to ${nextTheme.label} mode`}
      title={`Current: ${theme} - Switch to ${nextTheme.label}`}
    >
      {theme === "light" && <Sun className="h-5 w-5" />}
      {theme === "dark" && <Moon className="h-5 w-5" />}
      {/* {theme === "system" && <Monitor className="h-5 w-5" />} */}
    </button>
  );
}
