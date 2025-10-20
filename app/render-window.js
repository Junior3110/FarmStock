window.addEventListener("DOMContentLoaded", () => {
    const minimizeBtn = document.getElementById("minimize");
    const maximizeBtn = document.getElementById("maximize");
    const closeBtn = document.getElementById("close");

    if (minimizeBtn)
        minimizeBtn.addEventListener("click", () => window.api.minimize());
    if (maximizeBtn)
        maximizeBtn.addEventListener("click", () => window.api.maximize());
    if (closeBtn)
        closeBtn.addEventListener("click", () => window.api.close());
});