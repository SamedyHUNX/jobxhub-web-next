"use client";

import MarkdownRenderer from "@/components/markdown/MarkdownRenderer";
import PageLoader from "@/components/PageLoader";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useJobListings } from "@/hooks/use-job-listings";
import { useProfile } from "@/hooks/use-profile";
import { cn } from "@/lib/utils";
import { Resume } from "@/types";
import { FileText, Loader2, Sparkles, UploadCloud } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { toast } from "sonner";

export default function UserResumePage() {
  const {
    getUserResume,
    uploadResume,
    uploadResumeLoading,
    deleteResume,
    isDeletingResume,
  } = useJobListings();

  const { user: currentUser } = useProfile();

  const [resume, setResume] = useState<Resume | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [resumeLoading, setResumeLoading] = useState(true);

  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (!currentUser?.id) return;

    setResumeLoading(true);

    getUserResume(currentUser.id, {
      onSuccess: (data) => {
        setResume(data ?? null);
        setResumeLoading(false);
      },
      onError: () => {
        setResumeLoading(false);
      },
    });
  }, [currentUser?.id, getUserResume]);

  if (resumeLoading) return <PageLoader />;

  const handleFile = (file: File) => {
    if (uploadResumeLoading) return;

    if (file.type !== "application/pdf") {
      toast.error("Only PDF files are allowed");
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      toast.error("File size must be under 5MB");
      return;
    }

    uploadResume(
      { file },
      {
        onSuccess: (data) => setResume(data),
      },
    );
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);

    const file = e.dataTransfer.files?.[0];
    if (file) handleFile(file);
  };

  const handleDelete = () => {
    if (!currentUser?.id) return;

    deleteResume(currentUser.id, {
      onSuccess: () => setResume(null),
    });
  };

  return (
    <div className="w-full mx-auto p-8 space-y-6">
      <h1 className="text-4xl font-bold text-black dark:text-white">
        Upload Your Resume
      </h1>

      <Card>
        <CardContent className="pt-6 space-y-4">
          {/* Dropzone */}
          {!resume && (
            <div
              onClick={() => fileInputRef.current?.click()}
              onDragOver={(e) => {
                e.preventDefault();
                setIsDragging(true);
              }}
              onDragLeave={() => setIsDragging(false)}
              onDrop={handleDrop}
              className={cn(
                "border-2 border-dashed rounded-lg p-10 text-center cursor-pointer transition-colors",
                isDragging
                  ? "border-primary bg-primary/5"
                  : "border-muted-foreground/30 hover:border-primary/50",
              )}
            >
              {uploadResumeLoading ? (
                <div className="flex flex-col items-center gap-2 text-muted-foreground">
                  <Loader2 className="h-8 w-8 animate-spin" />
                  <p>Uploading...</p>
                </div>
              ) : (
                <div className="flex flex-col items-center gap-2 text-muted-foreground">
                  <UploadCloud className="h-8 w-8" />
                  <p className="font-medium">Drag & drop your resume here</p>
                  <p className="text-sm">or click to browse</p>
                  <p className="text-xs">PDF only · Max 5MB</p>
                </div>
              )}

              <input
                ref={fileInputRef}
                type="file"
                accept="application/pdf"
                className="hidden"
                onChange={(e) => {
                  const file = e.target.files?.[0];
                  if (file) {
                    handleFile(file);
                    e.target.value = "";
                  }
                }}
              />
            </div>
          )}

          {/* Resume Details */}
          {resume && (
            <ResumeDetails
              resume={resume}
              onDelete={handleDelete}
              isDeleting={isDeletingResume}
            />
          )}
        </CardContent>
      </Card>

      {/* AI Summary */}
      {resume?.aiSummary && <AiSummaryCard summary={resume.aiSummary} />}
    </div>
  );
}

function ResumeDetails({
  resume,
  onDelete,
  isDeleting,
}: {
  resume: Resume;
  onDelete: () => void;
  isDeleting: boolean;
}) {
  return (
    <div className="flex items-center justify-between rounded-lg border p-4">
      <div className="flex items-center gap-3">
        <FileText className="h-8 w-8 text-primary" />
        <div>
          <p className="font-medium text-sm">resume.pdf</p>
          <p className="text-xs text-muted-foreground">
            Uploaded {new Date(resume.createdAt).toLocaleDateString()}
          </p>
        </div>
      </div>

      <div className="flex items-center gap-2">
        <Button variant="outline" size="sm" asChild>
          <a
            href={resume.resumeFileUrl}
            target="_blank"
            rel="noopener noreferrer" // open the page in a new tab
          >
            View
          </a>
        </Button>

        <Button
          variant="destructive"
          size="sm"
          onClick={onDelete}
          disabled={isDeleting}
        >
          {isDeleting ? "Deleting..." : "Delete"}
        </Button>
      </div>
    </div>
  );
}

function AiSummaryCard({ summary }: { summary: string }) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Sparkles className="h-5 w-5 text-primary" />
          AI-Generated Summary
        </CardTitle>
        <CardDescription>
          This is used by employers to quickly understand your qualifications
          and experience
        </CardDescription>
      </CardHeader>
      <CardContent>
        <MarkdownRenderer source={summary} />
      </CardContent>
    </Card>
  );
}
