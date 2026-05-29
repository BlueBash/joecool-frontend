import { Input } from "@/components/ui/input";
import {
  BALANCE_ORDER_COLUMNS,
  BALANCE_ORDER_ROWS,
  type BalanceOrdersGrid,
} from "./order-kind-summary";
import { STOCK_FIELD_CLASS } from "../field-classes";

type BalanceOrdersTableProps = {
  grid: BalanceOrdersGrid;
};

export function BalanceOrdersTable({ grid }: BalanceOrdersTableProps) {
  const { NUM } = STOCK_FIELD_CLASS;

  return (
    <div>
      <table className="w-full text-[12.5px]">
        <thead className="text-muted-foreground border-b border-border">
          <tr>
            <th className="text-left py-1.5"></th>
            {BALANCE_ORDER_COLUMNS.map((col) => (
              <th key={col.kind} className="text-right px-2">
                {col.label}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {BALANCE_ORDER_ROWS.map((row) => (
            <tr key={row.key} className="border-b border-border/60">
              <td className="py-1.5 font-medium">{row.label}</td>
              {BALANCE_ORDER_COLUMNS.map((col) => {
                const value = grid[row.key][col.kind];
                const display =
                  row.key === "values"
                    ? value.toFixed(2)
                    : String(Math.round(value));
                return (
                  <td key={col.kind} className="px-2 py-1">
                    <Input
                      className={`${NUM} text-right`}
                      value={display}
                      readOnly
                      disabled
                    />
                  </td>
                );
              })}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
