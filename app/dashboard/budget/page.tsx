import { getProjects } from "@/lib/data/projects";
import { getBudgetCategories, getSpentByCategory } from "@/lib/data/budget";
import { getTotalSpent } from "@/lib/data/expenses";
import { NoProjectCTA } from "@/components/no-project-cta";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { BudgetCategoriesEditor } from "./budget-categories-editor";

function formatCurrency(amount: number) {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(amount);
}

export default async function BudgetPage() {
  const projects = await getProjects();
  const initialProject = projects[0] ?? null;

  if (projects.length === 0) {
    return <NoProjectCTA />;
  }

  const projectId = initialProject!.id;
  const [categories, spentByCategory, totalSpent] = await Promise.all([
    getBudgetCategories(projectId),
    getSpentByCategory(projectId),
    getTotalSpent(projectId),
  ]);

  const projectBudget = initialProject!.budget ?? 0;
  const remainingOverall = Math.max(0, projectBudget - totalSpent);
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">Budget</h1>
        <p className="text-muted-foreground">
          Track spending by category against your planned budget.
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Total budget
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold">{formatCurrency(projectBudget)}</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Total spent
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold">{formatCurrency(totalSpent)}</p>
            <p className="mt-1 text-sm text-muted-foreground">
              Remaining: {formatCurrency(remainingOverall)}
            </p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>By category</CardTitle>
          <p className="text-sm text-muted-foreground">
            Set a budget per category to see remaining amount and progress.
          </p>
        </CardHeader>
        <CardContent>
          <BudgetCategoriesEditor
            projectId={projectId}
            spentByCategory={spentByCategory}
            existingBudgets={categories}
          />
        </CardContent>
      </Card>
    </div>
  );
}
