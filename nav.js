// Wait for the DOM to load
document.addEventListener("DOMContentLoaded", () => {
    const hamburger = document.querySelector(".hamburger-menu");
    const navBar = document.querySelector(".nav-bar");

    // Add click event listener to the hamburger menu
    hamburger.addEventListener("click", () => {
        // Toggle the "active" class on the nav-bar
        navBar.classList.toggle("active");

        // Optional: Add a log for debugging
        console.log("Hamburger menu clicked. Nav-bar toggled.");
    });
});
