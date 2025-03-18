fetch("login-modal.html")
    .then(response => {
        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }
        return response.text();
    })
    .then(html => {
        document.body.insertAdjacentHTML("beforeend", html);

        attachSignupListener();
    })
    .catch(error => {
        console.error("Error loading login modal:", error);
    });

document.addEventListener("DOMContentLoaded", function () {
    const user = JSON.parse(localStorage.getItem("user"));
    if (user) {
        showLoggedInState(user);
    }
});

function attachSignupListener() {
    // Login Handling
    const loginButton = document.getElementById("login-btn");
    
    if (loginButton) {
        loginButton.addEventListener("click", async function (event) {
            event.preventDefault();
            console.log("✅ Login button clicked");
            
            const emailInput = document.getElementById("login-email");
            const passwordInput = document.getElementById("login-password");

            if (!emailInput || !passwordInput) {
                console.error("Login form inputs not found.");
                return;
            }

            const email = emailInput.value.trim();
            const password = passwordInput.value.trim();

            try {
                console.log("2 - Fetching login API");
                const response = await fetch("/login", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    credentials: "include",
                    body: JSON.stringify({ 
                        emailLogin: email, 
                        passwordLogin: password, 
                    }),
                });

                console.log("2.5 - Received Response:", response);

                // ✅ Parse JSON response 
                const data = await response.json();
                console.log("3.5 - Parsed response data:", data);

                if (!response.ok) {
                    console.log("3 - Server responded with an error");
                    console.error("❌ Login failed:", errorData.error);
                    alert(`⚠️ ${errorData.error}`);
                    return;
                }

                localStorage.removeItem("user");
                document.cookie = "auth_token=; path=/; expires=Thu, 01 Jan 1970 00:00:00 UTC;"; // Expire previous token

                // ✅ Store token in a cookie
                document.cookie = `auth_token=${data.token}; path=/; Secure; SameSite=Strict`;

                // ✅ Store user details in localStorage
                localStorage.setItem("user", JSON.stringify(data.user));

                // ✅ Update UI
                showLoggedInState(data.user);

                // ✅ Redirect to Home Page
                window.location.href = "index.html";

            } catch (error) {
                console.error("❌ Fetch error:", error);
                alert("Server error. Please try again.");
            }

            console.log("1.5 - Script reached the end");
        });
    } else {
        console.error("❌ Login button not found.");
    }

    // Signup Handling
    const signupButton = document.getElementById("signup-btn");

    if (signupButton) {
        signupButton.addEventListener("click", async function (event) {
            event.preventDefault();
            console.log("✅ Signup button clicked");

            // Get user input
            const username = document.getElementById("signup-username").value.trim();
            const email = document.getElementById("signup-email").value.trim();
            const password = document.getElementById("signup-password").value.trim();
            const confirmPassword = document.getElementById("signup-confirm-password").value.trim();

            console.log("📝 Username:", username);
            console.log("📧 Email:", email);
            console.log("🔑 Password:", password);

            // Basic validation
            if (!username || !email || !password || !confirmPassword) {
                alert("⚠️ Please fill out all fields.");
                return;
            }

            if (password !== confirmPassword) {
                alert("⚠️ Passwords do not match!");
                return;
            }

            try {
                // Send signup request to the server
                console.log("Sending signup request...");

                const response = await fetch("/signup", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ 
                        nameSignup: username, 
                        emailSignup: email, 
                        passwordSignup: password, 
                    }),
                });

                const data = await response.json();
                console.log("🔹 Server Response:", data);
                
                if (!response.ok) {
                    alert(`⚠️ Signup failed: ${data.error}`);
                    return;
                }

                // Save user data in Local Storage
                localStorage.setItem("user", JSON.stringify(data.user));
                console.log(" User signed up:", data.user);

                // Redirect to Home Page
                window.location.href = "index.html";

            } catch (error) {
                console.error("❌ Signup error:", error);
                alert("Server error. Please try again.");
            }
        });
    } else {
        console.error("❌ Signup button not found.");
    }
}