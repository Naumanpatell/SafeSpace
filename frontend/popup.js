const statusEl = document.getElementById("status");
const toggleBtn = document.getElementById("toggle");

let active = true;

toggleBtn.addEventListener("click", () => {
    active = !active;
    statusEl.innerText = active ? "Active" : "Paused";
    // Optional: send message to content.js to pause checking
});