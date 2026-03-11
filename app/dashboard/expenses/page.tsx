import { getProjects } from "@/lib/data/projects";
import { getExpenses } from "@/lib/data/expenses";
import { NoProjectCTA } from "@/components/no-project-cta";
import { ExpensesPageClient } from "./expenses-page-client";

export default async function ExpensesPage() {
  const projects = await getProjects();
  const initialProject = projects[0] ?? null;

  if (projects.length === 0) {
    return <NoProjectCTA />;
  }

  const expenses = await getExpenses(initialProject!.id);

  return (
    <ExpensesPageClient
      projectId={initialProject!.id}
      initialExpenses={expenses}
    />
  );
}
