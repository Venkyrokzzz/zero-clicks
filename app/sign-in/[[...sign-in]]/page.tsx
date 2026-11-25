import { SignIn } from "@clerk/nextjs";
import s from "@/components/workspace/Workspace.module.css";

export default function SignInPage() {
  return (
    <main className={s.workspace}>
      <div className={s.authPanel}>
        <SignIn signUpUrl="/sign-up" fallbackRedirectUrl="/workspace" appearance={{ variables: { colorPrimary: "#671f3d" } }} />
      </div>
    </main>
  );
}
