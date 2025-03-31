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

// ===== UI Updates for Logged-In State ===== //
function showLoggedInState(user) {
    console.log("🔹 Checking stored user data:", user);

    if (!user || !user.name) {
        console.error("❌ No user data available.");
        return;
    }

    console.log("🔹 Updating UI for:", user.name); // Debugging log

    // Hide the Login button
    const loginButton = document.getElementById("login-button");
    if (loginButton) {
        loginButton.style.display = "none";
        console.log("✅ Hiding login button");
    } else {
        console.error("❌ login-button not found in the DOM");
    }

    // Show the Profile button with the user’s name
    const profileNav = document.getElementById("profile-nav");
    if (profileNav) {
        profileNav.style.display = "block";

        const firstName = user.name.split(" ")[0]; 
        profileNav.querySelector("#profile-button").textContent = `Welcome, ${firstName}`;
        console.log(`✅ Updated profile button: Welcome, ${firstName}`);
    } else {
        console.error("❌ profile-nav not found in the DOM");
    }

    // Show the Log button
    const logNav = document.getElementById("log-nav");
    if (logNav) {
        logNav.style.display = "block";
        console.log("✅ Showing log navigation");
    } else {
        console.error("❌ log-nav not found in the DOM");
    }

    // Close the login modal
    closeLoginModal();
}

document.addEventListener("DOMContentLoaded", function () {
    const user = JSON.parse(localStorage.getItem("user"));
    console.log("🔎 Checking stored user data:", user);

    if (user) {
        console.log("🔹 User found in localStorage:", user);
        showLoggedInState(user);
    } else {
        console.log("❌ No user data found.");
    }
});

// ===== Profile Dropdown Handling ===== //
document.addEventListener("DOMContentLoaded", function () {
    const profileButton = document.getElementById("profile-button");
    if (profileButton) {
        profileButton.addEventListener("click", function (e) {
            e.preventDefault();
            const dropdown = document.getElementById("profile-dropdown");
            if (dropdown) {
                dropdown.style.display = dropdown.style.display === "block" ? "none" : "block";
            }
        });
    } else {
        console.error("❌ profile-button not found in the DOM");
    }
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

    location.href = "/"; // Redirect to homepage
});

function loggedOut() {
    // Show the Login button
    document.getElementById("login-button").style.display = "block";
  
    // Hide Profile and Log buttons
    document.getElementById("profile-nav").style.display = "none";
    document.getElementById("log-nav").style.display = "none";
}

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
            setTimeout(observeModal, 100); // Retry in 100ms
        }
    };

    observeModal(); // Start observing the modal
});

// ===== Search Functionality ===== //
document.getElementById("log-nav").addEventListener("click", function () {
    document.getElementById("searchModal").style.display = "block";
});

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

let savedReviewBook = null

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
    const publishedYear = book.volumeInfo.publishedDate ? book.volumeInfo.publishedDate.split("-")[0] : "No Year";
  
    // Set book details in the review modal
    document.getElementById("book-title").textContent = title;
    document.getElementById("book-author").textContent = author;
    document.getElementById("modal-image").src = thumbnail;
  
    // Display the modal
    const bookReviewModal = document.getElementById("bookReviewModal");
    bookReviewModal.style.display = "flex";
    savedReviewBook = {
        title: book.volumeInfo.title || "No Title Available",
        author: book.volumeInfo.authors ? book.volumeInfo.authors.join(", ") : "No Author Available",
        publishedYear: book.volumeInfo.publishedDate ? book.volumeInfo.publishedDate.split("-")[0] : "No Year",
        genre: book.volumeInfo.genre ? book.volumeInfo.genre.join (", ") : "No genres Available",
        thumbnail: book.volumeInfo.imageLinks ? book.volumeInfo.imageLinks.thumbnail : "default-cover.jpg"
    };
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
async function saveReview() {
    const user = JSON.parse(localStorage.getItem("user")).name;
    const finishedReading = document.getElementById("finishedReading").checked;
    const review = document.getElementById("review").value;
    const tags = document.getElementById("tags").value.split(",");
    const rating = Array.from(document.querySelectorAll("#rating-stars .star.selected")).length;
    const thumbnail = document.getElementById("modal-image");
    
    if (review.trim() === "") {
      alert("Please write a review before saving!");
      return;
    }

    const reviewData = {
        user,
        finishedReading,
        reviewContent: review,
        book: savedReviewBook,
        tags,
        rating,
        thumbnail
    };

    try {
        const response = await fetch("http://localhost:5000/bv/reviews/saveReview", {
            method: "POST",
            headers: {
              "Content-Type": "application/json"
            },
            body: JSON.stringify(reviewData)
        });

        const result = await response.json();
        console.log("THIS IS THE RESULT OF THE SAVING OF THE REVIEW" +result);
        alert(result.message);

    } catch (error) {
        console.error("Error saving review:" , error);
    }

    console.log("Review Data", reviewData)
    
    console.log("Review Saved:");
    console.log("Finished Reading:", finishedReading);
    console.log("Review:", review);
    console.log("Tags:", tags);
    console.log("Rating:", rating);

  
    alert("Review saved successfully!");
    closeBookReviewModal();
}


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
  
// Function to Reset Stars
function resetStars() {
    stars.forEach((star) => star.classList.remove("selected"));
}

// Add Event Listener to Save Button


if (typeof window !== "undefined") {

// ===== Check Logged-In State on Page Load ===== //
window.onload = function () {
    const user = JSON.parse(localStorage.getItem("user"));
    if (user) {
        showLoggedInState(user);
    } else {
        loggedOut();
    }
};

// ===== Trigger Modals ===== //
document.addEventListener("DOMContentLoaded", () => {
    const loginButton = document.getElementById("login-button");
    if (loginButton) {
        loginButton.onclick = function (e) {
            e.preventDefault();
            showLoginModal();
        }
    } else {
        console.error("login-button not found in the DOM");
    }

    // Check if user is already logged in
    const user = JSON.parse(localStorage.getItem("user"));
    if (user) {
        showLoggedInState(user);
    }
});

}

const fetchReviewFromS3 = async (fileName) => {
    const params = {
        Bucket: 'bookvibe-bucket',
        Key: `reviews/${fileName}`,
    }

    try {
        const data = await s3.getObject(params).promise();
        const review = JSON.parse(data.Body.toString());
        console.log("Fetched review: ", review);
        return review;
    } catch (error) {
        console.error("Error fetching review: ", error);
        console.log(error);
    }
};




// Export only for Node.js
if (typeof module !== "undefined" && module.exports) {
    module.exports = { showLoggedInState };
}