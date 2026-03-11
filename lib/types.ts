export type ExpenseSource =
  | "manual"
  | "telegram"
  | "whatsapp"
  | "voice"
  | "ocr";

export type PhaseStatus = "pending" | "in_progress" | "completed";

export interface Project {
  id: string;
  name: string;
  location: string | null;
  budget: number;
  start_date: string | null;
  expected_completion: string | null;
  created_at: string;
  updated_at: string;
  user_id?: string | null;
}

export interface BudgetCategory {
  id: string;
  project_id: string;
  category: string;
  budget_amount: number;
  created_at: string;
}

export interface Expense {
  id: string;
  project_id: string;
  amount: number;
  category: string;
  description: string | null;
  paid_to: string | null;
  date: string;
  payment_mode: string | null;
  bill_url: string | null;
  source: ExpenseSource;
  ocr_text: string | null;
  created_at: string;
  updated_at: string;
}

export interface ConstructionPhase {
  id: string;
  project_id: string;
  phase_name: string;
  status: PhaseStatus;
  start_date: string | null;
  expected_end: string | null;
  actual_end: string | null;
  notes: string | null;
  sort_order: number;
  created_at: string;
  updated_at: string;
}

export interface ActivityLog {
  id: string;
  event_type: string;
  raw_input: string | null;
  parsed_output: unknown;
  status: string;
  project_id: string | null;
  expense_id: string | null;
  created_at: string;
}

export const DEFAULT_PHASES = [
  "Foundation",
  "Pillars",
  "Slab",
  "Walls",
  "Plastering",
  "Electrical",
  "Plumbing",
  "Tiles",
  "Painting",
  "Finishing",
] as const;

export const EXPENSE_CATEGORIES = [
  "Cement",
  "Labour",
  "Steel",
  "Sand",
  "Bricks",
  "Electrical",
  "Plumbing",
  "Tiles",
  "Paint",
  "Doors & Windows",
  "Other",
] as const;

export const PAYMENT_MODES = ["Cash", "UPI", "Bank Transfer", "Cheque", "Other"] as const;
