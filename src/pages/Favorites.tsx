import React, { useEffect, useMemo, useState } from "react";
import { useAuth } from "../components/AuthProvider";
import { fetchAllFavorites, type FavoriteRow } from "@/lib/favorites";

export default function Favorites() {
  const { configured, user } = useAuth();
  const [rows, setRows] = useState<FavoriteRow[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;

    if (!configured || !user) {
      setRows([]);
      return;
    }

    setLoading(true);
    setError(null);
    fetchAllFavorites()
      .then((data) => {
        if (cancelled) return;
        setRows(data);
      })
      .catch(() => {
        if (cancelled) return;
        setError("Kunde inte ladda favoriter.");
      })
      .finally(() => {
        if (cancelled) return;
        setLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, [configured, user]);

  const grouped = useMemo(() => {
    const byMonth = new Map<string, FavoriteRow[]>();
    for (const r of rows) {
      const key = r.date_str.slice(0, 7);
      byMonth.set(key, [...(byMonth.get(key) ?? []), r]);
    }
    return Array.from(byMonth.entries()).sort(([a], [b]) => a.localeCompare(b));
  }, [rows]);

  return (
    <div className="rounded-2xl border border-slate-800 bg-slate-900/40 p-4">
      <h1 className="text-base font-semibold text-slate-100">Favoriter</h1>
      {!configured ? (
        <p className="mt-2 text-sm text-slate-300">Backend är inte konfigurerat ännu.</p>
      ) : !user ? (
        <p className="mt-2 text-sm text-slate-300">Logga in för att se och spara favoriter.</p>
      ) : (
        <>
          <div className="mt-2 text-xs text-slate-400">{loading ? "Laddar…" : `${rows.length} favorit(er)`}</div>
          {error ? (
            <div className="mt-3 rounded-xl border border-slate-800 bg-slate-950/40 px-3 py-2 text-xs text-slate-200">
              {error}
            </div>
          ) : null}

          <div className="mt-4 space-y-4">
            {grouped.length === 0 && !loading ? (
              <div className="text-sm text-slate-300">Inga favoriter än.</div>
            ) : null}

            {grouped.map(([ym, items]) => (
              <div key={ym} className="rounded-2xl border border-slate-800 bg-slate-950/30 p-3">
                <div className="text-xs font-semibold text-slate-200">{ym}</div>
                <ul className="mt-2 space-y-2">
                  {items.map((r) => (
                    <li key={r.id} className="flex items-center justify-between text-sm text-slate-100">
                      <span className="tabular-nums">{r.date_str}</span>
                      <span className="rounded-lg bg-slate-900/60 px-2 py-0.5 text-xs text-slate-200">
                        Lag {r.team_num}
                      </span>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
}
