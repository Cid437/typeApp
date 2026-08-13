document.addEventListener("DOMContentLoaded", () => {

    console.log("App loaded");

    document.getElementById("dark-theme")
        .addEventListener("click", () => {
            console.log("Dark clicked");
            document.body.className = "theme-dark";
        });

    document.getElementById("light-theme")
        .addEventListener("click", () => {
            console.log("Light clicked");
            document.body.className = "theme-light";
        });

    document.getElementById("dracula-theme")
        .addEventListener("click", () => {
            document.body.className = "theme-dracula";
        });

        const code =
            getRandomSnippet();

        updateSnippet(code);

        initializeTyping(code);

        console.log(
            "Best WPM:",
            getBestWPM()
        );

        const submitButton =
        document.getElementById("submit-test");

    submitButton.addEventListener(
        "click",
        submitTest
    );

});