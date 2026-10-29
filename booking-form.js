// ==========================================
// TRIPWHEELS BOOKING FORM
// ==========================================

let selectedVehicle = null;
let pricePerDay = 0;


// ==========================================
// PAGE LOAD
// ==========================================

document.addEventListener("DOMContentLoaded", function () {

    const user = JSON.parse(
        localStorage.getItem("tripwheelsUser")
    );

    if (!user || !user.id) {

        alert("Please login first.");

        window.location.href = "../login.html";

        return;
    }


    // GET SELECTED VEHICLE

    selectedVehicle = JSON.parse(
        localStorage.getItem("selectedVehicle")
    );


    if (!selectedVehicle) {

        alert("Please select a vehicle first.");

        window.location.href =
            "../user-dashboard.html#vehicles";

        return;
    }


    // ======================================
    // VEHICLE INFORMATION
    // ======================================

    document.getElementById("vehicleName").innerText =
        selectedVehicle.name || "Vehicle";


    document.getElementById("vehicleType").innerText =
        selectedVehicle.type || "Vehicle";


    document.getElementById("vehicleRegistration").innerText =
        selectedVehicle.registration || "--";


    pricePerDay =
        Number(selectedVehicle.price) || 0;


    document.getElementById("vehiclePrice").innerText =
        `₹${pricePerDay}/day`;


    // ======================================
    // VEHICLE IMAGE
    // ======================================

    const vehicleImage =
        document.getElementById("vehicleImage");


    if (selectedVehicle.image) {

        vehicleImage.src =
            selectedVehicle.image;

    } else {

        vehicleImage.style.display =
            "none";
    }


    // ======================================
    // DATE
    // ======================================

    const today =
        new Date();


    const todayString =
        today.toISOString().split("T")[0];


    const tomorrow =
        new Date();


    tomorrow.setDate(
        tomorrow.getDate() + 1
    );


    const tomorrowString =
        tomorrow.toISOString().split("T")[0];


    document.getElementById("bookingDate").value =
        todayString;


    document.getElementById("returnDate").value =
        tomorrowString;


    // ======================================
    // TIME
    // ======================================

    document.getElementById("pickupTime").value =
        "10:00";


    document.getElementById("returnTime").value =
        "10:00";


    // ======================================
    // MINIMUM DATES
    // ======================================

    document.getElementById("bookingDate").min =
        todayString;


    document.getElementById("returnDate").min =
        todayString;


    // ======================================
    // CALCULATE
    // ======================================

    calculateBooking();


    // ======================================
    // EVENTS
    // ======================================

    document.getElementById("bookingDate")
        .addEventListener("change", calculateBooking);


    document.getElementById("returnDate")
        .addEventListener("change", calculateBooking);


    document.getElementById("pickupTime")
        .addEventListener("change", calculateBooking);


    document.getElementById("returnTime")
        .addEventListener("change", calculateBooking);


    // ======================================
    // CONFIRM BUTTON
    // ======================================

    document.getElementById("payAdvanceBtn")
        .addEventListener(
            "click",
            confirmBooking
        );

});


// ==========================================
// CALCULATE BOOKING
// ==========================================

function calculateBooking() {

    const pickupDate =
        document.getElementById(
            "bookingDate"
        ).value;


    const returnDate =
        document.getElementById(
            "returnDate"
        ).value;


    if (!pickupDate || !returnDate) {
        return;
    }


    const start =
        new Date(pickupDate);


    const end =
        new Date(returnDate);


    if (end < start) {

        document.getElementById(
            "durationText"
        ).innerText =
            "Invalid return date";


        return;
    }


    let days =
        Math.ceil(
            (end - start) /
            (1000 * 60 * 60 * 24)
        );


    if (days < 1) {
        days = 1;
    }


    // ======================================
    // PRICE
    // ======================================

    const rentalAmount =
        pricePerDay * days;


    const platformFee =
        0;


    const totalAmount =
        rentalAmount + platformFee;


    const advanceAmount =
        Math.round(totalAmount * 0.20);


    const remainingAmount =
        totalAmount - advanceAmount;


    // ======================================
    // UPDATE PAGE
    // ======================================

    document.getElementById(
        "durationText"
    ).innerText =
        `${days} day(s)`;


    document.getElementById(
        "rentalCharges"
    ).innerText =
        `₹${rentalAmount}`;


    document.getElementById(
        "totalAmount"
    ).innerText =
        `₹${totalAmount}`;


    document.getElementById(
        "advanceAmount"
    ).innerText =
        `₹${advanceAmount}`;


    document.getElementById(
        "remainingAmount"
    ).innerText =
        `₹${remainingAmount}`;
}


