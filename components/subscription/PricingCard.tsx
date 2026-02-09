interface PricingCardProps {
  title?: string;
  price?: number;
  description?: string;
  features?: readonly string[] | string[];
  buttonText?: string;
  onButtonClick?: () => void;
  isPopular?: boolean;
  interval?: string;
}

export default function PricingCard({
  title = "Free",
  price = 0,
  description = "Great for trying out Frames X component and templates.",
  features = [],
  buttonText = "Get Started",
  onButtonClick = () => {},
  isPopular = false,
  interval = "month",
}: PricingCardProps) {
  return (
    <div
      className={`w-full bg-white dark:bg-gray-800 rounded-2xl border-4 ${isPopular ? "border-blue-500 dark:border-blue-400" : "border-purple-600 dark:border-purple-500"} p-8 shadow-lg dark:shadow-gray-900/50 relative hover:shadow-xl dark:hover:shadow-gray-900/70 transition-shadow duration-300`}
    >
      {/* Popular Badge */}
      {isPopular && (
        <div className="absolute top-0 right-8 -translate-y-1/2 bg-blue-500 dark:bg-blue-600 text-white px-4 py-1 rounded-full text-sm font-semibold">
          Popular
        </div>
      )}

      {/* Header */}
      <div className="mb-8">
        <h2 className="text-gray-900 dark:text-white text-2xl font-bold mb-2">
          {title}
        </h2>
        <p className="text-gray-600 dark:text-gray-300 text-base leading-relaxed mb-6">
          {description}
        </p>
        <div className="flex items-baseline gap-2">
          <span className="text-5xl font-bold text-gray-900 dark:text-white">
            ${price}
          </span>
          <span className="text-gray-500 dark:text-gray-400 text-xl">
            /{interval}
          </span>
        </div>
      </div>

      {/* CTA Button */}
      <button
        onClick={onButtonClick}
        className={`w-full ${isPopular ? "bg-blue-600 hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600" : "bg-gray-900 hover:bg-gray-800 dark:bg-gray-700 dark:hover:bg-gray-600"} text-white text-lg font-semibold py-3 px-6 rounded-xl transition-colors duration-200 mb-8`}
      >
        {buttonText}
      </button>

      {/* Divider */}
      <div className="border-t border-gray-200 dark:border-gray-700 mb-6"></div>

      {/* Features List */}
      <ul className="space-y-4">
        {features.map((feature, index) => (
          <li key={index} className="flex items-center gap-3">
            <div className="flex-shrink-0">
              <svg
                className="w-5 h-5 text-green-500 dark:text-green-400"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path
                  fillRule="evenodd"
                  d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                  clipRule="evenodd"
                />
              </svg>
            </div>
            <span className="text-gray-700 dark:text-gray-200 text-base">
              {feature}
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
}
