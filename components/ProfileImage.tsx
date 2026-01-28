import { ChangeEvent, useEffect, useRef } from "react";
import { Camera } from "lucide-react";

interface ProfileImageProps {
  value: string | File | null;
  onChange?: (file: File | null) => void;
  fallbackInitials?: string;
  label?: string;
  error?: string;
  size?: "sm" | "md" | "lg";
  editable?: boolean;
}

export default function ProfileImage({
  value,
  onChange,
  fallbackInitials = "",
  label = "Click to upload photo",
  error,
  size = "md",
  editable = true,
}: ProfileImageProps) {
  const objectUrlRef = useRef<string | null>(null);

  // Cleanup object URL on unmount or when image changes
  useEffect(() => {
    return () => {
      if (objectUrlRef.current) {
        URL.revokeObjectURL(objectUrlRef.current);
      }
    };
  }, []);

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (onChange) {
        onChange(file);
      }
    }
  };

  const getImageUrl = () => {
    if (!value) return null;

    if (typeof value === "string") {
      return value;
    }

    if (value instanceof File) {
      if (objectUrlRef.current) {
        URL.revokeObjectURL(objectUrlRef.current);
      }
      objectUrlRef.current = URL.createObjectURL(value);
      return objectUrlRef.current;
    }

    return null;
  };

  const imageUrl = getImageUrl();

  const sizeClasses = {
    sm: "w-16 h-16",
    md: "w-24 h-24",
    lg: "w-32 h-32",
  };

  const iconSizeClasses = {
    sm: "w-3 h-3",
    md: "w-4 h-4",
    lg: "w-5 h-5",
  };

  const buttonSizeClasses = {
    sm: "w-6 h-6",
    md: "w-8 h-8",
    lg: "w-10 h-10",
  };

  const textSizeClasses = {
    sm: "text-xl",
    md: "text-2xl",
    lg: "text-3xl",
  };

  return (
    <div className="flex flex-col items-center space-y-3">
      <div className="relative">
        <div
          className={`${sizeClasses[size]} rounded-full bg-gray-100 dark:bg-gray-700 border-2 border-dashed border-gray-300 dark:border-gray-600 flex items-center justify-center overflow-hidden`}
        >
          {imageUrl ? (
            <img
              src={imageUrl}
              alt="Profile preview"
              className="w-full h-full object-cover"
            />
          ) : fallbackInitials ? (
            <div
              className={`${textSizeClasses[size]} font-semibold text-gray-600 dark:text-gray-300`}
            >
              {fallbackInitials}
            </div>
          ) : (
            <svg
              className="w-10 h-10 text-gray-400 dark:text-gray-500"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
              />
            </svg>
          )}
        </div>

        {editable && (
          <div>
            <label
              htmlFor="image-upload"
              className={`absolute bottom-0 right-0 bg-blue-600 hover:bg-blue-700 text-white rounded-full ${buttonSizeClasses[size]} cursor-pointer shadow-lg transition-colors flex items-center justify-center`}
            >
              {<Camera className={iconSizeClasses[size]} />}
            </label>
            <input
              id="image-upload"
              type="file"
              accept="image/*"
              className="hidden"
              onChange={handleFileChange}
            />
          </div>
        )}
      </div>
      {label && (
        <p className="text-sm text-gray-500 dark:text-gray-400">{label}</p>
      )}
      {error && <p className="text-sm text-red-500">{error}</p>}
    </div>
  );
}
