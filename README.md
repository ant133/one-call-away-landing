# Landing page

Static landing page with no build step. Open `index.html` and it works. Original
project imagery lives in `assets/` rather than large embedded data URIs.

## Before it goes live

1. **Supabase** — set `SUPABASE_URL` and `SUPABASE_ANON_KEY` at the top of the
   `<script>` in `index.html`. Run `backend/supabase/migrations/0001_waitlist.sql`
   first: the table is insert-only via RLS, which is what makes it safe to ship
   the anon key in a public page. The form cannot read the list back.

2. **WhatsApp channel** — two placeholder `href="#"` links: the footer of
   `index.html` and the button on `thanks.html` (`id="wa"`). Drop the real link in.

3. **Privacy link** — footer of `index.html`, also `href="#"`.

## Languages

English by default; Bahasa if the browser reports `id-*`, and the EN/ID switch in
the header overrides either way. Every string lives in the `I18N.id` object in
`index.html` — English is read from the markup itself, so to change English copy
you edit the HTML, and to change Bahasa you edit the dictionary.

`thanks.html` reads `?lang=id` to match, which the form appends automatically.

## Notes

The page uses progressive enhancement and respects reduced-motion preferences.
