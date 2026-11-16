import { Logo } from "@/components/site";

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <main className="grid min-h-screen place-items-center px-4">
      <div className="flex w-full max-w-sm flex-col items-center gap-6">
        <Logo />
        {children}
      </div>
    </main>
  );
}
