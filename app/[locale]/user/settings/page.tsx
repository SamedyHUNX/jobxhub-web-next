"use client";

import { useState } from "react";
import { Camera } from "lucide-react";
import { useProfile } from "@/hooks/use-profile";
import PageLoader from "@/components/PageLoader";

export default function UserSettingsPage() {
  const { profile: currentUser } = useProfile();
  const [isEditing, setIsEditing] = useState(false);

  if (!currentUser) {
    return <PageLoader />;
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  return (
    <div className="flex-1 overflow-y-auto bg-white dark:bg-black">
      <div className="max-w-7xl mx-auto p-8">
        <h1 className="text-4xl font-sans font-semibold text-gray-900 dark:text-white mb-10">
          Profile details
        </h1>

        {/* Profile Section */}
        <div className="border-b border-gray-200 dark:border-gray-700 pb-8">
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-6">
              <div className="relative">
                <div className="w-20 h-20 rounded-full bg-gray-200 dark:bg-gray-700 overflow-hidden">
                  {currentUser.imageUrl ? (
                    <img
                      src={currentUser.imageUrl}
                      alt={`${currentUser.firstName} ${currentUser.lastName}`}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-2xl font-semibold text-gray-600 dark:text-gray-300">
                      {currentUser.firstName?.[0]}
                      {currentUser.lastName?.[0]}
                    </div>
                  )}
                </div>
                <button className="absolute bottom-0 right-0 w-6 h-6 bg-white dark:bg-gray-700 rounded-full shadow-md border border-gray-200 dark:border-gray-600 flex items-center justify-center hover:bg-gray-50 dark:hover:bg-gray-600 transition-colors">
                  <Camera className="w-3.5 h-3.5 text-gray-600 dark:text-gray-300" />
                </button>
              </div>
              <div>
                <label className="block text-sm text-gray-600 dark:text-gray-400 mb-1">
                  Profile
                </label>
                <p className="text-lg font-medium text-gray-900 dark:text-white mb-1">
                  {currentUser.firstName} {currentUser.lastName}
                </p>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  @{currentUser.username}
                </p>
              </div>
            </div>
            <button
              onClick={() => setIsEditing(!isEditing)}
              className="px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
            >
              Update profile
            </button>
          </div>
        </div>

        {/* Email Addresses Section */}
        <div className="border-b border-gray-200 dark:border-gray-700 py-8">
          <label className="block text-sm font-medium text-gray-900 dark:text-white mb-4">
            Email addresses
          </label>
          <div className="space-y-3">
            <div className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
              <span className="text-gray-900 dark:text-white">
                {currentUser.email}
              </span>
              <span className="text-xs text-gray-500 dark:text-gray-400 bg-gray-200 dark:bg-gray-600 px-2 py-1 rounded">
                Primary
              </span>
            </div>
          </div>
        </div>

        {/* Phone Number Section */}
        <div className="border-b border-gray-200 dark:border-gray-700 py-8">
          <label className="block text-sm font-medium text-gray-900 dark:text-white mb-4">
            Phone number
          </label>
          <div className="space-y-3">
            {currentUser.phoneNumber ? (
              <div className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
                <span className="text-gray-900 dark:text-white">
                  {currentUser.phoneNumber}
                </span>
                <span className="text-xs text-gray-500 dark:text-gray-400 bg-gray-200 dark:bg-gray-600 px-2 py-1 rounded">
                  Verified
                </span>
              </div>
            ) : (
              <div className="text-sm text-gray-600 dark:text-gray-400">
                No phone number added
              </div>
            )}
          </div>
        </div>

        {/* Date of Birth Section */}
        <div className="border-b border-gray-200 dark:border-gray-700 py-8">
          <label className="block text-sm font-medium text-gray-900 dark:text-white mb-4">
            Date of birth
          </label>
          <div className="p-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
            <span className="text-gray-900 dark:text-white">
              {formatDate(currentUser.dateOfBirth)}
            </span>
          </div>
        </div>

        {/* Username Section */}
        <div className="border-b border-gray-200 dark:border-gray-700 py-8">
          <label className="block text-sm font-medium text-gray-900 dark:text-white mb-4">
            Username
          </label>
          <div className="p-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
            <span className="text-gray-900 dark:text-white">
              {currentUser.username}
            </span>
          </div>
        </div>

        {/* Account Information Section */}
        <div className="py-8">
          <label className="block text-sm font-medium text-gray-900 dark:text-white mb-4">
            Account information
          </label>
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600 dark:text-gray-400">
                Account type
              </span>
              <span className="text-sm text-gray-900 dark:text-white">
                {currentUser.userRole}
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600 dark:text-gray-400">
                Member since
              </span>
              <span className="text-sm text-gray-900 dark:text-white">
                {formatDate(currentUser.createdAt)}
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600 dark:text-gray-400">
                Last updated
              </span>
              <span className="text-sm text-gray-900 dark:text-white">
                {formatDate(currentUser.updatedAt)}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
