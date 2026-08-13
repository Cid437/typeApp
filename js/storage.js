/**
 * storage.js
 * -----------------------------------------------------------------------
 * Thin wrapper around localStorage so the rest of the app never touches
 * key names directly. Best WPM is tracked per-language.
 * -----------------------------------------------------------------------
 */

const STORAGE_PREFIX = "typeapp_best_wpm_";

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
