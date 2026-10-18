# SAHAYINI localization audit (this round)

## Done (8 languages: ta, en, hi, te, mr, ml, gu, kn)
- **SOS page** – `src/i18n/sosStrings.ts` (new): helpline names/descriptions (numbers unchanged), default contact names and relationships, relationship dropdown, call/delete labels, location errors, offline-kit card, helplines intro. `SosView.tsx` now uses it.
- **Capture Location / Find Nearby Police / Live location share** – `src/i18n/locationStrings.ts` (new, 118 keys x 8 languages, coverage checked by script): all buttons, permission/GPS/camera errors, notices, empty states, consent text, disclaimers, and the prepared emergency SMS text (`buildAlertText`, `buildCaptureMessage` take a language). Components: `CaptureLocationCard`, `NearbyPoliceCard`, `LiveLocationShare`.
- **Scam Protection page** – `src/i18n/scamStrings.ts` (new): the 5 "Common Scam Types" lessons, portal badge, sample labels. The page now also uses the existing `t.scam.*` keys it had been ignoring (description, placeholder, analyzing label, golden-hour notice, 1930 button, portal labels).
- **Learn: women's safety, scholarships, banking, laws** – `src/i18n/legalLocalized.ts` (new): localized category titles/descriptions and lesson card titles/descriptions; lesson reader shows a localized notice that the body is English.

## NOT done / remaining limitations (please read)
1. **Bodies of the 13 lessons in `src/data/legalLessons.ts`** (sections, tips, warnings, summaries, audio scripts, read/listen durations) are still English. They are read aloud with an English voice. They also have no quizzes. This is the largest remaining gap (~39 KB of English legal text to translate x 7 languages). Legal wording needs review by a qualified person before publishing, so I did not machine-translate it.
2. **"NationalDhoka"** does not exist anywhere in this project (searched all source). The hub is titled "National Cyber Crime Reporting Hub" (localized). No feature was invented under that name; tell me if it should be added or renamed.
3. **Sample scam messages** on the Scam page stay English (they feed the English keyword heuristics in `scamHeuristics.ts`; local-language heuristics are not implemented).
4. **Complaint & FIR** strings fall back to English for any key missing from `complaintStrings.ts`; the generated complaint draft is English by design.
5. `NearbyPoliceCard` now shows a generic localized search error instead of the raw server message.
6. Emergency SMS text is written in the sender's selected language; recipients may read another language.
7. Not audited yet: `OfflineSafetyKitModal.tsx`, `AskSahayiniView`, `DashboardView`, `ProfileSettingsView`, `AuthView`, default notifications in `AppContext.tsx` (English), `offlineStorage.ts` fallbacks.
8. All non-English strings are my own translations and need native-speaker review.

## Verification actually run
- `tsx` unit tests: core, update, photoShare, complaint – all passed (English paths).
- Script check: every language has all 118 `LocationStrings` keys.
- Strict `tsc` on the pure modules (strings + share utils): no errors.
- Syntax-level `tsc` on changed React files with `--noResolve`: no syntax/undefined-name errors.
- **Not run (no network, `npm install` fails here):** full `npm run lint`, `npm run build`, browser testing, language switching on open pages, voice/TTS, offline/PWA. Please run `npm install --legacy-peer-deps && npm run lint && npm test && npm run build` locally.
