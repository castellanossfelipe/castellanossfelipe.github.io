// ============================================================================
// TODO (outstanding, as of Oct 21 2026):
//   1. RESUMES: drop the three PDFs into /resumes with the exact filenames listed in `resumes` below
//      (see resumes/README.txt). Until then the "Get resume" download links will 404.
//   2. REVIEWS: add a `review: "..."` line (1 to 3 sentences, your own words) to each book and album in
//      `books` / `albums` further down. They show as "My take" in "Behind the portfolio".
//      Search this file for "TODO REVIEW" to find each spot.
// ============================================================================

// Résumé versions shown by the "Get résumé" button.
// Add, remove or reorder entries freely: the dialog adapts to any number (1 to ~5 reads best).
// Put the PDFs in /resumes. `note` is an optional one-line hint under the name.
window.SITE_CONFIG = {
  resumes: [
    { label: "Software Engineering", note: "Software and full-stack roles",     file: "resumes/Felipe-Castellanos-Resume-SWE.pdf" },
    { label: "Cloud Computing",      note: "Cloud, infrastructure and DevOps",  file: "resumes/Felipe-Castellanos-Resume-Cloud.pdf" },
    { label: "Tech Consulting",      note: "Technology consulting and advisory", file: "resumes/Felipe-Castellanos-Resume-Consulting.pdf" }
  ],

  // "Behind the portfolio": the places you've lived, in order. Drives the map, the list and the live clocks.
  // lat/lon place the dot, tz is the IANA time zone, anchor is where the map label sits (l, r, t or b).
  // Add `note` (one line) to any stop to show it when that stop is tapped. A stop with no `to` shows just `from`.
  homes: [
    { name: "Bogot\u00e1",   region: "Colombia",            country: "Colombia", lat: 4.7110,  lon: -74.0721, tz: "America/Bogota",    from: "2004",      to: "2014", anchor: "b" },
    { name: "Rockville", region: "Maryland, USA",       country: "USA",      lat: 39.0840, lon: -77.1528, tz: "America/New_York",  from: "2014",      to: "2018", anchor: "r" },
    { name: "Bogot\u00e1",   region: "Colombia",            country: "Colombia", lat: 4.7110,  lon: -74.0721, tz: "America/Bogota",    from: "2018",      to: "2023", anchor: "b" },
    { name: "Davidson",  region: "North Carolina, USA", country: "USA",      lat: 35.4993, lon: -80.8487, tz: "America/New_York",  from: "2023",      to: "2025", anchor: "l" },
    { name: "Budapest",  region: "Hungary",             country: "Hungary",  lat: 47.4979, lon: 19.0402,  tz: "Europe/Budapest",   from: "Fall 2025", to: "",     anchor: "t" },
    { name: "Davidson",  region: "North Carolina, USA", country: "USA",      lat: 35.4993, lon: -80.8487, tz: "America/New_York",  from: "2026",      to: "now",  anchor: "l" }
  ],

  // "Behind the portfolio" shelf. Books stand as spines on the top shelf, albums sit as record sleeves below.
  // Tapping one opens its cover (or a record sliding out of its sleeve). `review` (your take, 1 to 3 sentences)
  // appears beside it. `color` is the spine colour (books) or the record-label colour (albums); pick the cover's
  // main colour. Text on it switches between dark and light automatically. `image` is optional: put a photo of your own copy in images/shelf/ and point to it here;
  // if the file is missing, a typeset cover is shown instead. Keep images small (about 400px wide).
  // Example: { title: "...", author: "...", tag: "...", review: "Why this mattered to me.", image: "images/shelf/x.jpg" }
  books: [
    { title: "Dopamine Nation",                    author: "Anna Lembke",      color: "#f9f8f6", image: "images/shelf/dopamine-nation.jpg" },  // TODO REVIEW
    { title: "So Good They Can\u2019t Ignore You", author: "Cal Newport",      color: "#e96b30", image: "images/shelf/so-good-they-cant-ignore-you.jpg" },  // TODO REVIEW
    { title: "Death in the Afternoon",             author: "Ernest Hemingway", color: "#b61e1d", image: "images/shelf/death-in-the-afternoon.jpg" },  // TODO REVIEW
    { title: "Tuesdays with Morrie",               author: "Mitch Albom",      color: "#f9e9c8", image: "images/shelf/tuesdays-with-morrie.jpg" }  // TODO REVIEW
  ],

  // Albums: use `artist` instead of `author`.
  albums: [
    { title: "De Ida y Vuelta", artist: "Chabuco",         color: "#e5c340", image: "images/shelf/de-ida-y-vuelta.jpg" },  // TODO REVIEW
    { title: "FERXXOCALIPSIS",  artist: "Feid",            color: "#ec6927", image: "images/shelf/ferxxocalipsis.jpg" },  // TODO REVIEW
    { title: "Bad",             artist: "Michael Jackson", color: "#fdfefe", image: "images/shelf/bad.jpg" },  // TODO REVIEW
    { title: "Jazz Samba",      artist: "Stan Getz",       color: "#e64d44", image: "images/shelf/jazz-samba.jpg" }  // TODO REVIEW
  ],

  // The books on the nightstand right now. They lean against the end of the book shelf. Leave empty ([]) to hide them.
  // Example: [{ title: "Title", author: "Author" }, { title: "Title", author: "Author" }]
  reading: []
};
