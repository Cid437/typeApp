let targetText = "";
let started = false;

let totalTyped = 0;
let correctTyped = 0;
let errors = 0;

function initializeTyping(snippet) {

    targetText = snippet;

    totalTyped = 0;
    correctTyped = 0;
    errors = 0;

    updateErrors(0);
    updateWPM(0);
    updateAccuracy(100);

    const input =
        document.getElementById("typing-input");

    input.value = "";

    input.disabled = false;

    input.addEventListener("input", handleTyping);
}

function handleTyping(event) {

    if (!started) {

        started = true;

        startTimer();
    }

    const typed =
        event.target.value;

    totalTyped = typed.length;

    correctTyped = 0;

    errors = 0;

    for (
        let i = 0;
        i < typed.length;
        i++
    ) {

        if (
            typed[i] === targetText[i]
        ) {

            correctTyped++;

        } else {

            errors++;
        }
    }

    const elapsed =
        60 - timer;

    const wpm =
        calculateWPM(
            correctTyped,
            elapsed
        );

    const accuracy =
        calculateAccuracy(
            correctTyped,
            totalTyped
        );

    updateWPM(wpm);
    updateAccuracy(accuracy);
    updateErrors(errors);

    saveBestWPM(wpm);
    
}

function submitTest() {

    const typed =
        document.getElementById(
            "typing-input"
        ).value;

    const totalChars =
        typed.length;

    const accuracy =
        calculateAccuracy(
            correctTyped,
            totalChars
        );

    const elapsed =
        60 - timer;

    const wpm =
        calculateWPM(
            correctTyped,
            elapsed
        );

    alert(
        `Results

WPM: ${wpm}
Accuracy: ${accuracy}%
Errors: ${errors}`
    );
}