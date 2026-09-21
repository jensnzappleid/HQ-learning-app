# Harper Learning 🌸

A daily maths (and, next, science) revision app for Harper, built around the **New Zealand Curriculum Year 8** (Phase 3, refreshed 2025 curriculum). Plain HTML/CSS/JS, no build step, works offline as a home-screen app on iPad.

## What it does

- **Practice sessions of 10 / 15 / 20 minutes** (or a set number of questions), either **mixed** across every topic, one **strand** (Number, Algebra, …), or a **single topic**.
- **Randomised numbers every time** so answers cannot be memorised, but the numbers stay "nice".
- **80 % calculation, 20 % word problems**, never two word problems in a row.
- **Three difficulty levels** per topic; the app moves up after two first-try correct answers and down after two misses.
- **Marking with a second chance**: wrong → hint + try again; wrong again → full worked solution, and a fresh question on the same technique comes back later in the session.
- **Revision notes** for every topic: what it is, the method as numbered steps, worked examples, common mistakes.
- **Progress** saved on the device: stars per topic, streak calendar, accuracy by strand, session history, backup / restore.
- Designed for ADHD / ASD: one question per screen, big calm buttons, predictable layout, no flashing, optional on-screen keypad, optional bigger text, light / night colours, reduced-motion respected.

## Files

```
harper-learning/
  index.html                app shell (lists every topic file)
  css/app.css               design tokens + components (light / dark)
  js/core/registry.js       TOPIC + QUESTION schema (read this before adding topics)
  js/core/engine.js         session logic: topic weighting, 80/20 mix, levels, retry queue
  js/core/mark.js           answer marking (numbers, fractions, text, multi-choice)
  js/core/store.js          localStorage progress + settings
  js/art/animals.js         SVG animal mascots
  js/maths/topics/*.js      one generator file per topic (29 topics)
  js/ui.js                  screens
  sw.js / manifest.webmanifest   offline + Add-to-Home-Screen
  scripts/check-topics.js   stress test: every generator × level × kind, 150 times
  scripts/build-single.js   bundles everything into dist/harper-maths.html
```

## Run it

Any static file server works, e.g. from this folder:

```bash
npx serve .          # or: python3 -m http.server 8080
```

Then open `http://localhost:8080`. On the iPad: open the hosted URL in Safari → Share → **Add to Home Screen**. After the first load it works offline.

### Hosting options

- **Vercel**: new project → root directory `harper-learning` → framework "Other" → deploy. (No build command.)
- **GitHub Pages**: publish the `harper-learning` folder.
- **Single file**: `node scripts/build-single.js` → send `dist/harper-maths.html` to the iPad (Files app / AirDrop) and open it in Safari. Progress still saves.

## Adding or changing topics

1. Copy `js/maths/topics/integers.js`, change the id / strand / order, write `learn` and `generate`.
2. Add a `<script>` line for it in `index.html`.
3. `node scripts/check-topics.js your-topic-id` until it prints ✓.

## Curriculum coverage (Year 8)

| Strand | Topics |
|---|---|
| Number | place value & rounding · integers · BEDMAS · factors & primes · powers & roots · fractions + − · fractions × ÷ · decimals · FDP conversions · percentages (incl. GST 15 %) · ratio · rates · estimation |
| Algebra | patterns & rules · expressions & substitution · expanding brackets · solving equations · coordinates & graphs |
| Measurement | metric units · perimeter & area · circles · volume & capacity · time |
| Geometry | angle rules · 2D & 3D shapes · transformations |
| Statistics | mean / median / mode / range · reading graphs & tables |
| Probability | probability |

Science is planned as a second subject using the same engine (`subject: 'science'`).
