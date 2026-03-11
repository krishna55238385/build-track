"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Save, Plus } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { createClient } from "@/lib/supabase/client";
import type { BudgetCategory } from "@/lib/types";

function formatCurrency(amount: number) {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(amount);
}

export function BudgetCategoriesEditor({
  projectId,
  spentByCategory,
  existingBudgets,
}: {
  projectId: string;
  spentByCategory: Record<string, number>;
  existingBudgets: BudgetCategory[];
}) {
  const router = useRouter();
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [newCategory, setNewCategory] = useState("");
  const [newBudget, setNewBudget] = useState("");

  const existingMap = useMemo(() => {
    const m = new Map<string, number>();
    for (const b of existingBudgets) m.set(b.category, Number(b.budget_amount));
    return m;
  }, [existingBudgets]);

  const allCategories = useMemo(() => {
    const set = new Set<string>();
    for (const c of Object.keys(spentByCategory)) set.add(c);
    for (const b of existingBudgets) set.add(b.category);
    return Array.from(set).sort((a, b) => a.localeCompare(b));
  }, [spentByCategory, existingBudgets]);

  const [drafts, setDrafts] = useState<Record<string, string>>({});

  function getBudgetDraft(cat: string) {
    const draft = drafts[cat];
    if (draft != null) return draft;
    const existing = existingMap.get(cat);
    return existing == null ? "" : String(existing);
  }

  async function upsertBudget(category: string, budgetAmount: number) {
    const supabase = createClient();
    const { error: upsertError } = await supabase.from("budget_categories").upsert(
      {
        project_id: projectId,
        category,
        budget_amount: budgetAmount,
      },
      { onConflict: "project_id,category" }
    );
    return upsertError ?? null;
  }

  async function handleSaveRow(cat: string) {
    setSaving(true);
    setError(null);
    const draft = getBudgetDraft(cat);
    const budgetAmount = Number(draft);
    if (!Number.isFinite(budgetAmount) || budgetAmount < 0) {
      setSaving(false);
      setError("Budget must be a valid non-negative number.");
      return;
    }
    const err = await upsertBudget(cat, budgetAmount);
    setSaving(false);
    if (err) {
      setError(err.message);
      toast.error("Failed to save budget");
      return;
    }
    toast.success("Budget saved");
    router.refresh();
  }

  async function handleAddCategory() {
    const cat = newCategory.trim();
    if (!cat) return;
    setSaving(true);
    setError(null);
    const budgetAmount = newBudget.trim() === "" ? 0 : Number(newBudget);
    if (!Number.isFinite(budgetAmount) || budgetAmount < 0) {
      setSaving(false);
      setError("Budget must be a valid non-negative number.");
      return;
    }
    const err = await upsertBudget(cat, budgetAmount);
    setSaving(false);
    if (err) {
      setError(err.message);
      toast.error("Failed to add category");
      return;
    }
    toast.success("Category added");
    setNewCategory("");
    setNewBudget("");
    router.refresh();
  }

  return (
    <div className="space-y-4">
      <div className="rounded-lg border border-border bg-muted/20 p-3">
        <div className="grid gap-3 md:grid-cols-3">
          <div className="md:col-span-1">
            <label className="text-sm font-medium">New category</label>
            <Input
              placeholder="e.g. Labour"
              value={newCategory}
              onChange={(e) => setNewCategory(e.target.value)}
            />
          </div>
          <div className="md:col-span-1">
            <label className="text-sm font-medium">Budget (₹)</label>
            <Input
              type="number"
              step="0.01"
              placeholder="0"
              value={newBudget}
              onChange={(e) => setNewBudget(e.target.value)}
            />
          </div>
          <div className="md:col-span-1 flex items-end">
            <Button onClick={handleAddCategory} disabled={saving}>
              <Plus className="mr-2 size-4" />
              Add category
            </Button>
          </div>
        </div>
      </div>

      {error && (
        <Alert variant="destructive">
          <AlertTitle>Couldn’t save</AlertTitle>
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      <div className="rounded-xl border border-border">
        <div className="hidden grid-cols-5 gap-2 border-b border-border bg-muted/30 px-3 py-2 text-xs font-medium text-muted-foreground sm:grid">
          <div className="col-span-2">Category</div>
          <div>Spent</div>
          <div>Budget</div>
          <div />
        </div>
        <div className="divide-y divide-border">
          {allCategories.map((cat) => {
            const spent = spentByCategory[cat] ?? 0;
            const budgetStr = getBudgetDraft(cat);
            const budgetNum = budgetStr === "" ? null : Number(budgetStr);
            const remaining =
              budgetNum == null || !Number.isFinite(budgetNum)
                ? null
                : Math.max(0, budgetNum - spent);

            return (
              <div
                key={cat}
                className="grid gap-2 px-3 py-3 text-sm sm:grid-cols-5 sm:items-center"
              >
                <div className="sm:col-span-2">
                  <p className="truncate font-medium">{cat}</p>
                  <p className="mt-1 text-xs text-muted-foreground sm:hidden">
                    Spent: {formatCurrency(spent)}
                  </p>
                </div>
                <div className="hidden text-sm sm:block">
                  {formatCurrency(spent)}
                </div>
                <div>
                  <Input
                    type="number"
                    step="0.01"
                    value={budgetStr}
                    placeholder="Set budget"
                    onChange={(e) =>
                      setDrafts((d) => ({ ...d, [cat]: e.target.value }))
                    }
                  />
                  {remaining != null && (
                    <p className="mt-1 text-xs text-muted-foreground">
                      Remaining: {formatCurrency(remaining)}
                    </p>
                  )}
                </div>
                <div className="flex justify-end sm:col-span-1">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleSaveRow(cat)}
                    disabled={saving}
                  >
                    <Save className="mr-2 size-4" />
                    Save
                  </Button>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      <p className="text-xs text-muted-foreground">
        Budgets are stored in <code>budget_categories</code> and are used to
        calculate Remaining and Progress.
      </p>
    </div>
  );
}

