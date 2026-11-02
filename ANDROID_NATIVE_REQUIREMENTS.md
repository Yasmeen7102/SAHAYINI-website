# SOS features that need the native Android app (Capacitor)

The web version of SAHAYINI cannot do the following. None of it is faked in the web UI; the SOS page says
so in all eight languages. These are the changes needed if you want them. **None of this is implemented yet.**

## 1. Background voice monitoring (screen off / app not open)
A browser tab stops listening when it is hidden or the screen locks. Needed:
- A Capacitor plugin (or small custom plugin) running an Android **foreground service** with a persistent
  notification ("SAHAYINI is listening"), `foregroundServiceType="microphone"`.
- Permissions in `AndroidManifest.xml`: `RECORD_AUDIO`, `FOREGROUND_SERVICE`, `FOREGROUND_SERVICE_MICROPHONE`,
  `POST_NOTIFICATIONS` (Android 13+), and a battery-optimisation exemption request.
- On-device phrase detection (Android `SpeechRecognizer`, or an offline keyword spotter) so audio is not sent to a server.
- Re-use `src/utils/sosLogic.ts` rules (strong vs weak phrases, 2.5 s sustained loud sound, cancel cool-down).
- Android 14+ restricts starting microphone foreground services from the background; the user must start monitoring
  while the app is visible.

## 2. Sending the alert automatically
A web page can only open the SMS/WhatsApp app with a prefilled message; the user must tap Send.
- SMS without user interaction: `SEND_SMS` permission via a native plugin (Google Play restricts this permission to
  default-SMS-handler apps, so a Play Store release needs a policy declaration, or use a server-side SMS gateway instead).
- WhatsApp cannot be sent silently by any app; use SMS or a server-side messaging service.
- Server-side alternative: a backend endpoint (Twilio / MSG91 / similar) that sends the alert. This needs an API key kept
  on the server only, never in the web bundle.

## 3. Live location links that update for contacts
The web page can only share a snapshot link. A link that keeps updating for contacts needs:
- A backend (for example Supabase table + a small viewer page) storing the latest position per share session, with an
  expiring random token in the link, and a Stop button that deletes it.
- Background updates from the app: `@capacitor/geolocation` or a background-geolocation plugin, a foreground service
  of type `location`, and permissions `ACCESS_FINE_LOCATION`, `ACCESS_BACKGROUND_LOCATION` (needs Play Store review).

## 4. Other
- Calling 112 / contacts: `tel:` links already work in the app WebView.
- Photos: `@capacitor/camera` gives a more reliable camera/gallery picker than the browser file input.
- Native share with files: `@capacitor/share`.
