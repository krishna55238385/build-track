"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { AddExpenseDialog } from "@/components/add-expense-dialog";
import type { Expense } from "@/lib/types";
import { Plus } from "lucide-react";

function formatCurrency(amount: number) {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(amount);
}

function sourceLabel(source: string) {
  const labels: Record<string, string> = {
    manual: "Manual",
    telegram: "Telegram",
    whatsapp: "WhatsApp",
    voice: "Voice",
    ocr: "Bill photo",
  };
  return labels[source] ?? source;
}

export function ExpensesPageClient({
  projectId,
  initialExpenses,
}: {
  projectId: string;
  initialExpenses: Expense[];
}) {
  const [dialogOpen, setDialogOpen] = useState(false);

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">Expenses</h1>
          <p className="text-muted-foreground">
            All expenses for this project. Add manually or via Telegram.
          </p>
        </div>
        <Button onClick={() => setDialogOpen(true)}>
          <Plus className="mr-2 size-4" />
          Add expense
        </Button>
      </div>

      {initialExpenses.length === 0 ? (
        <div className="rounded-xl border border-border p-8 text-center text-muted-foreground">
          No expenses yet. Add one or send a message to the Telegram bot.
        </div>
      ) : (
        <>
          {/* Mobile: card list */}
          <div className="grid gap-3 md:hidden">
            {initialExpenses.map((e) => (
              <div
                key={e.id}
                className="rounded-xl border border-border bg-card p-4 text-card-foreground"
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="min-w-0">
                    <p className="truncate font-medium">{e.category}</p>
                    <p className="mt-1 text-sm text-muted-foreground">
                      {e.date}
                      {e.paid_to ? ` · ${e.paid_to}` : ""}
                    </p>
                  </div>
                  <div className="shrink-0 text-right">
                    <p className="font-semibold">{formatCurrency(e.amount)}</p>
                    <Badge variant="secondary" className="mt-2">
                      {sourceLabel(e.source)}
                    </Badge>
                  </div>
                </div>
                {e.description && (
                  <p className="mt-3 line-clamp-2 text-sm">{e.description}</p>
                )}
              </div>
            ))}
          </div>

          {/* Desktop/tablet: table */}
          <div className="hidden rounded-xl border border-border md:block">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="min-w-[110px]">Date</TableHead>
                  <TableHead className="min-w-[120px]">Category</TableHead>
                  <TableHead className="min-w-[220px]">
                    Description / Paid to
                  </TableHead>
                  <TableHead className="min-w-[120px]">Amount</TableHead>
                  <TableHead className="min-w-[110px]">Source</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {initialExpenses.map((e) => (
                  <TableRow key={e.id}>
                    <TableCell className="font-medium">{e.date}</TableCell>
                    <TableCell>{e.category}</TableCell>
                    <TableCell className="max-w-[320px] truncate">
                      {e.paid_to && (
                        <span className="font-medium">{e.paid_to}</span>
                      )}
                      {e.paid_to && e.description && " · "}
                      {e.description}
                    </TableCell>
                    <TableCell className="font-medium">
                      {formatCurrency(e.amount)}
                    </TableCell>
                    <TableCell>
                      <Badge variant="secondary">{sourceLabel(e.source)}</Badge>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </>
      )}

      <AddExpenseDialog
        projectId={projectId}
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        onSuccess={() => setDialogOpen(false)}
      />
    </div>
  );
}
