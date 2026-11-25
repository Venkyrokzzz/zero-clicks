import "server-only";
import { createHash } from "node:crypto";
import { isIP } from "node:net";
import { supabase } from "@/lib/supabase";

export function publicRequestBucket(request: Request) {
  const ip = request.headers.get("x-vercel-forwarded-for")?.split(",")[0]?.trim() ?? "";
  return isIP(ip) ? createHash("sha256").update(ip).digest("hex") : "unknown";
}

export async function consumeRequestBudget(
  bucket: string,
  limit: number,
  windowSeconds = 3600,
): Promise<"allowed" | "limited" | "unavailable"> {
  try {
    const { data, error } = await supabase.rpc("consume_request_budget", {
      p_bucket: bucket,
      p_limit: limit,
      p_window_seconds: windowSeconds,
    }).abortSignal(AbortSignal.timeout(3_000));
    if (error || typeof data !== "boolean") return "unavailable";
    return data ? "allowed" : "limited";
  } catch {
    return "unavailable";
  }
}

export async function consumePublicBudget(request: Request, scope: string, perClient: number, global: number) {
  // Check the shared budget first to bound the number of new database keys.
  const overall = await consumeRequestBudget(`${scope}:global`, global);
  if (overall !== "allowed") return overall;
  return consumeRequestBudget(`${scope}:${publicRequestBucket(request)}`, perClient);
}
