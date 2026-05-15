import { Link } from "@tanstack/react-router";
import { useMemo, type ReactNode } from "react";
import {
  PoundSterling, ShoppingCart, Boxes, Users, Building2,
} from "lucide-react";
import { useOrders, useTxns } from "@/store";
import { useStockDirectory } from "@/features/stock/hooks";
import { useDashboardSummary } from "./hooks";
import { KpiTile } from "@/components/kpi-tile";
import { CopyableCode, PageHeader } from "@/components/app-shell";
import { Pill } from "@/components/pill";

function fmt(n: number) {
  return new Intl.NumberFormat("en-GB", { style: "currency", currency: "GBP" }).format(n);
}

export function DashboardPage() {
  const summary = useDashboardSummary();
  const recentStockQuery = useStockDirectory({ page: 1, pageSize: 6 });
  const orders = useOrders((s) => s.items);
  const txns = useTxns((s) => s.items);

  const kpis = useMemo(() => {
    const sales = txns.filter(t => t.kind === "Invoice").reduce((sum, t) => sum + t.value, 0);
    return {
      sales,
      stockCount: summary.summary.stockTotal,
      customers: summary.summary.customerTotal,
      suppliers: summary.summary.supplierTotal,
      ordersN: orders.length,
    };
  }, [txns, summary.summary, orders.length]);

  const recentStocks = recentStockQuery.items;
  const recentOrders = orders.slice(0, 6);
  const recentInvoices = txns.filter(t => t.kind === "Invoice").slice(0, 6);
  const recentPayments = txns.filter(t => t.kind === "Payment").slice(0, 6);

  // 30-day fake sparkline
  const spark = useMemo(() => Array.from({ length: 30 }, (_, i) => 30 + Math.sin(i / 2) * 12 + (i / 3)), []);
  const sparkPath = useMemo(() => {
    const max = Math.max(...spark), min = Math.min(...spark);
    const w = 600, h = 60;
    return spark.map((v, i) => {
      const x = (i / (spark.length - 1)) * w;
      const y = h - ((v - min) / (max - min || 1)) * h;
      return `${i === 0 ? "M" : "L"}${x.toFixed(1)},${y.toFixed(1)}`;
    }).join(" ");
  }, [spark]);

  return (
    <div>
      <PageHeader
        title="Welcome back, Anuj"
        description="Monday, May 4, 2026 · A snapshot of your business."
      />

      <div className="px-5 py-4 space-y-4">
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-2.5">
          <KpiTile label="Total Sales" value={fmt(kpis.sales)} icon={PoundSterling} accent="primary" delta={{ value: "+12.4%", positive: true }} />
          <KpiTile label="Orders"      value={String(kpis.ordersN)} icon={ShoppingCart} accent="info" delta={{ value: "+3", positive: true }} />
          <KpiTile label="Stock On Hand" value={kpis.stockCount.toLocaleString()} icon={Boxes} accent="success" delta={{ value: "-2.1%", positive: false }} />
          <KpiTile label="Customers"   value={String(kpis.customers)} icon={Users} accent="warning" />
          <KpiTile label="Suppliers"   value={String(kpis.suppliers)} icon={Building2} />
        </div>

        <div className="rounded-lg border border-border bg-card p-3">
          <div className="flex items-center justify-between mb-2">
            <div>
              <h3 className="text-[13px] font-semibold">Sales — last 30 days</h3>
              <p className="text-[11.5px] text-muted-foreground">{fmt(kpis.sales)} total · trending up</p>
            </div>
            <Pill variant="success">+12.4%</Pill>
          </div>
          <svg viewBox="0 0 600 60" className="w-full h-16">
            <defs>
              <linearGradient id="sg" x1="0" x2="0" y1="0" y2="1">
                <stop offset="0%" stopColor="oklch(0.55 0.18 260)" stopOpacity="0.35" />
                <stop offset="100%" stopColor="oklch(0.55 0.18 260)" stopOpacity="0" />
              </linearGradient>
            </defs>
            <path d={`${sparkPath} L600,60 L0,60 Z`} fill="url(#sg)" />
            <path d={sparkPath} fill="none" stroke="oklch(0.55 0.18 260)" strokeWidth="1.5" />
          </svg>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-3">
          <RecentBlock title="Recent Stocks" linkTo="/stocks" linkLabel="View stock">
            <table className="w-full text-[13px]">
              <thead className="text-[11.5px] uppercase tracking-wide text-muted-foreground">
                <tr><th className="text-left font-medium pb-1">Code</th><th className="text-left font-medium pb-1">Title</th><th className="text-right font-medium pb-1">On Hand</th></tr>
              </thead>
              <tbody>
                {recentStocks.map(s => (
                  <tr key={s.id} className="border-t border-border/60">
                    <td className="py-1.5"><CopyableCode value={s.code} /></td>
                    <td className="py-1.5 truncate max-w-[180px]">{s.title}</td>
                    <td className="py-1.5 text-right tabular-nums">{s.onHand}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </RecentBlock>

          <RecentBlock title="Recent Orders" linkTo="/orders" linkLabel="View orders">
            <table className="w-full text-[13px]">
              <thead className="text-[11.5px] uppercase tracking-wide text-muted-foreground">
                <tr><th className="text-left font-medium pb-1">Code</th><th className="text-left font-medium pb-1">Customer</th><th className="text-left font-medium pb-1">Status</th></tr>
              </thead>
              <tbody>
                {recentOrders.map(o => (
                  <tr key={o.id} className="border-t border-border/60">
                    <td className="py-1.5"><CopyableCode value={o.code} /></td>
                    <td className="py-1.5 truncate max-w-[180px]">{o.addrName}</td>
                    <td className="py-1.5">
                      <Pill variant={o.status === "Shipped" ? "success" : o.status === "Cancelled" ? "danger" : o.status === "Confirmed" ? "info" : "neutral"}>
                        {o.status}
                      </Pill>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </RecentBlock>

          <RecentBlock title="Recent Invoices" linkTo="/transactions" linkLabel="View invoices">
            <table className="w-full text-[13px]">
              <thead className="text-[11.5px] uppercase tracking-wide text-muted-foreground">
                <tr><th className="text-left font-medium pb-1">Ref</th><th className="text-left font-medium pb-1">Customer</th><th className="text-right font-medium pb-1">Value</th></tr>
              </thead>
              <tbody>
                {recentInvoices.map(t => (
                  <tr key={t.id} className="border-t border-border/60">
                    <td className="py-1.5"><CopyableCode value={t.refMain} /></td>
                    <td className="py-1.5 truncate max-w-[180px]">{t.addrName}</td>
                    <td className="py-1.5 text-right tabular-nums">{fmt(t.value)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </RecentBlock>

          <RecentBlock title="Recent Payments" linkTo="/transactions" linkLabel="View payments">
            <table className="w-full text-[13px]">
              <thead className="text-[11.5px] uppercase tracking-wide text-muted-foreground">
                <tr><th className="text-left font-medium pb-1">Ref</th><th className="text-left font-medium pb-1">Customer</th><th className="text-right font-medium pb-1">Value</th></tr>
              </thead>
              <tbody>
                {recentPayments.map(t => (
                  <tr key={t.id} className="border-t border-border/60">
                    <td className="py-1.5"><CopyableCode value={t.refMain} /></td>
                    <td className="py-1.5 truncate max-w-[180px]">{t.addrName}</td>
                    <td className="py-1.5 text-right tabular-nums">{fmt(t.value)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </RecentBlock>
        </div>
      </div>
    </div>
  );
}

interface RecentBlockProps {
  title: string;
  linkTo: string;
  linkLabel: string;
  children: ReactNode;
}

function RecentBlock({ title, linkTo, linkLabel, children }: RecentBlockProps) {
  return (
    <div className="rounded-lg border border-border bg-card p-3">
      <div className="flex items-center justify-between mb-1.5">
        <h3 className="text-[13px] font-semibold">{title}</h3>
        <Link to={linkTo} className="text-[12px] text-primary hover:underline">{linkLabel} →</Link>
      </div>
      {children}
    </div>
  );
}
