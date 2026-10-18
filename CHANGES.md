# SAHAYINI update notes

Modified: server.ts, index.html, package.json (test script), src/index.css, src/types/index.ts,
src/services/offlineStorage.ts (getOfflineChatResult added; recursion guard in getCachedSchemes),
src/components/common/Logo.tsx, views: AskSahayini, ScamProtection, Learn, Dashboard, Sos, Schemes, ProfileSettings.
Added: src/hooks/useExclusiveSpeech.ts, src/utils/scamHeuristics.ts, src/i18n/extraStrings.ts,
src/utils/update.test.ts, public/sahayini-logo.png, public/sahayini-emblem.png (+ regenerated PWA icons/favicon).

Run: npm install && npm test && npm run build && npm run dev
Needs GEMINI_API_KEY in .env (see .env.example) for live AI chat / scam analysis.
Not verified in a browser: build, service worker, voice playback, live Gemini, offline->online recovery.
Non-English strings in src/i18n/extraStrings.ts need native-speaker review.

## Round 2
- Learn: 4 new topics (Women's Safety & Harassment, Scholarships & Education, Bank Details & Money Safety,
  Indian Acts/Punishments/Fines) and 13 new lessons (src/data/legalLessons.ts), merged in lessonsData getters.
  Lesson text is English (shown for every app language, read aloud with an English voice).
- Ask SAHAYINI: a pasted suspicious message gets a scam analysis in text AND voice (src/services/scamCheck.ts,
  shared with the Scam Protection page).
- Share live location (SOS page + Dashboard card): finds the nearest police station (OpenStreetMap/Overpass,
  needs internet) and opens SMS/WhatsApp pre-addressed to the police station (if it lists a mobile number) and all
  saved emergency contacts (src/components/common/LiveLocationShare.tsx, src/utils/emergencyShare.ts).
  The phone's messaging app sends the message; a web app cannot send SMS or alert police by itself.
- Fixed: missing Logo import in ProfileSettingsView (round 1 bug).

