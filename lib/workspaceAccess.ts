import "server-only";

export function isWorkspaceOwner(userId?: string | null) {
  const ownerId = process.env.ZERO_CLICKS_OWNER_CLERK_ID?.trim();
  return Boolean(ownerId && userId === ownerId);
}

export function workspaceHome(userId: string) {
  return isWorkspaceOwner(userId) ? "/admin" : "/dashboard";
}
