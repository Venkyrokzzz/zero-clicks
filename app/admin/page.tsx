"use client";

import { useCallback, useEffect, useState } from "react";
import {
  formatDate,
  panelRequest,
  statusLabel,
} from "@/components/workspace/panel-data";
import s from "@/components/workspace/Workspace.module.css";

interface Client {
  clerk_user_id: string;
  email: string | null;
  business_name: string | null;
  location: string | null;
  plan: string;
  trial_paused: boolean;
  trial_ends_at: string | null;
  notes: string | null;
  google_connected: boolean;
  google_needs_reconnect: boolean;
  last_synced_at: string | null;
  has_stripe_customer: boolean;
  subscription_status: string | null;
  reviews_count: number | null;
}

export default function AdminPage() {
  const [clients, setClients] = useState<Client[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("all");

  const load = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      const data = await panelRequest<{ clients: Client[] }>(
        "/api/admin/clients",
      );
      setClients(
        data.clients.filter(
          (c) => c.plan !== "admin" && c.email !== "zeroclicks.hq@gmail.com",
        ),
      );
    } catch (e) {
      setError(e instanceof Error ? e.message : "Could not load clients.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void load();
  }, [load]);

  const paymentAttention = (client: Client) =>
    ["past_due", "unpaid", "incomplete", "paused"].includes(
      client.subscription_status ?? "",
    );
  const shown = clients.filter((c) => {
    const text =
      `${c.business_name ?? ""} ${c.email ?? ""} ${c.location ?? ""}`.toLowerCase();
    return (
      text.includes(search.trim().toLowerCase()) &&
      (filter === "all" ||
        (filter === "attention" && paymentAttention(c)) ||
        (filter === "unlinked" && !c.has_stripe_customer) ||
        (filter === "connected" && c.google_connected))
    );
  });

  return (
    <main className={s.workspace}>
      <div className={s.frame}>
        <header className={s.header}>
          <div>
            <h1>Client operations</h1>
            <p className={s.muted}>
              Venue connections, review activity and billing status.
            </p>
          </div>
          <div className={s.row}>
            <a href="/dashboard" className={s.button}>
              Client panel
            </a>
            <button onClick={load} disabled={loading} className={s.button}>
              {loading ? "Refreshing…" : "Refresh clients"}
            </button>
          </div>
        </header>
        {error && (
          <p role="alert" className={s.alert}>
            {error}
          </p>
        )}
        <div className={s.controls}>
          <label>
            Search venues
            <input
              type="search"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </label>
          <label>
            Show
            <select value={filter} onChange={(e) => setFilter(e.target.value)}>
              <option value="all">All clients</option>
              <option value="attention">Billing needs attention</option>
              <option value="unlinked">No Stripe customer</option>
              <option value="connected">Google connected</option>
            </select>
          </label>
          {!loading && !error && (
            <span className={s.muted}>
              {shown.length} of {clients.length} clients ·{" "}
              {clients.filter(paymentAttention).length} with billing issues
            </span>
          )}
        </div>
        {shown.length > 0 ? (
          <div
            className={`${s.scroller} ${s.detail}`}
            tabIndex={0}
            aria-label="Client operations table"
          >
            <table className={s.table}>
              <thead>
                <tr>
                  <th scope="col">Venue</th>
                  <th scope="col">Google</th>
                  <th scope="col">Saved Stripe status</th>
                  <th scope="col">Reviews</th>
                </tr>
              </thead>
              <tbody>
                {shown.map((c) => (
                  <tr key={c.clerk_user_id}>
                    <td>
                      <a
                        href={`/admin/clients/${encodeURIComponent(c.clerk_user_id)}`}
                      >
                        {c.business_name || c.email || "Unnamed venue"}
                      </a>
                      <p className={s.muted}>
                        {c.location || statusLabel(c.plan)}
                      </p>
                    </td>
                    <td>
                      {c.google_needs_reconnect
                        ? "Reconnect required"
                        : c.google_connected
                          ? "Connected"
                          : "Not connected"}
                      {c.last_synced_at && (
                        <p className={s.muted}>
                          Last check {formatDate(c.last_synced_at)}
                        </p>
                      )}
                    </td>
                    <td>
                      <span
                        className={`${s.status} ${paymentAttention(c) ? s.warn : ""}`}
                      >
                        {c.has_stripe_customer
                          ? statusLabel(c.subscription_status)
                          : "No Stripe customer"}
                      </span>
                    </td>
                    <td>{c.reviews_count ?? "Unavailable"}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <p className={s.muted}>
            {loading
              ? "Loading clients…"
              : error
                ? "Client list unavailable."
                : "No clients match this view."}
          </p>
        )}
      </div>
    </main>
  );
}
