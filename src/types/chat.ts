import type {
  PayslipData,
  CRMCustomer,
  GoalItem,
  LeaveHistoryItem,
  ModuleTable,
} from "./api";

// ─── HRX ─────────────────────────────────────────────────────────────────────

export type PayslipWidget = {
  type: "hrx_payslip";
  source: "hrx";
  month: string;
  employee: { name: string };
  salary: PayslipData["salary"];
};

// ─── USMS ─────────────────────────────────────────────────────────────────────

export type TableWidget = {
  type: "table";
  source: "itsm" | "cerework" | "crm";
  tables: ModuleTable[];
};

// ─── CRM ──────────────────────────────────────────────────────────────────────

export type CRMWidget = {
  type: "crm_customer";
  source: "cerework";
  customer: CRMCustomer;
};

// ─── CereWork (Leave + Goals) ─────────────────────────────────────────────────

export type CereWorkWidget = {
  type: "cere_work";
  source: "cerework";
  action:
    | "add_goal"
    | "previous_goals"
    | "next_goals"
    | "goal_menu"
    | "leave_balance";
  goals?: GoalItem[];
  employee?: { name: string; emp_id: string };
  leave?: {
    casual: { used: number; total: number };
    sick: { used: number; total: number };
    earned: { used: number; total: number };
  };
  leave_history?: LeaveHistoryItem[];
};

export type OptionItem = {
  label: string;
  value: string;
};

export type OptionsWidget = {
  type: "options";
  source: "itsm" | "cerework" | "crm";
  options: OptionItem[];
};

// ─── Union ────────────────────────────────────────────────────────────────────

export type WidgetData =
  | PayslipWidget
  | TableWidget
  | CRMWidget
  | CereWorkWidget
  | OptionsWidget;

// ─── Chat message ─────────────────────────────────────────────────────────────

export interface ChatResponse {
  message: string;
  widgets: WidgetData[];
}
