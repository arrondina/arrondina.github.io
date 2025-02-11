// ===== Modal Handling ===== //

// Open and close the Login/Signup Modal
function showLoginModal() {
    const modal = document.getElementById("authModal");
    if (modal) modal.style.display = "block";
}
  
function closeLoginModal() {
    const modal = document.getElementById("authModal");
    if (modal) modal.style.display = "none";
}
 
// ===== Local Login Functionality ===== //
function attachEventListeners() {
    const loginForm = document.getElementById("login-form");
    if (loginForm) {
        loginForm.addEventListener("submit", function (e) {
            e.preventDefault(); // Prevent page refresh

             
            // Get login input values
            const email = document.getElementById("login-email").value.trim();
            const password = document.getElementById("login-password").value.trim();

            const testUser = {
                email: "user@gmail.com",
                password: "user123",
                name: "User"
            };

            console.log(email + ' ' + password)

            // Validate credentials
            if (email === testUser.email && password === testUser.password) {
                localStorage.setItem("user", JSON.stringify(testUser));
                showLoggedInState(testUser);
                alert("Login successful! Welcome, " + testUser.name);
            } else {
                alert("Invalid email or password. Please try again.");
            }
        });
    } else {
        console.error("Login form not found.");
    }
}
 
document.addEventListener("DOMContentLoaded", function () {
    const loginForm = document.getElementById("login-form");

    if (loginForm) {
        loginForm.addEventListener("submit", async function (event) {
            event.preventDefault();
            console.log("after if (loginForm)")

            //  Ensure elements exist before accessing their values
            const emailInput = document.getElementById("login-email");
            const passwordInput = document.getElementById("login-password");

            if (!emailInput || !passwordInput) {
                console.error("Login form inputs not found.");
                return;
            }

            console.log("1")

            const email = emailInput.value;
            const password = passwordInput.value;

            try {
                console.log("2 - Fetching login API");
                const response = await fetch("/login", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ emailLogin: email, passwordLogin: password }),
                });
            
                console.log("2.5 - Received Response:", response);
            
                // ✅ Log response details
                const text = await response.text();
                console.log("2.6 - Raw response text:", text);
            
                if (!response.ok) {
                    console.log("3 - Server responded with an error");
                    console.error("❌ Login failed:", response.status);
                    alert("Invalid email or password.");
                    return;
                }
            
                const data = JSON.parse(text); // Convert response to JSON manually
                console.log("3.5 - Parsed response data:", data);
            
                if (data && data.name) {
                    console.log("4 - Calling showLoggedInState()");
                    showLoggedInState(data);
                } else {
                    console.error("❌ No valid user data received");
                }
                console.log("5 - Done with login logic");
            } catch (error) {
                console.error("❌ Fetch error:", error);
                alert("Server error. Please try again.");
            }

            console.log("1.5 - Script reached the end");
            
        });
        
    } else {
        console.error(" Login form not found.");
    }
});

// UI Updates for Logged-In State
function showLoggedInState(user) {
    console.log("🔹 Updating UI for:", user.name); // Debugging log

    // Hide the Login button
    const loginButton = document.getElementById("login-button");
    if (loginButton) loginButton.style.display = "none";

    // Show the Profile button with the user’s name
    const profileNav = document.getElementById("profile-nav");
    if (profileNav) {
        profileNav.style.display = "block";
        profileNav.querySelector("#profile-button").textContent = `Welcome, ${user.name}`;
    }

    // Show the Log button
    const logNav = document.getElementById("log-nav");
    if (logNav) logNav.style.display = "block";

    // Close the login modal (if applicable)
    closeLoginModal();
}

function closeLoginModal() {
    const loginModal = document.getElementById("login-modal");
    if (loginModal) loginModal.style.display = "none";
}

function loggedOut() {
    // Show the Login button
    document.getElementById("login-button").style.display = "block";
  
    // Hide Profile and Log buttons
    document.getElementById("profile-nav").style.display = "none";
    document.getElementById("log-nav").style.display = "none";
}

