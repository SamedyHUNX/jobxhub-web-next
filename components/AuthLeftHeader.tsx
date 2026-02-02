export default function AuthLeftHeader({
  title,
  description,
}: {
  title: string;
  description?: string;
}) {
  return (
    <div className="space-y-2">
      <h1 className="text-4xl font-bold text-gray-900 dark:text-white tracking-tighter">
        {title}
      </h1>
      <p className="text-gray-600 dark:text-gray-400">{description}</p>
    </div>
  );
}
