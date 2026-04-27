export type WidgetType = "hrx" | "itsm" | "cerework";

export interface WidgetField {
  label: string;
  value: string;
}

export interface WidgetAction {
  label: string;
  variant: "primary" | "secondary";
}

export interface WidgetData {
  source: WidgetType;
  title: string;
  subtitle: string;
  status?: string;
  statusColor?: "green" | "yellow" | "red" | "blue";
  fields: WidgetField[];
  actions: WidgetAction[];
}

export interface ChatResponse {
  message: string;
  widgets: WidgetData[];
}

const hrxLeaveResponse: ChatResponse = {
  message: "Here's your leave balance from **HRX**. You have sufficient casual leaves available.",
  widgets: [
    {
      source: "hrx",
      title: "Leave Balance",
      subtitle: "Employee: John Doe (EMP-4521)",
      status: "Active",
      statusColor: "green",
      fields: [
        { label: "Casual Leave", value: "8 / 12 remaining" },
        { label: "Sick Leave", value: "5 / 7 remaining" },
        { label: "Earned Leave", value: "14 / 20 remaining" },
        { label: "Last Leave Taken", value: "Mar 10 – Mar 12, 2026" },
      ],
      actions: [
        { label: "Apply Leave", variant: "primary" },
        { label: "View History", variant: "secondary" },
      ],
    },
  ],
};

const hrxPayslipResponse: ChatResponse = {
  message: "Here's your latest payslip information from **HRX**.",
  widgets: [
    {
      source: "hrx",
      title: "Payslip – March 2026",
      subtitle: "John Doe • Dept: Engineering",
      status: "Processed",
      statusColor: "green",
      fields: [
        { label: "Basic Salary", value: "₹65,000" },
        { label: "HRA", value: "₹18,200" },
        { label: "Deductions", value: "₹8,400" },
        { label: "Net Pay", value: "₹74,800" },
      ],
      actions: [
        { label: "Download PDF", variant: "primary" },
        { label: "Compare Months", variant: "secondary" },
      ],
    },
  ],
};

const itsmTicketResponse: ChatResponse = {
  message: "I found **2 open tickets** in **ITSM** matching your query.",
  widgets: [
    {
      source: "itsm",
      title: "INC-20482 — VPN Connection Drops",
      subtitle: "Reported by: John Doe • Priority: High",
      status: "In Progress",
      statusColor: "yellow",
      fields: [
        { label: "Assigned To", value: "Network Team – Ravi Kumar" },
        { label: "Created", value: "Mar 22, 2026" },
        { label: "SLA Remaining", value: "4h 30m" },
        { label: "Category", value: "Network > VPN" },
      ],
      actions: [
        { label: "View Details", variant: "primary" },
        { label: "Add Comment", variant: "secondary" },
      ],
    },
    {
      source: "itsm",
      title: "REQ-10293 — Laptop Upgrade Request",
      subtitle: "Requested by: John Doe • Priority: Medium",
      status: "Pending Approval",
      statusColor: "blue",
      fields: [
        { label: "Approver", value: "Mgr – Sarah Chen" },
        { label: "Requested On", value: "Mar 18, 2026" },
        { label: "Item", value: "MacBook Pro 16\" M4" },
        { label: "Estimated Cost", value: "₹2,45,000" },
      ],
      actions: [
        { label: "Track Status", variant: "primary" },
        { label: "Cancel Request", variant: "secondary" },
      ],
    },
  ],
};

const cereworkResponse: ChatResponse = {
  message: "Here's your workspace booking status from **Cerework**.",
  widgets: [
    {
      source: "cerework",
      title: "Workspace Booking",
      subtitle: "Bangalore – Indiranagar Hub",
      status: "Confirmed",
      statusColor: "green",
      fields: [
        { label: "Date", value: "Mar 26, 2026" },
        { label: "Desk", value: "Zone B – Desk 14" },
        { label: "Time Slot", value: "9:00 AM – 6:00 PM" },
        { label: "Amenities", value: "WiFi, Parking, Locker" },
      ],
      actions: [
        { label: "Modify Booking", variant: "primary" },
        { label: "Cancel", variant: "secondary" },
      ],
    },
  ],
};

const defaultResponse: ChatResponse = {
  message: "I can help you with queries across **HRX** (HR & Payroll), **ITSM** (IT Service Management), and **Cerework** (Workspace Management). Try asking about:\n\n• Leave balance or payslips\n• IT tickets or service requests\n• Workspace bookings",
  widgets: [],
};

export function getMockResponse(query: string): ChatResponse {
  const q = query.toLowerCase();
  if (q.includes("leave") || q.includes("attendance")) return hrxLeaveResponse;
  if (q.includes("pay") || q.includes("salary") || q.includes("payslip")) return hrxPayslipResponse;
  if (q.includes("ticket") || q.includes("incident") || q.includes("vpn") || q.includes("laptop") || q.includes("itsm") || q.includes("issue")) return itsmTicketResponse;
  if (q.includes("workspace") || q.includes("booking") || q.includes("desk") || q.includes("cerework")) return cereworkResponse;
  return defaultResponse;
}
