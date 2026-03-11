import Link from "next/link";
import { PlusCircle } from "lucide-react";

export function NoProjectCTA() {
  return (
    <div className="flex flex-col items-center justify-center rounded-xl border border-dashed border-border bg-muted/30 p-12 text-center">
      <h2 className="text-xl font-semibold">No project yet</h2>
      <p className="mt-2 max-w-sm text-muted-foreground">
        Create your first construction project to start tracking expenses,
        budget, and timeline.
      </p>
      <Link
        href="/dashboard/new"
        className="mt-6 inline-flex h-9 items-center justify-center gap-2 rounded-lg bg-primary px-4 text-sm font-medium text-primary-foreground hover:bg-primary/80"
      >
        <PlusCircle className="size-5" />
        Create project
      </Link>
    </div>
  );
}
