"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { createClient } from "@/lib/supabase/client";
import { DEFAULT_PHASES } from "@/lib/types";

export function CreateProjectForm() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [name, setName] = useState("");
  const [location, setLocation] = useState("");
  const [budget, setBudget] = useState("");
  const [startDate, setStartDate] = useState("");
  const [expectedCompletion, setExpectedCompletion] = useState("");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!name.trim()) return;
    setLoading(true);
    setError(null);
    const supabase = createClient();
    const { data: project, error: projectError } = await supabase
      .from("projects")
      .insert({
        name: name.trim(),
        location: location.trim() || null,
        budget: parseFloat(budget) || 0,
        start_date: startDate || null,
        expected_completion: expectedCompletion || null,
      })
      .select("id")
      .single();

    if (projectError || !project) {
      setLoading(false);
      const message =
        projectError?.code === "42501"
          ? "Permission denied. Run the development migration in Supabase (see README): supabase/migrations/002_allow_anon_dev.sql"
          : projectError?.message ?? "Could not create project. Try again.";
      setError(message);
      return;
    }

    // Seed default construction phases
    const { error: phasesError } = await supabase
      .from("construction_phases")
      .insert(
        DEFAULT_PHASES.map((phase_name, i) => ({
          project_id: project.id,
          phase_name,
          status: "pending",
          sort_order: i,
        }))
      );

    if (phasesError) {
      setLoading(false);
      setError(
        phasesError.code === "42501"
          ? "Project created but phases failed (permission denied). Run supabase/migrations/002_allow_anon_dev.sql"
          : phasesError.message ?? "Project created but phases failed."
      );
      return;
    }

    setLoading(false);
    router.push("/dashboard");
    router.refresh();
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Project details</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">Project name</Label>
            <Input
              id="name"
              placeholder="e.g. Home construction - Chennai"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="location">Location</Label>
            <Input
              id="location"
              placeholder="City / address"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="budget">Total budget (₹)</Label>
            <Input
              id="budget"
              type="number"
              step="0.01"
              placeholder="0"
              value={budget}
              onChange={(e) => setBudget(e.target.value)}
            />
          </div>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="start_date">Start date</Label>
              <Input
                id="start_date"
                type="date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="expected_completion">Expected completion</Label>
              <Input
                id="expected_completion"
                type="date"
                value={expectedCompletion}
                onChange={(e) => setExpectedCompletion(e.target.value)}
              />
            </div>
          </div>
          {error && (
            <div
              role="alert"
              className="rounded-lg border border-destructive/50 bg-destructive/10 px-3 py-2 text-sm text-destructive"
            >
              {error}
            </div>
          )}
          <div className="flex gap-2 pt-4">
            <Button type="submit" disabled={loading}>
              {loading ? "Creating…" : "Create project"}
            </Button>
            <Link
              href="/dashboard"
              className="inline-flex h-9 items-center justify-center rounded-lg border border-input bg-background px-4 text-sm font-medium hover:bg-muted"
            >
              Cancel
            </Link>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
