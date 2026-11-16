import { NextResponse } from "next/server";
import { ZodError } from "zod";
import { AiError } from "@/lib/ai";
import { LimitError } from "@/lib/account";

export function fail(e: unknown) {
  if (e instanceof ZodError) return NextResponse.json({ error: e.issues[0]?.message ?? "Invalid input" }, { status: 400 });
  if (e instanceof AiError || e instanceof LimitError) return NextResponse.json({ error: e.message }, { status: e.status });
  console.error(e);
  return NextResponse.json({ error: "Something went wrong. Please try again." }, { status: 500 });
}
