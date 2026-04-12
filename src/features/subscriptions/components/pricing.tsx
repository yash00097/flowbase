"use client";

import { CheckIcon, StarIcon } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { FREE_TIER_LIMITS } from "@/config/constants";
import { useHasActiveSubscription } from "@/features/subscriptions/hooks/use-subscription";
import { authClient } from "@/lib/auth-client";
import { cn } from "@/lib/utils";

type Plan = {
  name: string;
  price: string;
  priceSuffix?: string;
  description: string;
  features: string[];
  highlight?: boolean;
};

const plans: Plan[] = [
  {
    name: "Free",
    price: "$0",
    priceSuffix: "/month",
    description: "Get started and explore the platform.",
    features: [
      `Up to ${FREE_TIER_LIMITS.workflows} workflows`,
      `${FREE_TIER_LIMITS.executionsPerMonth} executions per month`,
      "All node types",
      "Community support",
    ],
  },
  {
    name: "Pro",
    price: "$10",
    priceSuffix: "/month",
    description: "For teams running production automations.",
    features: [
      "Unlimited workflows",
      "Unlimited executions",
      "All node types",
      "Priority support",
    ],
    highlight: true,
  },
];

export const PricingHeader = () => {
  return (
    <div className="flex flex-col">
      <h1 className="text-lg md:text-xl font-semibold">Pricing</h1>
      <p className="text-xs md:text-sm text-muted-foreground">
        Compare plans and pick the one that fits your workflow.
      </p>
    </div>
  );
};

export const PricingPlans = () => {
  const { hasActiveSubscription, isLoading } = useHasActiveSubscription();

  return (
    <div className="grid gap-4 md:grid-cols-2">
      {plans.map((plan) => {
        const isPro = plan.name === "Pro";
        const isCurrent = isPro
          ? hasActiveSubscription
          : !hasActiveSubscription;

        return (
          <Card
            key={plan.name}
            className={cn(
              "p-6 shadow-none",
              plan.highlight && "border-primary",
            )}
          >
            <CardHeader className="p-0">
              <div className="flex items-center justify-between">
                <CardTitle className="text-base font-medium">
                  {plan.name}
                </CardTitle>
                {!isLoading && isCurrent && (
                  <Badge variant="secondary">Current plan</Badge>
                )}
              </div>
              <CardDescription className="text-xs">
                {plan.description}
              </CardDescription>
              <div className="flex items-baseline gap-1 pt-2">
                <span className="text-2xl font-semibold">{plan.price}</span>
                {plan.priceSuffix && (
                  <span className="text-xs text-muted-foreground">
                    {plan.priceSuffix}
                  </span>
                )}
              </div>
            </CardHeader>
            <CardContent className="p-0 pt-4">
              <ul className="flex flex-col gap-y-2">
                {plan.features.map((feature) => (
                  <li
                    key={feature}
                    className="flex items-center gap-x-2 text-sm"
                  >
                    <CheckIcon className="size-4 text-primary" />
                    <span>{feature}</span>
                  </li>
                ))}
              </ul>
            </CardContent>
            {isPro && (
              <CardFooter className="p-0 pt-6">
                <Button
                  className="w-full"
                  size="sm"
                  disabled={isLoading || hasActiveSubscription}
                  onClick={() => authClient.checkout({ slug: "pro" })}
                >
                  <StarIcon className="size-4" />
                  {hasActiveSubscription ? "You are on Pro" : "Upgrade to Pro"}
                </Button>
              </CardFooter>
            )}
          </Card>
        );
      })}
    </div>
  );
};

export const PricingContainer = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  return (
    <div className="p-4 md:px-10 md:py-6 h-full">
      <div className="mx-auto max-w-4xl w-full flex flex-col h-full gap-y-8">
        <PricingHeader />
        {children}
      </div>
    </div>
  );
};
