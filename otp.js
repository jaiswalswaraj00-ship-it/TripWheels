const otpInputs = document.querySelectorAll(".otp");

// Automatically move to next box
otpInputs.forEach((input, index) => {

    input.addEventListener("input", () => {

        if (input.value.length === 1 && index < otpInputs.length - 1) {
            otpInputs[index + 1].focus();
        }

    });

    input.addEventListener("keydown", (event) => {

        if (event.key === "Backspace" && input.value === "" && index > 0) {
            otpInputs[index - 1].focus();
        }

    });

});

// Demo mobile number
document.getElementById("mobileDisplay").innerText =
    "+91 XXXXX XXXXX";


function verifyOTP() {

    let otp = "";

    const otpInputs = document.querySelectorAll(".otp");

    otpInputs.forEach(function(input) {
        otp += input.value;
    });


    if (otp.length !== 6) {

        document.getElementById("message").innerText =
            "Please enter all 6 digits.";

        document.getElementById("message").style.color =
            "red";

        return;
    }


    // Demo OTP verification

    alert("OTP Verified Successfully!");


    // OTP → Profile

    window.location.href = "profile.html";
}

    // Demo OTP verification
    alert("OTP Verified Successfully!");

    // Go to profile page
    window.location.href = "profile.html";



function resendOTP() {

    alert("New OTP has been sent!");

}


function goBack() {

    window.location.href = "login.html";

}