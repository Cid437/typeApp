let timer = 60;
let timerInterval;

function startTimer() {

    clearInterval(timerInterval);

    timerInterval = setInterval(() => {

        timer--;

        updateTimer(timer);

        if (timer <= 0) {

            clearInterval(timerInterval);

            document
                .getElementById("typing-input")
                .disabled = true;
        }

    }, 1000);
}

function resetTimer(seconds = 60) {

    clearInterval(timerInterval);

    timer = seconds;

    updateTimer(timer);
}