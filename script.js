// ================= VEHICLE FILTER =================

function selectVehicle(type, button) {

    const buttons =
        document.querySelectorAll(".vehicle-tab");

    buttons.forEach(function(btn) {
        btn.classList.remove("active");
    });

    button.classList.add("active");


    const vehicles =
        document.querySelectorAll(".vehicle-card");


    vehicles.forEach(function(vehicle) {

        if (
            type === "all" ||
            vehicle.dataset.type === type
        ) {

            vehicle.style.display = "block";

        } else {

            vehicle.style.display = "none";

        }

    });

}


// ================= SEARCH =================

function searchVehicles() {

    const city =
        document.getElementById("city").value;

    const pickupDate =
        document.getElementById("pickupDate").value;

    const returnDate =
        document.getElementById("returnDate").value;

    const pickupTime =
        document.getElementById("pickupTime").value;

    const returnTime =
        document.getElementById("returnTime").value;


    if (
        city === "" ||
        pickupDate === "" ||
        returnDate === "" ||
        pickupTime === "" ||
        returnTime === ""
    ) {

        alert(
            "Please select location, date and time."
        );

        return;
    }


    if (returnDate < pickupDate) {

        alert(
            "Return date cannot be before pickup date."
        );

        return;
    }


    document
        .getElementById("fleet")
        .scrollIntoView({
            behavior: "smooth"
        });

}

async function bookVehicle(vehicleName) {

    const user = JSON.parse(
        localStorage.getItem("tripwheelsUser")
    );

    if (!user || !user.id) {
        alert("Please login first to book a vehicle.");
        window.location.href = "login.html";
        return;
    }

    try {

        const response = await fetch(
            "http://localhost:5000/api/vehicles"
        );

        if (!response.ok) {
            throw new Error("Failed to load vehicles");
        }

        const vehicles = await response.json();

        const vehicle = vehicles.find(function (item) {
            return (
                String(item.model || "").toLowerCase() ===
                String(vehicleName).toLowerCase()
            ) ||
            (
                String(item.brand || "") +
                " " +
                String(item.model || "")
            ).toLowerCase() ===
            String(vehicleName).toLowerCase();
        });

        if (!vehicle) {
            alert(
                "This vehicle is not available in the database yet."
            );
            return;
        }

        localStorage.setItem(
            "selectedVehicle",
            JSON.stringify({
                vehicleId: vehicle._id,
                ownerId: vehicle.ownerId,
                name: vehicle.brand
                    ? vehicle.brand + " " + vehicle.model
                    : vehicle.model,
                type: vehicle.type,
                price: vehicle.price
            })
        );

        window.location.href =
            "booking-form.html";

    } catch (error) {

        console.error(
            "VEHICLE FETCH ERROR:",
            error
        );

        alert(
            "Unable to connect to the server. Please make sure backend is running."
        );
    }
}
// ================= LOGIN =================

function goToLogin() {

    window.location.href =
        "login.html";

}


// ================= GPS =================

function getLocation() {

    if (!navigator.geolocation) {

        alert(
            "GPS is not supported by your browser."
        );

        return;
    }


    navigator.geolocation.getCurrentPosition(

        function(position) {

            const latitude =
                position.coords.latitude;

            const longitude =
                position.coords.longitude;


            document.getElementById(
                "locationText"
            ).innerText =
                "My Location";


            document.getElementById(
                "city"
            ).value =
                "Current Location";


            console.log(
                "Latitude:",
                latitude
            );

            console.log(
                "Longitude:",
                longitude
            );


            alert(
                "Your location has been detected."
            );

        },


        function() {

            alert(
                "Location permission was denied."
            );

        }

    );

}


// ================= SHOW ALL =================

function showAllVehicles() {

    const vehicles =
        document.querySelectorAll(
            ".vehicle-card"
        );


    vehicles.forEach(function(vehicle) {

        vehicle.style.display =
            "block";

    });


    document
        .getElementById("fleet")
        .scrollIntoView({
            behavior: "smooth"
        });


    const buttons =
        document.querySelectorAll(
            ".vehicle-tab"
        );


    buttons.forEach(function(button) {

        button.classList.remove(
            "active"
        );

    });


    buttons[0].classList.add(
        "active"
    );

}


// ================= PAGE LOAD =================

window.onload = function() {

    const today =
        new Date();


    const year =
        today.getFullYear();

    const month =
        String(
            today.getMonth() + 1
        ).padStart(2, "0");

    const day =
        String(
            today.getDate()
        ).padStart(2, "0");


    const currentDate =
        year +
        "-" +
        month +
        "-" +
        day;


    document.getElementById(
        "pickupDate"
    ).value =
        currentDate;


    document.getElementById(
        "returnDate"
    ).value =
        currentDate;

};


// =========================================
// HOMEPAGE CUSTOMER FEEDBACK
// =========================================

let homepageFeedbacks = [];

let currentFeedbackIndex = 0;

let feedbackTimer = null;


