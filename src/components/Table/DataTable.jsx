"use client";

import { Grid } from "gridjs-react";
import { html } from "gridjs";
import "gridjs/dist/theme/mermaid.css";
import "@/styles/dataTable.css";

/** Modular kolom aksi */
export const actionColumn = (itemType = "items") => ({
  name: "Aksi",
  width: "140px",
  sort: false,
  attributes: {
    class: "text-center",
  },
  formatter: (_, row) => {
    const id = row?.cells?.[0]?.data;

    return html(`
      <div class="flex gap-2 justify-center">
        <button
          class="btn btn-ghost btn-sm bg-blue-500 hover:bg-blue-800"
          data-id="${id}"
          data-action="detail"
          data-type="${itemType}"
        >Detail</button>
        <button
          class="btn btn-ghost btn-sm bg-green-600 hover:bg-green-800"
          data-id="${id}"
          data-action="edit"
          data-type="${itemType}"
        >Edit</button>
        <button
          class="btn btn-ghost btn-sm bg-red-600 hover:bg-red-800"
          data-id="${id}"
          data-action="delete"
          data-type="${itemType}"
        >Delete</button>
      </div>
    `);
  },
});

export default function DataTable({ columns, rows, onAction }) {
  return (
    <div
      onClick={(e) => {
        const target = e.target.closest("button[data-action]");
        if (!target) return;

        const id = target.dataset.id;
        const action = target.dataset.action;
        const type = target.dataset.type;

        if (onAction && typeof onAction === "function") {
          onAction({ id, action, type });
        }
      }}
    >
      <Grid
        data={() =>
          new Promise((resolve) => {
            setTimeout(() => resolve(rows), 1000);
          })
        }
        columns={columns}
        autoWidth={true}
        search={true}
        width="100%"
        height="100%"
        style={{
          container: {
            width: "100%",
            height: "100%",
          },
          td: {
            lineBreak: "anywhere",
          },
        }}
        pagination={{
          limit: 10,
        }}
        language={{
          search: {
            placeholder: "Search...",
          },
          pagination: {
            previous: "<",
            next: ">",
          },
        }}
      />
    </div>
  );
}
