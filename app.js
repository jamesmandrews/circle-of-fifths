/* ============================================================
   Circle of Fifths — beginner music theory reference
   No notation. Click a key -> see + hear ALL of its chords:
   the diatonic triads, their 7th versions, and the common
   borrowable (modal interchange) chords. Every chord is a
   button you can click to hear it and intermix by ear.
   ============================================================ */

const CIRCLE = [
  { major: 'C',  minor: 'Am',  scale: ['C','D','E','F','G','A','B'] },
  { major: 'G',  minor: 'Em',  scale: ['G','A','B','C','D','E','F#'] },
  { major: 'D',  minor: 'Bm',  scale: ['D','E','F#','G','A','B','C#'] },
  { major: 'A',  minor: 'F#m', scale: ['A','B','C#','D','E','F#','G#'] },
  { major: 'E',  minor: 'C#m', scale: ['E','F#','G#','A','B','C#','D#'] },
  { major: 'B',  minor: 'G#m', scale: ['B','C#','D#','E','F#','G#','A#'] },
  { major: 'F#', minor: 'D#m', scale: ['F#','G#','A#','B','C#','D#','E#'] },
  { major: 'Db', minor: 'Bbm', scale: ['Db','Eb','F','Gb','Ab','Bb','C'] },
  { major: 'Ab', minor: 'Fm',  scale: ['Ab','Bb','C','Db','Eb','F','G'] },
  { major: 'Eb', minor: 'Cm',  scale: ['Eb','F','G','Ab','Bb','C','D'] },
  { major: 'Bb', minor: 'Gm',  scale: ['Bb','C','D','Eb','F','G','A'] },
  { major: 'F',  minor: 'Dm',  scale: ['F','G','A','Bb','C','D','E'] },
];

const PC = {
  'C':0,'B#':0,'C#':1,'Db':1,'D':2,'D#':3,'Eb':3,'E':4,'Fb':4,
  'E#':5,'F':5,'F#':6,'Gb':6,'G':7,'G#':8,'Ab':8,'A':9,'A#':10,'Bb':10,
  'B':11,'Cb':11
};

const FLAT_NAMES = ['C','Db','D','Eb','E','F','Gb','G','Ab','A','Bb','B'];

// Which circle segment a chord root lands on: major chords -> outer ring,
// minor chords -> inner (relative-minor) ring.
const MAJOR_PC_INDEX = {};
const MINOR_PC_INDEX = {};
CIRCLE.forEach((e, i) => {
  MAJOR_PC_INDEX[PC[e.major]] = i;
  MINOR_PC_INDEX[PC[e.minor.replace('m', '')]] = i;
});

// Interval recipes (semitones from root) for every chord shape we play.
const SHAPES = {
  maj:  [0,4,7],       min:  [0,3,7],       dim:  [0,3,6],      aug: [0,4,8],
  maj7: [0,4,7,11],    dom7: [0,4,7,10],    m7:   [0,3,7,10],
  m7b5: [0,3,6,10],    dim7: [0,3,6,9],     mMaj7:[0,3,7,11],
  sus2: [0,2,7],       sus4: [0,5,7],       six:  [0,4,7,9],    m6:  [0,3,7,9],
  add9: [0,4,7,14],    nine: [0,4,7,10,14], maj9: [0,4,7,11,14],m9:  [0,3,7,10,14],
};

const SHAPE_SUFFIX = {
  maj:'', min:'m', dim:'°', aug:'+',
  maj7:'maj7', dom7:'7', m7:'m7', m7b5:'m7♭5', dim7:'°7', mMaj7:'m(maj7)',
  sus2:'sus2', sus4:'sus4', six:'6', m6:'m6', add9:'add9', nine:'9', maj9:'maj9', m9:'m9',
};

const SHAPE_COLOR = {
  maj:'maj', aug:'maj', maj7:'maj', dom7:'maj', six:'maj', add9:'maj', nine:'maj',
  maj9:'maj', sus2:'maj', sus4:'maj',
  min:'min', m7:'min', m6:'min', m9:'min', mMaj7:'min',
  dim:'dim', dim7:'dim', m7b5:'dim',
};

