import Link from "next/link";
import { Receipt, Wallet, CalendarDays, TrendingUp } from "lucide-react";
import { getProjects } from "@/lib/data/projects";
import { getRecentExpenses, getTotalSpent } from "@/lib/data/expenses";
import { getConstructionPhases } from "@/lib/data/phases";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { NoProjectCTA } from "@/components/no-project-cta";
import { Progress } from "@/components/ui/progress";

function formatCurrency(amount: number) {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(amount);
}

export default async function DashboardPage() {
  const projects = await getProjects();
  const initialProject = projects[0] ?? null;

  if (projects.length === 0) {
    return <NoProjectCTA />;
  }

  const projectId = initialProject!.id;
  const [recentExpenses, phases, projectTotalSpent] = await Promise.all([
    getRecentExpenses(projectId, 8),
    getConstructionPhases(projectId),
    getTotalSpent(projectId),
  ]);

  const remaining = Math.max(0, initialProject!.budget - projectTotalSpent);
  const spentPct =
    initialProject!.budget > 0
      ? Math.min(100, (projectTotalSpent / initialProject!.budget) * 100)
      : 0;
  const currentPhase = phases.find((p) => p.status === "in_progress") ?? phases[0];

  return (
      <div className="space-y-8">
        <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <h1 className="text-2xl font-semibold tracking-tight">
              Project overview
            </h1>
            <p className="text-muted-foreground">
              Budget, expenses, and construction progress at a glance
            </p>
          </div>
          <div className="flex flex-wrap gap-2">
            <Link
              href="/dashboard/expenses"
              className="inline-flex h-9 items-center justify-center gap-2 rounded-lg border border-input bg-background px-4 text-sm font-medium hover:bg-muted"
            >
              <Receipt className="size-4" />
              Add / view expenses
            </Link>
            <Link
              href="/dashboard/budget"
              className="inline-flex h-9 items-center justify-center gap-2 rounded-lg bg-primary px-4 text-sm font-medium text-primary-foreground hover:bg-primary/80"
            >
              <Wallet className="size-4" />
              Set budgets
            </Link>
          </div>
        </div>

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Total budget
              </CardTitle>
              <Wallet className="size-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-bold">
                {formatCurrency(initialProject!.budget)}
              </p>
              <p className="mt-1 text-sm text-muted-foreground">
                Plan by categories in Budget
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Total spent
              </CardTitle>
              <Receipt className="size-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-bold">
                {formatCurrency(projectTotalSpent)}
              </p>
              <div className="mt-3">
                <div className="flex items-center justify-between text-xs text-muted-foreground">
                  <span>Budget used</span>
                  <span>{Math.round(spentPct)}%</span>
                </div>
                <Progress value={spentPct} className="mt-2 h-2" />
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Remaining
              </CardTitle>
              <TrendingUp className="size-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-bold text-emerald-600 dark:text-emerald-400">
                {formatCurrency(remaining)}
              </p>
              <p className="mt-1 text-sm text-muted-foreground">
                Based on total project budget
              </p>
            </CardContent>
          </Card>
        </div>

        <div className="grid gap-6 lg:grid-cols-2">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle>Recent expenses</CardTitle>
              <Link
                href="/dashboard/expenses"
                className="inline-flex h-7 items-center gap-1 rounded-lg border border-transparent px-2.5 text-sm font-medium transition-colors hover:bg-accent hover:text-accent-foreground"
              >
                View all <Receipt className="ml-1 size-4" />
              </Link>
            </CardHeader>
            <CardContent>
              {recentExpenses.length === 0 ? (
                <p className="text-muted-foreground">
                  No expenses yet. Add one manually or via Telegram.
                </p>
              ) : (
                <ul className="space-y-3">
                  {recentExpenses.map((e) => (
                    <li
                      key={e.id}
                      className="flex flex-col gap-2 border-b border-border pb-3 last:border-0 sm:flex-row sm:items-center sm:justify-between"
                    >
                      <div>
                        <p className="font-medium">{e.category}</p>
                        <p className="text-sm text-muted-foreground">
                          {e.paid_to && `${e.paid_to} · `}
                          {e.date}
                        </p>
                      </div>
                      <span className="font-medium">
                        {formatCurrency(e.amount)}
                      </span>
                    </li>
                  ))}
                </ul>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle>Construction phase</CardTitle>
              <Link
                href="/dashboard/timeline"
                className="inline-flex h-7 items-center gap-1 rounded-lg border border-transparent px-2.5 text-sm font-medium transition-colors hover:bg-accent hover:text-accent-foreground"
              >
                Timeline <CalendarDays className="ml-1 size-4" />
              </Link>
            </CardHeader>
            <CardContent>
              {currentPhase ? (
                <div>
                  <Badge
                    variant={
                      currentPhase.status === "completed"
                        ? "default"
                        : currentPhase.status === "in_progress"
                          ? "secondary"
                          : "outline"
                    }
                  >
                    {currentPhase.status.replace("_", " ")}
                  </Badge>
                  <p className="mt-2 font-medium">{currentPhase.phase_name}</p>
                  {currentPhase.expected_end && (
                    <p className="text-sm text-muted-foreground">
                      Expected: {currentPhase.expected_end}
                    </p>
                  )}
                </div>
              ) : (
                <p className="text-muted-foreground">
                  No phases added. Set up your timeline.
                </p>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
  );
}
