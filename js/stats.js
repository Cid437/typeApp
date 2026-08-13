/**
 * stats.js
 * -----------------------------------------------------------------------
 * Pure calculation helpers. No DOM access here on purpose, so these are
 * easy to unit test and reuse (e.g. for a future results history view).
 * -----------------------------------------------------------------------
 */

/**
 * Standard WPM formula: correctly-typed characters grouped into
 * 5-character "words", divided by minutes elapsed.
 */
function calculateWPM(correctChars, secondsElapsed) {
  if (secondsElapsed <= 0) return 0;
  const minutes = secondsElapsed / 60;
  return Math.round((correctChars / 5) / minutes);
}

/** Accuracy = correct keystrokes / total keystrokes made, as a percentage. */
function calculateAccuracy(correctChars, totalChars) {
  if (totalChars <= 0) return 100;
  return Math.round((correctChars / totalChars) * 100);
}

/** Formats elapsed seconds as e.g. "12.4s" for the live status bar. */
function formatTime(seconds) {
  return `${seconds.toFixed(1)}s`;
}