// Diatonic degrees, with both triad + diatonic-7th forms.
const MAJOR_DEGREES = [
  { rn:'I',   q:'maj', rn7:'Imaj7',  s7:'maj7' },
  { rn:'ii',  q:'min', rn7:'ii7',    s7:'m7'   },
  { rn:'iii', q:'min', rn7:'iii7',   s7:'m7'   },
  { rn:'IV',  q:'maj', rn7:'IVmaj7', s7:'maj7' },
  { rn:'V',   q:'maj', rn7:'V7',     s7:'dom7' },
  { rn:'vi',  q:'min', rn7:'vi7',    s7:'m7'   },
  { rn:'vii°',q:'dim', rn7:'viiø7',  s7:'m7b5' },
];
const MINOR_DEGREES = [
  { rn:'i',   q:'min', rn7:'i7',      s7:'m7'   },
  { rn:'ii°', q:'dim', rn7:'iiø7',    s7:'m7b5' },
  { rn:'III', q:'maj', rn7:'IIImaj7', s7:'maj7' },
  { rn:'iv',  q:'min', rn7:'iv7',     s7:'m7'   },
  { rn:'v',   q:'min', rn7:'v7',      s7:'m7'   },
  { rn:'VI',  q:'maj', rn7:'VImaj7',  s7:'maj7' },
  { rn:'VII', q:'maj', rn7:'VII7',    s7:'dom7' },
];

// Borrowed chords (modal interchange).
const MAJOR_BORROWED = [
  { rn:'iv',   off:5,  q:'min', src:'from minor', res:'→ I' },
  { rn:'♭VII', off:10, q:'maj', src:'from minor', res:'→ I' },
  { rn:'♭VI',  off:8,  q:'maj', src:'from minor', res:'→ V' },
  { rn:'♭III', off:3,  q:'maj', src:'from minor', res:'→ ♭VI' },
  { rn:'v',    off:7,  q:'min', src:'from minor', res:'→ I' },
  { rn:'ii°', off:2,  q:'dim', src:'from minor', res:'→ V' },
];
const MINOR_BORROWED = [
  { rn:'V',    off:7,  q:'maj', src:'dominant',     res:'→ i' },
  { rn:'vii°', off:11, q:'dim', src:'leading tone', res:'→ i' },
  { rn:'IV',   off:5,  q:'maj', src:'from major',   res:'→ i' },
  { rn:'I',    off:0,  q:'maj', src:'Picardy',      res:'the ending' },
  { rn:'ii',   off:2,  q:'min', src:'from major',   res:'→ V' },
];

// Chord-colour glossary — non-standard shapes, built on the current tonic.
const GLOSSARY = [
  { shape:'dom7', label:'Dominant 7  (7)',            blurb:'Tense and bluesy — it wants to resolve. This is the V7 → I pull.' },
  { shape:'maj7', label:'Major 7  (maj7)',            blurb:'Soft, dreamy, jazzy — a major chord with a gentle sheen.' },
  { shape:'m7',   label:'Minor 7  (m7)',              blurb:'Mellow and smooth — the everyday minor of soul and R&B.' },
  { shape:'m7b5', label:'Half-diminished  (m7♭5)',    blurb:'Unstable and searching — the classic ii chord in a minor key.' },
  { shape:'dim7', label:'Diminished 7  (°7)',         blurb:'Maximum tension, slippery and symmetrical — a passing chord.' },
  { shape:'sus4', label:'Suspended 4  (sus4)',        blurb:'No third, so neither happy nor sad — it hangs, then falls to the major.' },
  { shape:'sus2', label:'Suspended 2  (sus2)',        blurb:'Open and airy — also has no third.' },
  { shape:'six',  label:'Sixth  (6)',                 blurb:'Sweet and vintage — a major chord with an added 6th.' },
  { shape:'add9', label:'Add 9  (add9)',              blurb:'A bright triad with an extra sparkle on top.' },
  { shape:'nine', label:'Ninth  (9)',                 blurb:'A fuller, funkier dominant 7.' },
  { shape:'aug',  label:'Augmented  (+)',             blurb:'Eerie and rising — the top note is stretched sharp.' },
];

// ---- State ----
let selectedIndex = null;
let mode = 'major';       // 'major' | 'minor'

