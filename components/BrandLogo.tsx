"use client";

import Image from "next/image";
import Link from "next/link";
import brandLogo from "@/public/assets/images/jobxhub.png";

export default function BrandLogo({ className }: { className?: string }) {
  return (
    <Link href={"/"} className={className}>
      <div className="flex flex-row items-center gap-2.5">
        <Image
          src={brandLogo}
          alt="JobXHub"
          width={140}
          height={32}
          className="w-9 h-9"
        />
        <div className="relative overflow-hidden">
          <h1 className="font-sans font-bold text-2xl tracking-tight bg-linear-to-r from-gray-900 via-gray-800 to-gray-900 dark:from-white dark:via-gray-100 dark:to-white bg-clip-text text-transparent group-hover:from-blue-600 group-hover:via-purple-600 group-hover:to-blue-600 transition-all duration-500">
            Job
            <span className="text-blue-600 dark:text-blue-400 group-hover:text-purple-600 dark:group-hover:text-purple-400 transition-colors duration-500">
              X
            </span>
            Hub
          </h1>
        </div>
      </div>
    </Link>
  );
}
