"use client";

import { useEffect, useState } from "react";
import { panelRequest } from "@/components/workspace/panel-data";
import s from "@/components/workspace/Workspace.module.css";

type Location = {
  accountId: string;
  locationId: string;
  name: string;
  address: string;
};
type State = "loading" | "connected" | "choose" | "disconnected";

function locationRequest<T>(data: object, signal?: AbortSignal) {
  return panelRequest<T>("/api/integrations/google", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
    ...(signal && { signal }),
  });
}

export default function ConnectionStatus() {
  const [state, setState] = useState<State>("loading");
  const [locations, setLocations] = useState<Location[]>([]);
  const [error, setError] = useState("");
  const [saving, setSaving] = useState(false);
  const [retry, setRetry] = useState(0);

  useEffect(() => {
    const controller = new AbortController();
    const { signal } = controller;
    async function load() {
      setError("");
      setState("loading");
      setLocations([]);
      try {
        const connection = await panelRequest<{
          connected: boolean;
          authorization: boolean;
          needs_reconnect: boolean;
        }>("/api/integrations/google", { signal });
        if (signal.aborted) return;
        if (connection.connected) {
          setState("connected");
          return;
        }
        if (!connection.authorization || connection.needs_reconnect) {
          setState("disconnected");
          return;
        }
        const result = await locationRequest<{ locations: Location[] }>(
          { action: "list" },
          signal,
        );
        if (!signal.aborted) {
          setLocations(result.locations);
          setState("choose");
        }
      } catch (issue) {
        if (signal.aborted) return;
        setState("disconnected");
        setError(
          issue instanceof Error
            ? issue.message
            : "Could not check your connection.",
        );
      }
    }

    void load();
    return () => controller.abort();
  }, [retry]);

  async function choose(location: Location) {
    setSaving(true);
    setError("");
    try {
      await locationRequest({
        accountId: location.accountId,
        locationId: location.locationId,
      });
      setState("connected");
    } catch (issue) {
      setError(
        issue instanceof Error
          ? issue.message
          : "Could not save this location.",
      );
    } finally {
      setSaving(false);
    }
  }

  const heading =
    state === "connected"
      ? "Google Business Profile connected"
      : state === "choose"
        ? "Choose your location"
        : state === "loading"
          ? "Checking your Google connection"
          : "Google connection incomplete";

  return (
    <main className={s.workspace}>
      <div className={`${s.compact} ${s.stack}`}>
        <header className={s.header}>
          <h1>{heading}</h1>
        </header>
        {state === "loading" && (
          <p role="status" className={s.muted}>
            Looking up your connection and available locations…
          </p>
        )}
        {state === "connected" && (
          <p className={s.muted}>
            You can open your review inbox. Reviews will appear after Zero
            Clicks checks your listing.
          </p>
        )}
        {state === "choose" && (
          <section
            className={`${s.box} ${s.stack}`}
            aria-label="Business Profiles"
          >
            <p className={s.muted}>
              {locations.length
                ? "Select the Business Profile you want Zero Clicks to monitor."
                : "No Business Profiles are available to this Google account. Make sure it owns or manages the profile."}
            </p>
            {locations.map((location) => (
              <button
                type="button"
                className={s.button}
                key={`${location.accountId}:${location.locationId}`}
                onClick={() => choose(location)}
                disabled={saving}
              >
                {location.name}
                {location.address && ` · ${location.address}`}
              </button>
            ))}
            {saving && (
              <p role="status" className={s.muted}>
                Saving your selected location…
              </p>
            )}
          </section>
        )}
        {error && (
          <p role="alert" className={s.alert}>
            {error}
          </p>
        )}
        <div className={s.row}>
          {state !== "connected" && state !== "loading" && (
            <a href="/api/auth/google" className={s.primary}>
              Choose a Google account
            </a>
          )}
          {(error || (state === "choose" && !locations.length)) && (
            <button
              type="button"
              className={s.button}
              onClick={() => setRetry((n) => n + 1)}
            >
              Check again
            </button>
          )}
          <a href="/dashboard" className={s.button}>
            Open review inbox
          </a>
        </div>
      </div>
    </main>
  );
}
