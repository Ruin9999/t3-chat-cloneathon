import { SignIn } from "@clerk/nextjs";

export default function SignInPage() {
  return <div className="flex min-w-screen min-h-screen items-center justify-center">
    <SignIn />
  </div>
}