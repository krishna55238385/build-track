import { createClient } from "@/lib/supabase/server";
import type { BudgetCategory } from "@/lib/types";

export async function getBudgetCategories(
  projectId: string
): Promise<BudgetCategory[]> {
  const supabase = await createClient();
  if (!supabase) return [];
  const { data, error } = await supabase
    .from("budget_categories")
    .select("*")
    .eq("project_id", projectId)
    .order("category");
  if (error) return [];
  return (data ?? []) as BudgetCategory[];
}

export async function getSpentByCategory(
  projectId: string
): Promise<Record<string, number>> {
  const supabase = await createClient();
  if (!supabase) return {};
  const { data, error } = await supabase
    .from("expenses")
    .select("category, amount")
    .eq("project_id", projectId);
  if (error) return {};
  const out: Record<string, number> = {};
  for (const row of data ?? []) {
    const cat = (row as { category: string; amount: number }).category;
    out[cat] = (out[cat] ?? 0) + Number((row as { amount: number }).amount);
  }
  return out;
}
