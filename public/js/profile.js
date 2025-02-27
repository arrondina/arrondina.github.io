document.addEventListener("DOMContentLoaded", function () {
    // Get user data from localStorage
    const user = JSON.parse(localStorage.getItem("user"));

    if (!user) {
        console.error("❌ No user data found. Redirecting to login...");
        window.location.href = "/index.html"; // Redirect to home if not logged in
        return;
    }

    console.log("✅ User data loaded:", user);

    // Update profile with user data
    document.querySelector(".sideBar-personal__name p").textContent = user.name;
    document.querySelector(".sideBar-personal__mail").textContent = user.email;
    document.querySelector(".profileInfo-content.username").textContent = user.name;
    document.querySelector(".profileInfo-content.email").textContent = user.email;
});

document.addEventListener("DOMContentLoaded", function () {
    console.log("Profile.js loaded"); // Debugging log

    const editButton = document.querySelector(".profileInfo-button");

    if (editButton) {
        editButton.addEventListener("click", function () {
            console.log("Edit button clicked!"); // Debugging log
            openEditModal();
        });
    } else {
        console.error("❌ Edit button not found!");
    }
});

// Open the Edit Name Modal
function openEditModal() {
    document.getElementById("editNameModal").style.display = "block";
}

// Close the Edit Name Modal
function closeEditModal() {
    const modal = document.getElementById("editNameModal");
    if (modal) modal.style.display = "none";
}

// Close the modal when clicking outside of it
window.addEventListener("click", function (event) {
    const editModal = document.getElementById("editNameModal");

    if (editModal && event.target === editModal) {
        closeEditModal();
    }
});

// Save New Name
function saveNewName() {
    const newName = document.getElementById("new-username").value.trim();
    
    if (newName !== "") {
        // Update the displayed username
        document.querySelector(".profileInfo-content.username").textContent = newName;

        // Update localStorage
        let user = JSON.parse(localStorage.getItem("user"));
        user.name = newName;
        localStorage.setItem("user", JSON.stringify(user));

        // Close Modal
        closeEditModal();
    } else {
        alert("Please enter a valid name.");
    }
}