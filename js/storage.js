function saveBestWPM(wpm) {

    let best =
        localStorage.getItem("bestWPM") || 0;

    if (wpm > best) {

        localStorage.setItem(
            "bestWPM",
            wpm
        );
    }
}

function getBestWPM() {

    return localStorage.getItem(
        "bestWPM"
    ) || 0;
}