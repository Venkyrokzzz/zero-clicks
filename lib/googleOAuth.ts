import "server-only";
import { createHmac, timingSafeEqual } from "node:crypto";

export const BUSINESS_SCOPE = "https://www.googleapis.com/auth/business.manage";
export const NONCE_COOKIE = "zc_oauth_nonce";
export const START_PATH = "/api/auth/google";
export const CALLBACK_PATH = START_PATH + "/callback";
export const STATE_LIFETIME = 600;

export function oauthConfig() {
  const {
    GOOGLE_CLIENT_ID: clientId,
    GOOGLE_CLIENT_SECRET: clientSecret,
    GOOGLE_REDIRECT_URI: redirectUri,
    OAUTH_STATE_SECRET: stateSecret,
  } = process.env;
  if (!clientId || !clientSecret || !redirectUri || !stateSecret) return null;
  try {
    const uri = new URL(redirectUri);
    if (
      uri.protocol !== "https:" ||
      uri.pathname !== CALLBACK_PATH ||
      uri.search ||
      uri.hash
    )
      return null;
    return {
      clientId,
      clientSecret,
      redirectUri,
      stateSecret,
      origin: uri.origin,
    };
  } catch {
    return null;
  }
}

export const cookieSettings = {
  httpOnly: true,
  secure: true,
  sameSite: "lax" as const,
  path: START_PATH,
};

function mac(value: string, userId: string, secret: string) {
  return createHmac("sha256", secret)
    .update(JSON.stringify([value, userId]))
    .digest("hex");
}

export function signGoogleState(nonce: string, userId: string, secret: string) {
  const value = `${nonce}.${Date.now() + STATE_LIFETIME * 1000}`;
  return `${value}.${mac(value, userId, secret)}`;
}

export function validGoogleState(
  state: string,
  nonce: string,
  userId: string,
  secret: string,
) {
  const parts = state.split(".");
  if (
    parts.length !== 3 ||
    parts[0] !== nonce ||
    !/^\d{13}$/.test(parts[1]) ||
    !/^[a-f0-9]{64}$/.test(parts[2])
  )
    return false;
  const expiresAt = Number(parts[1]);
  if (expiresAt <= Date.now() || expiresAt > Date.now() + STATE_LIFETIME * 1000)
    return false;
  return timingSafeEqual(
    Buffer.from(parts[2], "hex"),
    Buffer.from(mac(`${nonce}.${parts[1]}`, userId, secret), "hex"),
  );
}
