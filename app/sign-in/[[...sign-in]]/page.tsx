import { SignIn } from "@clerk/nextjs";
import { redirect } from "next/navigation";
import s from "@/components/workspace/Workspace.module.css";

const site = "https://www.0-clicks.uk";

function signInDestination(requested?: string) {
  if (requested) {
    try {
      const destination = new URL(requested, site);
      const onSite = destination.origin === site || destination.origin === "https://0-clicks.uk";
      if (onSite && /^\/(admin|dashboard|connect|onboarding|start|workspace)(?:\/|$)/.test(destination.pathname)) {
        return new URL(destination.pathname + destination.search, site).href;
      }
    } catch {
      // Invalid or external destinations fall back to the workspace router.
    }
  }
  return `${site}/workspace`;
}

export default async function SignInPage({
  params,
  searchParams,
}: {
  params: Promise<{ "sign-in"?: string[] }>;
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const [route, query] = await Promise.all([params, searchParams]);
  if (process.env.VERCEL_ENV === "production" && !route["sign-in"]?.length &&
      !Object.keys(query).some(key => key.startsWith("__clerk_"))) {
    const hosted = new URL("https://accounts.0-clicks.uk/sign-in");
    hosted.searchParams.set("redirect_url", signInDestination(typeof query.redirect_url === "string" ? query.redirect_url : undefined));
    redirect(hosted.href);
  }

  return (
    <main className={s.workspace}>
      <div className={s.authPanel}>
        <SignIn signUpUrl="/sign-up" fallbackRedirectUrl="/workspace" appearance={{ variables: { colorPrimary: "#671f3d" } }} />
      </div>
    </main>
  );
}
