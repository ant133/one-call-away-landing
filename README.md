# One Call Away landing page and Android mockup

Static HTML, CSS, and JavaScript; no build step or dependencies.

Run `python3 -m http.server 8080 --directory landing` from the repository root,
then open `http://localhost:8080`.

- `index.html`: responsive landing page with English/Bahasa Indonesia copy.
- `mockup.html`: eight-screen Android design board.
- `mockup.html?mode=interactive&screen=welcome`: connected prototype.
- `mockup.html?embed=1&screen=home`: individual screen, also used by the hero previews.

The eight screens are Welcome, Home, People, Person details, Record a memory,
Review memories, Reminders, and Settings. The prototype uses sample data. It
simulates recording, supports editing and saving memories within a preview,
searches people, and changes reminder preferences. It does not access the
microphone, device calendar, Android settings, or backend. Reloading resets it.
The production Kotlin application in `android/` is not changed by this mockup.

## Files

- `landing.css`, `landing.js`: marketing layout, translations, waitlist submission.
- `app.css`, `app.js`: shared mockup design tokens, screens, and interactions.
- `waitlist-config.js`: existing public Supabase URL and publishable key. Never
  place service-role keys or backend secrets here.
- `assets/generated/`: four original AI-generated PNGs and optimized JPEGs used
  by the site. Asset prompts and handoff notes are in `../docs/UI Design.md`.
- `qa/`: screenshots from local visual verification.

## Waitlist

The existing insert-only Supabase waitlist integration is preserved. Its schema
and policy are in `backend/supabase/migrations/0001_waitlist.sql`. The form keeps
its email value on failure, prevents duplicate submissions while pending, times
out after 15 seconds, and redirects to `thanks.html?lang=en` or `?lang=id` only on
a successful insert or duplicate-address response. A missing configuration
shows an error instead of claiming the visitor joined.

English is the default unless the browser uses Indonesian. The EN/ID switch
persists an optional `oca-lang` preference. The Android concept uses English.
Google Fonts is optional; the layout falls back to the system sans-serif font.
