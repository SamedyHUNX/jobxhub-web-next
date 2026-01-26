export default function FormFooter({ name = "JobXHub" }) {
  return (
    <div className="mt-12 pt-8 border-t border-gray-200">
      <div className="flex items-center justify-center gap-2 text-gray-500">
        <span>Secured by</span>
        <span className="text-gray-900 font-semibold">{name}</span>
      </div>
    </div>
  );
}
