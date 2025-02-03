// Dark Mode Toggle
const darkModeToggle = document.getElementById("darkModeToggle");

darkModeToggle.addEventListener("click", () => {
    document.body.classList.toggle("dark-mode");
    darkModeToggle.textContent = document.body.classList.contains("dark-mode") ? "☀️" : "🌙";
});

// Fade-in Animation on Scroll
const sections = document.querySelectorAll("section");

const revealSections = () => {
    sections.forEach((section) => {
        if (section.getBoundingClientRect().top < window.innerHeight - 100) {
            section.classList.add("show");
        }
    });
};

window.addEventListener("scroll", revealSections);
document.addEventListener("DOMContentLoaded", revealSections);

// Work Filtering Feature
const filterButtons = document.querySelectorAll(".filter-btn");
const workItems = document.querySelectorAll(".work-item");

filterButtons.forEach((button) => {
    button.addEventListener("click", () => {
        filterButtons.forEach((btn) => btn.classList.remove("active"));
        button.classList.add("active");

        const filter = button.getAttribute("data-filter");

        workItems.forEach((item) => {
            item.style.display = (filter === "all" || item.getAttribute("data-category") === filter) ? "block" : "none";
        });
    });
});

// Contact Form Submission
document.getElementById("contactForm").addEventListener("submit", (event) => {
    event.preventDefault();
    alert("Thank you for reaching out! I'll get back to you soon.");
});
