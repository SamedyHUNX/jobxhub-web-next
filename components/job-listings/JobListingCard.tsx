import { formatDate, formatWage } from "@/lib/formatter";
import type { JobListing } from "@/types";
import {
  Briefcase,
  Building2,
  Calendar,
  DollarSign,
  MapPin,
  Star,
  TrendingUp,
} from "lucide-react";
import Link from "next/link";
import { ComponentType } from "react";

const JobListingCardItem = ({
  icon: Icon,
  text,
  secondaryText,
  className = "text-gray-600 dark:text-gray-400",
}: {
  icon: ComponentType<{ className?: string }>;
  text: string;
  secondaryText?: string;
  className?: string;
}) => {
  return (
    <div className="flex items-start gap-2">
      <Icon className="w-4 h-4 text-gray-400 dark:text-gray-500 mt-0.5 shrink-0" />
      <div className="text-sm">
        <p className={className}>{text}</p>
        {secondaryText && (
          <p className="text-gray-500 dark:text-gray-500">{secondaryText}</p>
        )}
      </div>
    </div>
  );
};

export default function JobListingCard({ job }: { job: JobListing }) {
  return (
    <div
      key={job.id}
      className="bg-white dark:bg-gray-900 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 hover:shadow-md transition-shadow overflow-hidden"
    >
      <div className="p-6">
        {/* Header */}
        <div className="flex items-start justify-between mb-4">
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-2">
              <h3 className="text-xl font-semibold text-gray-900 dark:text-gray-100">
                {job.title}
              </h3>
              {job.isFeatured && (
                <Star className="w-5 h-5 text-yellow-500 fill-yellow-500" />
              )}
            </div>
            <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
              <Building2 className="w-4 h-4" />
              <span>Organization ID: {job.organizationId}</span>
            </div>
          </div>
          <span
            className={`px-3 py-1 rounded-full text-xs font-medium ${
              job.status === "published"
                ? "bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-300"
                : job.status === "draft"
                  ? "bg-gray-100 dark:bg-gray-800 text-gray-800 dark:text-gray-300"
                  : "bg-yellow-100 dark:bg-yellow-900/30 text-yellow-800 dark:text-yellow-300"
            }`}
          >
            {job.status}
          </span>
        </div>

        {/* Description */}
        <p className="text-gray-700 dark:text-gray-300 mb-4 line-clamp-2">
          {job.description}
        </p>

        {/* Details Grid */}
        <div className="grid grid-cols-2 gap-4 mb-4">
          {/* Location */}
          <JobListingCardItem
            icon={MapPin}
            text={job.locationRequirement.replace(/_/g, " ")}
            secondaryText={
              job.city && job.stateAbbreviation
                ? `${job.city}, ${job.stateAbbreviation}`
                : undefined
            }
            className="text-gray-600 dark:text-gray-400 capitalize"
          />

          {/* Wage */}
          <JobListingCardItem
            icon={DollarSign}
            text={formatWage(job.wage, job.wageInterval)}
            className="text-gray-900 dark:text-gray-100 font-medium"
          />

          {/* Job Type */}
          <JobListingCardItem
            icon={Briefcase}
            text={job.type.replace(/_/g, " ")}
            className="text-gray-600 dark:text-gray-400 capitalize"
          />

          {/* Experience Level */}
          <JobListingCardItem
            icon={TrendingUp}
            text={job.experienceLevel.replace(/_/g, " ")}
            className="text-gray-600 dark:text-gray-400 capitalize"
          />
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between pt-4 border-t border-gray-200 dark:border-gray-700">
          <div className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400">
            <Calendar className="w-4 h-4" />
            {job.postedAt ? (
              <span>Posted {formatDate(job.postedAt)}</span>
            ) : (
              <span>Created {formatDate(job.createdAt)}</span>
            )}
          </div>
          <Link
            href={`/employer/orgs/${job.organizationId}/all-jobs/${job.id}`}
            className="text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 font-medium text-sm"
          >
            Details →
          </Link>
        </div>
      </div>
    </div>
  );
}
