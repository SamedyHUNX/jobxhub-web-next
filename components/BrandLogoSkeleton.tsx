export default function BrandLogoSkeleton({
  className,
}: {
  className?: string;
}) {
  return (
    <div className={className}>
      <div className="flex flex-row items-center gap-2.5">
        {/* Logo skeleton */}
        <div className="w-9 h-9 bg-gray-200 dark:bg-gray-700 rounded-md animate-pulse" />

        {/* Text skeleton */}
        <div className="relative overflow-hidden">
          <div className="h-8 w-32 bg-gray-200 dark:bg-gray-700 rounded animate-pulse" />
        </div>
      </div>
    </div>
  );
}
