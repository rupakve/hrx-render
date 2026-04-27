import { Download, FileText } from "lucide-react";
import type { PayslipWidget } from "@/types/chat";
import { Card, SourceBadge, StatusBadge, actionPrimary } from "../shared";

const PayslipWidget = ({ data }: { data: PayslipWidget }) => (
  <Card source="hrx">
    <div className="flex items-start justify-between gap-3 mb-4">
      <div>
        <div className="flex items-center gap-2 mb-1">
          <SourceBadge source="hrx" />
          <StatusBadge status="Generated" color="green" />
        </div>
        <h3 className="font-semibold text-card-foreground text-[15px]">
          Payslip
        </h3>
        <p className="text-xs text-muted-foreground mt-0.5">
          {data.month} · {data.employee.name}
        </p>
      </div>
      <FileText size={14} className="text-muted-foreground mt-1 shrink-0" />
    </div>

    <div className="grid grid-cols-2 gap-3">
      {[
        {
          label: "Basic Salary",
          value: `₹ ${data.salary.basic.toLocaleString()}`,
        },
        {
          label: "Deductions",
          value: `₹ ${data.salary.deductions.toLocaleString()}`,
        },
      ].map((f) => (
        <div key={f.label} className="bg-secondary/40 rounded-lg p-3">
          <p className="text-[10px] uppercase tracking-wider text-muted-foreground">
            {f.label}
          </p>
          <p className="text-sm font-semibold text-card-foreground mt-0.5">
            {f.value}
          </p>
        </div>
      ))}
    </div>

    <div className="mt-3 bg-widget-hrx/10 border border-widget-hrx/20 rounded-lg p-3">
      <p className="text-[10px] uppercase tracking-wider text-widget-hrx">
        Net Salary
      </p>
      <p className="text-lg font-bold text-card-foreground mt-0.5">
        ₹ {data.salary.net.toLocaleString()}
      </p>
    </div>

    <div className="flex gap-2 mt-4 pt-4 border-t border-border">
      <button
        className={`flex items-center gap-1.5 text-xs font-medium px-4 py-2 rounded-lg transition-all ${actionPrimary.hrx}`}
      >
        <Download size={12} /> Download PDF
      </button>
    </div>
  </Card>
);

export default PayslipWidget;
