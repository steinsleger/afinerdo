# Agent guide

Afinerdo, called Nerd Tuner in English, is a chromatic tuner built as a static Vite + React + TypeScript site, packaged for Android with Capacitor from the same build. There is no backend, router, UI library or i18n library.

## Commands

Use pnpm 12 through Corepack (`corepack enable`, or prefix commands with `corepack`). Stay on Node 24: it runs the TypeScript tests natively and, unlike Node 26, ships Corepack, which the Vercel build needs.

- `pnpm test`: unit tests in `src/*.test.ts`
- `pnpm build`: type-check, build into `dist/` and prerender one page per language
- `pnpm dev`: development server
- `pnpm android`: build and copy `dist/` into `android/` with `cap sync`

## Map

- `src/notes.ts`: equal temperament maths, note names, the A4 and octave ranges and cents against a target pitch class.
- `src/pitch.ts`: McLeod Pitch Method with an FFT autocorrelation. `createPitchDetector` allocates its buffers once, so detecting a frame allocates almost nothing.
- `src/tuning.ts`: turns the per-frame frequencies into a steady reading: smoothing, holding through short dropouts and the in-tune hold.
- `src/tone.ts`: the shared `AudioContext` and the sine voice. `src/useListener.ts`: microphone, analyser and the frame loop.
- `src/Display.tsx`: the screen, which shows the tone readout or `TuningMeter.tsx`, with note names from `NoteName.tsx`. `src/NoteGrid.tsx`, `src/Stepper.tsx`, `src/Segmented.tsx` and `src/ModeSwitch.tsx`: controls. `src/Settings.tsx`: the settings dialog with the theme and the credits.
- `src/i18n.ts`: every visible string, one dictionary per language, the language context and `languageOfPath`. `src/preferences.ts`: localStorage and the theme.
- `src/seo.ts`: canonical and hreflang URLs, Open Graph and structured data for `https://afinerdo.com.ar`, with each page's title and description taken from its dictionary. `src/Head.tsx`: head tags, with the Open Graph ones shared by the root page. `src/entry-server.tsx`: the pages, the x-default root page and the sitemap.
- `scripts/prerender.mjs`: writes `dist/es/`, `dist/en/`, the root page and the sitemap, with the stylesheet inline and the fonts preloaded.
- `public/og-es.png` and `public/og-en.png`: screenshots of each page at 1200×630 in the light theme with A4 sounding. Take them again when the design changes. `public/apple-touch-icon.png`: `favicon.svg` at 180px on an opaque background.
- `src/fonts/`: Martian Mono and a two-glyph subset of Noto Sans Mono for ♯ and ♭, which Martian Mono lacks.
- `android/`: the Capacitor project. `app/src/main/assets/public` is generated and ignored.

## Rules

- The interface is in formal Spanish: address the user as `usted`, never as `vos` or `tú`. Every string lives in `src/i18n.ts`, and `en` is typed as `typeof es`, so a missing key fails the build. Proper names and units such as Hz and ¢ are the same in every language and stay in the components. A new language only needs a new dictionary in `STRINGS`, which includes its page title and description, and its social preview image in `public/`.
- Note names come from each dictionary's `naturals`. A black key is named as a sharp of the note below, with the flat of the note above as its second name.
- The microphone loop never goes through React state: `TuningMeter` writes `data-state`, `--cents` and text through refs. React renders only on taps.
- The microphone opens only while `TuningMeter` is mounted, which means listen mode with a target note, and with `echoCancellation`, `noiseSuppression` and `autoGainControl` off, because they distort a sustained tone. Hiding the page releases the note, which stops both the tone and the microphone, and suspends the `AudioContext` once the tone has faded out, because suspending cuts the output at once and clicks.
- Listen mode compares against the target's pitch class with the octave folded to ±600 cents, so the octave control is disabled there.
- `unlockAudio()` must run inside the tap handler, or iOS keeps the `AudioContext` silent.
- Only choices made by the user are stored, through `usePreference`, so untouched defaults keep following the system. Storage keys start with `afinerdo:`. `index.html` reads `afinerdo:theme` before the first paint, so keep both in sync.
- Nothing may need scrolling on a phone on its side, or upright with at least 480px of height. Heights follow the viewport: `--note-size` sets the screen and key rows flex down to 36px. Below 540px of height the screen and the controls tighten and key rows go down to 32px. A phone on its side switches to the two-column layout, whose screen column keeps 250px for the widest readout, and a black key too small for both names hides its flat.
- Colors are tokens on `:root` built with `light-dark()`, and `data-theme` on `<html>` overrides the system. There is one signal color, `--signal`. A new font goes into `src/fonts/` and into `LICENSE`.
- The Android app is offline: its manifest declares only `RECORD_AUDIO` and `MODIFY_AUDIO_SETTINGS`, with no `INTERNET`. Capacitor's `BridgeWebChromeClient` turns the WebView's audio request into the runtime permission. On Android, safe areas come from Capacitor's `--safe-area-inset-*` variables, with `env()` as the fallback.
- The adaptive icon is the vector in `android/app/src/main/res/drawable/ic_launcher_foreground.xml`. The legacy PNG mipmaps and the favicon share the same design in `public/favicon.svg`: change all of them together.
- Google Play's payments policy rejects donation links in apps by individuals. If donations are added, keep them out of the Android build.
- The website counts visits with Vercel Web Analytics, injected in `main.tsx` only when `Capacitor.isNativePlatform()` is false, so the Android app sends nothing. `PRIVACY.md` describes what it records: keep them in sync.
- There is no language selector. Each page's language comes from its path, `/es/` or `/en/`, so search engines index both. The root page is the x-default: it sends each visitor, and the Android app, to the first supported language among `navigator.languages`, or else English. Capacitor answers every path without an extension with the root page, so the app goes to `/es/index.html` instead of `/es/`.
- Every page is prerendered and hydrated, so the first client render must match the prerendered HTML: read localStorage in layout effects, as `usePreference` does, never during render, and touch no browser global while a module loads, because the prerender runs in Node.
- Each page has its own title, description, canonical URL, hreflang alternates, Open Graph tags and structured data, all from `src/seo.ts`. Never hide text from users to show it to search engines.
- The interface meets WCAG 2.2 AA in both themes: 4.5:1 for text, 3:1 for controls, states and focus rings, which use `--focus`. A state never relies on a shade alone, so keys and options carry LEDs. Disabled controls only dim, since WCAG exempts them. Black keys hide ♯ and ♭ from screen readers and carry their spoken name as hidden text, which also keeps the visible label in the accessible name. Note names on the screen do the same through `NoteName`. Microphone states reach screen readers through the `role="status"` region in `Display`, which stays mounted while the meter comes and goes, at most once per `createAnnouncer` interval. Transitions stop under `prefers-reduced-motion`, and the side-by-side layout needs 560px of width, so 400% zoom reflows to the stack.
- Claude is credited in the documentation and `LICENSE`, never in the app.
- In documents, do not break lines in the middle of a sentence.

## Dependencies

`pnpm-workspace.yaml` rejects versions younger than 3 days and fails if a package loses its trust level. Do not add exclusions or bypass this. Pick an older version instead. Dependency build scripts stay blocked unless listed in `allowBuilds`. GitHub Actions are pinned by commit SHA.

## Style

Keep code simple and easy to test, with few comments and self-explanatory names. No emojis. Do not add functionality nobody asked for. Update `CHANGELOG.md` for user-facing changes. On a release, bump `version` in `package.json` to match the newest entry, following Semantic Versioning. Android reads it as `versionName`; raise `versionCode` in `android/app/build.gradle` as well.
