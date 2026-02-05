"use client";

import { cn } from "@/lib/utils";
import { markdownClassNames } from "./_MarkdownEditor";
import Markdown from "react-markdown";
import remarkGfm from "remark-gfm";
import rehypeRaw from "rehype-raw";

interface MarkdownRendererProps {
  source: string;
  className?: string;
}

export default function MarkdownRenderer({
  className,
  source,
}: MarkdownRendererProps) {
  return (
    <div className={cn(markdownClassNames, className)}>
      <Markdown remarkPlugins={[remarkGfm]} rehypePlugins={[rehypeRaw]}>
        {source}
      </Markdown>
    </div>
  );
}
