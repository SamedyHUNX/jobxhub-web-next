"use client";

import { useTheme } from "next-themes";
import Image from "next/image";
import Link from "next/link";

export default function BrandLogo({ className }: { className?: string }) {
  const { theme } = useTheme();
  return (
    <Link href={"/"} className={className}>
      <Image
        src={
          theme === "dark"
            ? "/assets/icons/logo-dark.svg"
            : "/assets/icons/logo-light.svg"
        }
        alt="stockxhub"
        width={140}
        height={32}
        className="h-8 w-auto"
      />
    </Link>
  );
}
