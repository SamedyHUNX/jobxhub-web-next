import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Check } from "lucide-react";
import { ReactNode } from "react";

interface PricingCardProps {
  title?: string;
  price?: number;
  description?: string;
  features?: readonly string[] | string[];
  buttonText?: string;
  buttonComponent?: ReactNode;
  isPopular?: boolean;
  interval?: string;
}

export default function PricingCard({
  title = "Free",
  price = 0,
  description = "Great for trying out Frames X component and templates.",
  features = [],
  buttonText = "Get Started",
  buttonComponent,
  isPopular = false,
  interval = "month",
}: PricingCardProps) {
  return (
    <Card
      className={`relative w-full ${isPopular ? "border-primary shadow-lg" : ""}`}
    >
      {isPopular && (
        <Badge className="absolute -top-3 right-8" variant="default">
          Popular
        </Badge>
      )}

      <CardHeader>
        <CardTitle className="text-2xl">{title}</CardTitle>
        <CardDescription className="text-base leading-relaxed">
          {description}
        </CardDescription>
      </CardHeader>

      <CardContent className="space-y-6">
        <div className="flex items-baseline gap-2">
          <span className="text-5xl font-bold">${price}</span>
          <span className="text-xl text-muted-foreground">/{interval}</span>
        </div>

        {buttonComponent && <div className="pt-4">{buttonComponent}</div>}

        <div className="border-t pt-6">
          <ul className="space-y-3">
            {features.map((feature, index) => (
              <li key={index} className="flex items-center gap-3">
                <Check className="h-5 w-5 shrink-0 text-green-500" />
                <span className="text-base">{feature}</span>
              </li>
            ))}
          </ul>
        </div>
      </CardContent>
    </Card>
  );
}
