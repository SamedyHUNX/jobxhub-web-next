import BrandLogo from "./BrandLogo";

export default function PageLoader({
  message = "Loading...",
  showLogo = true,
}: {
  message?: string;
  showLogo?: boolean;
}) {
  return (
    <div className="fixed inset-0 z-50 flex flex-col items-center justify-center">
      {/* Logo at top */}
      {showLogo && (
        <div className="absolute top-8">
          <BrandLogo />
        </div>
      )}

      {/* Loading spinner in center */}
      <div className="flex flex-col items-center gap-4">
        {/* Spinner */}
        <div className="relative w-16 h-16">
          <div className="absolute inset-0 border-4 border-gray-200 dark:border-gray-700 rounded-full"></div>
          <div className="absolute inset-0 border-4 border-blue-600 dark:border-blue-400 rounded-full border-t-transparent animate-spin"></div>
        </div>

        {/* Loading text */}
        <p className="text-gray-600 dark:text-gray-400 font-medium">
          {message}
        </p>
      </div>
    </div>
  );
}
