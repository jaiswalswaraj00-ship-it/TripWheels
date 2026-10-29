// ==========================================
// MY BOOKINGS - MONGODB VERSION
// ==========================================

let bookings = [];


// ==========================================
// PAGE LOAD
// ==========================================

document.addEventListener("DOMContentLoaded", function () {

    loadBookings();

});


// ==========================================
// LOAD BOOKINGS FROM MONGODB
// ==========================================

async function loadBookings() {

    const user =
        JSON.parse(
            localStorage.getItem("tripwheelsUser")
        );


    // Check login

    if (!user || !user.id) {

        alert("Please login first.");

        window.location.href =
            "login.html";

        return;
    }


    try {

        const response =
            await fetch(
                "http://localhost:5000/api/bookings/user/" +
                user.id
            );


        if (!response.ok) {

            throw new Error(
                "Failed to load bookings"
            );

        }


        bookings =
            await response.json();


        console.log(
            "Bookings from MongoDB:",
            bookings
        );


        updateSummary();

        displayBookings(bookings);


    } catch (error) {

        console.error(
            "LOAD BOOKINGS ERROR:",
            error
        );


        document.getElementById(
            "bookingList"
        ).innerHTML = `

            <div class="empty-state">

                <div class="empty-icon">
                    ⚠️
                </div>

                <h2>
                    Unable to load bookings
                </h2>

                <p>
                    Please make sure the TripWheels backend is running.
                </p>

            </div>

        `;

    }

}


// ==========================================
// UPDATE SUMMARY
// ==========================================

function updateSummary() {

    const pending =
        bookings.filter(
            function (booking) {

                return booking.status === "Pending";

            }
        ).length;


    const confirmed =
        bookings.filter(
            function (booking) {

                return booking.status === "Confirmed";

            }
        ).length;


    const completed =
        bookings.filter(
            function (booking) {

                return booking.status === "Completed";

            }
        ).length;


    const cancelled =
        bookings.filter(
            function (booking) {

                return booking.status === "Cancelled";

            }
        ).length;


    document.getElementById(
        "totalCount"
    ).innerText =
        bookings.length;


    document.getElementById(
        "pendingCount"
    ).innerText =
        pending;


    document.getElementById(
        "confirmedCount"
    ).innerText =
        confirmed;


    document.getElementById(
        "completedCount"
    ).innerText =
        completed;

}


// ==========================================
// DISPLAY BOOKINGS
// ==========================================

function displayBookings(list) {

    const container =
        document.getElementById(
            "bookingList"
        );


    if (!container) {
        return;
    }


    // No bookings

    if (
        !list ||
        list.length === 0
    ) {

        container.innerHTML = `

            <div class="empty-state">

                <div class="empty-icon">
                    📅
                </div>

                <h2>
                    No bookings found
                </h2>

                <p>
                    You have not made any bookings yet.
                </p>

                <a
                    href="user-dashboard.html"
                    class="empty-btn"
                >
                    Find a Vehicle
                </a>

            </div>

        `;

        return;
    }


    container.innerHTML = "";


    // ==========================================
    // DISPLAY EACH BOOKING
    // ==========================================

    list.forEach(
        function (booking) {


            // Vehicle icon

            let icon = "🏍️";


            const type =
                String(
                    booking.vehicleType || ""
                ).toLowerCase();


            if (type === "car") {

                icon = "🚗";

            }
            else if (
                type === "scooty" ||
                type === "scooter"
            ) {

                icon = "🛵";

            }
            else if (type === "van") {

                icon = "🚐";

            }


            // ==========================================
            // VEHICLE IMAGE
            // ==========================================

            let vehicleImage = `

                <div class="default-vehicle-icon">
                    ${icon}
                </div>

            `;


            // If backend sends populated vehicle

            if (
                booking.vehicleId &&
                typeof booking.vehicleId === "object" &&
                booking.vehicleId.image
            ) {

                vehicleImage = `

                    <img
                        src="${booking.vehicleId.image}"
                        alt="${booking.vehicle || "Vehicle"}"
                    >

                `;

            }


            // ==========================================
            // STATUS
            // ==========================================

            const status =
                booking.status ||
                "Pending";


            const statusClass =
                status.toLowerCase();


            // ==========================================
            // BOOKING ID
            // ==========================================

            const bookingId =
                booking._id ||
                "N/A";


            // ==========================================
            // CREATE CARD
            // ==========================================

            container.innerHTML += `

                <div class="booking-card">

                    <div class="booking-left">


                        <div class="vehicle-image">

                            ${vehicleImage}

                        </div>


                        <div class="booking-info">


                            <h2>
                                ${booking.vehicle || "Vehicle"}
                            </h2>


                            <p>
                                🚘 Type:
                                ${booking.vehicleType || "Vehicle"}
                            </p>


                            <p>
                                📍
                                ${booking.location || "Location not specified"}
                            </p>


                            <p>
                                📅 Rental Date:
                                ${booking.date || "N/A"}
                            </p>


                            <p>
                                🗓️ Rental Days:
                                ${booking.days || 1} day(s)
                            </p>


                            <p>
                                🆔 Booking ID:
                                ${bookingId}
                            </p>


                        </div>

                    </div>


                    <div class="booking-right">


                        <span
                            class="status ${statusClass}"
                        >
                            ${status}
                        </span>


                        <div class="amount">
                            ₹${booking.amount || 0}
                        </div>


                    </div>

                </div>

            `;

        }
    );

}


// ==========================================
// FILTER BOOKINGS
// ==========================================

function filterBookings(
    status,
    button
) {


    // Remove active

    document
        .querySelectorAll(
            ".filter-btn"
        )
        .forEach(
            function (btn) {

                btn.classList.remove(
                    "active"
                );

            }
        );


    // Add active

    if (button) {

        button.classList.add(
            "active"
        );

    }


    // All

    if (status === "all") {

        displayBookings(
            bookings
        );

        return;
    }


    // Filter

    const filtered =
        bookings.filter(
            function (booking) {

                return (
                    booking.status ===
                    status
                );

            }
        );


    displayBookings(
        filtered
    );

}