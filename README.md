# MUPHUS — Official Artist Website

Statische Website ohne Build-Schritt (HTML, CSS, ES-Module). Three.js und Schriften sind lokal eingebunden, beim Seitenaufruf werden keine Drittanbieter kontaktiert.

## Lokal starten

ES-Module funktionieren nicht über `file://`. Ordner mit einem kleinen Server öffnen:

```bash
cd muphus-site
python3 -m http.server 8000     # dann http://localhost:8000
```

## Was du pflegst

| Datei | Inhalt |
|---|---|
| `js/config.js` | devMode, Claim, Booking-Mail, EPK-PDF, Hero-Video/Poster, Social-Links, Kennzahlen, About-Text |
| `js/data.js` | Releases, Labels, Auftritte, Meilensteine |
| `assets/` | Logos (Originale unverändert), `releases/`, `live/`, `about/`, `hero/` |
| `files/` | EPK-PDF |

Leere Werte erscheinen im `devMode` als sichtbare Platzhalter, im Live-Modus werden sie ausgeblendet.

## Vor dem Launch

1. `devMode: false` in `js/config.js`
2. Booking-E-Mail, EPK-PDF, Social-Links eintragen
3. Platzhalter-Releases (`ph-…`) in `js/data.js` durch echte Einträge ersetzen
4. Labels, Kennzahlen, Jahreszahlen und Auftritte vom Artist bestätigen lassen
5. `impressum.html` und `datenschutz.html` mit echten Angaben füllen (rechtlich prüfen)
6. In `index.html` OG-Image/URL als absolute Domain eintragen, Meta-Texte prüfen

## Hero-Video

Eingebunden sind `assets/hero/hero.mp4` (1080p, ca. 3,8 s Loop), `hero-720.mp4` (Mobile) und `hero-poster.jpg`. Austauschen: neue Dateien mit gleichem Namen ablegen (H.264, ohne Ton, möglichst unter 6 MB) oder Pfade in `js/config.js` unter `hero` ändern. `hero.blur` (px) kann Text im Video unleserlich machen. Bei Reduced-Motion, Datensparmodus oder Fehler bleibt das Poster stehen.

## Diskografie

Covers liegen in `assets/releases/`, die Einträge in `js/data.js`. Einige Streaming-Links sind Such-Links statt Direktlinks und können dort jederzeit ausgetauscht werden.

## Labels

Die 13 Label-Logos liegen als weiße PNGs in `assets/labels/`, die Einträge in `js/data.js` (`labels`). Neues Label: Logo ablegen, Eintrag mit `name`, `logo`, optional `url` ergänzen. Vor Launch bitte Nutzungsrechte der Logos bestätigen.

## EPK

Das EPK-PDF liegt unter `files/MUPHUS-EPK.pdf` (Pfad in `js/config.js` unter `epk.url`). Der EPK-Button und der Header-Link öffnen es in einem neuen Tab, „Save PDF“ lädt es herunter. Zum Austauschen einfach die Datei mit gleichem Namen ersetzen. Achtung: Das PDF enthält Telefonnummer und Klarnamen und ist damit öffentlich abrufbar.

## Kontakt

Booking-Mail, Spotify, Instagram, TikTok, SoundCloud und YouTube sind in `js/config.js` eingetragen (der Hero-Button „Open Spotify“ nutzt `socials.spotify`).

## Hinweise

- Das offizielle YouTube-Video lädt erst nach Klick (Zwei-Klick-Lösung, youtube-nocookie.com).
- Nature One lief unter DANNY DEVOT und wird nicht als MUPHUS-Auftritt gezeigt (`showAliasPerformances`).
- `assets/muphus_*_trimmed.png` sind nur zugeschnittene Kopien der Originale (transparenter Rand entfernt), nicht verändert.
- Three.js (r187) liegt in `vendor/` und ist nicht minifiziert; für maximale Performance beim Deployment minifizieren.
- Schriften: Space Grotesk und Inter (SIL OFL, Lizenztexte in `fonts/`).
