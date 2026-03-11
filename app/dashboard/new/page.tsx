import { getProjects } from "@/lib/data/projects";
import { CreateProjectForm } from "@/components/create-project-form";

export default async function NewProjectPage() {
  const projects = await getProjects();
  const initialProject = projects[0] ?? null;

  return (
    <div className="mx-auto max-w-xl space-y-6">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">Create project</h1>
        <p className="text-muted-foreground">
          Add a new construction project to track expenses and timeline.
        </p>
      </div>
      <CreateProjectForm />
    </div>
  );
}
