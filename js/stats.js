function calculateWPM(charsTyped, secondsElapsed) {

    if (secondsElapsed === 0)
        return 0;

    return Math.round(
        (charsTyped / 5) /
        (secondsElapsed / 60)
    );
}

function calculateAccuracy(correct, total) {

    if (total === 0)
        return 100;

    return Math.round(
        (correct / total) * 100
    );
}