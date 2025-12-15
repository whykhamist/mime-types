// Score RFC facets (see https://tools.ietf.org/html/rfc6838#section-3)
export const FACET_SCORES: Record<string, number> = {
  "prs.": 100,
  "x-": 200,
  "x.": 300,
  "vnd.": 400,
  default: 900,
};

// Score mime source (Logic originally from `jshttp/mime-types` module)
export const SOURCE_SCORES: Record<string, number> = {
  nginx: 10,
  apache: 20,
  iana: 40,
  default: 30, // definitions added by `jshttp/mime-db` project?
};

export const TYPE_SCORES: Record<string, number> = {
  // prefer application/xml over text/xml
  // prefer application/rtf over text/rtf
  application: 1,

  // prefer font/woff over application/font-woff
  font: 2,

  // prefer video/mp4 over audio/mp4 over application/mp4
  // See https://www.rfc-editor.org/rfc/rfc4337.html#section-2
  audio: 2,
  video: 3,

  default: 0,
};

export const EXTENSION_SCORES: Record<string, number> = {
  // Images
  jpg: 950,
  jpeg: 940,
  png: 900,
  svg: 880,
  webp: 860,
  avif: 820,
  gif: 700,
  ico: 650,
  tif: 420,
  tiff: 410,
  bmp: 250,
  heic: 780,
  heif: 770,

  // Documents
  pdf: 980,
  txt: 880,
  text: 860,
  md: 820,
  html: 780,
  htm: 760,
  shtml: 750,
  docx: 750,
  doc: 540,
  xlsx: 730,
  xls: 500,
  pptx: 720,
  ppt: 500,
  odt: 650,
  ods: 640,
  odp: 630,
  rtf: 520,
  csv: 700,
  tsv: 680,
  json: 740,
  yaml: 600,
  yml: 590,
  epub: 500,

  // Audio
  mp3: 960,
  m4a: 820,
  flac: 760,
  wav: 520,
  ogg: 600,
  opus: 650,
  aac: 640,

  // Video
  mp4: 970,
  webm: 840,
  mkv: 760,
  mov: 650,
  avi: 320,
  m4v: 780,
  hevc: 720,

  // Archives & Compression
  zip: 950,
  gz: 820,
  tgz: 810,
  tar: 800,
  "7z": 760,
  rar: 640,
  bz2: 700,
  tbz: 690,

  // Fonts
  woff2: 920,
  woff: 880,
  ttf: 820,
  otf: 800,
  eot: 300,

  // Code / Programming
  js: 900,
  mjs: 880,
  ts: 870,
  tsx: 860,
  jsx: 850,
  css: 830,
  php: 750,
  py: 750,
  java: 700,
  class: 300,
  go: 700,
  cs: 600,
  rb: 620,
  c: 580,
  h: 570,
  cpp: 560,
  hpp: 550,

  // Binary / Generic
  bin: 260,
  dat: 220,
  exe: 200,
  dll: 150,
  iso: 420,

  // Fallback
  default: 100,
};

export const CATEGORY_EXTENSION_FALLBACK: Record<string, number> = {
  image: 500,
  video: 500,
  audio: 500,
  application: 300,
  font: 400,
  text: 550,
  default: 100,
};