// =========================================
// LOAD FEEDBACK FROM MONGODB
// =========================================

async function loadHomepageFeedback() {

    const feedbackBox =
        document.getElementById(
            "homepageFeedback"
        );


    const dotsBox =
        document.getElementById(
            "feedbackDots"
        );


    if (!feedbackBox) {
        return;
    }


    try {

        const response =
            await fetch(
                "http://localhost:5000/api/feedback"
            );


        if (!response.ok) {

            throw new Error(
                "Failed to load feedback"
            );

        }


        homepageFeedbacks =
            await response.json();


        // No feedback yet

        if (
            homepageFeedbacks.length === 0
        ) {

            feedbackBox.innerHTML = `

                <div class="feedback-loading">

                    No feedback yet.
                    Be the first to share your experience! 💬

                </div>

            `;

            return;
        }


        currentFeedbackIndex = 0;


        createFeedbackDots();


        showHomepageFeedback(
            currentFeedbackIndex
        );


        startFeedbackSlider();


    } catch (error) {

        console.error(
            "FEEDBACK LOAD ERROR:",
            error
        );


        feedbackBox.innerHTML = `

            <div class="feedback-loading">

                Customer experiences will appear here.

            </div>

        `;

    }

}


// =========================================
// SHOW FEEDBACK
// =========================================

function showHomepageFeedback(index) {

    const feedbackBox =
        document.getElementById(
            "homepageFeedback"
        );


    if (
        !feedbackBox ||
        !homepageFeedbacks[index]
    ) {
        return;
    }


    const feedback =
        homepageFeedbacks[index];


    const name =
        feedback.name ||
        "TripWheels User";


    const message =
        feedback.message ||
        "";


    const rating =
        Number(
            feedback.rating
        ) || 0;


    const firstLetter =
        name
            .charAt(0)
            .toUpperCase();


    const stars =
        "★".repeat(rating) +
        "☆".repeat(5 - rating);


    feedbackBox.classList.add(
        "change"
    );


    setTimeout(
        function () {

            feedbackBox.innerHTML = `

                <div class="feedback-quote">
                    “
                </div>


                <div class="homepage-feedback-rating">
                    ${stars}
                </div>


                <p class="homepage-feedback-message">
                    ${escapeFeedbackHTML(message)}
                </p>


                <div class="homepage-feedback-user">

                    <div class="feedback-user-avatar">
                        ${escapeFeedbackHTML(firstLetter)}
                    </div>


                    <div>

                        <div class="feedback-user-name">
                            ${escapeFeedbackHTML(name)}
                        </div>

                        <div class="feedback-user-text">
                            TripWheels Customer
                        </div>

                    </div>

                </div>

            `;


            feedbackBox.classList.remove(
                "change"
            );


            updateFeedbackDots(index);

        },
        400
    );

}


// =========================================
// CREATE DOTS
// =========================================

function createFeedbackDots() {

    const dotsBox =
        document.getElementById(
            "feedbackDots"
        );


    if (!dotsBox) {
        return;
    }


    dotsBox.innerHTML = "";


    homepageFeedbacks.forEach(
        function (_, index) {

            const dot =
                document.createElement(
                    "span"
                );


            dot.className =
                "feedback-dot";


            if (index === 0) {

                dot.classList.add(
                    "active"
                );

            }


            dotsBox.appendChild(dot);

        }
    );

}


// =========================================
// UPDATE DOTS
// =========================================

function updateFeedbackDots(index) {

    const dots =
        document.querySelectorAll(
            ".feedback-dot"
        );


    dots.forEach(
        function (dot, dotIndex) {

            if (
                dotIndex === index
            ) {

                dot.classList.add(
                    "active"
                );

            } else {

                dot.classList.remove(
                    "active"
                );

            }

        }
    );

}


// =========================================
// AUTOMATIC SLIDER
// =========================================

function startFeedbackSlider() {

    if (feedbackTimer) {

        clearInterval(
            feedbackTimer
        );

    }


    if (
        homepageFeedbacks.length <= 1
    ) {

        return;

    }


    feedbackTimer =
        setInterval(
            function () {

                currentFeedbackIndex++;


                if (
                    currentFeedbackIndex >=
                    homepageFeedbacks.length
                ) {

                    currentFeedbackIndex = 0;

                }


                showHomepageFeedback(
                    currentFeedbackIndex
                );

            },

            5000
        );

}


// =========================================
// SECURITY
// =========================================

function escapeFeedbackHTML(text) {

    return String(text)
        .replace(
            /&/g,
            "&amp;"
        )
        .replace(
            /</g,
            "&lt;"
        )
        .replace(
            />/g,
            "&gt;"
        )
        .replace(
            /"/g,
            "&quot;"
        )
        .replace(
            /'/g,
            "&#039;"
        );

}


// =========================================
// START WHEN PAGE LOADS
// =========================================

document.addEventListener(
    "DOMContentLoaded",
    function () {

        loadHomepageFeedback();

    }
);