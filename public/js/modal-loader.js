// Check if the modal is already loaded
if (!window.authModalLoaded) {
    window.authModalLoaded = true; // Set the flag

    // Fetch the modal once
    fetch("/public/login-modal.html")
        .then(response => {
            if (!response.ok) {
                throw new Error(`HTTP error! Status: ${response.status}`);
            }
            return response.text();
        })
        .then(html => {
            document.body.insertAdjacentHTML("beforeend", html);
            console.log("✅ authModal loaded successfully");
        })
        .catch(error => {
            console.error("❌ Error loading authModal:", error);
        });
} else {
    console.log("⚠️ authModal already loaded. Skipping...");
}