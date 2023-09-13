import { SignUp } from "@clerk/nextjs";

export default function SignupPage() {
  return (
    <div className="h-screen w-full flex items-center justify-center">
      <SignUp />
    </div>
  );
}
