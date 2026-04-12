import type { Metadata } from "next";
import {
  PricingContainer,
  PricingPlans,
} from "@/features/subscriptions/components/pricing";
import { requireAuth } from "@/lib/auth-utils";

export const metadata: Metadata = {
  title: "pricing",
};

const Page = async () => {
  await requireAuth();

  return (
    <PricingContainer>
      <PricingPlans />
    </PricingContainer>
  );
};

export default Page;
