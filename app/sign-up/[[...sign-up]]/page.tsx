import { SignUp } from "@clerk/nextjs";

export default function Page() {
  return (
    <div className="flex flex-1 items-center justify-center bg-muted/20 p-4 py-12">
      <SignUp />
    </div>
  );
}
