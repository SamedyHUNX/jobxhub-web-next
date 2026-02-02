import dynamic from "next/dynamic";
import "@mdxeditor/editor/style.css";

export const MarkdownEditor = dynamic(() => import("./_MarkdownEditor"), {
  ssr: false,
});
