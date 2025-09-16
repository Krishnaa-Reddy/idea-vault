# IdeaVault – Architecture

## 🖥️ Frontend

- Angular 20+
- Tailwind CSS
- Spartan UI (shadcn-style components)
- NGX-UI (animations - planned later)

## ⚙️ Backend

- Supabase (DB + auth + edge functions)
- Cron jobs for samrt reminders
- _Redis (future: cache/queue; if the app scales by any chance)_

## 🔑 Authentication

- Google OAuth via Supabase
- LocalStorage (for anonymous/offline usage)
- Smart Reminders = requires login

## 📩 Integrations

- Emails → Resend API (Free Tier)

Planned (Later):

- Link metadata → metadata-scraper
- AI → Gemini for suggestions/autocomplete
- _WhatsApp (Future: Twilio experiments, optional)_

## 🌍 Deployment

- Domain: [ideavault.space](http://ideavault.space/)
- Hosting planned via Vercel/Github Pages/Netlify
