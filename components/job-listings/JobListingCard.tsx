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

export default function JobListingCard({ job }: { job: JobListing }) {
  return (
    <div
      key={job.id}
      className="bg-white rounded-lg shadow-sm border border-gray-200 hover:shadow-md transition-shadow overflow-hidden"
    >
      <div className="p-6">
        {/* Header */}
        <div className="flex items-start justify-between mb-4">
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-2">
              <h3 className="text-xl font-semibold text-gray-900">
                {job.title}
              </h3>
              {job.isFeatured && (
                <Star className="w-5 h-5 text-yellow-500 fill-yellow-500" />
              )}
            </div>
            <div className="flex items-center gap-2 text-sm text-gray-600">
              <Building2 className="w-4 h-4" />
              <span>Organization ID: {job.organizationId}</span>
            </div>
          </div>
          <span
            className={`px-3 py-1 rounded-full text-xs font-medium ${
              job.status === "published"
                ? "bg-green-100 text-green-800"
                : job.status === "draft"
                  ? "bg-gray-100 text-gray-800"
                  : "bg-yellow-100 text-yellow-800"
            }`}
          >
            {job.status}
          </span>
        </div>

        {/* Description */}
        <p className="text-gray-700 mb-4 line-clamp-2">{job.description}</p>

        {/* Details Grid */}
        <div className="grid grid-cols-2 gap-4 mb-4">
          {/* Location */}
          <div className="flex items-start gap-2">
            <MapPin className="w-4 h-4 text-gray-400 mt-0.5 shrink-0" />
            <div className="text-sm">
              <p className="text-gray-600 capitalize">
                {job.locationRequirement.replace(/_/g, " ")}
              </p>
              {job.city && job.stateAbbreviation && (
                <p className="text-gray-500">
                  {job.city}, {job.stateAbbreviation}
                </p>
              )}
            </div>
          </div>

          {/* Wage */}
          <div className="flex items-start gap-2">
            <DollarSign className="w-4 h-4 text-gray-400 mt-0.5 shrink-0" />
            <div className="text-sm">
              <p className="text-gray-900 font-medium">
                {formatWage(job.wage, job.wageInterval)}
              </p>
            </div>
          </div>

          {/* Job Type */}
          <div className="flex items-start gap-2">
            <Briefcase className="w-4 h-4 text-gray-400 mt-0.5 shrink-0" />
            <div className="text-sm">
              <p className="text-gray-600 capitalize">
                {job.type.replace(/_/g, " ")}
              </p>
            </div>
          </div>

          {/* Experience Level */}
          <div className="flex items-start gap-2">
            <TrendingUp className="w-4 h-4 text-gray-400 mt-0.5 shrink-0" />
            <div className="text-sm">
              <p className="text-gray-600 capitalize">
                {job.experienceLevel.replace(/_/g, " ")}
              </p>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between pt-4 border-t border-gray-200">
          <div className="flex items-center gap-2 text-sm text-gray-500">
            <Calendar className="w-4 h-4" />
            {job.postedAt ? (
              <span>Posted {formatDate(job.postedAt)}</span>
            ) : (
              <span>Created {formatDate(job.createdAt)}</span>
            )}
          </div>
          <Link
            href={`/employer/orgs/${job.organizationId}/all-jobs/${job.id}`}
            className="text-blue-600 hover:text-blue-700 font-medium text-sm"
          >
            Details →
          </Link>
        </div>
      </div>
    </div>
  );
}
