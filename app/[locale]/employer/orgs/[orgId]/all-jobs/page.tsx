"use client";

import { useState, useMemo } from "react";
import { useJobListings } from "@/hooks/use-job-listings";
import { Search, Filter, Briefcase } from "lucide-react";
import type {
  ExperienceLevel,
  JobListing,
  JobListingStatus,
  JobListingType,
  LocationRequirement,
} from "@/types";
import PageLoader from "@/components/PageLoader";
import { Button } from "@/components/ui/button";
import JobListingCard from "@/components/job-listings/JobListingCard";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Checkbox } from "@/components/ui/checkbox";
import { useOrgs } from "@/hooks/use-orgs";

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
  const { selectedOrgId } = useOrgs();
  const { jobListings: allJobListings, isLoading } = useJobListings({
    organizationId: selectedOrgId,
  });

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
    <div className="min-h-screen w-full p-8 bg-background">
      {/* Header */}
      <Card className="mb-6">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-3xl">All Job Listings</CardTitle>
              <CardDescription className="mt-2">
                Manage and view all positions across your organization
              </CardDescription>
            </div>
            <div className="text-right">
              <p className="text-sm text-muted-foreground">Total Listings</p>
              <p className="text-2xl font-bold text-primary">
                {allJobListings.length}
              </p>
            </div>
          </div>
        </CardHeader>
      </Card>

      <div className="mx-auto">
        {/* Search and Controls */}
        <Card className="mb-6">
          <CardContent className="pt-6">
            <div className="flex flex-col lg:flex-row gap-4">
              {/* Search */}
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input
                  type="text"
                  placeholder="Search by title, description, or location..."
                  value={filters.search}
                  onChange={(e) =>
                    setFilters((prev) => ({ ...prev, search: e.target.value }))
                  }
                  className="pl-9"
                />
              </div>

              {/* Sort */}
              <Select
                value={sortBy}
                onValueChange={(value) => setSortBy(value as SortOption)}
              >
                <SelectTrigger className="w-45">
                  <SelectValue placeholder="Sort by" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="newest">Newest First</SelectItem>
                  <SelectItem value="oldest">Oldest First</SelectItem>
                  <SelectItem value="wage-high">Highest Wage</SelectItem>
                  <SelectItem value="wage-low">Lowest Wage</SelectItem>
                  <SelectItem value="title">Title (A-Z)</SelectItem>
                </SelectContent>
              </Select>

              {/* Filter Toggle */}
              <Button
                variant="outline"
                onClick={() => setShowFilters(!showFilters)}
                className="gap-2"
              >
                <Filter className="w-4 h-4" />
                Filters
                {activeFilterCount > 0 && (
                  <Badge variant="default" className="ml-1">
                    {activeFilterCount}
                  </Badge>
                )}
              </Button>
            </div>

            {/* Filter Panel */}
            {showFilters && filterOptions && (
              <>
                <Separator className="my-4" />
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {/* Job Type */}
                  <div className="space-y-3">
                    <Label className="text-sm font-medium">Job Type</Label>
                    <div className="space-y-2">
                      {(filterOptions.types as JobListingType[]).map((type) => (
                        <div key={type} className="flex items-center space-x-2">
                          <Checkbox
                            id={`type-${type}`}
                            checked={filters.type.includes(type)}
                            onCheckedChange={() => toggleFilter("type", type)}
                          />
                          <Label
                            htmlFor={`type-${type}`}
                            className="text-sm font-normal cursor-pointer capitalize"
                          >
                            {type.replace(/_/g, " ")}
                          </Label>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Location Requirement */}
                  <div className="space-y-3">
                    <Label className="text-sm font-medium">Location</Label>
                    <div className="space-y-2">
                      {(
                        filterOptions.locationRequirements as LocationRequirement[]
                      ).map((location) => (
                        <div
                          key={location}
                          className="flex items-center space-x-2"
                        >
                          <Checkbox
                            id={`location-${location}`}
                            checked={filters.locationRequirement.includes(
                              location,
                            )}
                            onCheckedChange={() =>
                              toggleFilter("locationRequirement", location)
                            }
                          />
                          <Label
                            htmlFor={`location-${location}`}
                            className="text-sm font-normal cursor-pointer capitalize"
                          >
                            {location.replace(/_/g, " ")}
                          </Label>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Experience Level */}
                  <div className="space-y-3">
                    <Label className="text-sm font-medium">
                      Experience Level
                    </Label>
                    <div className="space-y-2">
                      {(
                        filterOptions.experienceLevels as ExperienceLevel[]
                      ).map((level) => (
                        <div
                          key={level}
                          className="flex items-center space-x-2"
                        >
                          <Checkbox
                            id={`experience-${level}`}
                            checked={filters.experienceLevel.includes(level)}
                            onCheckedChange={() =>
                              toggleFilter("experienceLevel", level)
                            }
                          />
                          <Label
                            htmlFor={`experience-${level}`}
                            className="text-sm font-normal cursor-pointer capitalize"
                          >
                            {level.replace(/_/g, " ")}
                          </Label>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Status */}
                  <div className="space-y-3">
                    <Label className="text-sm font-medium">Status</Label>
                    <div className="space-y-2">
                      {(filterOptions.statuses as JobListingStatus[]).map(
                        (status) => (
                          <div
                            key={status}
                            className="flex items-center space-x-2"
                          >
                            <Checkbox
                              id={`status-${status}`}
                              checked={filters.status.includes(status)}
                              onCheckedChange={() =>
                                toggleFilter("status", status)
                              }
                            />
                            <Label
                              htmlFor={`status-${status}`}
                              className="text-sm font-normal cursor-pointer capitalize"
                            >
                              {status}
                            </Label>
                          </div>
                        ),
                      )}
                    </div>
                  </div>

                  {/* States */}
                  {filterOptions.states.length > 0 && (
                    <div className="space-y-3">
                      <Label className="text-sm font-medium">State</Label>
                      <div className="space-y-2 max-h-40 overflow-y-auto">
                        {(filterOptions.states as string[]).map((state) => (
                          <div
                            key={state}
                            className="flex items-center space-x-2"
                          >
                            <Checkbox
                              id={`state-${state}`}
                              checked={filters.state.includes(state)}
                              onCheckedChange={() =>
                                toggleFilter("state", state)
                              }
                            />
                            <Label
                              htmlFor={`state-${state}`}
                              className="text-sm font-normal cursor-pointer"
                            >
                              {state}
                            </Label>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>

                {activeFilterCount > 0 && (
                  <div className="mt-6 flex justify-end">
                    <Button
                      variant="ghost"
                      onClick={clearFilters}
                      className="text-sm"
                    >
                      Clear all filters
                    </Button>
                  </div>
                )}
              </>
            )}
          </CardContent>
        </Card>

        {/* Results Count */}
        <div className="mb-4">
          <p className="text-sm text-muted-foreground">
            Showing {filteredAndSortedJobs.length} of {allJobListings.length}{" "}
            jobs
          </p>
        </div>

        {/* Job Listings Grid */}
        {filteredAndSortedJobs.length === 0 ? (
          <Card>
            <CardContent className="flex flex-col items-center justify-center py-12">
              <Briefcase className="w-12 h-12 text-muted-foreground mb-4" />
              <h3 className="text-lg font-medium mb-2">No jobs found</h3>
              <p className="text-muted-foreground mb-4">
                Try adjusting your filters or search terms
              </p>
              {activeFilterCount > 0 && (
                <Button variant="link" onClick={clearFilters}>
                  Clear all filters
                </Button>
              )}
            </CardContent>
          </Card>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {filteredAndSortedJobs.map((job) => (
              <JobListingCard key={job.id} job={job} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
