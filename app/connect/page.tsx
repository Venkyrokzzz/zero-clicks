"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { Suspense } from "react";
import styles from "@/components/workspace/Workspace.module.css";

const messages: Record<string, string> = {
  access_denied:
    "Google access wasn’t granted. Choose the Google account that manages your venue and allow Business Profile access.",
  invalid_state:
    "This connection attempt expired or was started in a different tab. Start again here.",
  session_expired:
    "Your Zero Clicks session expired. Sign in again, then reconnect from this page.",
  google_config:
    "Google connection is temporarily unavailable. Contact Zero Clicks support.",
  google_client_rejected:
    "Google rejected the credentials for the Zero Clicks app. Contact support. Retrying with another Google account will not fix this error.",
  google_code_expired:
    "The Google sign-in code expired or was already used. Start a fresh connection.",
  google_token_exchange:
    "Zero Clicks could not finish the Google sign-in. Try once more. If this continues, contact support.",
  google_consent:
    "Google could not complete consent. Use the Google account that owns or manages the Business Profile.",
  google_scope:
    "Google sign-in completed, but Business Profile access was not granted. Start again and approve that permission.",
  google_refresh_missing:
    "Google did not grant ongoing access. Start again and confirm the permissions for your managed profile.",
  google_identity:
    "Zero Clicks could not read the Google account email. Start a fresh connection.",
  db_error:
    "We couldn’t save the connection. Try again or contact support if the problem continues.",
  profile_required:
    "Complete your Zero Clicks venue setup before connecting Google.",
  too_many_attempts:
    "There have been too many connection attempts. Please wait before trying again.",
};

function ConnectContent() {
  const error = useSearchParams().get("error");
  const message = error
    ? (messages[error] ??
      "We couldn’t connect your Google account. Start again from this page.")
    : null;

  return (
    <main className={styles.workspace}>
      <div className={`${styles.compact} ${styles.stack}`}>
        <header className={styles.header}>
          <div>
            <h1>Connect your Google venue</h1>
            <p className={styles.muted}>
              Use the Google account that owns or manages the Business Profile
              you want to connect.
            </p>
          </div>
        </header>
        <ol className={styles.setupSteps} aria-label="Venue setup steps">
          <li>Venue details</li>
          <li aria-current="step">Connect Google</li>
          <li>Review inbox</li>
        </ol>
        {message && (
          <p role="alert" className={styles.alert}>
            {message}
          </p>
        )}
        {error && (
          <p className={styles.muted}>
            Reference: {messages[error] ? error : "google_connect"}
          </p>
        )}
        <div className={styles.row}>
          {error === "profile_required" ? (
            <Link href="/onboarding" className={styles.primary}>
              Complete venue setup
            </Link>
          ) : (
            error !== "google_config" &&
            error !== "google_client_rejected" &&
            error !== "too_many_attempts" && (
              <a href="/api/auth/google" className={styles.primary}>
                {error ? "Start a new connection" : "Choose a Google account"}
              </a>
            )
          )}
          <Link href="/dashboard/integrations" className={styles.button}>
            Back to integrations
          </Link>
          {message && (
            <a href="mailto:zeroclicks.hq@gmail.com">Contact support</a>
          )}
        </div>
      </div>
    </main>
  );
}

export default function ConnectPage() {
  return (
    <Suspense>
      <ConnectContent />
    </Suspense>
  );
}
