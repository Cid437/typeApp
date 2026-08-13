/**
 * app.js
 * -----------------------------------------------------------------------
 * Bootstraps the app and wires user actions (picking a language, resetting,
 * switching languages, retrying) to the typing engine and UI layer.
 * -----------------------------------------------------------------------
 */

let currentLanguageId = null;

document.addEventListener("DOMContentLoaded", () => {
  initTypingEngine({ onFinish: handleTestFinished });
  renderLanguagePicker(startLanguage);
});

/** Starts a fresh test for the given language and switches to the typing screen. */
function startLanguage(languageId) {
  currentLanguageId = languageId;

  const snippet = getRandomSnippet(languageId);

  renderLanguageDropdown(languageId, onLanguageDropdownChange);
  updatePromptPath(languageId);
  setEditorFilename(languageId);
  updateBestBadge(getBestWPM(languageId));

  loadSnippet(languageId, snippet);

  showScreen("typing");
}

/** Fired when the in-test language dropdown changes. */
function onLanguageDropdownChange(languageId) {
  startLanguage(languageId);
}

/** Handles the "next snippet →" results-screen action. */
function loadNextSnippet() {
  const snippet = getRandomSnippet(currentLanguageId);
  loadSnippet(currentLanguageId, snippet);
  showScreen("typing");
}

/** Called by the typing engine once a snippet has been fully typed. */
function handleTestFinished({ languageId, wpm, accuracy, errors, isNewBest }) {
  updateBestBadge(getBestWPM(languageId));
  renderResults({ wpm, accuracy, errors, isNewBest });
  showScreen("results");
}

/* ---------------------------- static wiring ---------------------------- */

document.getElementById("reset-btn").addEventListener("click", () => {
  restartSnippet();
});

document.getElementById("back-to-picker").addEventListener("click", () => {
  showScreen("picker");
});

document.getElementById("retry-btn").addEventListener("click", () => {
  restartSnippet();
  showScreen("typing");
});

document.getElementById("new-snippet-btn").addEventListener("click", loadNextSnippet);
