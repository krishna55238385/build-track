export function SetupRequired() {
  const apiLink =
    "https://supabase.com/dashboard/project/_/settings/api";

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-background p-6">
      <div className="w-full max-w-md space-y-6 rounded-xl border border-border bg-card p-8 text-card-foreground shadow-sm">
        <div>
          <h1 className="text-xl font-semibold">Supabase setup required</h1>
          <p className="mt-2 text-sm text-muted-foreground">
            BuildTrack AI needs a Supabase project to store projects, expenses,
            and timeline data. Add your project URL and anon key to continue.
          </p>
        </div>

        <ol className="list-inside list-decimal space-y-3 text-sm">
          <li>
            Create a project at{" "}
            <a
              href="https://supabase.com"
              target="_blank"
              rel="noopener noreferrer"
              className="text-primary underline underline-offset-2"
            >
              supabase.com
            </a>
            .
          </li>
          <li>
            In the SQL Editor, run the migration from{" "}
            <code className="rounded bg-muted px-1.5 py-0.5 text-xs">
              supabase/migrations/001_schema.sql
            </code>
            .
          </li>
          <li>
            Open your project’s{" "}
            <a
              href={apiLink}
              target="_blank"
              rel="noopener noreferrer"
              className="text-primary underline underline-offset-2"
            >
              API settings
            </a>{" "}
            and copy the Project URL and anon public key.
          </li>
          <li>
            In this app’s root, create a file{" "}
            <code className="rounded bg-muted px-1.5 py-0.5 text-xs">
              .env.local
            </code>{" "}
            with:
            <pre className="mt-2 overflow-x-auto rounded-lg border border-border bg-muted/50 p-3 text-xs">
              {`NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key`}
            </pre>
          </li>
          <li>Restart the dev server (<code className="rounded bg-muted px-1.5 py-0.5 text-xs">npm run dev</code>).</li>
        </ol>

        <p className="text-xs text-muted-foreground">
          See the project README for optional Telegram and n8n configuration.
        </p>
      </div>
    </div>
  );
}
