export const PAYMENT_LINKS = {
  premium: import.meta.env.VITE_STRIPE_PAYMENT_LINK_PREMIUM ?? "https://buy.stripe.com/9B67sM4mV0Xb1T15tx7Vm06",
  swipe: import.meta.env.VITE_STRIPE_PAYMENT_LINK_SWIPE ?? "https://buy.stripe.com/00wcN6dXveO1fJR5tx7Vm07",
  bundle: import.meta.env.VITE_STRIPE_PAYMENT_LINK_BUNDLE ?? "https://buy.stripe.com/00geVe06FgW9gNVcVZ7Vm05",
} as const;

export interface PricingPlan {
  id: "premium" | "swipe" | "bundle";
  name: string;
  price: string;
  description: string;
  link: string;
  mostPopular?: boolean;
}

export const PRICING_PLANS: PricingPlan[] = [
  {
    id: "premium",
    name: "Premium",
    price: "39 kr/mån",
    description: "Gruppchatt för skift, spara scheman, annonsfri, notiser",
    link: PAYMENT_LINKS.premium,
  },
  {
    id: "swipe",
    name: "Premium Swipe",
    price: "69 kr/mån",
    description: "Allt i Premium + swipe på kollegor (kön, företag, nära mig)",
    link: PAYMENT_LINKS.swipe,
    mostPopular: true,
  },
  {
    id: "bundle",
    name: "🎁 Bästa dealen",
    price: "108 kr/mån",
    description: "Båda planerna - spara 0 kr!",
    link: PAYMENT_LINKS.bundle,
  },
];
