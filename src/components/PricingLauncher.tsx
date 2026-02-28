import React, { lazy, Suspense, useState } from "react";

const PricingSection = lazy(() => import("./PricingSection").then((m) => ({ default: m.PricingSection })));

export function PricingLauncher() {
  const [open, setOpen] = useState(false);

  return (
    <div className="space-y-3">
      <div className="rounded-2xl border border-slate-800 bg-slate-900/40 p-4">
        <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
          <div>
            <div className="text-sm font-semibold text-slate-100">Premium</div>
            <div className="mt-1 text-xs text-slate-300">
              Köp via Stripe Payment Links. Prislistan laddas först när du klickar.
            </div>
          </div>

          <button
            type="button"
            className="h-10 rounded-xl bg-emerald-400 px-4 text-sm font-semibold text-slate-950 hover:bg-emerald-300"
            onClick={() => setOpen((v) => !v)}
          >
            {open ? "Dölj" : "Visa priser & köp"}
          </button>
        </div>
      </div>

      {open ? (
        <Suspense
          fallback={
            <div className="rounded-3xl border border-slate-800 bg-slate-950/30 p-6 text-sm text-slate-300">
              Laddar prislista…
            </div>
          }
        >
          <PricingSection />
        </Suspense>
      ) : null}
    </div>
  );
}
