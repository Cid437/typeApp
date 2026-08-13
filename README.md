# typeApp

A local, no-build typing trainer for practicing code syntax instead of
regular words — inspired by Monkeytype.

## Run it

No install, no server. Just open `index.html` in any modern browser.

> Tailwind and the fonts load from a CDN for convenience (per the "single
> HTML + Tailwind CDN" option), so an internet connection is needed the
> first time a page loads them. Everything else — typing logic, stats,
> snippets, your best-WPM history — runs and is stored fully locally.

## Project structure

```
typeApp/
├── index.html              # single page: picker → typing → results
├── css/
│   └── style.css            # fonts, cursor animation, char highlighting
├── js/
│   ├── data/
│   │   └── snippets.js      # all languages + snippets live here
│   ├── stats.js              # calculateWPM / calculateAccuracy (pure)
│   ├── storage.js            # best-WPM persistence (localStorage)
│   ├── ui.js                  # all DOM rendering/updates
│   ├── typingEngine.js       # input handling, timing, cursor state
│   └── app.js                 # wires screens + user actions together
└── README.md
```

## Adding a language or more snippets

Everything lives in `js/data/snippets.js`. To add a language:

```js
SNIPPET_DATA.rust = {
  id: "rust",
  name: "Rust",
  extension: ".rs",
  accent: "#dea584",
  snippets: [
    `fn main() {\n    println!("hello");\n}`,
  ],
};

LANGUAGE_ORDER.push("rust");
```

To add more practice snippets to an existing language, just push more
strings into its `snippets` array — no other code changes needed.

## Features

- **Typing engine** — live per-character highlighting (green = correct,
  red = incorrect, gray = untyped) with a blinking block cursor.
- **Real-time stats** — WPM, accuracy, and error count, shown in a
  status-bar styled after a code editor's bottom bar.
- **Language picker** — a "file browser" of available languages, plus an
  in-test dropdown to switch languages without leaving the typing screen.
- **Restart shortcut** — press `Tab` (or click "restart") to reset the
  current snippet at any time.
- **Best WPM** — persisted per language in `localStorage`, shown in the
  header and on the results screen.
