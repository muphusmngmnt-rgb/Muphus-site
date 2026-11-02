/**
 * MUPHUS — Inhalte (Releases, Labels, Auftritte, Meilensteine)
 * ------------------------------------------------------------
 * Neuen Release hinzufügen: Eintrag kopieren, Cover nach assets/releases/ legen.
 * Einträge mit `placeholder: true` sind Dummy-Platzhalter und nur im devMode sichtbar.
 *
 * HINWEIS zu den Links: Einige Streaming-Links sind Such-Links (öffnen die Suche der
 * Plattform) statt Direktlinks. Direktlinks einfach in `links` austauschen.
 */

/** @typedef {'single'|'collaboration'|'remix'} ReleaseCategory */

export const releases = [
  {
    id: 'letzte-nacht',
    title: 'Letzte Nacht!',
    artists: ['MUPHUS', 'MBMZ', 'LIMIC'],
    releaseDate: '2025-06-13',
    year: 2025,
    label: 'Kontor Records',
    artwork: 'assets/releases/letzte-nacht.webp',
    category: 'collaboration',
    links: {
      spotify: 'https://open.spotify.com/search/Letzte%20Nacht%20MUPHUS%20LIMIC%20MBMZ',
      appleMusic: 'https://music.apple.com/de/search?term=Letzte%20Nacht%20MUPHUS%20LIMIC%20MBMZ',
      soundcloud: 'https://soundcloud.com/search?q=Letzte%20Nacht%20MUPHUS%20LIMIC%20MBMZ',
      youtube: 'https://www.youtube.com/results?search_query=MUPHUS+LIMIC+MBMZ+Letzte+Nacht',
    },
  },
  {
    id: 'mahaba',
    title: 'Mahaba',
    artists: ['MUPHUS'],
    label: 'Run Deep', // laut Cover (RDP364 / RUNDEEP) – bitte bestätigen
    artwork: 'assets/releases/mahaba.webp',
    category: 'single',
    links: {
      spotify: 'https://open.spotify.com/search/MUPHUS%20Mahaba',
      appleMusic: 'https://music.apple.com/de/search?term=MUPHUS%20Mahaba',
      soundcloud: 'https://soundcloud.com/search?q=MUPHUS%20Mahaba',
      youtube: 'https://www.youtube.com/results?search_query=MUPHUS+Mahaba',
    },
  },
  {
    id: 'never-gonna-hard',
    title: 'Never Gonna Hard',
    artists: ['MUPHUS'],
    year: 2024,
    label: 'Future House Cloud',
    artwork: 'assets/releases/never-gonna-hard.webp',
    category: 'single',
    links: {
      spotify: 'https://open.spotify.com/search/MUPHUS%20Never%20Gonna%20Hard',
      appleMusic: 'https://music.apple.com/de/search?term=MUPHUS%20Never%20Gonna%20Hard',
      soundcloud: 'https://soundcloud.com/search?q=MUPHUS%20Never%20Gonna%20Hard',
      youtube: 'https://www.youtube.com/results?search_query=MUPHUS+Never+Gonna+Hard',
    },
  },
  {
    id: 'nowhere-else-lalala',
    title: 'Nowhere Else (LaLaLa)',
    artists: ['MUPHUS', 'BASTL', 'FLX'],
    releaseDate: '2025-07-25',
    year: 2025,
    artwork: 'assets/releases/nowhere-else.webp',
    category: 'collaboration',
    links: {
      spotify: 'https://open.spotify.com/search/Nowhere%20Else%20LaLaLa%20MUPHUS%20BASTL%20FLX',
      appleMusic: 'https://music.apple.com/de/song/1817196546',
      soundcloud: 'https://soundcloud.com/search?q=Nowhere%20Else%20LaLaLa%20MUPHUS',
      youtube: 'https://www.youtube.com/results?search_query=MUPHUS+BASTL+FLX+Nowhere+Else+LaLaLa',
    },
  },
  {
    id: 'siyaphakama',
    title: 'Siyaphakama!',
    artists: ['MUPHUS'],
    year: 2025,
    label: 'Future House Cloud', // abgeleitet vom offiziellen YouTube-Video – bitte bestätigen
    artwork: 'assets/releases/siyaphakama.webp',
    category: 'single',
    links: {
      spotify: 'https://open.spotify.com/search/MUPHUS%20Siyaphakama',
      appleMusic: 'https://music.apple.com/us/song/1814087952',
      soundcloud: 'https://soundcloud.com/search?q=MUPHUS%20Siyaphakama',
      youtube: 'https://www.youtube.com/watch?v=PX_vG8r5qhU',
    },
  },
  {
    id: 'spell-on-my-mind',
    title: 'Spell On My Mind',
    artists: ['Giorgio Gee', 'MUPHUS'],
    year: 2023,
    label: 'You Love Dance',
    artwork: 'assets/releases/spell-on-my-mind.webp',
    category: 'collaboration',
    links: {
      spotify: 'https://open.spotify.com/album/1r1MKHwvhXNQiJjaWo0nSA',
      appleMusic: 'https://music.apple.com/de/album/spell-on-my-mind-single/1674854436',
      soundcloud: 'https://soundcloud.com/search?q=Giorgio%20Gee%20MUPHUS%20Spell%20On%20My%20Mind',
      youtube: 'https://www.youtube.com/results?search_query=Giorgio+Gee+MUPHUS+Spell+On+My+Mind',
    },
  },
  {
    id: 'zauberland',
    title: 'Zauberland',
    artists: ['Pazoo', 'MUPHUS', 'MBMZ'],
    year: 2024,
    label: 'Pazoo Recordings',
    distributor: 'Electrola',
    artwork: 'assets/releases/zauberland.webp',
    category: 'collaboration',
    links: {
      spotify: 'https://open.spotify.com/track/4naOLliMqRMOcfEOBJ1jAP',
      appleMusic: 'https://music.apple.com/us/album/zauberland-single/1783671135',
      soundcloud: 'https://soundcloud.com/search?q=Pazoo%20MUPHUS%20MBMZ%20Zauberland',
      youtube: 'https://www.youtube.com/results?search_query=Pazoo+MUPHUS+MBMZ+Zauberland',
    },
  },
];

