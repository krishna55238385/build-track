"use client";

import { usePathname } from "next/navigation";
import Link from "next/link";
import {
  LayoutDashboard,
  Receipt,
  Wallet,
  CalendarDays,
  MessageSquare,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useProject } from "@/lib/project-context";

const nav = [
  { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { href: "/dashboard/expenses", label: "Expenses", icon: Receipt },
  { href: "/dashboard/budget", label: "Budget", icon: Wallet },
  { href: "/dashboard/timeline", label: "Timeline", icon: CalendarDays },
];

export function AppSidebar({ className }: { className?: string }) {
  const pathname = usePathname();
  const { project } = useProject();

  return (
    <aside
      className={cn(
        "flex w-56 flex-col border-r border-border bg-card/70 text-card-foreground backdrop-blur-xl",
        className
      )}
    >
      <div className="flex h-14 items-center border-b border-border px-4">
        <Link href="/dashboard" className="flex items-center gap-2 font-semibold">
          <span className="text-primary">BuildTrack</span>
          <span className="text-muted-foreground">AI</span>
        </Link>
      </div>
      {project && (
        <div className="border-b border-border px-4 py-3">
          <p className="text-xs font-medium text-muted-foreground">
            Current project
          </p>
          <p className="truncate text-sm font-medium">{project.name}</p>
        </div>
      )}
      <nav className="flex flex-1 flex-col gap-1 p-2">
        {nav.map((item) => {
          const active = pathname === item.href;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "relative flex items-center gap-3 rounded-lg px-3 py-2 text-muted-foreground transition-colors hover:bg-accent hover:text-accent-foreground",
                active && "bg-accent text-accent-foreground"
              )}
            >
              {active && (
                <span className="absolute left-0 top-1/2 h-5 w-1 -translate-y-1/2 rounded-r-full bg-primary" />
              )}
              <item.icon className="size-5 shrink-0" />
              {item.label}
            </Link>
          );
        })}
      </nav>
      <div className="border-t border-border p-2">
        <a
          href="https://t.me/YourBuildTrackBot"
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-3 rounded-lg px-3 py-2 text-muted-foreground transition-colors hover:bg-accent hover:text-accent-foreground"
        >
          <MessageSquare className="size-5" />
          Telegram Bot
        </a>
      </div>
    </aside>
  );
}
