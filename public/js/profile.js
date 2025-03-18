let user = null;

document.addEventListener("DOMContentLoaded", async function () {
    console.log("Profile.js loaded"); // Debugging log

    let user = JSON.parse(localStorage.getItem("user"));

    if (!user) {
        console.log("🔵 No user in localStorage. Fetching from API...");
        try {
            const response = await fetch("/user", { method: "GET", credentials: "include" });

        if (!response.ok) {
            console.error("❌ Unauthorized access. Redirecting to login...");
            window.location.href = "/index.html"; // Redirect to login if not authenticated
            return;
        }

        user = await response.json();
        console.log("✅ User data loaded:", user);

        localStorage.setItem("user", JSON.stringify(user));

        } catch (error) {
            console.error("❌ Error fetching user data:", error);
            alert("⚠️ Failed to load profile. Redirecting...");
            window.location.href = "/index.html"; // Redirect to login on error
            return;
        }
    } else {
        console.log("✅ User data loaded from localStorage:", user);
    }

    // Update profile with user data
    document.querySelector(".sideBar-personal__name p").textContent = user.name;
    document.querySelector(".sideBar-personal__mail").textContent = user.email;
    document.querySelector(".profileInfo-content.username").textContent = user.name;
    document.querySelector(".profileInfo-content.email").textContent = user.email;
    
    // Handle Edit Button
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

// Save Updated Name
async function saveNewName() {
    const newName = document.getElementById("new-username").value.trim();
    
    if (newName === "") {
        alert("Please enter a valid name.");
        return;
    }

    try {
        // Send request to update the name
        const response = await fetch("/update-name", {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            credentials: "include", // Send cookies for authentication
            body: JSON.stringify({ newName: newName })
        });

        if (!response.ok) {
            throw new Error("Failed to update name in the database.");
        }

        const updatedUser = await response.json();
        console.log("✅ Name updated successfully:", updatedUser);

        // Update UI
        user.name = newName;
        const firstName = newName.split(" ")[0];

        document.querySelector("#profile-button").textContent = `Welcome, ${firstName}`;
        document.querySelector(".sideBar-personal__name p").textContent = newName;
        document.querySelector(".profileInfo-content.username").textContent = newName;

        alert("Name updated successfully!");
        closeEditModal();
    } catch (error) {
        console.error("Error updating name:", error);
        alert("Failed to update name. Please try again.");
    }
}