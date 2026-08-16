/**
 * app.js
 * -----------------------------------------------------------------------
 * Bootstraps the app and wires user actions (picking a language, resetting,
 * switching languages, retrying, changing practice mode) to the typing
 * engine and UI layer.
 *
 * Practice modes:
 *   - "random"      pulls any snippet from the language's pool each time.
 *   - "progression" walks the language's snippets easiest -> hardest,
 *                    remembering per-language progress in localStorage.
 *
 * The sample output for a snippet is always shown above the editor before
 * typing starts, in every mode — it's not gated behind a separate mode.
 * -----------------------------------------------------------------------
 */

let currentLanguageId = null;
let currentMode = "random";

document.addEventListener("DOMContentLoaded", () => {
  currentMode = getPracticeMode();
  if (currentMode !== "progression") currentMode = "random"; // guards against a stale/removed mode value

  initTypingEngine({ onFinish: handleTestFinished });
  initModeToggle(currentMode, onModeChange);
  renderLanguagePicker(startLanguage, currentMode, handleResetProgress);
});

/** Fired when the user taps "random" or "progression" on the picker screen. */
function onModeChange(mode) {
  if (mode === currentMode) return;
  currentMode = mode;
  savePracticeMode(mode);
  setModeToggleUI(mode);
  renderLanguagePicker(startLanguage, currentMode, handleResetProgress);
}

/** Fired when the user clicks a language's reset-progress control on the picker. */
function handleResetProgress(languageId) {
  resetProgress(languageId);
  renderLanguagePicker(startLanguage, currentMode, handleResetProgress);
}

/**
 * Picks the snippet + selection metadata for a language, honoring the
 * current practice mode.
 *   - "progression" resumes from the saved index, easiest -> hardest.
 *   - "random" picks any snippet from the language's full pool.
 */
function pickSnippet(languageId) {
  if (currentMode === "progression") {
    const sorted = getSortedSnippets(languageId);
    const idx = Math.min(getProgressIndex(languageId), sorted.length - 1);
    return { snippet: sorted[idx], meta: { mode: "progression", index: idx, total: sorted.length } };
  }

  const total = SNIPPET_DATA[languageId].snippets.length;
  return { snippet: getRandomSnippet(languageId), meta: { mode: "random", index: null, total } };
}

/** Starts a fresh test for the given language and switches to the typing screen. */
function startLanguage(languageId) {
  currentLanguageId = languageId;

  const { snippet, meta } = pickSnippet(languageId);

  renderLanguageDropdown(languageId, onLanguageDropdownChange);
  updatePromptPath(languageId);
  setEditorFilename(languageId);
  updateBestBadge(getBestWPM(languageId));
  showTrackCompleteNote(false);

  loadSnippet(languageId, snippet, meta);

  showScreen("typing");
  focusTypingInput();
}

/** Fired when the in-test language dropdown changes. */
function onLanguageDropdownChange(languageId) {
  startLanguage(languageId);
}

/**
 * Handles the "next snippet →" results-screen action. Progress itself is
 * already persisted by handleTestFinished the moment a level is cleared,
 * so this just loads whatever pickSnippet() resolves to now.
 */
function loadNextSnippet() {
  const { snippet, meta } = pickSnippet(currentLanguageId);
  showTrackCompleteNote(false);
  loadSnippet(currentLanguageId, snippet, meta);
  showScreen("typing");
  focusTypingInput();
}

/**
 * Called by the typing engine once a snippet has been fully typed. In
 * progression mode, this is where the cleared level is persisted —
 * immediately, not deferred until the user clicks "next snippet" — so
 * closing the tab right after finishing a level doesn't lose credit for it.
 */
function handleTestFinished({ languageId, wpm, accuracy, errors, isNewBest, explanation, output, mode, progressIndex, progressTotal }) {
  updateBestBadge(getBestWPM(languageId));
  renderResults({ wpm, accuracy, errors, isNewBest, explanation, output });

  let justFinishedTrack = false;

  if (mode === "progression") {
    justFinishedTrack = progressIndex + 1 >= progressTotal;
    const nextIndex = justFinishedTrack ? 0 : progressIndex + 1; // loop back to the easiest snippet
    saveProgressIndex(languageId, nextIndex);
  }

  // Celebrate finishing the whole track — surfaced once they move on to
  // the next (wrapped-around) snippet, via loadNextSnippet() above.
  results_pendingTrackComplete = justFinishedTrack;

  const nextBtn = document.getElementById("new-snippet-btn");
  nextBtn.textContent = justFinishedTrack ? "↺ start track over" : "next snippet →";

  showScreen("results");
}

// Set right before showing results; consumed the moment "next snippet" is clicked.
let results_pendingTrackComplete = false;

/* ---------------------------- static wiring ---------------------------- */

document.getElementById("reset-btn").addEventListener("click", () => {
  restartSnippet();
});

document.getElementById("back-to-picker").addEventListener("click", () => {
  renderLanguagePicker(startLanguage, currentMode, handleResetProgress);
  showScreen("picker");
});

document.getElementById("retry-btn").addEventListener("click", () => {
  showScreen("typing");
  restartSnippet();
});

document.getElementById("new-snippet-btn").addEventListener("click", () => {
  const wasTrackComplete = results_pendingTrackComplete;
  loadNextSnippet();
  if (wasTrackComplete) showTrackCompleteNote(true);
});
