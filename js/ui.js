/**
 * ui.js
 * -----------------------------------------------------------------------
 * Everything that touches the DOM lives here. typingEngine.js and app.js
 * call into these functions rather than querying elements themselves,
 * so markup can change without touching the typing logic.
 * -----------------------------------------------------------------------
 */

const screens = {
  picker: document.getElementById("picker-screen"),
  typing: document.getElementById("typing-screen"),
  results: document.getElementById("results-screen"),
};

/** Shows exactly one of the three top-level screens. */
function showScreen(name) {
  Object.entries(screens).forEach(([key, el]) => {
    el.classList.toggle("hidden", key !== name);
  });
}

/** Builds the language picker grid of "file cards". */
function renderLanguagePicker(onSelect) {
  const grid = document.getElementById("language-grid");
  grid.innerHTML = "";

  LANGUAGE_ORDER.forEach((id) => {
    const lang = SNIPPET_DATA[id];

    const card = document.createElement("button");
    card.type = "button";
    card.className = "file-card";
    card.setAttribute("aria-label", `Practice ${lang.name}`);

    card.innerHTML = `
      <span class="ext-badge" style="color:${lang.accent}; background:${lang.accent}1a;">
        ${lang.extension}
      </span>
      <span class="flex-1">
        <span class="block font-mono text-ink text-sm font-medium">${lang.name}</span>
        <span class="block text-dim text-xs mt-0.5">${lang.snippets.length} snippets</span>
      </span>
      <span class="text-dim text-lg leading-none">→</span>
    `;

    card.addEventListener("click", () => onSelect(id));
    grid.appendChild(card);
  });
}

/** Fills the in-test language <select> dropdown and wires its change handler. */
function renderLanguageDropdown(currentId, onChange) {
  const select = document.getElementById("language-select");
  select.innerHTML = "";

  LANGUAGE_ORDER.forEach((id) => {
    const opt = document.createElement("option");
    opt.value = id;
    opt.textContent = SNIPPET_DATA[id].name;
    if (id === currentId) opt.selected = true;
    select.appendChild(opt);
  });

  select.onchange = (e) => onChange(e.target.value);
}

/** Updates the terminal-style header path, e.g. "~/typeApp/javascript". */
function updatePromptPath(languageId) {
  const el = document.getElementById("prompt-path");
  el.textContent = languageId ? `/${languageId}` : "";
}

/** Updates the fake editor titlebar filename to match the active language. */
function setEditorFilename(languageId) {
  const el = document.getElementById("editor-filename");
  el.textContent = `snippet${SNIPPET_DATA[languageId].extension}`;
}

/** Shows the one-line "what this code does" teaser above the editor. */
function renderSnippetDescription(description) {
  const el = document.getElementById("snippet-description");
  el.textContent = description ? `// ${description}` : "";
}

/**
 * Renders the target snippet as individual <span> characters, applying a
 * class per character based on what's been typed so far:
 *   - char-correct    -> typed and matches
 *   - char-incorrect  -> typed and does not match
 *   - char-pending     -> not yet reached
 *   - char-cursor      -> the single next character to type
 * Also rebuilds the line-number gutter to match the snippet's line count.
 */
function renderSnippet(target, typedChars) {
  const container = document.getElementById("snippet");
  const cursorIndex = typedChars.length;

  const html = target
    .split("")
    .map((ch, i) => {
      let cls = "char ";
      if (i < cursorIndex) {
        cls += typedChars[i] === ch ? "char-correct" : "char-incorrect";
      } else if (i === cursorIndex) {
        cls += "char-pending char-cursor";
      } else {
        cls += "char-pending";
      }
      const safe = ch === "\n" ? "\n" : escapeHtml(ch);
      return `<span class="${cls}">${safe}</span>`;
    })
    .join("");

  container.innerHTML = html;
  renderGutter(target);
}

/** Rebuilds the line-number gutter alongside the snippet. */
function renderGutter(target) {
  const gutter = document.getElementById("line-gutter");
  const lineCount = target.split("\n").length;
  gutter.innerHTML = Array.from({ length: lineCount }, (_, i) => `<div>${i + 1}</div>`).join("");
}

function escapeHtml(ch) {
  const map = { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" };
  return map[ch] || ch;
}

/** Updates the live status-bar stats. */
function updateStatsDisplay({ wpm, accuracy, errors, seconds }) {
  document.getElementById("wpm").textContent = wpm;
  document.getElementById("accuracy").textContent = `${accuracy}%`;
  document.getElementById("errors").textContent = errors;
  document.getElementById("timer").textContent = formatTime(seconds);
}

/** Shows/hides the "click to start" hint under the editor. */
function setTypingHintVisible(visible) {
  document.getElementById("typing-hint").classList.toggle("hidden", !visible);
}

/** Updates the small "best wpm" badge in the page header. */
function updateBestBadge(wpm) {
  const el = document.getElementById("best-wpm-badge");
  el.textContent = wpm > 0 ? `${wpm} wpm` : "— wpm";
}

/** Populates the results screen after a completed test. */
function renderResults({ wpm, accuracy, errors, isNewBest, explanation, output }) {
  document.getElementById("result-wpm").textContent = wpm;
  document.getElementById("result-accuracy").textContent = `${accuracy}%`;
  document.getElementById("result-errors").textContent = errors;

  const note = document.getElementById("result-best-note");
  note.textContent = isNewBest ? "★ new personal best" : "";

  document.getElementById("result-explanation").textContent = explanation || "";
  document.getElementById("result-output").textContent = output || "";
}
