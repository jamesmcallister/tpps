# TPPS Cloudflare Deployment Checklist

## 1. Domain & Email Routing

- [ ] **Domain Registration/Transfer:** Move or add `tppslandscapes.co.uk` (or your intended domain) to Cloudflare so it manages your DNS.
- [ ] **Email Routing:** Under **Email** -> **Email Routing**, enable Email Routing for the domain.
- [ ] **Inbound Routing:** Once the Worker is deployed, create a custom address or catch-all route that sends inbound emails (e.g., `hello@tppslandscapes.co.uk`) directly to the `tpps-inbox` Worker.
- [ ] **Outbound Verification (Send Email):** Ensure the domain's SPF, DKIM, and DMARC records are fully verified in the Cloudflare Email Routing dashboard so the worker can use the `send_email` binding.

## 2. Cloudflare Zero Trust (Access)

_The Worker is protected behind Cloudflare Access to ensure only you/your team can view the inbox._

- [ ] **Create an Access Application:** In the Zero Trust dashboard, create an application for the dashboard route (e.g., `inbox.tppslandscapes.co.uk`).
- [ ] **Get the `POLICY_AUD`:** Go to the Access Application settings -> Overview, and copy the **Audience Tag (AUD)**. Add this to `apps/email/.dev.vars` (or the `vars` section of `wrangler.jsonc`) under `POLICY_AUD`.
- [ ] **Update `TEAM_DOMAIN`:** Update the `TEAM_DOMAIN` variable in `apps/email/wrangler.jsonc` with your new Zero Trust team domain (e.g., `https://your-team.cloudflareaccess.com/cdn-cgi/access/certs`).

## 3. R2 Storage (File/Attachment Storage)

_The app uses an R2 bucket called `tpps-inbox`._

- [ ] **Create the bucket:** Run `npx wrangler r2 bucket create tpps-inbox` in your terminal, or create it via the Cloudflare Dashboard.

## 4. Workers AI

- [ ] **Enable Workers AI:** Ensure Workers AI is enabled and the terms of service are accepted in your Cloudflare account. The app relies on the `AI` binding to parse and reply to emails automatically.

## 5. Review `wrangler.jsonc` Variables

Before deploying, double-check that the following values are correct in `apps/email/wrangler.jsonc`:

- [ ] `DOMAINS` is set to your actual domain (e.g., `tppslandscapes.co.uk`).
- [ ] `POLICY_AUD` is set to the Audience Tag (AUD) from Zero Trust.
- [ ] `TEAM_DOMAIN` is set to your Zero Trust auth domain.
