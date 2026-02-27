"use client";

import React, { useMemo, useState } from "react";
import { PRICING_PLANS } from "@lib/pricing";

export function PricingSection() {
  const plans = useMemo(() => PRICING_PLANS, []);
  const [clicked, setClicked] = useState<string | null>(null);

  return (
    <section className="rounded-3xl border border-slate-800 bg-gradient-to-br from-slate-900/40 to-slate-950/30 p-5 md:p-8">
      <div className="mb-6 text-center">
        <h2 className="text-2xl font-bold tracking-tight text-slate-50 md:text-3xl">Välj din plan</h2>
        <p className="mt-2 text-sm text-slate-300 md:text-base">
          Säkra betalningar med kort, Apple Pay &amp; Google Pay via Stripe.
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-3 md:gap-6">
        {plans.map((plan) => {
          const isBusy = clicked === plan.id;

          return (
            <div
              key={plan.id}
              className={`relative overflow-hidden rounded-3xl border p-5 transition md:p-6 ${
                plan.mostPopular
                  ? "border-emerald-400/40 bg-emerald-400/5 shadow-[0_0_0_1px_rgba(16,185,129,0.12)]"
                  : "border-slate-800 bg-slate-950/30 hover:border-slate-700"
              }`}
            >
              {plan.mostPopular ? (
                <div className="absolute right-4 top-4 rounded-full bg-emerald-400/15 px-3 py-1 text-[11px] font-semibold text-emerald-200">
                  Mest populär
                </div>
              ) : null}

              <div className="text-center">
                <h3 className="text-lg font-semibold text-slate-100 md:text-xl">{plan.name}</h3>
                <div className="mt-3 text-3xl font-bold text-slate-50 md:text-4xl">{plan.price}</div>
                <p className="mt-3 text-sm leading-relaxed text-slate-300">{plan.description}</p>
              </div>

              <button
                type="button"
                className={`mt-5 w-full rounded-2xl px-4 py-3 text-sm font-semibold transition disabled:opacity-60 ${
                  plan.mostPopular
                    ? "bg-emerald-400 text-slate-950 hover:bg-emerald-300"
                    : "bg-slate-100 text-slate-950 hover:bg-white"
                }`}
                disabled={isBusy}
                onClick={() => {
                  setClicked(plan.id);
                  // Viktigt för mobil: navigera direkt på klick (ingen extra Stripe-laddning).
                  window.location.assign(plan.link);
                }}
              >
                {isBusy ? "Öppnar…" : `Köp ${plan.name}`}
              </button>

              <div className="mt-3 text-center text-[11px] text-slate-400">
                Öppnas i Stripe Checkout (Payment Link).
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}

