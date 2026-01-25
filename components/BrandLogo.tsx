"use client";

import Image from "next/image";
import Link from "next/link";
import brandLogo from "@/public/assets/images/jobxhub.png";

export default function BrandLogo({
  className,
  width = 230,
  height = 32,
}: {
  className?: string;
  width?: number;
  height?: number;
}) {
  return (
    <Link href="/" className={className}>
      <div className="flex flex-row items-center gap-2.5">
        <Image
          src={brandLogo}
          alt="JobXHub"
          width={width}
          height={height}
          className="w-9 h-9"
        />
        <div className="relative overflow-hidden">
          <h1 className="font-sans font-bold text-2xl tracking-tight bg-linear-to-r from-gray-900 via-gray-800 to-gray-900 dark:from-white dark:via-gray-100 dark:to-white bg-clip-text text-transparent">
            Job
            <span className="text-blue-600 dark:text-blue-400">X</span>
            Hub
          </h1>
        </div>
      </div>
    </Link>
  );
}
