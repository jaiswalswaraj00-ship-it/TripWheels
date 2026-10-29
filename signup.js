let selectedRole = "user";


// ===============================
// SELECT USER / OWNER
// ===============================
function selectRole(role) {
    selectedRole = role;

    const userButton = document.getElementById("userRole");
    const ownerButton = document.getElementById("ownerRole");

    userButton.classList.remove("active");
    ownerButton.classList.remove("active");

    if (role === "user") {
        userButton.classList.add("active");
    }

    if (role === "owner") {
        ownerButton.classList.add("active");
    }

    console.log("Selected Role:", selectedRole);
}


// ===============================
// CREATE ACCOUNT
// ===============================
async function createAccount(event) {
    event.preventDefault();

    const name = document.getElementById("name").value.trim();
    const email = document.getElementById("email").value.trim();
    const mobile = document.getElementById("mobile").value.trim();
    const password = document.getElementById("password").value;
    const confirmPassword =
        document.getElementById("confirmPassword").value;

    // Mobile validation
    if (!/^[6-9][0-9]{9}$/.test(mobile)) {
        alert("Please enter a valid 10-digit Indian mobile number.");
        return;
    }

    // Password validation
    if (password.length < 6) {
        alert("Password must contain at least 6 characters.");
        return;
    }

    // Confirm password
    if (password !== confirmPassword) {
        alert("Passwords do not match.");
        return;
    }

    // Check selected role
    console.log("Creating account with role:", selectedRole);

    try {

        const response = await fetch(
            "http://localhost:5000/api/users/register",
            {
                method: "POST",

                headers: {
                    "Content-Type": "application/json"
                },

                body: JSON.stringify({
                    name: name,
                    email: email,
                    mobile: mobile,
                    password: password,
                    role: selectedRole
                })
            }
        );

        const data = await response.json();

        console.log("Server Response:", data);

        if (!response.ok) {
            alert("❌ " + data.message);
            return;
        }

        alert(
            "✅ " +
            selectedRole.toUpperCase() +
            " account created successfully!"
        );

        window.location.href = "login.html";

    } catch (error) {

        console.error("Signup Error:", error);

        alert(
            "❌ Cannot connect to TripWheels server."
        );
    }
}