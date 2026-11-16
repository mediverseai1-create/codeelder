# CodeElder

AI engineering workspace: assistant chat, code review, task planner, playbooks, credits and billing.
Next.js 16, React 19, Tailwind 4, Supabase (auth, Postgres, RLS), Gemini API.

## Setup
1. `npm install`
2. Create a Supabase project and run `supabase/schema.sql` in the SQL editor.
3. In Supabase Auth settings add your site URL and `<site>/auth/callback` as redirect URLs.
4. Copy `.env.example` to `.env.local` and fill every value.
5. `npm run dev`

## Plans and payments
Free (20 credits), Solo $47, Pro $57, Max $97, assumed monthly. Chat = 1 credit, review = 3, task = 5.
The $97 payment link has not been supplied. The Max card shows "Contact us" until `NEXT_PUBLIC_PAYLINK_MAX` is set.

Plans are never activated by returning from a payment page. Activation happens only via:
- `POST /api/webhooks/selar` with header `x-webhook-secret: $SELAR_WEBHOOK_SECRET`. The payload field names are a best guess and must be verified against the provider's real webhook before you rely on it.
- `POST /api/admin/activate` with `{email, plan}` by a signed-in user listed in `ADMIN_EMAILS`, after you confirm payment manually.

## Deploy to Vercel
Import the GitHub repo, add all variables from `.env.example` (service role and Gemini keys server-only), deploy, then set the Supabase redirect URLs to the Vercel domain.
