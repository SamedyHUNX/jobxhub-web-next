"use client";

import Image from "next/image";
import Link from "next/link";
import brandLogo from "@/public/assets/images/jobxhub.png";

export default function BrandLogo({ className }: { className?: string }) {
  return (
    <Link href={"/"} className={className}>
      <div className="flex flex-1 flex-row gap-3">
        <Image
          src={brandLogo}
          alt="stockxhub"
          width={140}
          height={32}
          className="w-10 h-9"
        />
        <h1 className="font-sans font-bold text-2xl pt-1 tracking-tighter text-gray-900 dark:text-white">
          JobXHub
        </h1>
      </div>
    </Link>
  );
}
