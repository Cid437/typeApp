/**
 * typingEngine.js
 * -----------------------------------------------------------------------
 * Owns the live state of a single typing test: the target snippet, what
 * has been typed, timing, and cumulative accuracy tracking. Rendering is
 * delegated to ui.js; persistence to storage.js.
 * -----------------------------------------------------------------------
 */

const engine = {
  languageId: null,
  target: "",
  description: "",
  explanation: "",
  output: "",
  predictedOutput: "", // exact literal output, shown above the editor when present
  level: "beginner",
  mode: "random",       // "random" | "progression" — echoed back via onFinish
  progressIndex: null,  // this snippet's index in the sorted track (progression only)
  progressTotal: null,  // track length (progression only)
  typedChars: [],
  startTime: null,
  intervalHandle: null,
  totalKeystrokes: 0, // every character-added keystroke (mistakes included)
  totalCorrectKeystrokes: 0,
  finished: false,
  onFinish: null, // callback(stats) set by app.js
};

let inputEl; // the hidden <textarea> capturing keystrokes
let snippetEl;

/** One-time wiring of DOM listeners. Call once on app startup. */
function initTypingEngine({ onFinish }) {
  inputEl = document.getElementById("typing-input");
  snippetEl = document.getElementById("snippet");
  engine.onFinish = onFinish;

  inputEl.addEventListener("input", handleInput);
  inputEl.addEventListener("keydown", handleKeyDown);
  inputEl.addEventListener("focus", () => snippetEl.classList.add("is-focused"));
  inputEl.addEventListener("blur", () => snippetEl.classList.remove("is-focused"));

  // Clicking or tabbing onto the visible snippet should focus the real
  // capture field, since the textarea itself is visually hidden.
  snippetEl.addEventListener("click", () => inputEl.focus());
  snippetEl.addEventListener("focus", () => inputEl.focus());
}

/**
 * Loads a fresh snippet into the engine and resets all test state.
 * `snippet` is the full data object: { code, level, description, explanation, output, predictedOutput }.
 * `meta` describes how it was selected: { mode, index, total }, where
 * index/total are only meaningful in "progression" mode.
 */
function loadSnippet(languageId, snippet, meta = { mode: "random", index: null, total: null }) {
  stopTimer();

  engine.languageId = languageId;
  engine.target = snippet.code;
  engine.description = snippet.description;
  engine.explanation = snippet.explanation;
  engine.output = snippet.output;
  engine.predictedOutput = snippet.predictedOutput || "";
  engine.level = snippet.level;
  engine.mode = meta.mode;
  engine.progressIndex = meta.index;
  engine.progressTotal = meta.total;

  engine.typedChars = [];
  engine.startTime = null;
  engine.totalKeystrokes = 0;
  engine.totalCorrectKeystrokes = 0;
  engine.finished = false;

  inputEl.value = "";
  inputEl.disabled = false;

  renderSnippetDescription(engine.description);
  renderOutputGoal(engine.predictedOutput || engine.output);
  renderLevelBadge({ level: engine.level, mode: engine.mode, index: engine.progressIndex, total: engine.progressTotal });
  renderSnippet(engine.target, engine.typedChars);
  updateStatsDisplay({ wpm: 0, accuracy: 100, errors: 0, seconds: 0 });
  setTypingHintVisible(true);
}

/**
 * Focuses the hidden capture field so the person can start typing right
 * away after picking a language/snippet — no click into the editor first.
 * Called after the typing screen becomes visible (a hidden textarea can't
 * take focus, so this must run after showScreen("typing")).
 */
function focusTypingInput() {
  if (inputEl) inputEl.focus();
}

/** Restarts the current snippet from scratch (Tab shortcut / Reset button). */
function restartSnippet() {
  showTrackCompleteNote(false);
  loadSnippet(
    engine.languageId,
    {
      code: engine.target,
      level: engine.level,
      description: engine.description,
      explanation: engine.explanation,
      output: engine.output,
      predictedOutput: engine.predictedOutput,
    },
    { mode: engine.mode, index: engine.progressIndex, total: engine.progressTotal }
  );
  inputEl.focus();
}

/**
 * Main input handler. Fires on every keystroke (including backspace/paste).
 * Compares the full current value against the target and re-renders.
 */
function handleInput(event) {
  if (engine.finished) return;

  const newValue = event.target.value;
  const previousLength = engine.typedChars.length;

  // Start the clock on the very first keystroke of the test.
  if (!engine.startTime) {
    engine.startTime = performance.now();
    startTimer();
  }

  // Only count *added* characters as keystrokes for accuracy purposes —
  // backspacing shouldn't let someone "erase" a mistake from the stats,
  // which mirrors how most typing tests measure accuracy.
  if (newValue.length > previousLength) {
    const addedIndex = newValue.length - 1;
    const isCorrect = newValue[addedIndex] === engine.target[addedIndex];
    engine.totalKeystrokes++;
    if (isCorrect) engine.totalCorrectKeystrokes++;
  }

  engine.typedChars = newValue.split("");
  updateCursorPosition();
  updateLiveStats();

  if (newValue.length >= engine.target.length) {
    finishTest();
  }
}

/**
 * Handles non-text keys: Tab restarts the current snippet instead of
 * moving focus, matching the "quick shortcut to restart" requirement.
 */
function handleKeyDown(event) {
  if (event.key === "Tab") {
    event.preventDefault();
    restartSnippet();
  }
}

/** Re-renders the snippet so the highlighted/cursor character stays in sync. */
function updateCursorPosition() {
  renderSnippet(engine.target, engine.typedChars);
}

/** Computes and pushes the current live WPM/accuracy/errors/time to the UI. */
function updateLiveStats() {
  const elapsedSeconds = (performance.now() - engine.startTime) / 1000;
  const wpm = calculateWPM(engine.totalCorrectKeystrokes, elapsedSeconds);
  const accuracy = calculateAccuracy(engine.totalCorrectKeystrokes, engine.totalKeystrokes);
  const errors = engine.totalKeystrokes - engine.totalCorrectKeystrokes;

  updateStatsDisplay({ wpm, accuracy, errors, seconds: elapsedSeconds });
}

/** Ticks the on-screen timer every 100ms while a test is in progress. */
function startTimer() {
  setTypingHintVisible(false);
  clearInterval(engine.intervalHandle);
  engine.intervalHandle = setInterval(() => {
    if (!engine.finished) updateLiveStats();
  }, 100);
}

function stopTimer() {
  clearInterval(engine.intervalHandle);
  engine.intervalHandle = null;
}

/** Ends the test, finalizes stats, persists a new best if applicable. */
function finishTest() {
  engine.finished = true;
  stopTimer();
  inputEl.disabled = true;

  const elapsedSeconds = (performance.now() - engine.startTime) / 1000;
  const wpm = calculateWPM(engine.totalCorrectKeystrokes, elapsedSeconds);
  const accuracy = calculateAccuracy(engine.totalCorrectKeystrokes, engine.totalKeystrokes);
  const errors = engine.totalKeystrokes - engine.totalCorrectKeystrokes;

  const isNewBest = saveBestWPM(engine.languageId, wpm);

  if (engine.onFinish) {
    engine.onFinish({
      languageId: engine.languageId,
      wpm,
      accuracy,
      errors,
      isNewBest,
      explanation: engine.explanation,
      output: engine.output,
      mode: engine.mode,
      progressIndex: engine.progressIndex,
      progressTotal: engine.progressTotal,
    });
  }
}