// Book API
const apiKey = "AIzaSyAo-MpqBAect4NxyOvp1AjVN0-39F2Q2wg";

// Open the Search Modal
function openSearchModal() {
    document.getElementById("searchModal").style.display = "block";
}

// Close the Search Modal
function closeSearchModal() {
    const searchModal = document.getElementById("searchModal");
    if (searchModal) {
        searchModal.style.display = "none";
    }

    // Reset the search input field
    const searchInput = document.getElementById("book-name");
    if (searchInput) {
        searchInput.value = "";
    }

    // Clear the search results
    const searchResults = document.getElementById("searchResults");
    if (searchResults) {
        searchResults.innerHTML = "";
    }
}

// Search Books using Google Books API
async function searchBooks() {
    const query = document.getElementById("book-name").value; // Search input
    const url = `https://www.googleapis.com/books/v1/volumes?q=${encodeURIComponent(query)}&key=${apiKey}`;
  
    try {
        const response = await fetch(url);
        const data = await response.json();

        // Clear previous search results
        const searchResults = document.getElementById("searchResults");
        searchResults.innerHTML = "";

        // Display results
        if (data.items && data.items.length > 0) {
            data.items.forEach((book) => {
                const title = book.volumeInfo.title || "No Title Available";
                const authors = book.volumeInfo.authors ? book.volumeInfo.authors.join(", ") : "No Author Available";
                const publishedYear = book.volumeInfo.publishedDate ? book.volumeInfo.publishedDate.split("-")[0] : "No Year";

                // Create a list item for the book
                const li = document.createElement("li");
                li.innerHTML = `
                    <h3>${title} (${publishedYear})</h3>
                    <p>${authors}</p>
                `;

                li.classList.add("book-item");
                li.onclick = () => openBookReview(book); // Open the book review modal on click
                searchResults.appendChild(li);
            });
        } else {
            searchResults.innerHTML = "<li>No books found</li>";
        }
    } catch (error) {
        console.error("Error fetching data from Google Books API:", error);
    }
}

// ===== Book Review Modal ===== //
function openBookReview(book) {
    // Extract details
    const title = book.volumeInfo.title || "No Title Available";
    const author = book.volumeInfo.authors ? book.volumeInfo.authors.join(", ") : "No Author Available";
    const thumbnail = book.volumeInfo.imageLinks ? book.volumeInfo.imageLinks.thumbnail : "";
  
    // Set book details in the review modal
    document.getElementById("book-title").textContent = title;
    document.getElementById("book-author").textContent = author;
    document.getElementById("modal-image").src = thumbnail;
  
    // Display the modal
    const bookReviewModal = document.getElementById("bookReviewModal");
    bookReviewModal.style.display = "flex";
}
  
// Function to Close the Modal
function closeBookReviewModal() {
    const bookReviewModal = document.getElementById("bookReviewModal");
    bookReviewModal.style.display = "none";
  
    // Reset stars when modal is closed
    resetStars();
    closeSearchModal();
} 

function goBackToSearch() {
    // Close the Book Review Modal
    closeBookReviewModal();

    // Reopen the Search Modal
    const searchModal = document.getElementById("searchModal");
    if (searchModal) {
        searchModal.style.display = "block";
    }
}
  
// Save Review Functionality
function saveReview() {
    const finishedReading = document.getElementById("finishedReading").checked;
    const review = document.getElementById("review").value;
    const tags = document.getElementById("tags").value.split(",");
    const rating = Array.from(document.querySelectorAll("#rating-stars .star.selected")).length;
    
    if (reviewText.trim() === "") {
      alert("Please write a review before saving!");
      return;
    }
    
    console.log("Review Saved:");
    console.log("Finished Reading:", finishedReading);
    console.log("Review:", review);
    console.log("Tags:", tags);
    console.log("Rating:", rating);
  
    alert("Review saved successfully!");
    closeBookReviewModal();
}
  
// Function to Reset Stars
function resetStars() {
    stars.forEach((star) => star.classList.remove("selected"));
}

