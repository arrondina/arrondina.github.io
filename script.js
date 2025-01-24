const testUser = {
    email: "user@gmail.com",
    password: "user123",
    name: "Test User"
};

// Show the login modal
function showLoginModal() {
    document.getElementById("authModal").style.display = "block";
}

// Close the login modal
function closeLoginModal() {
    document.getElementById("authModal").style.display = "none";
}

// Handle login submission
document.getElementById("login-form").addEventListener("submit", function (e) {
    e.preventDefault(); // Prevent default form submission

    const email = document.getElementById("email").value.trim();
    const password = document.getElementById("password").value.trim();

    // Check against hardcoded test credentials
    if (email === testUser.email && password === testUser.password) {
        // Save user data in localStorage
        localStorage.setItem("user", JSON.stringify(testUser));

        // Update the UI to reflect logged-in state
        showLoggedInState(testUser);
        alert("Login successful! Welcome, " + testUser.name);
    } else {
        alert("Invalid email or password. Please try again.");
    }
});

// Show logged-in state (Profile + Log buttons)
function showLoggedInState(user) {
    // Hide the Login button
    document.getElementById("login-button").style.display = "none";

    // Show the Profile button
    const profileNav = document.getElementById("profile-nav");
    profileNav.style.display = "block";
    profileNav.querySelector("#profile-button").textContent = `Welcome, ${user.name}`;

    // Show the Log button
    const logNav = document.getElementById("log-nav");
    logNav.style.display = "block";

    // Close the login modal
    closeLoginModal();
}

// Check for logged-in state on page load
window.onload = function () {
    const user = JSON.parse(localStorage.getItem("user"));
    console.log("On Load - Retrieved User:", user);
    if (user) {
        showLoggedInState(user);
    }
};

// Open the Log Modal for Reviews
function openLogModal() {
    alert("This will open the Log Review modal. (Placeholder for now)");
}

// Toggle the dropdown menu when the profile button is clicked
document.getElementById("profile-button").addEventListener("click", function (e) {
    e.preventDefault();
    const dropdown = document.getElementById("profile-dropdown");
    dropdown.style.display = dropdown.style.display === "block" ? "none" : "block";
});

// Close the dropdown if clicked outside
document.addEventListener("click", function (e) {
    const dropdown = document.getElementById("profile-dropdown");
    const profileButton = document.getElementById("profile-button");
    if (!profileButton.contains(e.target) && !dropdown.contains(e.target)) {
        dropdown.style.display = "none";
    }
});

// Handle the Logout button
document.getElementById("logout").addEventListener("click", function () {
    localStorage.removeItem("user"); // Remove user data from localStorage
    alert("You have logged out.");
    loggedOut(); // Reset UI to logged-out state
});

// Reset UI to Logged-Out State
function loggedOut() {
    // Show the Login button
    document.getElementById("login-button").style.display = "block";

    // Hide the Profile button
    document.getElementById("profile-nav").style.display = "none";

    // Hide the Log button
    document.getElementById("log-nav").style.display = "none";
}
