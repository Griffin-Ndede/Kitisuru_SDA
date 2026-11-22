import React from "react";
import Card from "./Card";
import { EmptyState } from "./States";

// A table inside a card, with an empty state.
// columns: [{ key, header, render?(row), className?, hideOnMobile? }]
export default function DataTable({ columns, rows, empty, onRowClick, rowKey = "id" }) {
  if (!rows.length) return <Card padded={false}>{empty || <EmptyState title="Nothing here yet" />}</Card>;
  return (
    <Card padded={false}>
      <div className="overflow-x-auto">
        <table className="w-full text-left text-sm">
          <thead>
            <tr className="border-b border-line text-xs uppercase tracking-wider text-muted">
              {columns.map((col) => (
                <th key={col.key} scope="col" className={`px-5 py-3 font-semibold ${col.hideOnMobile ? "hidden md:table-cell" : ""} ${col.className || ""}`}>{col.header}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {rows.map((row) => (
              <tr
                key={row[rowKey]}
                onClick={onRowClick ? () => onRowClick(row) : undefined}
                className={`border-b border-line/70 last:border-0 ${onRowClick ? "cursor-pointer hover:bg-paper" : ""}`}
              >
                {columns.map((col) => (
                  <td key={col.key} className={`px-5 py-3.5 align-middle ${col.hideOnMobile ? "hidden md:table-cell" : ""} ${col.className || ""}`}>
                    {col.render ? col.render(row) : row[col.key] || "—"}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </Card>
  );
}
