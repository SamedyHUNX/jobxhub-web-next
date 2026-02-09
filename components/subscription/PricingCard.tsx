import { SubscriptionButton } from "./SubscriptionButton";

interface PricingCardProps {
  title: string;
  price: number;
  description: string;
  features: string[];
  interval: "month" | "year";
  isPopular?: boolean;
}

export default function PricingCard({
  title,
  price,
  description,
  features,
  interval,
  isPopular = false,
  planName,
}: PricingCardProps & { planName: "Basic" | "Growth" | "Enterprise" }) {
  return (
    <div
      className={`w-full bg-white rounded-2xl border-4 ${
        isPopular ? "border-blue-500" : "border-purple-600"
      } p-8 shadow-lg relative hover:shadow-xl transition-shadow duration-300`}
    >
      {/* Popular Badge */}
      {isPopular && (
        <div className="absolute top-0 right-8 -translate-y-1/2 bg-blue-500 text-white px-4 py-1 rounded-full text-sm font-semibold">
          Popular
        </div>
      )}

      {/* Header */}
      <div className="mb-8">
        <h2 className="text-gray-900 text-2xl font-bold mb-2">{title}</h2>
        <p className="text-gray-600 text-base leading-relaxed mb-6">
          {description}
        </p>
        <div className="flex items-baseline gap-2">
          <span className="text-5xl font-bold text-gray-900">${price}</span>
          <span className="text-gray-500 text-xl">/{interval}</span>
        </div>
      </div>

      {/* SubscriptionButton Component */}
      <div className="mb-8">
        <SubscriptionButton planName={planName} interval={interval} />
      </div>

      {/* Divider */}
      <div className="border-t border-gray-200 mb-6"></div>

      {/* Features List */}
      <ul className="space-y-4">
        {features.map((feature, index) => (
          <li key={index} className="flex items-center gap-3">
            <div className="shrink-0">
              <svg
                className="w-5 h-5 text-green-500"
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
            <span className="text-gray-700 text-base">{feature}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}
