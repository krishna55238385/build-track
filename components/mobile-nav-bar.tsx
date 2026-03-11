"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Receipt,
  Wallet,
  CalendarDays,
} from "lucide-react";
import { cn } from "@/lib/utils";

const items = [
  { href: "/dashboard", label: "Home", icon: LayoutDashboard },
  { href: "/dashboard/expenses", label: "Expenses", icon: Receipt },
  { href: "/dashboard/budget", label: "Budget", icon: Wallet },
  { href: "/dashboard/timeline", label: "Timeline", icon: CalendarDays },
] as const;

export function MobileNavBar() {
  const pathname = usePathname();

  return (
    <nav className="fixed inset-x-0 bottom-0 z-30 border-t border-border bg-background/70 backdrop-blur-xl md:hidden">
      <div className="mx-auto flex max-w-3xl items-center justify-between px-2 py-1.5 pb-[env(safe-area-inset-bottom)]">
        {items.map((item) => {
          const active =
            pathname === item.href ||
            (item.href === "/dashboard" && pathname === "/");

          const Icon = item.icon;

          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex flex-1 flex-col items-center gap-0.5 rounded-xl px-2 py-1.5 text-[11px] font-medium transition-colors",
                active
                  ? "text-primary"
                  : "text-muted-foreground hover:text-foreground"
              )}
            >
              <span
                className={cn(
                  "flex w-full max-w-[4.5rem] items-center justify-center rounded-full px-2 py-1",
                  active ? "bg-accent text-accent-foreground" : "text-inherit"
                )}
              >
                <Icon
                  className={cn(
                    "size-4",
                    active ? "text-accent-foreground" : "text-muted-foreground"
                  )}
                />
              </span>
              <span className={cn("truncate", active && "text-foreground")}>
                {item.label}
              </span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}

