"use client";

import { useCallback, useEffect, useState } from "react";
import { formatPackagePrice } from "@/lib/client-gallery/packages";
import type {
  ClientGalleryOrder,
  ClientGalleryOrderStatus,
} from "@/lib/client-gallery/order-types";

type OrderRow = ClientGalleryOrder & {
  client_galleries?: { title: string; share_token: string } | null;
};

const STATUS_OPTIONS: ClientGalleryOrderStatus[] = [
  "pending_payment",
  "paid",
  "submitted",
  "confirmed",
  "fulfilled",
  "cancelled",
];

export function ClientOrdersPanel() {
  const [orders, setOrders] = useState<OrderRow[]>([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);

  const load = useCallback(async () => {
    setLoading(true);
    const res = await fetch("/api/admin/client-gallery-orders");
    const data = await res.json();
    setLoading(false);

    if (!res.ok) {
      setError(data.error ?? "Could not load orders.");
      setOrders([]);
      return;
    }

    setError("");
    setOrders((data.orders ?? []) as OrderRow[]);
  }, []);

  useEffect(() => {
    void load();
  }, [load]);

  async function updateStatus(id: string, status: ClientGalleryOrderStatus) {
    const res = await fetch(`/api/admin/client-gallery-orders/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status }),
    });
    const data = await res.json();
    if (!res.ok) {
      setError(data.error ?? "Could not update order.");
      return;
    }
    await load();
  }

  if (loading) {
    return <p className="text-sm text-stone">Loading orders…</p>;
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-serif text-2xl text-bark">Client orders</h1>
        <p className="mt-2 text-sm text-stone">
          Digital package orders. Paid means Stripe checkout completed.
        </p>
      </div>

      {error ? (
        <p className="border border-parchment bg-white p-4 text-sm text-bark">
          {error}
        </p>
      ) : null}

      {!orders.length && !error ? (
        <p className="text-sm text-stone">No orders yet.</p>
      ) : (
        <ul className="space-y-3">
          {orders.map((order) => (
            <li
              key={order.id}
              className="border border-parchment bg-white px-4 py-4 text-sm"
            >
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div>
                  <p className="font-medium text-bark">
                    {order.client_name} · {order.package_label}
                  </p>
                  <p className="mt-1 text-stone">
                    {order.client_email}
                    {" · "}
                    {order.photo_count} photo
                    {order.photo_count === 1 ? "" : "s"}
                    {" · "}
                    {formatPackagePrice(order.price_cents)}
                  </p>
                  <p className="mt-1 text-stone">
                    {order.client_galleries?.title ?? "Gallery"}
                    {" · "}
                    {new Date(order.created_at).toLocaleString()}
                  </p>
                  {order.notes ? (
                    <p className="mt-2 text-bark">Notes: {order.notes}</p>
                  ) : null}
                </div>
                <label className="text-xs text-stone">
                  Status
                  <select
                    className="input mt-1 block min-w-[9rem] text-sm"
                    value={order.status}
                    onChange={(e) =>
                      void updateStatus(
                        order.id,
                        e.target.value as ClientGalleryOrderStatus,
                      )
                    }
                  >
                    {STATUS_OPTIONS.map((status) => (
                      <option key={status} value={status}>
                        {status}
                      </option>
                    ))}
                  </select>
                </label>
              </div>
              {order.client_galleries?.share_token ? (
                <p className="mt-3">
                  <a
                    href={`/view/${order.client_galleries.share_token}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="underline underline-offset-2 hover:text-bark"
                  >
                    Open gallery
                  </a>
                </p>
              ) : null}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
