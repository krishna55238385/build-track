"use client";

import { useRouter } from "next/navigation";
import { AppSidebar } from "@/components/app-sidebar";
import { ProjectProvider, useProject } from "@/lib/project-context";
import type { Project } from "@/lib/types";
import { cn } from "@/lib/utils";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Menu } from "lucide-react";
import { MobileNavBar } from "@/components/mobile-nav-bar";

function DashboardShellInner({
  children,
  projects,
  initialProject,
}: {
  children: React.ReactNode;
  projects: Project[];
  initialProject: Project | null;
}) {
  const { project, setProject } = useProject();
  const current = project ?? initialProject;

  return (
    <div className="flex min-h-screen">
      <AppSidebar className="fixed left-0 top-0 z-30 hidden h-screen md:flex" />

      <main className="flex-1 md:pl-56">
        <header className="sticky top-0 z-20 flex h-14 items-center gap-3 border-b border-border bg-background/70 px-4 backdrop-blur-xl md:px-6">
          <Sheet>
            <SheetTrigger asChild>
              <Button
                variant="outline"
                size="icon"
                className="md:hidden"
                aria-label="Open menu"
              >
                <Menu className="size-4" />
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="w-72 p-0">
              <AppSidebar className="h-full w-full border-r-0" />
            </SheetContent>
          </Sheet>

          <div className="flex min-w-0 flex-1 items-center justify-between gap-3">
            {projects.length > 0 && (
              <select
                value={current?.id ?? ""}
                onChange={(e) => {
                  const p =
                    projects.find((x) => x.id === e.target.value) ?? null;
                  setProject(p);
                }}
                className="w-full max-w-[18rem] truncate rounded-lg border border-input bg-transparent px-3 py-2 text-sm font-medium"
              >
                {projects.map((p) => (
                  <option key={p.id} value={p.id}>
                    {p.name}
                  </option>
                ))}
              </select>
            )}
          </div>
        </header>

        <div className="p-4 pb-24 md:p-6 md:pb-6">
          <div className="mx-auto w-full max-w-6xl">{children}</div>
        </div>

        {/* Mobile bottom tab bar */}
        <MobileNavBar />
      </main>
    </div>
  );
}

export function DashboardShell({
  children,
  projects,
  initialProject,
}: {
  children: React.ReactNode;
  projects: Project[];
  initialProject: Project | null;
}) {
  return (
    <ProjectProvider initialProject={initialProject}>
      <DashboardShellInner
        projects={projects}
        initialProject={initialProject}
      >
        {children}
      </DashboardShellInner>
    </ProjectProvider>
  );
}
