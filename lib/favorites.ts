import { getSupabaseClient } from "./supabaseClient";

export type FavoriteRow = {
  id: string;
  user_id: string;
  date: string; // YYYY-MM-DD
  lag: number; // 1-5
  note: string | null;
  created_at: string;
  updated_at: string;
};

export async function fetchFavoritesForMonth(params: { year: number; month: number; lag: 1 | 2 | 3 | 4 | 5 }) {
  const supabase = getSupabaseClient();

  const { year, month, lag } = params;
  const start = `${year}-${String(month).padStart(2, "0")}-01`;
  const endDate = new Date(year, month, 0);
  const end = `${year}-${String(month).padStart(2, "0")}-${String(endDate.getDate()).padStart(2, "0")}`;

  const { data, error } = await supabase
    .from("user_favorites")
    .select("id,date,lag,note,created_at,updated_at,user_id")
    .eq("lag", lag)
    .gte("date", start)
    .lte("date", end)
    .order("date", { ascending: true });

  if (error) throw error;
  return (data ?? []) as FavoriteRow[];
}

export async function fetchAllFavorites() {
  const supabase = getSupabaseClient();

  const { data, error } = await supabase
    .from("user_favorites")
    .select("id,date,lag,note,created_at,updated_at,user_id")
    .order("date", { ascending: true });

  if (error) throw error;
  return (data ?? []) as FavoriteRow[];
}

export async function toggleFavorite(params: { userId: string; dateStr: string; lag: 1 | 2 | 3 | 4 | 5 }) {
  const supabase = getSupabaseClient();

  const { userId, dateStr, lag } = params;

  const { data: existing, error: selectError } = await supabase
    .from("user_favorites")
    .select("id")
    .eq("date", dateStr)
    .eq("lag", lag)
    .maybeSingle();

  if (selectError) throw selectError;

  if (existing?.id) {
    const { error: deleteError } = await supabase.from("user_favorites").delete().eq("id", existing.id);
    if (deleteError) throw deleteError;
    return { isFavorite: false as const };
  }

  const { error: insertError } = await supabase.from("user_favorites").insert({
    user_id: userId,
    date: dateStr,
    lag,
    note: null,
  });

  if (insertError) throw insertError;
  return { isFavorite: true as const };
}

