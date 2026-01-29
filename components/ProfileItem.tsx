export default function ProfileItem({
  title,
  value,
}: {
  title: string;
  value: any;
}) {
  return (
    <div className="flex justify-between items-center">
      <span className="text-sm text-gray-600 dark:text-gray-400">{title}</span>
      <span className="text-sm text-gray-900 dark:text-white">{value}</span>
    </div>
  );
}
