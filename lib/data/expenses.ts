import { createClient } from "@/lib/supabase/server";
import type { Expense } from "@/lib/types";

export async function getExpenses(projectId: string): Promise<Expense[]> {
  const supabase = await createClient();
  if (!supabase) return [];
  const { data, error } = await supabase
    .from("expenses")
    .select("*")
    .eq("project_id", projectId)
    .order("date", { ascending: false })
    .order("created_at", { ascending: false });
  if (error) return [];
  return (data ?? []) as Expense[];
}

export async function getRecentExpenses(
  projectId: string,
  limit = 10
): Promise<Expense[]> {
  const supabase = await createClient();
  if (!supabase) return [];
  const { data, error } = await supabase
    .from("expenses")
    .select("*")
    .eq("project_id", projectId)
    .order("date", { ascending: false })
    .order("created_at", { ascending: false })
    .limit(limit);
  if (error) return [];
  return (data ?? []) as Expense[];
}

export async function getTotalSpent(projectId: string): Promise<number> {
  const supabase = await createClient();
  if (!supabase) return 0;
  const { data, error } = await supabase
    .from("expenses")
    .select("amount")
    .eq("project_id", projectId);
  if (error) return 0;
  return (data ?? []).reduce((sum, row) => sum + Number(row.amount), 0);
}
