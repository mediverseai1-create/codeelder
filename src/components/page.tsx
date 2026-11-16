import Link from "next/link";

export function PageHero({ eyebrow, title, intro }: { eyebrow: string; title: string; intro: string }) {
  return (
    <header className="mx-auto max-w-4xl px-4 pt-16 text-center">
      <p className="mx-auto w-fit rounded-full border border-line bg-surface px-3 py-1 text-xs text-accent2">{eyebrow}</p>
      <h1 className="mt-5 text-4xl font-bold tracking-tight sm:text-5xl">{title}</h1>
      <p className="mx-auto mt-4 max-w-2xl text-lg text-muted">{intro}</p>
    </header>
  );
}

export function Cards({ items }: { items: { t: string; d: string }[] }) {
  return (
    <div className="mx-auto mt-12 grid max-w-5xl gap-4 px-4 sm:grid-cols-2">
      {items.map((i) => (
        <div key={i.t} className="card p-6"><h2 className="font-semibold">{i.t}</h2><p className="mt-2 text-sm text-muted">{i.d}</p></div>
      ))}
    </div>
  );
}

export function Prose({ children }: { children: React.ReactNode }) {
  return <article className="mx-auto max-w-3xl space-y-4 px-4 py-12 text-sm leading-7 text-muted [&_h2]:mt-8 [&_h2]:text-lg [&_h2]:font-semibold [&_h2]:text-fg">{children}</article>;
}

export function Cta({ text = "Start free" }: { text?: string }) {
  return <div className="mt-12 text-center"><Link href="/signup" className="btn btn-primary">{text}</Link></div>;
}