// ---- Geometry ----
const CX = 240, CY = 240;
const R_MAJ_OUT = 220, R_MAJ_IN = 150;
const R_MIN_OUT = 150, R_MIN_IN = 96;

function polar(r, deg) {
  const rad = (deg * Math.PI) / 180;
  return [CX + r * Math.sin(rad), CY - r * Math.cos(rad)];
}
function annularSector(rOut, rIn, a0, a1) {
  const [x1, y1] = polar(rOut, a0);
  const [x2, y2] = polar(rOut, a1);
  const [x3, y3] = polar(rIn, a1);
  const [x4, y4] = polar(rIn, a0);
  return `M ${x1} ${y1} A ${rOut} ${rOut} 0 0 1 ${x2} ${y2} ` +
         `L ${x3} ${y3} A ${rIn} ${rIn} 0 0 0 ${x4} ${y4} Z`;
}

const SVGNS = 'http://www.w3.org/2000/svg';
function el(name, attrs = {}) {
  const n = document.createElementNS(SVGNS, name);
  for (const k in attrs) n.setAttribute(k, attrs[k]);
  return n;
}

// ---- Build the circle ----
const svg = document.getElementById('circle');
const segEls = [];

function buildCircle() {
  CIRCLE.forEach((entry, i) => {
    const center = i * 30;
    const a0 = center - 15, a1 = center + 15;

    const group = el('g', { class: 'segment seg-major', 'data-index': i, tabindex: '0', role: 'button' });
    group.appendChild(el('path', { class: 'seg-shape', d: annularSector(R_MAJ_OUT, R_MAJ_IN, a0, a1) }));
    const [lx, ly] = polar((R_MAJ_OUT + R_MAJ_IN) / 2, center);
    const label = el('text', { class: 'seg-label', x: lx, y: ly + 5 });
    label.textContent = entry.major;
    group.appendChild(label);
    const roleText = el('text', { class: 'role-tag', x: lx, y: ly - 12 });
    group.appendChild(roleText);
    group.addEventListener('click', () => selectKey(i, 'major'));
    group.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); selectKey(i, 'major'); }
    });
    svg.appendChild(group);

    const mgroup = el('g', { class: 'segment seg-minor', 'data-index': i, tabindex: '0', role: 'button' });
    mgroup.appendChild(el('path', { class: 'seg-shape', d: annularSector(R_MIN_OUT, R_MIN_IN, a0, a1) }));
    const [mlx, mly] = polar((R_MIN_OUT + R_MIN_IN) / 2, center);
    const mlabel = el('text', { class: 'seg-label', x: mlx, y: mly + 4 });
    mlabel.textContent = entry.minor;
    mgroup.appendChild(mlabel);
    mgroup.addEventListener('click', () => selectKey(i, 'minor'));
    mgroup.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); selectKey(i, 'minor'); }
    });
    svg.appendChild(mgroup);

    segEls.push({ major: group, minor: mgroup, roleText });
  });

  svg.appendChild(el('circle', { class: 'center-disc', cx: CX, cy: CY, r: R_MIN_IN - 6 }));
  const ck = el('text', { id: 'center-key', x: CX, y: CY - 2 });
  ck.textContent = '?';
  svg.appendChild(ck);
  const cs = el('text', { id: 'center-sub', x: CX, y: CY + 20 });
  cs.textContent = 'select a key';
  svg.appendChild(cs);
}

// ---- Audio: real piano samples (Salamander), with synth fallback ----
// Sampled notes we downloaded, mapped to MIDI numbers. Playback pitch-shifts
// from the nearest sample, so we only need a few notes across the range.
const SAMPLE_MIDI = {
  'C3':48,'Ds3':51,'Fs3':54,'A3':57,'C4':60,'Ds4':63,'Fs4':66,'A4':69,
  'C5':72,'Ds5':75,'Fs5':78,'A5':81,'C6':84,'Ds6':87,'Fs6':90,'A6':93,
};
const samples = [];
let pianoOk = true;