if (typeof window !== "undefined") {

// Close the modal when clicking outside of it
window.onclick = function (event) {
    const modal = document.getElementById("authModal");
    const searchModal = document.getElementById("searchModal");
    const bookReviewModal = document.getElementById("bookReviewModal");

    if (event.target === modal) {
        closeLoginModal();
    }

    if (event.target === searchModal) {
        closeSearchModal();
    }

    if (event.target === bookReviewModal) {
        closeBookReviewModal();
    }
};

// ===== Check Logged-In State on Page Load ===== //
window.onload = function () {
    const user = JSON.parse(localStorage.getItem("user"));
    if (user) {
        showLoggedInState(user);
    } else {
        loggedOut();
    }
};

// ===== Profile Dropdown Handling ===== //
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

// ===== Logout Handling ===== //
document.getElementById("logout").addEventListener("click", function () {
    localStorage.removeItem("user"); // Remove user data from localStorage
    alert("You have logged out.");
    loggedOut(); // Reset UI to logged-out state
});

// ===== Login/Signup Slider Handling ===== //
document.addEventListener("DOMContentLoaded", () => {
    const observeModal = () => {
        const authModal = document.getElementById("authModal");

        // Run slider logic only if the modal is present
        if (authModal) {
            // Get elements
            const loginText = document.querySelector(".title-text .login");
            const loginForm = document.querySelector("form.login");
            const signupForm = document.querySelector("form.signup");
            const loginBtn = document.querySelector("label.login");
            const signupBtn = document.querySelector("label.signup");
            const signupLink = document.querySelector("form .signup-link a");

            // Safety checks to ensure elements exist before adding event listeners
            if (loginText && loginForm && signupForm && loginBtn && signupBtn && signupLink) {
                // Handle signup button click
                signupBtn.addEventListener("click", () => {
                    loginForm.style.marginLeft = "-50%";
                    loginText.style.marginLeft = "-50%";
                });

                // Handle login button click
                loginBtn.addEventListener("click", () => {
                    loginForm.style.marginLeft = "0%";
                    loginText.style.marginLeft = "0%";
                });

                // Handle "Signup now" link click
                signupLink.addEventListener("click", (e) => {
                    e.preventDefault();
                    signupBtn.click();
                });

                console.log("Login/Signup slider initialized.");
            } else {
                console.error("One or more elements for the login/signup slider handling are missing.");
            }
        } else {
            console.warn("authModal not yet loaded. Retrying...");
            setTimeout(observeModal, 100); // Retry in 100ms
        }
    };

    observeModal(); // Start observing the modal
});

// ===== Search Functionality ===== //
document.getElementById("log-nav").addEventListener("click", function () {
    document.getElementById("searchModal").style.display = "block";
});

// Star Rating Logic
const stars = document.querySelectorAll(".star");

stars.forEach((star) => {
    star.addEventListener("click", () => {
        const starValue = parseInt(star.getAttribute("data-value"));
      
        // Check if the clicked star is already selected
        if (star.classList.contains("selected")) {
            // If it's already selected, reset all stars
            resetStars();
        } else {
            // Otherwise, select the clicked star and all previous stars
            resetStars(); // Clear previous selection
            for (let i = 0; i < starValue; i++) {
                stars[i].classList.add("selected");
            }
        }
    });
});

// Add Event Listener to Save Button
document.querySelector(".save-button").addEventListener("click", saveReview);

// ===== Trigger Modals ===== //
document.addEventListener("DOMContentLoaded", () => {
    const loginButton = document.getElementById("login-button");
    if (loginButton) {
        loginButton.addEventListener("click", function (e) {
            e.preventDefault();
            showLoginModal();
        });
    }

    // Check if user is already logged in
    const user = JSON.parse(localStorage.getItem("user"));
    if (user) {
        showLoggedInState(user);
    }
});

}
// Export only for Node.js
if (typeof module !== "undefined" && module.exports) {
    module.exports = { showLoggedInState };
}