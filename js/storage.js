/**
 * storage.js
 * -----------------------------------------------------------------------
 * Thin wrapper around localStorage so the rest of the app never touches
 * key names directly.
 *   - Best WPM is tracked per-language.
 *   - Progression mode's "which snippet is next" pointer is tracked
 *     per-language, so leaving and coming back resumes where you left off.
 *   - The chosen practice mode (random/progression/output) is remembered globally.
 * -----------------------------------------------------------------------
 */

const STORAGE_PREFIX = "typeapp_best_wpm_";
const PROGRESS_PREFIX = "typeapp_progress_";
const MODE_KEY = "typeapp_mode";

/** Persists a new best WPM for a language if it beats the current one. */
function saveBestWPM(languageId, wpm) {
  const current = getBestWPM(languageId);
  if (wpm > current) {
    localStorage.setItem(STORAGE_PREFIX + languageId, String(wpm));
    return true; // signals a new personal best
  }
  return false;
}

/** Reads the stored best WPM for a language (0 if none yet). */
function getBestWPM(languageId) {
  const value = localStorage.getItem(STORAGE_PREFIX + languageId);
  return value ? parseInt(value, 10) : 0;
}

/* ============================================================
   Progression mode: which snippet index (into getSortedSnippets)
   a language should resume from next.
   ============================================================ */

/** Reads the index of the next snippet to practice in a language's track. */
function getProgressIndex(languageId) {
  const value = localStorage.getItem(PROGRESS_PREFIX + languageId);
  return value ? parseInt(value, 10) : 0;
}

/** Saves which snippet index a language's progression should resume from. */
function saveProgressIndex(languageId, index) {
  localStorage.setItem(PROGRESS_PREFIX + languageId, String(index));
}

/** Resets a language's progression back to its easiest snippet. */
function resetProgress(languageId) {
  localStorage.setItem(PROGRESS_PREFIX + languageId, "0");
}

/** Reads the saved practice mode ("random" or "progression"), defaulting to random. */
function getPracticeMode() {
  return localStorage.getItem(MODE_KEY) || "random";
}

/** Persists the chosen practice mode. */
function savePracticeMode(mode) {
  localStorage.setItem(MODE_KEY, mode);
}