function initSamples() {
  for (const name in SAMPLE_MIDI) {
    const a = new Audio('assets/piano/' + name + '.mp3');
    a.preload = 'auto';
    a.addEventListener('error', () => { pianoOk = false; }, { once: true });
    samples.push({ midi: SAMPLE_MIDI[name], audio: a });
  }
  samples.sort((x, y) => x.midi - y.midi);
}

function nearestSample(midi) {
  let best = samples[0], bd = Infinity;
  for (const s of samples) {
    const d = Math.abs(s.midi - midi);
    if (d < bd) { bd = d; best = s; }
  }
  return best;
}

function playPianoNote(midi, gain) {
  const s = nearestSample(midi);
  const a = s.audio.cloneNode();
  a.preservesPitch = false;
  a.webkitPreservesPitch = false;
  a.mozPreservesPitch = false;
  a.playbackRate = Math.pow(2, (midi - s.midi) / 12);
  a.volume = gain;
  const p = a.play();
  if (p && p.catch) p.catch(() => { pianoOk = false; });
}

// Synth fallback (used only if the samples fail to load).
let actx = null;
function audio() {
  if (!actx) actx = new (window.AudioContext || window.webkitAudioContext)();
  if (actx.state === 'suspended') actx.resume();
  return actx;
}
function playChordSynth(midis, dur) {
  const ctx = audio();
  const t0 = ctx.currentTime;
  const master = ctx.createGain();
  master.gain.value = 0.0001;
  master.connect(ctx.destination);
  master.gain.setValueAtTime(0.0001, t0);
  master.gain.exponentialRampToValueAtTime(0.2, t0 + 0.015);
  master.gain.exponentialRampToValueAtTime(0.0001, t0 + dur);
  midis.forEach((midi) => {
    const osc = ctx.createOscillator();
    osc.type = 'triangle';
    osc.frequency.value = 440 * Math.pow(2, (midi - 69) / 12);
    osc.connect(master);
    osc.start(t0);
    osc.stop(t0 + dur + 0.05);
  });
}

function playChord(rootPc, shape, when = 0, dur = 0.9) {
  const midis = (SHAPES[shape] || SHAPES.maj).map((iv) => 60 + rootPc + iv);
  const fire = () => {
    if (pianoOk) midis.forEach((m) => playPianoNote(m, 0.5));
    else playChordSynth(midis, dur);
  };
  if (when > 0) setTimeout(fire, when * 1000);
  else fire();
}

// ---- Selection / render ----
function selectKey(index, m) {
  selectedIndex = index;
  if (m) setMode(m, true);
  render();
}
function setMode(m, skipRender) {
  mode = m;
  document.getElementById('btn-major').classList.toggle('active', m === 'major');
  document.getElementById('btn-minor').classList.toggle('active', m === 'minor');
  document.getElementById('btn-major').setAttribute('aria-selected', m === 'major');
  document.getElementById('btn-minor').setAttribute('aria-selected', m === 'minor');
  if (!skipRender) render();
}

function nameFor(root, shape) { return root + (SHAPE_SUFFIX[shape] || ''); }

