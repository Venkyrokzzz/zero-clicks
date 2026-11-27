export function googleConnectionStatus(connection?: {
  account_id?: string | null;
  location_id?: string | null;
  refresh_token?: string | null;
  needs_reconnect?: boolean | null;
} | null) {
  if (!connection) return "not_connected";
  if (connection.needs_reconnect || !connection.refresh_token?.trim()) return "reconnect";
  if (!connection.account_id || !connection.location_id) return "pick_venue";
  return "connected";
}

export const googleConnectionLabels = {
  not_connected: "Not connected",
  reconnect: "Reconnect required",
  pick_venue: "Select a Google venue",
  connected: "Connected",
} as const;
