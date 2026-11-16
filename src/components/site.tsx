import Link from "next/link";
import { Check } from "lucide-react";
import { PLANS, PAID_PLANS } from "@/lib/plans";

export function Logo() {
  return (
    <Link href="/" className="flex items-center gap-2 font-bold tracking-tight">
      <span className="grid h-7 w-7 place-items-center rounded-md bg-accent text-bg font-mono text-sm">{"{}"}</span>
      CodeElder
    </Link>
  );
}

export function SiteHeader() {
  return (
    <header className="sticky top-0 z-30 border-b border-line bg-bg/85 backdrop-blur">
      <div className="mx-auto flex h-14 max-w-6xl items-center justify-between px-4">
        <div className="flex items-center gap-8">
          <Logo />
          <nav className="hidden gap-6 text-sm text-muted md:flex">
            <Link href="/features" className="hover:text-fg">Features</Link>
            <Link href="/pricing" className="hover:text-fg">Pricing</Link>
            <Link href="/about" className="hover:text-fg">About</Link>
          </nav>
        </div>
        <div className="flex items-center gap-2">
          <Link href="/login" className="btn btn-ghost">Sign in</Link>
          <Link href="/signup" className="btn btn-primary">Start free</Link>
        </div>
      </div>
    </header>
  );
}

export function SiteFooter() {
  return (
    <footer className="mt-24 border-t border-line">
      <div className="mx-auto flex max-w-6xl flex-col gap-4 px-4 py-10 text-sm text-muted sm:flex-row sm:justify-between">
        <div><Logo /><p className="mt-2 max-w-xs">An AI engineering workspace for reviews, answers and planned changes.</p></div>
        <div className="flex gap-10">
          <div className="flex flex-col gap-2"><Link href="/features">Features</Link><Link href="/pricing">Pricing</Link></div>
          <div className="flex flex-col gap-2"><Link href="/about">About &amp; contact</Link><Link href="/login">Sign in</Link></div>
        </div>
      </div>
      <p className="border-t border-line py-4 text-center text-xs text-muted">© {new Date().getFullYear()} CodeElder. Not affiliated with any other coding assistant.</p>
    </footer>
  );
}

export function PricingCards({ current }: { current?: string }) {
  return (
    <div className="grid gap-4 md:grid-cols-3">
      {PAID_PLANS.map((id) => {
        const p = PLANS[id];
        const best = id === "pro";
        return (
          <div key={id} className={`card flex flex-col p-6 ${best ? "border-accent" : ""}`}>
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold">{p.name}</h3>
              {best && <span className="rounded-full bg-accent px-2 py-0.5 text-xs font-semibold text-bg">Most popular</span>}
            </div>
            <p className="mt-1 text-sm text-muted">{p.tagline}</p>
            <p className="mt-5 text-4xl font-bold">${p.price}<span className="text-base font-normal text-muted"> / month</span></p>
            <ul className="mt-5 flex-1 space-y-2 text-sm">
              {p.features.map((f) => (
                <li key={f} className="flex gap-2"><Check size={16} className="mt-0.5 shrink-0 text-accent2" />{f}</li>
              ))}
            </ul>
            {current === id ? (
              <span className="btn btn-ghost mt-6 cursor-default">Current plan</span>
            ) : p.link ? (
              <a href={p.link} target="_blank" rel="noopener noreferrer" className={`btn mt-6 ${best ? "btn-primary" : "btn-ghost"}`}>Get {p.name}</a>
            ) : (
              <Link href="/about#contact" className="btn btn-ghost mt-6">Contact us to get {p.name}</Link>
            )}
          </div>
        );
      })}
    </div>
  );
}
