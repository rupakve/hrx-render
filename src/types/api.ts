// src/types/api.ts

export type ApiResponse<T = unknown> = {
  // new fields
  module?: string;
  reply?: string;
  module_response?: T;
  // old fields (keep temporarily until all responses migrated)
  type?: string;
  message?: string;
  data?: T;
};

// ─── Table types ─────────────────────────────────────────────────────────────

export type TableRow = Record<string, string | number | null>;

export type ModuleTable = {
  table_name: string;
  columns: string[];
  rows: TableRow[];
};

export type UsmsModuleResponse = {
  table?: ModuleTable[];
  data?: unknown;
  response?: string;
  routed_to?: string;
  session_id?: string;
};

export type OptionItem = {
  label: string;
  value: string;
};
