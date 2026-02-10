"use client";

import { SubscriptionButton } from "@/components/subscription/SubscriptionButton";
import { useState } from "react";

export default function PricingPage() {
  const [interval, setInterval] = useState<"month" | "year">("month");

  return (
    <div className="container mx-auto py-12 px-4">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold mb-4">Choose Your Plan</h1>
        <p className="text-gray-600 mb-8">Start your 14-day free trial today</p>

        {/* Billing Toggle */}
        <div className="inline-flex items-center gap-4 bg-gray-100 p-1 rounded-lg">
          <button
            onClick={() => setInterval("month")}
            className={`px-6 py-2 rounded-md transition ${
              interval === "month"
                ? "bg-white shadow text-blue-600"
                : "text-gray-600"
            }`}
          >
            Monthly
          </button>
          <button
            onClick={() => setInterval("year")}
            className={`px-6 py-2 rounded-md transition ${
              interval === "year"
                ? "bg-white shadow text-blue-600"
                : "text-gray-600"
            }`}
          >
            Yearly
            <span className="ml-2 text-xs text-green-600">Save 20%</span>
          </button>
        </div>
      </div>

      <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
        {/* Pro Plan */}
        <div className="border-2 rounded-xl p-8 hover:border-blue-500 transition">
          <h2 className="text-2xl font-bold mb-2">Pro</h2>
          <div className="mb-6">
            <span className="text-4xl font-bold">
              ${interval === "month" ? "29" : "279"}
            </span>
            <span className="text-gray-600">
              /{interval === "month" ? "month" : "year"}
            </span>
          </div>
          <ul className="space-y-3 mb-8">
            <li className="flex items-center gap-2">
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
              Unlimited projects
            </li>
            <li className="flex items-center gap-2">
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
              Priority support
            </li>
            <li className="flex items-center gap-2">
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
              Advanced analytics
            </li>
          </ul>
          <SubscriptionButton planName="Basic" interval={interval} />
        </div>

        {/* Enterprise Plan */}
        <div className="border-2 border-blue-500 rounded-xl p-8 relative">
          <div className="absolute top-0 right-8 -translate-y-1/2 bg-blue-500 text-white px-4 py-1 rounded-full text-sm">
            Popular
          </div>
          <h2 className="text-2xl font-bold mb-2">Enterprise</h2>
          <div className="mb-6">
            <span className="text-4xl font-bold">
              ${interval === "month" ? "99" : "949"}
            </span>
            <span className="text-gray-600">
              /{interval === "month" ? "month" : "year"}
            </span>
          </div>
          <ul className="space-y-3 mb-8">
            <li className="flex items-center gap-2">
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
              Everything in Pro
            </li>
            <li className="flex items-center gap-2">
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
              Dedicated support
            </li>
            <li className="flex items-center gap-2">
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
              Custom integrations
            </li>
            <li className="flex items-center gap-2">
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
              SLA guarantee
            </li>
          </ul>
          <SubscriptionButton planName="Enterprise" interval={interval} />
        </div>
      </div>
    </div>
  );
}
