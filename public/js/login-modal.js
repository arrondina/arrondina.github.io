fetch("login-modal.html")
.then(response => {
    if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
    }
    return response.text();
})
.then(html => {
    document.body.insertAdjacentHTML("beforeend", html);
    
    const loginForm = document.getElementById("login-form");
    if (loginForm) {
        loginForm.addEventListener("submit", async function (event) {
            event.preventDefault();
            console.log("✅ Login form submitted after loading modal");
            
            const emailInput = document.getElementById("login-email");
            const passwordInput = document.getElementById("login-password");

            if (!emailInput || !passwordInput) {
                console.error("Login form inputs not found.");
                return;
            }

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

                    // Save user data in Local Storage
                    localStorage.setItem("user", JSON.stringify(data));
                    showLoggedInState(data);

                    // Redirect to Home Page
                    window.location.href = "index.html";
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
        console.error("❌ Login form not found after loading modal.");
    }
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

