import { getProjects } from "@/lib/data/projects";
import { getConstructionPhases } from "@/lib/data/phases";
import { NoProjectCTA } from "@/components/no-project-cta";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { CheckCircle2, Circle, Loader2 } from "lucide-react";

export default async function TimelinePage() {
  const projects = await getProjects();
  const initialProject = projects[0] ?? null;

  if (projects.length === 0) {
    return <NoProjectCTA />;
  }

  const phases = await getConstructionPhases(initialProject!.id);

  return (
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">
            Construction timeline
          </h1>
          <p className="text-muted-foreground">
            Track phases and progress of your construction project.
          </p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Phases</CardTitle>
            <p className="text-sm text-muted-foreground">
              Update status and dates as work progresses.
            </p>
          </CardHeader>
          <CardContent>
            {phases.length === 0 ? (
              <p className="text-muted-foreground">
                No phases added yet. Create a project with phases or add them
                in project settings (coming soon).
              </p>
            ) : (
              <ul className="space-y-4">
                {phases.map((phase, i) => (
                  <li
                    key={phase.id}
                    className="flex items-start gap-4 border-b border-border pb-4 last:border-0 last:pb-0"
                  >
                    <div className="mt-1 flex size-10 shrink-0 items-center justify-center rounded-full border-2 border-border">
                      {phase.status === "completed" ? (
                        <CheckCircle2 className="size-5 text-emerald-600" />
                      ) : phase.status === "in_progress" ? (
                        <Loader2 className="size-5 animate-spin text-primary" />
                      ) : (
                        <Circle className="size-5 text-muted-foreground" />
                      )}
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-2">
                        <span className="font-medium">{phase.phase_name}</span>
                        <Badge
                          variant={
                            phase.status === "completed"
                              ? "default"
                              : phase.status === "in_progress"
                                ? "secondary"
                                : "outline"
                          }
                        >
                          {phase.status.replace("_", " ")}
                        </Badge>
                      </div>
                      <div className="mt-1 flex flex-wrap gap-4 text-sm text-muted-foreground">
                        {phase.start_date && (
                          <span>Start: {phase.start_date}</span>
                        )}
                        {phase.expected_end && (
                          <span>Expected: {phase.expected_end}</span>
                        )}
                        {phase.actual_end && (
                          <span>Done: {phase.actual_end}</span>
                        )}
                      </div>
                      {phase.notes && (
                        <p className="mt-2 text-sm">{phase.notes}</p>
                      )}
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </CardContent>
        </Card>
      </div>
  );
}
