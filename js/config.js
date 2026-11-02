/**
 * MUPHUS — zentrale Site-Konfiguration
 * ------------------------------------------------------------
 * Alle häufig geänderten Werte stehen hier. Leere Strings ('') bedeuten
 * "noch nicht vorhanden" – die Website zeigt dann einen sichtbaren,
 * sauberen Platzhalter (devMode) oder blendet das Element aus (Live-Modus).
 *
 * VOR DEM LAUNCH: devMode auf false setzen.
 * Hinweis: Meta-Tags (Title/Description/OG) für Suchmaschinen stehen
 * statisch in index.html, weil Crawler kein JavaScript voraussetzen sollen.
 */
export const config = {
  /** true = Platzhalter + Hinweise sichtbar. false = Live-Modus ohne Dummy-Daten. */
  devMode: true,

  artist: {
    name: 'MUPHUS',
    descriptor: 'DJ / PRODUCER · GERMANY',
    // Vorschlag aus dem Briefing – final abstimmen
    claim: 'MUSIC IS MORE THAN SOUND.',
  },

  /** Booking: Empfänger hier eintragen, z. B. 'booking@deine-domain.de' */
  booking: {
    email: 'muphus.mngmnt@gmail.com',
    subject: 'Booking Inquiry – MUPHUS',
  },

  /** EPK: PDF in /files/ ablegen und Pfad eintragen, z. B. 'files/MUPHUS-EPK.pdf' */
  epk: {
    url: 'files/MUPHUS-EPK.pdf',
  },

  /**
   * Hero-Hintergrundvideo (lokal gehostet, DSGVO-freundlich).
   * Empfehlung: 1920×1080, H.264 MP4 (+ optional WebM), 8–15 s Loop, ohne Ton, < 6 MB.
   * Beispiel: mp4: 'assets/hero/hero.mp4', poster: 'assets/hero/hero-poster.jpg'
   */
  hero: {
    mp4: 'assets/hero/hero.mp4',          // 1080p (Desktop)
    mp4Small: 'assets/hero/hero-720.mp4', // 720p (Smartphone/Tablet, spart Datenvolumen)
    webm: '',
    poster: 'assets/hero/hero-poster.jpg',
    // Weichzeichner in px (0 = scharf). Nur nötig, falls ein Clip Text/Credits enthält.
    // Aktuell 4 = leichter Weichzeichner; 0 = scharf.
    blur: 4,
  },

  /**
   * Offizielles Musikvideo (YouTube). Wird erst nach Klick geladen
   * (Zwei-Klick-Lösung über youtube-nocookie.com), damit beim Seitenaufruf
   * keine Daten an Google übertragen werden.
   */
  officialVideo: {
    youtubeId: 'crXwXducDX0',
    title: 'Official Music Video',
  },

  /** Social-Links – leer lassen, bis verifiziert */
  socials: {
    instagram: 'https://www.instagram.com/official.muphus',
    spotify: 'https://open.spotify.com/intl-de/artist/6u1e1yxbcOzQ96mQl2L6ta?si=yG9hBvUOSaewEOxUya1qyw',
    soundcloud: 'https://soundcloud.com/officialmuphus',
    youtube: 'https://www.youtube.com/@MUPHUS88/videos',
    tiktok: 'https://www.tiktok.com/@official.muphus',
  },

  /**
   * Kennzahlen – vom Artist kommuniziert, VOR Veröffentlichung bestätigen.
   * Die 4M+ gelten für BEIDE Artist-Projekte zusammen (siehe `note`).
   */
  stats: [
    {
      value: 3.5,
      suffix: 'M+',
      label: 'Spotify Streams',
      note: '',
      confirmed: true,
    },
    {
      value: 1000,
      suffix: '+',
      label: 'Radio Airplays',
      note: '',
      confirmed: true,
    },
    {
      value: 4000,
      suffix: '+',
      label: 'Shazams',
      note: '',
      confirmed: true,
    },
  ],

  about: {
    // Pfad zum Portrait/Studiofoto, z. B. 'assets/about/portrait.jpg'
    portrait: 'assets/about/portrait.jpg',
    portraitAlt: 'MUPHUS – Portrait',
    // **fett** wird hervorgehoben. Jeder Eintrag = ein Absatz.
    text: [
      "Hey! I'm Marvin, better known as MUPHUS, a music producer and DJ from Germany with nearly a decade of experience in electronic music.",
      "My musical journey started at a young age with drums, followed by teaching myself piano and developing a passion for melodies, harmonies and sound design. Eventually, discovering FL Studio opened the door to electronic music production and became the foundation of what MUPHUS is today.",
      "Since then, my music has reached listeners around the world, surpassing **3.5 million Spotify streams**, generating over **1,000 radio airplays** and more than **4,000 Shazams**. Along the way, I've released music through established labels including Kontor Records, Electrola, Pazoo Recordings, Soave, You Love Dance and Future House Cloud, while collaborating with talented artists.",
      "My sound is rooted in **Bass House and Future House**, combining energetic rhythms, distinctive melodies and powerful electronic elements. However, I never want to limit myself to one genre. Experimentation, emotion and creative freedom are what drive my production process.",
      "From the studio to the stage, every release is another step in an ongoing journey. And this is only the beginning.",
    ],
    facts: [
      { label: 'Based in', value: 'Germany' },
      { label: 'Role', value: 'DJ / Producer' },
      { label: 'Field', value: 'Electronic Music' },
    ],
  },

  /** Alias-Auftritte (z. B. DANNY DEVOT) nur nach ausdrücklicher Freigabe anzeigen */
  showAliasPerformances: false,

  /** Namen aus dem Briefing auch vor Verifizierung anzeigen? */
  showUnverifiedLabels: true,
};