/**
 * Labels & Partner. `verified: true` = durch die Timeline/Release-Infos des Artists belegt.
 * `relationship`: 'label' | 'partner' | 'collaborator'. `logo` nur mit Nutzungsrechten.
 */
export const labels = [
  { name: 'Kontor Records', logo: 'assets/labels/kontor-records.png', verified: true },
  { name: 'Universal Music Group', logo: 'assets/labels/universal-music-group.png', verified: true },
  { name: 'Electrola', logo: 'assets/labels/electrola.png', relationship: 'partner', verified: true },
  { name: 'Pazoo Recordings', logo: 'assets/labels/pazoo-recordings.png', verified: true },
  { name: 'Soave', logo: 'assets/labels/soave.png', verified: true },
  { name: 'YouLoveDance.TV', logo: 'assets/labels/youlovedance-tv.png', verified: true },
  { name: 'Future House Cloud', logo: 'assets/labels/future-house-cloud.png', verified: true },
  { name: 'Deepium', logo: 'assets/labels/deepium.png', verified: true },
  { name: 'RUN DBN', logo: 'assets/labels/run-dbn.png', verified: true },
  { name: 'Teamwrk Records', logo: 'assets/labels/teamwrk-records.png', verified: true },
  { name: "Spinnin' Records", logo: 'assets/labels/spinnin-records.png', verified: true },
  { name: 'Revealed', logo: 'assets/labels/revealed.png', verified: true },
  { name: 'Hexagon Records', logo: 'assets/labels/hexagon-records.png', verified: true },
];

/**
 * Auftritte. `project` ordnet jeden Auftritt dem richtigen Artist-Projekt zu.
 * Nature One lief unter dem Alias DANNY DEVOT → ohne Freigabe nicht als MUPHUS-Auftritt
 * sichtbar (config.showAliasPerformances).
 */
export const performances = [
  { id: 'kolibri-1', event: 'Kolibri Festival', note: 'On stage', date: '2026-08-22', alt: 'Kolibri Festival – on stage next to the DJ booth', project: 'MUPHUS', image: 'assets/live/kolibri-stage.webp', video: '', link: '' },
  { id: 'kolibri-2', event: 'Kolibri Festival', note: 'Crowd', date: '2026-08-22', alt: 'Kolibri Festival – view from the stage over the crowd', project: 'MUPHUS', image: 'assets/live/kolibri-crowd-1.webp', video: '', link: '' },
  { id: 'kolibri-3', event: 'Kolibri Festival', note: 'Night show', date: '2026-08-22', alt: 'Kolibri Festival – night show with the crowd in blue light', project: 'MUPHUS', image: 'assets/live/kolibri-crowd-2.webp', video: '', link: '' },
  { id: 'kolibri-4', event: 'Kolibri Festival', note: 'Pyro', date: '2026-08-22', alt: 'Kolibri Festival – flame jets in front of the stage', project: 'MUPHUS', image: 'assets/live/kolibri-pyro.webp', video: '', link: '' },
  // Ohne Foto/Video erst im devMode sichtbar (requiresImage)
  { id: 'stadtfeste', event: 'City Festivals', note: 'Various performances', project: 'MUPHUS', image: '', video: '', link: '', requiresImage: true },
  { id: 'nature-one', event: 'Nature One', project: 'DANNY DEVOT', image: '', video: '', link: '', aliasOnly: true, requiresImage: true },
  // Platzhalter-Slot für weitere bestätigte Auftritte (nur im devMode sichtbar)
  { id: 'ph-live-1', placeholder: true, event: 'Event Name', project: 'MUPHUS', image: '' },
];

/**
 * Karriere-Timeline (chronologisch). `year` groß, optional `sub` (z. B. Datum) darunter.
 */
export const milestones = [
  {
    id: 'm-2022', year: '2022', title: 'Early Releases',
    description: 'First releases as MUPHUS, including “Movies” and “Rollercoaster”.',
  },
  {
    id: 'm-2023', year: '2023', title: 'International Dance Releases',
    description: '“Spell On My Mind” with Giorgio Gee on You Love Dance. Further releases include “Ecstasy”, “Paralysiert” and “Up and Down”.',
  },
  {
    id: 'm-2024', year: '2024', title: 'Future House Cloud & Pazoo Recordings',
    description: '“Never Gonna Hard” on Future House Cloud and “Zauberland” with Pazoo and MBMZ on Pazoo Recordings, distributed by Electrola.',
  },
  {
    id: 'm-2025a', year: '2025', title: 'Major Collaborations & Label Releases',
    description: '“Letzte Nacht!” with LIMIC and MBMZ on Kontor Records. Further releases include “Nowhere Else (LaLaLa)” with BASTL and FLX and “Siyaphakama!”.',
  },
  {
    id: 'm-2025b', year: '2025', title: 'Further Collaborations',
    description: 'Additional releases including “MMMBop”, “Nicht Allein!” and “Shine Like Fire”.',
  },
  {
    id: 'm-2026a', year: '2026', title: 'New Music & Continued Growth',
    description: 'New releases including “1, 2, 3!” with MBMZ and “A Dream”.',
  },
  {
    id: 'm-2026b', year: '2026', sub: 'August 22', title: 'Kolibri Festival',
    description: 'Live performance at Kolibri Festival.', highlight: true,
  },
];
