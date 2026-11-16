import Link from "next/link";
import { redirect } from "next/navigation";
import { CreditCard, LayoutDashboard, ListChecks, MessagesSquare, ScanSearch, BookMarked, Settings } from "lucide-react";
import { Logo } from "@/components/site";
import { getAccount } from "@/lib/account";

const NAV = [
  { href: "/app", label: "Dashboard", icon: LayoutDashboard },
  { href: "/app/assistant", label: "Assistant", icon: MessagesSquare },
  { href: "/app/reviews", label: "Reviews", icon: ScanSearch },
  { href: "/app/tasks", label: "Tasks", icon: ListChecks },
  { href: "/app/playbooks", label: "Playbooks", icon: BookMarked },
  { href: "/app/billing", label: "Billing", icon: CreditCard },
  { href: "/app/settings", label: "Settings", icon: Settings },
];

export default async function AppLayout({ children }: { children: React.ReactNode }) {
  const acc = await getAccount();
  if (!acc) redirect("/login");
  return (
    <div className="min-h-screen md:flex">
      <aside className="border-b border-line bg-surface md:min-h-screen md:w-60 md:border-b-0 md:border-r">
        <div className="flex items-center justify-between p-4 md:block"><Logo /></div>
        <nav className="flex gap-1 overflow-x-auto px-2 pb-2 md:flex-col md:pb-0">
          {NAV.map(({ href, label, icon: Icon }) => (
            <Link key={href} href={href} className="flex items-center gap-2 whitespace-nowrap rounded-lg px-3 py-2 text-sm text-muted hover:bg-surface2 hover:text-fg">
              <Icon size={16} />{label}
            </Link>
          ))}
        </nav>
        <div className="hidden p-4 text-xs text-muted md:block">
          <p className="truncate">{acc.email}</p>
          <p className="mt-1">{acc.plan.name} · {acc.remaining} credits left</p>
          <form action="/auth/signout" method="post"><button className="mt-3 text-accent">Sign out</button></form>
        </div>
      </aside>
      <main className="min-w-0 flex-1 p-4 sm:p-8">{children}</main>
    </div>
  );
}
