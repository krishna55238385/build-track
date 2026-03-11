import { createClient } from "@/lib/supabase/server";
import type { ConstructionPhase } from "@/lib/types";

export async function getConstructionPhases(
  projectId: string
): Promise<ConstructionPhase[]> {
  const supabase = await createClient();
  if (!supabase) return [];
  const { data, error } = await supabase
    .from("construction_phases")
    .select("*")
    .eq("project_id", projectId)
    .order("sort_order", { ascending: true })
    .order("created_at", { ascending: true });
  if (error) return [];
  return (data ?? []) as ConstructionPhase[];
}
