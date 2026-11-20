# Changelog

All notable changes to this project are documented here. The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/), and the project follows [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

First version, by Adrián Steinsleger, developed with Claude Opus 5.5.

### Added

- A grid with the 12 notes of the chromatic scale. Tapping a note plays a sustained pure tone until it is tapped again or another note is chosen.
- A4 reference adjustable from 400 to 480 Hz, 440 Hz by default and remembered between visits.
- Octave control from 2 to 7, starting at 4.
- Microphone mode that shows whether the played pitch is too low or too high against the chosen note, in cents and on a needle, and marks it in tune within 5 cents. It compares regardless of octave and shows the detected note.
- Pitch detection with the McLeod Pitch Method, without dependencies.
- Spanish and English, each with its own page at `/es/` and `/en/` and its own note names. The root sends each visitor, and the Android app, to the version in their system language.
- Prerendered pages with their own title, description, canonical URL, hreflang alternates, social preview image and structured data, plus a sitemap and robots.txt. The stylesheet comes inline and the fonts are preloaded.
- A tagline under the name and a short description of the tuner in Settings.
- Accessibility to WCAG 2.2 AA: contrast in both themes, an LED on every chosen option, spoken names for sharps and flats, screen reader announcements of the microphone reading, reduced motion and reflow at 400% zoom.
- Light and dark themes, following the system or chosen in Settings.
- Settings with the theme, credits, feedback links, license, source code and privacy policy.
- A layout that fits any phone without scrolling, upright or on its side, as well as tablets and desktops.
- Android app built with Capacitor, fully offline, whose only permission is the microphone.
- Anonymous visit counts on the website with Vercel Web Analytics, without third-party cookies. The Android app sends nothing.
