# Circle of Fifths

**[Live demo →](https://jamesmandrews.github.io/circle-of-fifths/)**

An interactive circle of fifths for people who don't read music. Click a key on the
wheel and you get every chord that belongs to it — the seven diatonic triads, their
7th-chord versions, and the common borrowed chords — each one a button that plays a
real piano sample.

No notation, no staff, no prerequisites. The Roman numeral tells you the chord's job;
the wheel shows you where it lives.

## Features

- **Two-ring wheel** — outer ring is the 12 major keys, inner ring their relative
  minors. Tapping either ring both selects the key *and* sets the mode, so choosing
  "A minor" is one click, not two.
- **Live highlighting** — selecting a key lights up every segment that belongs to it,
  colour-coded by chord quality (major / minor / diminished), with borrowable chords
  marked in green.
- **Three chord sets per key** — basic triads, the same chords as 7ths, and borrowable
  (modal interchange) chords with their source and typical resolution.
- **Everything is audible** — click any chord to hear it. `▶ Play I – IV – V – vi`
  plays the progression.
- **Chord-colour glossary** — a second tab listing non-diatonic flavours (dominant 7,
  sus4, add9, augmented, …) built on whatever tonic you've selected, each with a
  plain-English description of what it sounds like.
- **Keyboard accessible** — wheel segments are focusable and respond to Enter/Space.

## Running it

There's no build step, no dependencies, and no package manager. Open the file:

```
open index.html
```

That's it. Everything is vanilla HTML/CSS/JS and the audio samples are local files
loaded through plain `<audio>` elements, so `file://` works fine.

If you'd rather serve it over HTTP:

```
python3 -m http.server 8777
# then visit http://localhost:8777/index.html
```

## Project layout

```
index.html          Page shell — header, SVG mount point, panel markup, footer
app.js              All logic: theory data, SVG generation, audio, rendering
styles.css          Layout, theming, responsive rules
assets/piano/       16 Salamander piano samples (~944 KB total)
```

Three files and a sample folder. Deliberately.

## How it works

### The theory data

Everything derives from one table, `CIRCLE` (`app.js:9`) — 12 entries, each holding a
major key, its relative minor, and the seven notes of the major scale. The minor scale
is not stored separately; it's the major scale rotated by five (`rotate(entry.scale, 5)`
at `app.js:327`), which is exactly what "relative minor" means.

The rest is lookup tables:

| Table | Purpose |
| --- | --- |
| `PC` (`app.js:24`) | Note name → pitch class 0–11. Handles enharmonics (`C#`/`Db`, `E#`, `Cb`). |
| `SHAPES` (`app.js:42`) | Chord shape → semitone intervals from the root. `maj: [0,4,7]`, `dom7: [0,4,7,10]`, etc. |
| `SHAPE_SUFFIX` (`app.js:50`) | Shape → the symbol printed after the root (`m7♭5`, `°7`, `maj7`). |
| `MAJOR_DEGREES` / `MINOR_DEGREES` (`app.js:64`) | Roman numeral, quality, and 7th-chord form for each scale degree. |
| `MAJOR_BORROWED` / `MINOR_BORROWED` (`app.js:84`) | Modal interchange chords as a semitone offset from the tonic, plus where they came from and where they want to go. |
| `GLOSSARY` (`app.js:101`) | Non-diatonic chord flavours with plain-English blurbs. |

Adding a chord type means adding one row. Nothing else needs to know about it.

### The wheel

The SVG is generated at runtime by `buildCircle()` (`app.js:148`), not authored by hand.
Each of the 12 keys gets a 30° slice; `annularSector()` (`app.js:128`) emits the path for
a ring segment given inner radius, outer radius, and a start/end angle. Outer ring spans
radius 150–220, inner ring 96–150, on a fixed `viewBox="0 0 480 480"`.

Highlighting works by class, not by redraw. `render()` (`app.js:305`) clears the state
classes off every segment, then re-adds `selected` / `in-maj` / `in-min` / `in-dim` / `bhl`
based on the current key. Major and diminished chords resolve to the outer ring, minor
chords to the inner ring, via `MAJOR_PC_INDEX` / `MINOR_PC_INDEX` (`app.js:34`).

### Audio

