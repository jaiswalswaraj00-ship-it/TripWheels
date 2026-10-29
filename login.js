let selectedRole = "user";


/* ===============================
   USER / OWNER
================================ */

function selectRole(role) {

    selectedRole = role;

    const userButton =
        document.getElementById("userRole");

    const ownerButton =
        document.getElementById("ownerRole");

    userButton.classList.remove("active");
    ownerButton.classList.remove("active");

    if (role === "user") {

        userButton.classList.add("active");

    } else {

        ownerButton.classList.add("active");

    }
}


/* ===============================
   LOGIN
================================ */

async function loginUser(event) {

    event.preventDefault();

    const phone =
        document.getElementById("phone").value.trim();

    const password =
        document.getElementById("password").value.trim();


    /* PHONE VALIDATION */

    if (!/^[6-9][0-9]{9}$/.test(phone)) {

        alert("Please enter a valid 10-digit Indian phone number.");

        return;
    }


    /* PASSWORD VALIDATION */

    if (password === "") {

        alert("Please enter your password.");

        return;
    }


    /* ===============================
       CONNECT WITH BACKEND
    ================================ */

    try {

        const response = await fetch(
            "http://localhost:5000/api/users/login",
            {
                method: "POST",

                headers: {
                    "Content-Type": "application/json"
                },

                body: JSON.stringify({

                    mobile: phone,

                    password: password,

                    role: selectedRole

                })
            }
        );


        const data = await response.json();


        /* ===============================
           LOGIN FAILED
        ================================ */

        if (!response.ok) {

            alert("❌ " + data.message);

            return;
        }


        /* ===============================
           LOGIN SUCCESSFUL
        ================================ */

        localStorage.setItem(
            "tripwheelsPhone",
            phone
        );

        localStorage.setItem(
            "tripwheelsRole",
            selectedRole
        );


        /* Save user information */

        if (data.user) {

            localStorage.setItem(
                "tripwheelsUser",
                JSON.stringify(data.user)
            );

        }


        /* ===============================
           GENERATE OTP
        ================================ */

        const otp =
            Math.floor(100000 + Math.random() * 900000);


        localStorage.setItem(
            "tripwheelsOTP",
            otp
        );


        /* ===============================
           TEMPORARY OTP FOR TESTING
        ================================ */

        alert(
            "Your TripWheels OTP is: " + otp
        );


        /* ===============================
           OPEN OTP PAGE
        ================================ */

        window.location.href = "otp.html";


    } catch (error) {

        console.error("Login Error:", error);

        alert(
            "❌ Cannot connect to TripWheels server. Please make sure the backend is running."
        );

    }
}


/* ===============================
   PASSWORD SHOW / HIDE
================================ */

function togglePassword() {

    const password =
        document.getElementById("password");

    const button =
        document.querySelector(".show-btn");


    if (password.type === "password") {

        password.type = "text";

        button.innerText = "Hide";

    } else {

        password.type = "password";

        button.innerText = "Show";

    }
}


/* ===============================
   SIGNUP
================================ */

function signup() {

    window.location.href = "signup.html";

}


/* ===============================
   FORGOT PASSWORD
================================ */

function forgotPassword(event) {

    event.preventDefault();

    alert(
        "Password recovery will use OTP verification."
    );

}