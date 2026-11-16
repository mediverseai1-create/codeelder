import { revalidatePath } from "next/cache";
import { getAccount } from "@/lib/account";
import { createClient } from "@/lib/supabase/server";

export const metadata = { title: "Settings" };

async function saveName(formData: FormData) {
  "use server";
  const name = String(formData.get("name") ?? "").trim().slice(0, 80);
  const acc = await getAccount();
  if (!acc) return;
  const supabase = await createClient();
  await supabase.from("profiles").update({ full_name: name }).eq("id", acc.userId);
  revalidatePath("/app/settings");
}

export default async function Settings() {
  const acc = (await getAccount())!;
  const supabase = await createClient();
  const { data: profile } = await supabase.from("profiles").select("full_name").eq("id", acc.userId).maybeSingle();
  return (
    <div className="mx-auto max-w-xl space-y-6">
      <h1 className="text-2xl font-bold">Settings</h1>
      <form action={saveName} className="card space-y-4 p-5">
        <div><label className="label" htmlFor="email">Email</label><input id="email" className="input" value={acc.email} readOnly /></div>
        <div><label className="label" htmlFor="name">Name</label><input id="name" name="name" className="input" defaultValue={profile?.full_name ?? ""} maxLength={80} /></div>
        <button className="btn btn-primary">Save</button>
      </form>
      <form action="/auth/signout" method="post" className="card p-5">
        <button className="btn btn-ghost">Sign out</button>
      </form>
    </div>
  );
}