The primary path is sample-based. Sixteen piano notes are loaded up front by
`initSamples()` (`app.js:201`) — C, D♯, F♯ and A across four octaves. To play an
arbitrary note, `playPianoNote()` (`app.js:220`) finds the nearest sample and pitch-shifts
it by setting `playbackRate` to `2^(semitones/12)`, with `preservesPitch = false` so the
browser resamples rather than time-stretches. Worst case is a 1.5-semitone shift, which
is small enough to still sound like a piano.

If any sample fails to load, `pianoOk` flips false and `playChordSynth()` (`app.js:239`)
takes over — triangle-wave oscillators through a Web Audio gain envelope. Not pretty,
but the app never goes silent.

Chords are built by mapping the shape's intervals over the root: `60 + rootPc + interval`,
so everything sounds in the octave above middle C.

### Responsive behaviour

Two layouts, and they follow different rules on purpose.

**Desktop (> 700px)** is deliberately constrained to a single screen — no scrolling, ever.
`body` is locked to `100dvh` with `overflow: hidden`, and `fitPanel()` (`app.js:419`)
measures the panel content against the available height and applies a `transform: scale()`
to shrink it until it fits (floor of 0.4). The wheel and the chords stay visible together.

**Mobile (≤ 700px)** drops that constraint. The height locks are released, `fitPanel()`
returns early, and the page scrolls normally. Shrinking to 0.4 on a phone produced ~6px
text, which is worse than a scrollbar. The circle becomes width-bound rather than
height-bound so its labels stay legible, tap targets grow, and all `:hover` rules are
gated behind `@media (hover: hover)` so a tap doesn't leave a stuck highlight.

The 700px breakpoint is defined in both `styles.css` and `app.js:416` (`MOBILE`). If you
change one, change the other — there's a comment in each pointing at the other.

## Known limitations

- **Landscape phones look bad.** A landscape iPhone is roughly 844×390, which lands in
  the 700–860px range: it gets the stacked column layout from `styles.css:47` with the
  circle capped at `34vh` (≈130px), while `fitPanel()` still crushes the panel. A wide,
  short screen actually wants the *desktop* two-column layout. Known, unfixed, left alone
  on purpose.
- **Orientation can't be locked.** For the record: `screen.orientation.lock()` is
  Chrome-Android-only and requires fullscreen; iOS Safari has never supported it. The
  manifest `orientation` field only applies to installed PWAs. There is no web API that
  fixes the point above by force.
- **Four chord shapes are defined but unused.** `mMaj7`, `m6`, `maj9` and `m9` exist in
  `SHAPES` and `SHAPE_SUFFIX` but aren't surfaced anywhere in the UI. Add a row to
  `GLOSSARY` to expose one.
- **Enharmonic spelling is simplified.** Borrowed chords are named from `FLAT_NAMES`
  (`app.js:30`), so you'll occasionally see a flat where a theorist would write a sharp.

## Extending it

- **New chord flavour in the glossary** — add the intervals to `SHAPES`, the symbol to
  `SHAPE_SUFFIX`, a colour class to `SHAPE_COLOR`, and one row to `GLOSSARY`.
- **New borrowed chord** — add a row to `MAJOR_BORROWED` or `MINOR_BORROWED` with its
  semitone offset from the tonic. The wheel highlighting picks it up automatically.
- **Different progression on the play button** — the sequence lives in the click handler
  at `app.js:458`.
- **Recolour** — the palette is CSS custom properties at the top of `styles.css`.

## Browser support

Modern evergreen browsers. Uses `matchMedia().addEventListener` (not the deprecated
`addListener`), `100dvh`, CSS custom properties, `@media (hover: hover)`, and
`HTMLMediaElement.preservesPitch` with `webkit`/`moz` prefixes for older Safari and
Firefox. Web Audio is only touched in the synth fallback path.

## Credits

Piano samples are from the [Salamander Grand Piano](https://archive.org/details/SalamanderGrandPianoV3)
by Alexander Holm, released under CC BY 3.0. If you redistribute this project, keep that
attribution.

## Licence

Copyright © 2026 James M Andrews. All rights reserved. See [`LICENSE`](LICENSE).

Proprietary — no licence is granted by the source being public. The piano samples in
`assets/piano/` are the exception: they are third-party work under CC BY 3.0 and keep
their own terms, which is why the attribution is shown in the footer of the app itself
and not only here. The credit has to travel with the work wherever it's served.
