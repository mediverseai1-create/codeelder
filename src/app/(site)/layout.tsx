import { SiteFooter, SiteHeader } from "@/components/site";

export default function SiteLayout({ children }: { children: React.ReactNode }) {
  return (<><SiteHeader />{children}<SiteFooter /></>);
}