## Round 3 — Ask SAHAYINI chatbot fix
Root cause: server.ts called the retired-for-new-keys model `gemini-2.5-flash`. Google now restricts the 2.5 models to
projects that already used them, so new keys get "model no longer available" (404). The server swallowed that error and
the app then showed the "AI service could not be reached" fallback instead of an AI answer.
- server.ts: model is now `gemini-3.8-flash` (override with GEMINI_MODEL; one backup model is tried only on "model not
  available"). Same SDK call (`ai.models.generateContent`). Key is read only from GEMINI_API_KEY on the server; the
  .env.example placeholder counts as missing. /api/chat now returns real AI text or a structured error
  (no_api_key, invalid_api_key, model_unavailable, quota, busy, timeout, network, empty). The built-in canned replies were
  removed. Language is whitelisted. System prompt rewritten (safety/112 first, no pretend actions, verified-vs-uncertain,
  official sources, no OTP/password requests, plain text for voice). /api/analyze-scam uses the same model helper.
- AskSahayiniView.tsx: failures show a clear localized error with a Retry button (no fake answers); history sent to the AI
  contains real AI answers only; questions (any text with "?") always go to the AI; offline behaviour unchanged.
- types/index.ts, i18n/extraStrings.ts: new error fields/strings (8 languages; need native-speaker review).

## Round 4 — Gemini 503 "high demand" resilience
Cause: gemini-3.8-flash can return HTTP 503 UNAVAILABLE (temporary capacity), and the code only fell back on 404.
- aiModels.ts (new): verified stable Flash chain gemini-3.8-flash -> gemini-3.6-flash -> gemini-3.5-flash-lite
  (Google docs, 14 Oct 2026). 3.7-flash / 3.5-flash are NOT used: Google documents them as aliases of 3.8 / 3.6.
- server.ts: bounded retry policy — temporary errors (503/500/504/timeout/network/empty) get 1 retry on the same model,
  429 and 404 go straight to the next model, invalid key / unknown stop at once. Max 5 calls, 20 s per call, 45 s total.
  Errors are classified into: invalid_api_key, no_api_key, model_unavailable, quota (429), busy (503), timeout, network.
  Removed the deprecated `temperature` parameter (Google: ignored now, HTTP 400 in future models) from the scam call.
- AskSahayiniView / types / extraStrings: separate localized messages for rate limit and unsupported model (8 languages,
  need native-speaker review). UI, Listen, Retry unchanged.
- scripts/check-gemini.ts + `npm run check:ai`: lists the models YOUR key can use and test-calls each chain model.

## Complaint & FIR Support (new feature)
Added: src/components/views/ComplaintSupportView.tsx, src/components/common/ComplaintPoliceFinder.tsx,
src/utils/complaintDraft.ts, src/i18n/complaintStrings.ts, src/utils/complaint.test.ts.
Modified (small edits): src/types/index.ts ('complaint' tab), src/App.tsx (route), src/components/common/Sidebar.tsx (new item),
src/components/views/DashboardView.tsx (navy card), src/components/views/SosView.tsx (link card), package.json (test script).
Drafts are always labelled "NOT YET SUBMITTED"; the app never claims a complaint was submitted or an FIR registered.
Non-English strings in complaintStrings.ts need native-speaker review; the draft text itself is English.


## Update — 14 October 2026

- Expanded Ask SAHAYINI's default quick-question list from 5 to 20 questions in each of the 8 supported languages (Tamil, English, Hindi, Telugu, Marathi, Malayalam, Gujarati and Kannada).
- Updated the online Gemini system instruction to explicitly preserve the selected language across suggested questions, follow-ups, retries and model fallbacks, and to check the answer language before returning it.
- Chatbot answers are now automatically offered as spoken output while remaining visible as text, for both live AI answers and saved offline answers. Actual speech depends on browser/device speech-synthesis support; the UI warns when a matching native voice is unavailable rather than silently reading another language.
- Added Naan Mudhalvan to the government-schemes catalogue using the official Tamil Nadu portal. Eligibility and deadlines are described as opportunity-specific and must be checked on the official portal.
- The ZIP does not include `.env` or `.env.local`; `.env.example` contains placeholders only. Configure the real Gemini key in a local `.env` file after extracting the project.

Verification note: confirmed 8 suggestion arrays with 20 entries each and confirmed the new Naan Mudhalvan entry is present. A full Vite build could not be completed in this environment because dependencies were not installed; `npm install --legacy-peer-deps` timed out, and `tsc --noEmit` reported missing `vite/client` and `vite-plugin-pwa/client` type packages. Run install/build locally to complete verification.

## Offline starter-question answers (follow-up fix)
- Added `src/services/offlineChatAnswers.ts` with locally bundled answers for all 20 Ask SAHAYINI starter questions in each of the 8 supported languages.
- Updated `src/services/offlineStorage.ts` to match a starter question in the selected language (or English) and return its saved localized answer before topic-keyword fallbacks. This works without a Gemini request or internet access.
- Updated `src/utils/update.test.ts` to check all 160 language/question combinations return a saved offline answer.
- Existing speech playback receives the same answer text through the existing chat response flow; actual spoken language depends on the browser/device voice availability.
- Government schemes data already contains the Naan Mudhalvan entry and was preserved.
- Verification limitation: dependency installation timed out in this environment, so the updated automated test suite and production build could not be run here. Please run `npm install --legacy-peer-deps`, `npm test`, and `npm run build` locally.

## Complaint draft preview modal update
- The Generate Complaint Draft button now opens a modal showing the generated complaint for review.
- Added a Download complaint action that downloads the draft as a text file.
- Added Print / Save as PDF action using the browser print dialog.
- Kept the prominent NOT YET SUBMITTED label and clear warning that SAHAYINI does not file the complaint or register an FIR.
- The modal allows users to close it or return to edit details.

## Evidence-photo addition (2026-10-15)
- Added an optional photo-evidence picker to Complaint & FIR Support. On supported phones it can open the camera; users can also choose an existing image.
- The image preview and download are available offline because the selected file remains local to the current browser session. The generated complaint draft records the photo filename as a separately attached piece of evidence.
- The photo is not automatically uploaded or sent. Users must download/share it separately alongside the complaint draft.
- Existing capture-location photo sharing, offline scam-pattern checks, online AI scam analysis, and language selection were retained.

## Localization round (see LOCALIZATION_AUDIT.md)
New: src/i18n/{sosStrings,locationStrings,scamStrings,legalLocalized}.ts, LOCALIZATION_AUDIT.md.
Modified: SosView, ScamProtectionView, CaptureLocationCard, NearbyPoliceCard, LiveLocationShare, LessonReaderModal,
data/lessonsData.ts, utils/emergencyShare.ts, utils/photoShare.ts. Lesson bodies in legalLessons.ts still English.
