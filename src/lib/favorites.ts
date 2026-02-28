import { supabase } from "@/integrations/supabase/client";

export type FavoriteRow = {
  id: string;
  user_id: string;
  date_str: string;
  team_num: number;
  note: string | null;
  created_at: string;
};

export async function fetchFavoritesForMonth(params: { year: number; month: number; lag: 1 | 2 | 3 | 4 | 5 }) {
  const { year, month, lag } = params;
  const start = `${year}-${String(month).padStart(2, "0")}-01`;
  const endDate = new Date(year, month, 0);
  const end = `${year}-${String(month).padStart(2, "0")}-${String(endDate.getDate()).padStart(2, "0")}`;

  const { data, error } = await supabase
    .from("user_favorites")
    .select("id, date_str, team_num, note, created_at, user_id")
    .eq("team_num", lag)
    .gte("date_str", start)
    .lte("date_str", end)
    .order("date_str", { ascending: true });

  if (error) throw error;
  return (data ?? []) as FavoriteRow[];
}

export async function fetchAllFavorites() {
  const { data, error } = await supabase
    .from("user_favorites")
    .select("id, date_str, team_num, note, created_at, user_id")
    .order("date_str", { ascending: true });

  if (error) throw error;
  return (data ?? []) as FavoriteRow[];
}

export async function toggleFavorite(params: { userId: string; dateStr: string; lag: 1 | 2 | 3 | 4 | 5 }) {
  const { userId, dateStr, lag } = params;

  const { data: existing, error: selectError } = await supabase
    .from("user_favorites")
    .select("id")
    .eq("date_str", dateStr)
    .eq("team_num", lag)
    .maybeSingle();

  if (selectError) throw selectError;

  if (existing?.id) {
    const { error: deleteError } = await supabase.from("user_favorites").delete().eq("id", existing.id);
    if (deleteError) throw deleteError;
    return { isFavorite: false as const };
  }

  const { error: insertError } = await supabase.from("user_favorites").insert({
    user_id: userId,
    date_str: dateStr,
    team_num: lag,
    note: null,
  });

  if (insertError) throw insertError;
  return { isFavorite: true as const };
}
