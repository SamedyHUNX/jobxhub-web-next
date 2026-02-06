"use client";

import { useState, useMemo } from "react";
import { useJobListings } from "@/hooks/use-job-listings";
import {
  Search,
  Filter,
  MapPin,
  DollarSign,
  Briefcase,
  Calendar,
  TrendingUp,
  Building2,
  ChevronDown,
  Star,
} from "lucide-react";
import type { JobListing } from "@/types";
import Link from "next/link";
import { formatDate, formatWage } from "@/lib/formatter";
import PageLoader from "@/components/PageLoader";
import { Button } from "@/components/ui/button";
import JobListingCard from "@/components/job-listings/JobListingCard";

type SortOption = "newest" | "oldest" | "wage-high" | "wage-low" | "title";

type FilterType = {
  search: string;
  type: string[];
  locationRequirement: string[];
  experienceLevel: string[];
  status: string[];
  state: string[];
};

export default function AllJobsByOrgPage() {
  const { jobListings: allJobListings, isLoading } = useJobListings();

  const [sortBy, setSortBy] = useState<SortOption>("newest");
  const [showFilters, setShowFilters] = useState<boolean>(false);
  const [filters, setFilters] = useState<FilterType>({
    search: "",
    type: [],
    locationRequirement: [],
    experienceLevel: [],
    status: [],
    state: [],
  });

  // Extract unique filter values
  const filterOptions = useMemo(() => {
    if (!allJobListings) return null;

    return {
      types: [...new Set(allJobListings.map((job: JobListing) => job.type))],
      locationRequirements: [
        ...new Set(
          allJobListings.map((job: JobListing) => job.locationRequirement),
        ),
      ],
      experienceLevels: [
        ...new Set(
          allJobListings.map((job: JobListing) => job.experienceLevel),
        ),
      ],
      statuses: [
        ...new Set(allJobListings.map((job: JobListing) => job.status)),
      ],
      states: [
        ...new Set(
          allJobListings
            .map((job: JobListing) => job.stateAbbreviation)
            .filter(Boolean),
        ),
      ],
    };
  }, [allJobListings]);

  // Filter and sort jobs
  const filteredAndSortedJobs: JobListing[] = useMemo(() => {
    if (!allJobListings) return [];

    let filtered = allJobListings.filter((job: JobListing) => {
      // Search filter
      if (filters.search) {
        const searchLower = filters.search.toLowerCase();
        const matchesSearch =
          job.title.toLowerCase().includes(searchLower) ||
          job.description.toLowerCase().includes(searchLower) ||
          job.city?.toLowerCase().includes(searchLower);
        if (!matchesSearch) return false;
      }

      // Type filter
      if (filters.type.length > 0 && !filters.type.includes(job.type)) {
        return false;
      }

      // Location requirement filter
      if (
        filters.locationRequirement.length > 0 &&
        !filters.locationRequirement.includes(job.locationRequirement)
      ) {
        return false;
      }

      // Experience level filter
      if (
        filters.experienceLevel.length > 0 &&
        !filters.experienceLevel.includes(job.experienceLevel)
      ) {
        return false;
      }

      // Status filter
      if (filters.status.length > 0 && !filters.status.includes(job.status)) {
        return false;
      }

      // State filter
      if (
        filters.state.length > 0 &&
        job.stateAbbreviation &&
        !filters.state.includes(job.stateAbbreviation)
      ) {
        return false;
      }

      return true;
    });

    // Sort
    filtered.sort((a: JobListing, b: JobListing) => {
      switch (sortBy) {
        case "newest":
          return (
            new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
          );
        case "oldest":
          return (
            new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
          );
        case "wage-high":
          return (Number(b.wage) || 0) - (Number(a.wage) || 0);
        case "wage-low":
          return (Number(a.wage) || 0) - (Number(b.wage) || 0);
        case "title":
          return a.title.localeCompare(b.title);
        default:
          return 0;
      }
    });

    return filtered;
  }, [allJobListings, filters, sortBy]);

  const toggleFilter = (category: keyof FilterType, value: string) => {
    setFilters((prev) => {
      const current = prev[category] as string[];
      return {
        ...prev,
        [category]: current.includes(value)
          ? current.filter((v) => v !== value)
          : [...current, value],
      };
    });
  };

  const clearFilters = () => {
    setFilters({
      search: "",
      type: [],
      locationRequirement: [],
      experienceLevel: [],
      status: [],
      state: [],
    });
  };

  if (!allJobListings && isLoading) {
    return <PageLoader />;
  }

  const activeFilterCount =
    filters.type.length +
    filters.locationRequirement.length +
    filters.experienceLevel.length +
    filters.status.length +
    filters.state.length;

  return (
    <div className="min-h-screen w-full p-8 bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="mx-auto sm:px-6 lg:px-8 py-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">
                All Job Listings
              </h1>
              <p className="mt-2 text-gray-600">
                Manage and view all positions across your organization
              </p>
            </div>
            <div className="flex items-center gap-4">
              <div className="text-right">
                <p className="text-sm text-gray-500">Total Listings</p>
                <p className="text-2xl font-bold text-blue-600">
                  {allJobListings.length}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="mx-auto">
        {/* Search and Controls */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 mb-6">
          <div className="flex flex-col lg:flex-row gap-4">
            {/* Search */}
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                placeholder="Search by title, description, or location..."
                value={filters.search}
                onChange={(e) =>
                  setFilters((prev) => ({ ...prev, search: e.target.value }))
                }
                className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            {/* Sort */}
            <div className="relative">
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as SortOption)}
                className="appearance-none pl-4 pr-10 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white cursor-pointer"
              >
                <option value="newest">Newest First</option>
                <option value="oldest">Oldest First</option>
                <option value="wage-high">Highest Wage</option>
                <option value="wage-low">Lowest Wage</option>
                <option value="title">Title (A-Z)</option>
              </select>
              <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 pointer-events-none" />
            </div>

            {/* Filter Toggle */}
            <button
              onClick={() => setShowFilters(!showFilters)}
              className="px-4 py-2.5 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors flex items-center gap-2"
            >
              <Filter className="w-5 h-5" />
              Filters
              {activeFilterCount > 0 && (
                <span className="bg-blue-600 text-white text-xs rounded-full px-2 py-0.5">
                  {activeFilterCount}
                </span>
              )}
            </button>
          </div>

          {/* Filter Panel */}
          {showFilters && filterOptions && (
            <div className="mt-4 pt-4 border-t border-gray-200">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {/* Job Type */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Job Type
                  </label>
                  <div className="space-y-2">
                    {filterOptions.types.map((type) => (
                      <label key={type} className="flex items-center">
                        <input
                          type="checkbox"
                          checked={filters.type.includes(type)}
                          onChange={() => toggleFilter("type", type)}
                          className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                        />
                        <span className="ml-2 text-sm text-gray-700 capitalize">
                          {type.replace(/_/g, " ")}
                        </span>
                      </label>
                    ))}
                  </div>
                </div>

                {/* Location Requirement */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Location
                  </label>
                  <div className="space-y-2">
                    {filterOptions.locationRequirements.map((location) => (
                      <label key={location} className="flex items-center">
                        <input
                          type="checkbox"
                          checked={filters.locationRequirement.includes(
                            location,
                          )}
                          onChange={() =>
                            toggleFilter("locationRequirement", location)
                          }
                          className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                        />
                        <span className="ml-2 text-sm text-gray-700 capitalize">
                          {location.replace(/_/g, " ")}
                        </span>
                      </label>
                    ))}
                  </div>
                </div>

                {/* Experience Level */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Experience Level
                  </label>
                  <div className="space-y-2">
                    {filterOptions.experienceLevels.map((level) => (
                      <label key={level} className="flex items-center">
                        <input
                          type="checkbox"
                          checked={filters.experienceLevel.includes(level)}
                          onChange={() =>
                            toggleFilter("experienceLevel", level)
                          }
                          className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                        />
                        <span className="ml-2 text-sm text-gray-700 capitalize">
                          {level.replace(/_/g, " ")}
                        </span>
                      </label>
                    ))}
                  </div>
                </div>

                {/* Status */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Status
                  </label>
                  <div className="space-y-2">
                    {filterOptions.statuses.map((status) => (
                      <label key={status} className="flex items-center">
                        <input
                          type="checkbox"
                          checked={filters.status.includes(status)}
                          onChange={() => toggleFilter("status", status)}
                          className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                        />
                        <span className="ml-2 text-sm text-gray-700 capitalize">
                          {status}
                        </span>
                      </label>
                    ))}
                  </div>
                </div>

                {/* States */}
                {filterOptions.states.length > 0 && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      State
                    </label>
                    <div className="space-y-2 max-h-40 overflow-y-auto">
                      {filterOptions.states.map((state) => (
                        <label key={state} className="flex items-center">
                          <input
                            type="checkbox"
                            checked={filters.state.includes(state)}
                            onChange={() => toggleFilter("state", state)}
                            className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                          />
                          <span className="ml-2 text-sm text-gray-700">
                            {state}
                          </span>
                        </label>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {activeFilterCount > 0 && (
                <div className="mt-4 flex justify-end">
                  <Button
                    onClick={clearFilters}
                    className="text-sm text-blue-600 hover:text-blue-700 font-medium"
                  >
                    Clear all filters
                  </Button>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Results Count */}
        <div className="mb-4">
          <p className="text-sm text-gray-600">
            Showing {filteredAndSortedJobs.length} of {allJobListings.length}{" "}
            jobs
          </p>
        </div>

        {/* Job Listings Grid */}
        {filteredAndSortedJobs.length === 0 ? (
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-12 text-center">
            <Briefcase className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              No jobs found
            </h3>
            <p className="text-gray-600 mb-4">
              Try adjusting your filters or search terms
            </p>
            {activeFilterCount > 0 && (
              <button
                onClick={clearFilters}
                className="text-blue-600 hover:text-blue-700 font-medium"
              >
                Clear all filters
              </button>
            )}
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {filteredAndSortedJobs.map((job) => (
              <JobListingCard job={job} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
