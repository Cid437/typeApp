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

/**
 * Builds the language picker grid of "file cards". Subtitle text adapts
 * to the current practice mode: snippet count for Random, or how far
 * along the easy-to-hard track the user has gotten for Progression. In
 * progression mode, languages with saved progress also get a small
 * reset control so the user can intentionally start a track over.
 */
function renderLanguagePicker(onSelect, mode, onResetProgress) {
  const grid = document.getElementById("language-grid");
  grid.innerHTML = "";

  LANGUAGE_ORDER.forEach((id) => {
    const lang = SNIPPET_DATA[id];
    const total = lang.snippets.length;

    let subtitle;
    let clearedCount = 0;
    let disabled = false;
    if (mode === "progression") {
      const idx = Math.min(getProgressIndex(id), total - 1);
      clearedCount = idx;
      subtitle = `${idx + 1} / ${total} \u00b7 next up`;
    } else if (mode === "output") {
      const eligible = getOutputEligibleSnippets(id).length;
      disabled = eligible === 0;
      subtitle = disabled ? "no output challenges yet" : `${eligible} output challenges`;
    } else {
      subtitle = `${total} snippets`;
    }

    const row = document.createElement("div");
    row.className = "flex items-stretch gap-2";

    const card = document.createElement("button");
    card.type = "button";
    card.className = "file-card flex-1";
    card.setAttribute("aria-label", `Practice ${lang.name}`);

    if (disabled) {
      card.disabled = true;
      card.classList.add("file-card--disabled");
    }

    card.innerHTML = `
      <span class="ext-badge" style="color:${lang.accent}; background:${lang.accent}1a;">
        ${lang.extension}
      </span>
      <span class="flex-1">
        <span class="block font-mono text-ink text-sm font-medium">${lang.name}</span>
        <span class="block text-dim text-xs mt-0.5">${subtitle}</span>
      </span>
      <span class="text-dim text-lg leading-none">→</span>
    `;

    if (!disabled) {
      card.addEventListener("click", () => onSelect(id));
    }
    row.appendChild(card);

    if (mode === "progression" && clearedCount > 0 && onResetProgress) {
      const resetBtn = document.createElement("button");
      resetBtn.type = "button";
      resetBtn.className = "reset-progress-btn";
      resetBtn.title = `Reset ${lang.name} progress back to level 1`;
      resetBtn.setAttribute("aria-label", `Reset ${lang.name} progress`);
      resetBtn.textContent = "\u21ba";
      resetBtn.addEventListener("click", (event) => {
        event.stopPropagation();
        onResetProgress(id);
      });
      row.appendChild(resetBtn);
    }

    grid.appendChild(row);
  });
}

/** Wires the Random / Progression segmented control and reflects the active mode. */
function initModeToggle(currentMode, onChange) {
  const buttons = document.querySelectorAll(".mode-btn");
  buttons.forEach((btn) => {
    btn.addEventListener("click", () => onChange(btn.dataset.mode));
  });
  setModeToggleUI(currentMode);
}

/** Updates the toggle's active button + helper hint text for a given mode. */
function setModeToggleUI(mode) {
  document.querySelectorAll(".mode-btn").forEach((btn) => {
    btn.classList.toggle("active", btn.dataset.mode === mode);
  });

  const hint = document.getElementById("mode-hint");
  if (mode === "progression") {
    hint.textContent = "easiest \u2192 hardest, picking up where you left off";
  } else if (mode === "output") {
    hint.textContent = "see the target output first, then type the code that produces it";
  } else {
    hint.textContent = "a random snippet each time";
  }
}

/**
 * Fills the in-test language <select> dropdown and wires its change handler.
 * In Output mode, languages with no output-eligible snippets are left out
 * entirely, since there'd be nothing to switch to.
 */
function renderLanguageDropdown(currentId, onChange, mode) {
  const select = document.getElementById("language-select");
  select.innerHTML = "";

  const ids = mode === "output"
    ? LANGUAGE_ORDER.filter((id) => getOutputEligibleSnippets(id).length > 0)
    : LANGUAGE_ORDER;

  ids.forEach((id) => {
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
 * Output Challenge mode shows the target output *before* typing, so the
 * exercise becomes "reproduce the code that makes this" rather than
 * "here's a hint, now type". Hidden entirely outside that mode.
 */
function renderOutputGoal(output, visible) {
  const wrap = document.getElementById("output-goal");
  wrap.classList.toggle("hidden", !visible);
  document.getElementById("output-goal-text").textContent = visible ? output || "" : "";
}

/**
 * Shows the difficulty badge next to the description. In Progression
 * mode it also shows "x / total" so the user can see how far through
 * the language's track they are.
 */
function renderLevelBadge({ level, mode, index, total }) {
  const el = document.getElementById("level-badge");
  const meta = LEVEL_META[level] || { label: level, color: "#565e6a" };

  let text = meta.label;
  if (mode === "progression" && typeof index === "number" && total) {
    text += ` \u00b7 ${index + 1}/${total}`;
  }

  el.textContent = text;
  el.style.color = meta.color;
  el.style.borderColor = `${meta.color}55`;
  el.style.background = `${meta.color}1a`;
  el.classList.remove("hidden");
}

/** Shows/hides the "you finished the whole track" celebration line. */
function showTrackCompleteNote(visible) {
  document.getElementById("track-complete-note").classList.toggle("hidden", !visible);
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
  el.textContent = wpm > 0 ? `${wpm} wpm` : "\u2014 wpm";
}

/** Populates the results screen after a completed test. */
function renderResults({ wpm, accuracy, errors, isNewBest, explanation, output }) {
  document.getElementById("result-wpm").textContent = wpm;
  document.getElementById("result-accuracy").textContent = `${accuracy}%`;
  document.getElementById("result-errors").textContent = errors;

  const note = document.getElementById("result-best-note");
  note.textContent = isNewBest ? "\u2605 new personal best" : "";

  document.getElementById("result-explanation").textContent = explanation || "";
  document.getElementById("result-output").textContent = output || "";
}
