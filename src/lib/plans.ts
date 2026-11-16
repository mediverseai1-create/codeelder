export type PlanId = "free" | "solo" | "pro" | "max";

export interface Plan {
  id: PlanId;
  name: string;
  price: number;
  credits: number;
  tagline: string;
  features: string[];
  tasks: boolean;
  maxPlaybooks: number;
  premiumModel: boolean;
  link: string;
}

// NEXT_PUBLIC_* must be referenced statically so Next can inline them.
export const PLANS: Record<PlanId, Plan> = {
  free: {
    id: "free", name: "Starter", price: 0, credits: 20,
    tagline: "Try CodeElder on real code.",
    features: ["20 credits per month", "Assistant chat", "Code reviews", "1 playbook"],
    tasks: false, maxPlaybooks: 1, premiumModel: false, link: "",
  },
  solo: {
    id: "solo", name: "Solo", price: 47, credits: 600,
    tagline: "For independent developers.",
    features: ["600 credits per month", "Assistant chat", "Code reviews", "5 playbooks", "Review history"],
    tasks: false, maxPlaybooks: 5, premiumModel: false,
    link: process.env.NEXT_PUBLIC_PAYLINK_SOLO || "https://selar.com/47plan?currency=USD",
  },
  pro: {
    id: "pro", name: "Pro", price: 57, credits: 2000,
    tagline: "For shipping developers.",
    features: ["2,000 credits per month", "Everything in Solo", "Task planner with patches", "Unlimited playbooks"],
    tasks: true, maxPlaybooks: 1000, premiumModel: false,
    link: process.env.NEXT_PUBLIC_PAYLINK_PRO || "https://selar.com/57plan?currency=USD",
  },
  max: {
    id: "max", name: "Max", price: 97, credits: 6000,
    tagline: "For heavy, daily use.",
    features: ["6,000 credits per month", "Everything in Pro", "Premium reasoning model", "Priority support"],
    tasks: true, maxPlaybooks: 1000, premiumModel: true,
    link: process.env.NEXT_PUBLIC_PAYLINK_MAX || "",
  },
};

export const PAID_PLANS: PlanId[] = ["solo", "pro", "max"];
export const CREDIT_COST = { chat: 1, review: 3, task: 5 } as const;
export type UsageKind = keyof typeof CREDIT_COST;

export function planByPrice(amount: number): PlanId | null {
  const hit = PAID_PLANS.find((p) => PLANS[p].price === Math.round(amount));
  return hit ?? null;
}
