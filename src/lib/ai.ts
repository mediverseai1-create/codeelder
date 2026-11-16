import { z } from "zod";

const BASE = "https://generativelanguage.googleapis.com/v1beta/models";

export class AiError extends Error {
  constructor(message: string, public status = 502) {
    super(message);
  }
}

interface Turn { role: "user" | "model"; text: string }

async function call(opts: { system: string; turns: Turn[]; json?: boolean; premium?: boolean }) {
  const key = process.env.GEMINI_API_KEY;
  if (!key) throw new AiError("AI is not configured. Set GEMINI_API_KEY.", 503);
  const model = opts.premium
    ? process.env.GEMINI_MODEL_PREMIUM || process.env.GEMINI_MODEL || "gemini-3.5-flash"
    : process.env.GEMINI_MODEL || "gemini-3.5-flash";

  const res = await fetch(`${BASE}/${model}:generateContent`, {
    method: "POST",
    headers: { "content-type": "application/json", "x-goog-api-key": key },
    body: JSON.stringify({
      systemInstruction: { parts: [{ text: opts.system }] },
      contents: opts.turns.map((t) => ({ role: t.role, parts: [{ text: t.text }] })),
      generationConfig: {
        temperature: 0.3,
        ...(opts.json ? { responseMimeType: "application/json" } : {}),
      },
    }),
    signal: AbortSignal.timeout(55_000),
  }).catch(() => {
    throw new AiError("The AI provider did not respond in time. Try again.", 504);
  });

  if (res.status === 429) throw new AiError("The AI provider is rate limiting requests. Try again shortly.", 429);
  if (!res.ok) throw new AiError(`AI provider error (${res.status}).`);
  const data = await res.json();
  const text: string | undefined = data?.candidates?.[0]?.content?.parts?.map((p: { text?: string }) => p.text ?? "").join("");
  if (!text) throw new AiError("The AI returned an empty response (it may have been filtered).");
  return text;
}

const BASE_SYSTEM =
  "You are CodeElder, a careful senior software engineer. Be precise and concise. " +
  "Never invent APIs, files or line numbers that are not in the code you were given; say when you are unsure.";

export async function chat(history: Turn[], playbook: string | null, premium: boolean) {
  const system = BASE_SYSTEM + (playbook ? `\n\nUser playbook (follow it):\n${playbook}` : "");
  return call({ system, turns: history, premium });
}

export const ReviewSchema = z.object({
  summary: z.string(),
  findings: z.array(
    z.object({
      severity: z.enum(["critical", "high", "medium", "low", "info"]),
      title: z.string(),
      line: z.number().int().nullable().optional(),
      explanation: z.string(),
      suggestion: z.string(),
    }),
  ),
});
export type Review = z.infer<typeof ReviewSchema>;

export async function reviewCode(code: string, language: string, playbook: string | null, premium: boolean) {
  const system =
    BASE_SYSTEM +
    ' Review the code for bugs, security issues, and maintainability. Respond ONLY with JSON: {"summary": string, "findings": [{"severity": "critical|high|medium|low|info", "title": string, "line": number|null, "explanation": string, "suggestion": string}]}. Line numbers are 1-based and refer to the supplied code. Return an empty findings array if the code is sound.' +
    (playbook ? `\n\nUser playbook:\n${playbook}` : "");
  const raw = await call({ system, turns: [{ role: "user", text: `Language: ${language}\n\n${code}` }], json: true, premium });
  return ReviewSchema.parse(parseJson(raw));
}

export const TaskSchema = z.object({
  plan: z.array(z.string()),
  patch: z.string(),
  risks: z.array(z.string()),
});
export type TaskResult = z.infer<typeof TaskSchema>;

export async function planTask(description: string, code: string | null, playbook: string | null, premium: boolean) {
  const system =
    BASE_SYSTEM +
    ' Plan the requested change. Respond ONLY with JSON: {"plan": string[] (ordered steps), "patch": string (unified diff or full replacement code in markdown fences, based only on supplied code), "risks": string[]}. If no code was supplied, patch should explain what to write and where.' +
    (playbook ? `\n\nUser playbook:\n${playbook}` : "");
  const raw = await call({
    system,
    turns: [{ role: "user", text: `Task: ${description}\n\nCode:\n${code ?? "(none supplied)"}` }],
    json: true,
    premium,
  });
  return TaskSchema.parse(parseJson(raw));
}

function parseJson(raw: string): unknown {
  try {
    return JSON.parse(raw.replace(/^```(?:json)?\s*|\s*```$/g, ""));
  } catch {
    throw new AiError("The AI returned malformed output. Try again.");
  }
}

/** Deterministic score derived from findings. The AI never picks the number. */
export function scoreFindings(findings: Review["findings"]) {
  const weight = { critical: 25, high: 12, medium: 6, low: 2, info: 0 } as const;
  const penalty = findings.reduce((s, f) => s + weight[f.severity], 0);
  return Math.max(0, 100 - penalty);
}
