import { SignUp } from "@clerk/nextjs";
import s from "@/components/workspace/Workspace.module.css";

export default function SignUpPage() {
  return (
    <main className={s.workspace}>
      <div className={s.authPanel}>
        <SignUp signInUrl="/sign-in" forceRedirectUrl="/onboarding" appearance={{ variables: { colorPrimary: "#671f3d" } }} />
      </div>
    </main>
  );
}
