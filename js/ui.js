function updateSnippet(code) {
    document.getElementById("snippet").textContent = code;
}

function updateWPM(value) {
    document.getElementById("wpm").textContent = value;
}

function updateAccuracy(value) {
    document.getElementById("accuracy").textContent =
        value + "%";
}

function updateErrors(value) {
    document.getElementById("errors").textContent = value;
}

function updateTimer(value) {
    document.getElementById("timer").textContent = value;
}