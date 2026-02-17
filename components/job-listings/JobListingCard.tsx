import { formatDate, formatWage } from "@/lib/formatter";
import type { JobListing } from "@/types";
import {
  Briefcase,
  Calendar,
  DollarSign,
  MapPin,
  Star,
  TrendingUp,
  Calculator,
} from "lucide-react";
import Link from "next/link";
import { ComponentType } from "react";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import MarkdownPartial from "../markdown/MarkdownPartial";
import MarkdownRenderer from "../markdown/MarkdownRenderer";

const JobListingCardItem = ({
  icon: Icon,
  text,
  secondaryText,
  className = "text-muted-foreground",
}: {
  icon: ComponentType<{ className?: string }>;
  text: string;
  secondaryText?: string;
  className?: string;
}) => {
  return (
    <div className="flex items-start gap-2">
      <Icon className="w-4 h-4 text-muted-foreground mt-0.5 shrink-0" />
      <div className="text-sm">
        <p className={className}>{text}</p>
        {secondaryText && (
          <p className="text-muted-foreground">{secondaryText}</p>
        )}
      </div>
    </div>
  );
};

export default function JobListingCard({ job }: { job: JobListing }) {
  const statusVariant = {
    published: "default",
    draft: "secondary",
    archived: "outline",
    delisted: "outline",
  }[job.status] as "default" | "secondary" | "outline";

  return (
    <Card className="hover:shadow-md transition-shadow">
      <CardHeader>
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <CardTitle className="flex items-center gap-2 text-3xl py-2">
              {job.title}
              {job.isFeatured && (
                <Star className="w-5 h-5 text-yellow-500 fill-yellow-500" />
              )}
            </CardTitle>
          </div>
          <Badge variant={statusVariant}>{job.status}</Badge>
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        {/* Description */}
        <MarkdownPartial
          dialogMarkdown={<MarkdownRenderer source={job.description} />}
          mainMarkdown={
            <MarkdownRenderer className="prose-sm" source={job.description} />
          }
          dialogTitle="Description"
        />

        {/* Details Grid */}
        <div className="grid grid-cols-2 gap-4">
          <JobListingCardItem
            icon={MapPin}
            text={job.locationRequirement.replace(/_/g, " ")}
            secondaryText={
              job.city && job.stateAbbreviation
                ? `${job.city}, ${job.stateAbbreviation}`
                : undefined
            }
            className="text-muted-foreground capitalize"
          />

          <JobListingCardItem
            icon={DollarSign}
            text={formatWage(job.wage, job.wageInterval)}
            className="text-foreground font-medium"
          />

          <JobListingCardItem
            icon={Calculator}
            text={job.applicationCount.toString()}
            className="text-foreground font-medium"
          />

          <JobListingCardItem
            icon={Briefcase}
            text={job.type.replace(/_/g, " ")}
            className="text-muted-foreground capitalize"
          />
        </div>
      </CardContent>

      <CardFooter className="flex items-center justify-between border-t pt-4">
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <Calendar className="w-4 h-4" />
          <span>Posted on {formatDate(job.postedAt!)}</span>
        </div>
        <Button variant="link" asChild className="px-0">
          <Link
            href={`/employer/orgs/${job.organizationId}/all-jobs/${job.id}`}
          >
            Details →
          </Link>
        </Button>
      </CardFooter>
    </Card>
  );
}