// Split a Roman-numeral chord symbol (e.g. "Imaj7", "viiø7", "♭VII7") into the
// numeral part and the quality/extension figure, so we can render the figure
// small and raised like proper theory notation.
function romanMarkup(rn) {
  const m = /^([♭♯b#]?)([IiVv]+)(.*)$/.exec(rn);
  if (!m) return '<span class="num">' + rn + '</span>';
  const numeral = m[1] + m[2];
  const fig = m[3];
  return '<span class="num">' + numeral + '</span>' +
         (fig ? '<sup class="fig">' + fig + '</sup>' : '');
}

function currentTonic() {
  if (selectedIndex === null) return { pc: 0, name: 'C' };
  const entry = CIRCLE[selectedIndex];
  if (mode === 'major') return { pc: PC[entry.major], name: entry.major };
  const mn = entry.minor.replace('m', '');
  return { pc: PC[mn], name: mn };
}

function render() {
  const chordsEl = document.getElementById('chords');
  const relEl = document.getElementById('relationships');
  const titleEl = document.getElementById('key-title');
  const progBtn = document.getElementById('play-prog');

  segEls.forEach((s) => {
    s.major.classList.remove('selected', 'in-maj', 'in-min', 'in-dim', 'bhl');
    s.minor.classList.remove('selected', 'in-maj', 'in-min', 'in-dim', 'bhl');
    s.roleText.textContent = '';
  });

  renderGlossary();
  document.getElementById('tab-gloss').disabled = (selectedIndex === null);

  if (selectedIndex === null) return;

  const entry = CIRCLE[selectedIndex];
  chordsEl.innerHTML = '';

  const degrees = mode === 'major' ? MAJOR_DEGREES : MINOR_DEGREES;
  const borrowed = mode === 'major' ? MAJOR_BORROWED : MINOR_BORROWED;
  const scale = mode === 'major' ? entry.scale : rotate(entry.scale, 5);
  const tonic = currentTonic();

  titleEl.textContent = tonic.name + (mode === 'major' ? ' major' : ' minor');
  setCenter(tonic.name, mode);

  // 1) The 7 diatonic triads
  addSectionTitle(chordsEl, 'Basic chords in this key');
  const triadGrid = addGrid(chordsEl);
  degrees.forEach((deg, i) => {
    const noteName = scale[i];
    addChord(triadGrid, deg.rn, nameFor(noteName, deg.q), deg.q, PC[noteName], deg.q, null);
  });

  // 2) The same chords as 7ths — intermix freely
  addSectionTitle(chordsEl, 'The same chords as 7ths');
  const seventhGrid = addGrid(chordsEl);
  degrees.forEach((deg, i) => {
    const noteName = scale[i];
    addChord(seventhGrid, deg.rn7, nameFor(noteName, deg.s7), deg.q, PC[noteName], deg.s7, null);
  });

  // 3) Borrowable chords
  addSectionTitle(chordsEl, 'Borrowable chords');
  const bgrid = addGrid(chordsEl);
  borrowed.forEach((b) => {
    const pc = (tonic.pc + b.off) % 12;
    addChord(bgrid, b.rn, nameFor(FLAT_NAMES[pc], b.q), b.q, pc, b.q, b.src, b.res);
  });

  // Highlight the wheel: tonic, then the diatonic (in-key) chords, then the
  // borrowable chords. Major chords sit on the outer ring, minor on the inner.
  function segFor(pc, quality) {
    if (quality === 'min') return segEls[MINOR_PC_INDEX[pc]] && segEls[MINOR_PC_INDEX[pc]].minor;
    return segEls[MAJOR_PC_INDEX[pc]] && segEls[MAJOR_PC_INDEX[pc]].major; // maj + dim -> outer
  }

  const QCLASS = { maj: 'in-maj', min: 'in-min', dim: 'in-dim' };
  degrees.forEach((deg, i) => {
    const seg = segFor(PC[scale[i]], deg.q);
    if (!seg) return;
    seg.classList.add(i === 0 ? 'selected' : QCLASS[deg.q]);
  });

  const taken = (seg) =>
    seg.classList.contains('selected') || seg.classList.contains('in-maj') ||
    seg.classList.contains('in-min') || seg.classList.contains('in-dim');
  borrowed.forEach((b) => {
    const seg = segFor((tonic.pc + b.off) % 12, b.q);
    if (seg && !taken(seg)) seg.classList.add('bhl');
  });

  const relMinor = entry.minor.replace('m', '');
  if (mode === 'major') {
    relEl.innerHTML =
      `<span class="key-dot d-key"></span> <strong>${entry.major} major</strong> is the key; ` +
      `<span class="key-dot d-borrow"></span> green marks borrowable chords. Every other lit ` +
      `segment is a chord in the key, coloured by type (see key below). ` +
      `<strong>${relMinor} minor</strong> is its relative minor.`;
  } else {
    relEl.innerHTML =
      `<span class="key-dot d-key"></span> <strong>${relMinor} minor</strong> is the key; ` +
      `<span class="key-dot d-borrow"></span> green marks borrowable chords. Every other lit ` +
      `segment is a chord in the key, coloured by type (see key below). ` +
      `<strong>${entry.major} major</strong> is its relative major.`;
  }

  progBtn.disabled = false;
  requestAnimationFrame(fitPanel);
}

function renderGlossary() {
  const g = document.getElementById('glossary');
  if (!g) return;
  const tonic = currentTonic();
  g.innerHTML = '';
  GLOSSARY.forEach((item) => {
    const row = document.createElement('button');
    const color = SHAPE_COLOR[item.shape] || 'maj';
    row.className = 'gloss-row q-' + color;
    row.innerHTML =
      `<div class="gloss-main"><span class="gloss-name">${nameFor(tonic.name, item.shape)}</span>` +
      `<span class="gloss-label">${item.label}</span></div>` +
      `<div class="gloss-blurb">${item.blurb}</div>`;
    row.addEventListener('click', () => playChord(tonic.pc, item.shape));
    g.appendChild(row);
  });
}

// Scale the panel content down so it never overflows the viewport (no scrolling).
function fitPanel() {
  const panel = document.querySelector('.panel');
  const inner = document.getElementById('panel-inner');
  if (!panel || !inner) return;
  inner.style.transform = 'none';
  const cs = getComputedStyle(panel);
  const padY = parseFloat(cs.paddingTop) + parseFloat(cs.paddingBottom);
  const avail = panel.clientHeight - padY;
  const need = inner.offsetHeight;
  const scale = need > avail ? Math.max(0.4, avail / need) : 1;
  inner.style.transform = 'scale(' + scale + ')';
}

function rotate(arr, n) { return arr.slice(n).concat(arr.slice(0, n)); }
function setCenter(name, sub) {
  document.getElementById('center-key').textContent = name;
  document.getElementById('center-sub').textContent = sub;
}
function addSectionTitle(parent, text) {
  const h = document.createElement('div');
  h.className = 'section-title';
  h.textContent = text;
  parent.appendChild(h);
}
function addGrid(parent) {
  const g = document.createElement('div');
  g.className = 'chords';
  parent.appendChild(g);
  return g;
}
function addChord(grid, rn, name, qClass, rootPc, shape, src, res) {
  const c = document.createElement('button');
  c.className = 'chord q-' + qClass + (src ? ' borrowed' : '');
  c.innerHTML = `<div class="rn">${romanMarkup(rn)}</div><div class="name">${name}</div>` +
                (src ? `<div class="src">${src}</div>` : '') +
                (res ? `<div class="res-hint">${res}</div>` : '');
  c.addEventListener('click', () => playChord(rootPc, shape));
  grid.appendChild(c);
}

// ---- Progression: I - IV - V7 - vi (minor: i - iv - V7 - VI) ----
document.getElementById('play-prog').addEventListener('click', function () {
  if (selectedIndex === null) return;
  const t = currentTonic().pc;
  let seq;
  if (mode === 'major') {
    seq = [ [t,'maj'], [(t+5)%12,'maj'], [(t+7)%12,'dom7'], [(t+9)%12,'min'] ];
  } else {
    seq = [ [t,'min'], [(t+5)%12,'min'], [(t+7)%12,'dom7'], [(t+8)%12,'maj'] ];
  }
  const step = 0.75;
  seq.forEach((ch, i) => playChord(ch[0], ch[1], i * step, step + 0.15));
  const btn = this;
  btn.classList.add('playing');
  setTimeout(() => btn.classList.remove('playing'), seq.length * step * 1000);
});

document.getElementById('btn-major').addEventListener('click', () => setMode('major'));
document.getElementById('btn-minor').addEventListener('click', () => setMode('minor'));

function setTab(name) {
  const main = name === 'main';
  document.getElementById('view-main').hidden = !main;
  document.getElementById('view-gloss').hidden = main;
  document.getElementById('tab-main').classList.toggle('active', main);
  document.getElementById('tab-gloss').classList.toggle('active', !main);
  document.getElementById('tab-main').setAttribute('aria-selected', main);
  document.getElementById('tab-gloss').setAttribute('aria-selected', !main);
  requestAnimationFrame(fitPanel);
}
document.getElementById('tab-main').addEventListener('click', () => setTab('main'));
document.getElementById('tab-gloss').addEventListener('click', () => setTab('gloss'));
window.addEventListener('resize', () => requestAnimationFrame(fitPanel));

initSamples();
buildCircle();
selectKey(0, 'major'); // auto-select C major on load
requestAnimationFrame(fitPanel);
