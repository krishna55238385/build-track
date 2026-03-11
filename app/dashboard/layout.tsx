import { getProjects } from "@/lib/data/projects";
import { isSupabaseConfigured } from "@/lib/supabase/server";
import { DashboardShell } from "@/components/dashboard-shell";
import { SetupRequired } from "@/components/setup-required";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  if (!isSupabaseConfigured()) {
    return <SetupRequired />;
  }

  const projects = await getProjects();
  const initialProject = projects[0] ?? null;

  return (
    <DashboardShell projects={projects} initialProject={initialProject}>
      {children}
    </DashboardShell>
  );
}