// ==========================================
// CONFIRM BOOKING
// ==========================================

async function confirmBooking() {

    const user =
        JSON.parse(
            localStorage.getItem(
                "tripwheelsUser"
            )
        );


    if (!user || !user.id) {

        alert("Please login first.");

        return;
    }


    if (!selectedVehicle) {

        alert("Vehicle not selected.");

        return;
    }


    // ======================================
    // GET FORM DATA
    // ======================================

    const pickupDate =
        document.getElementById(
            "bookingDate"
        ).value;


    const pickupTime =
        document.getElementById(
            "pickupTime"
        ).value;


    const returnDate =
        document.getElementById(
            "returnDate"
        ).value;


    const returnTime =
        document.getElementById(
            "returnTime"
        ).value;


    const paymentMethod =
        document.querySelector(
            'input[name="paymentMethod"]:checked'
        )?.value || "UPI";


    // ======================================
    // VALIDATION
    // ======================================

    if (
        !pickupDate ||
        !pickupTime ||
        !returnDate ||
        !returnTime
    ) {

        alert(
            "Please fill all date and time details."
        );

        return;
    }


    const start =
        new Date(
            `${pickupDate}T${pickupTime}`
        );


    const end =
        new Date(
            `${returnDate}T${returnTime}`
        );


    if (end <= start) {

        alert(
            "Return date/time must be after pickup date/time."
        );

        return;
    }


    // ======================================
    // DAYS
    // ======================================

    let days =
        Math.ceil(
            (end - start) /
            (1000 * 60 * 60 * 24)
        );


    if (days < 1) {
        days = 1;
    }


    // ======================================
    // AMOUNT
    // ======================================

    const amount =
        pricePerDay * days;


    // ======================================
    // FIXED LOCATIONS
    // ======================================

    const fixedLocation =
        "Government College of Engineering, Amravati, VMV Road, Near Kathora Naka";


    // ======================================
    // BOOKING DATA
    // ======================================

    const bookingData = {

        userId:
            user.id,

        ownerId:
            selectedVehicle.ownerId,

        vehicleId:
            selectedVehicle.vehicleId ||
            selectedVehicle._id,

        vehicle:
            selectedVehicle.name ||
            "Vehicle",

        vehicleType:
            selectedVehicle.type ||
            "Vehicle",

        location:
            fixedLocation,

        date:
            pickupDate,

        days:
            days,

        amount:
            amount,

        pickupLocation:
            fixedLocation,

        dropLocation:
            fixedLocation,

        pickupDate:
            pickupDate,

        pickupTime:
            pickupTime,

        returnDate:
            returnDate,

        returnTime:
            returnTime,

        paymentMethod:
            paymentMethod,

        paymentStatus:
            "Pending"
    };


    // ======================================
    // SEND TO BACKEND
    // ======================================

    try {

        const button =
            document.getElementById(
                "payAdvanceBtn"
            );


        button.disabled = true;

        button.innerText =
            "Creating Booking...";


        const response =
            await fetch(
                "http://localhost:5000/api/bookings/create",
                {
                    method: "POST",

                    headers: {
                        "Content-Type":
                            "application/json"
                    },

                    body:
                        JSON.stringify(
                            bookingData
                        )
                }
            );


        const data =
            await response.json();


        if (!response.ok) {

            button.disabled = false;

            button.innerText =
                "💳 Pay Advance & Confirm Booking";


            alert(
                data.message ||
                "Booking failed."
            );

            return;
        }


        // ==================================
        // SUCCESS
        // ==================================

        alert(
            "🎉 Booking created successfully!"
        );


        localStorage.removeItem(
            "selectedVehicle"
        );


        window.location.href =
            "../my-bookings.html";


    } catch (error) {

        console.error(
            "BOOKING ERROR:",
            error
        );


        const button =
            document.getElementById(
                "payAdvanceBtn"
            );


        button.disabled = false;

        button.innerText =
            "💳 Pay Advance & Confirm Booking";


        alert(
            "Unable to connect to the TripWheels server."
        );
    }
}