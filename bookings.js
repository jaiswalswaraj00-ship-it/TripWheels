// ==========================================
// TRIPWHEELS OWNER BOOKINGS - MONGODB
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
    try {
        const user = JSON.parse(
            localStorage.getItem("tripwheelsUser")
        );

        if (!user || !user.id) {
            alert("Owner login required.");
            window.location.href = "login.html";
            return;
        }

        const response = await fetch(
            `http://localhost:5000/api/bookings/owner/${user.id}`
        );

        if (!response.ok) {
            throw new Error("Failed to load bookings");
        }

        bookings = await response.json();

        updateSummary();
        displayBookings(bookings);

    } catch (error) {
        console.error("LOAD BOOKINGS ERROR:", error);
        alert("Unable to load bookings from server.");
    }
}

// ==========================================
// UPDATE SUMMARY
// ==========================================

function updateSummary() {

    const pending =
        bookings.filter(function (booking) {
            return booking.status === "Pending";
        }).length;

    const confirmed =
        bookings.filter(function (booking) {
            return booking.status === "Confirmed";
        }).length;

    const completed =
        bookings.filter(function (booking) {
            return booking.status === "Completed";
        }).length;

    document.getElementById("pendingCount").innerText =
        pending;

    document.getElementById("confirmedCount").innerText =
        confirmed;

    document.getElementById("completedCount").innerText =
        completed;

    document.getElementById("totalCount").innerText =
        bookings.length;
}

// ==========================================
// DISPLAY BOOKINGS
// ==========================================

function displayBookings(list) {

    const container =
        document.getElementById("bookingList");

    if (list.length === 0) {

        container.innerHTML = `
            <div class="empty-state">
                <div class="icon">
                    📅
                </div>

                <h2>
                    No bookings found
                </h2>

                <p>
                    There are no booking requests in this category.
                </p>
            </div>
        `;

        return;
    }

    container.innerHTML = "";

    list.forEach(function (booking) {

        let actionButtons = "";

        // ==================================
        // PENDING
        // ==================================

        if (booking.status === "Pending") {

            actionButtons = `
                <div class="booking-actions">

                    <button
                        class="action-btn confirm-btn"
                        onclick="confirmBooking('${booking._id}')">
                        Confirm
                    </button>

                    <button
                        class="action-btn cancel-btn"
                        onclick="cancelBooking('${booking._id}')">
                        Cancel
                    </button>

                </div>
            `;
        }

        // ==================================
        // CONFIRMED
        // ==================================

        if (booking.status === "Confirmed") {

            actionButtons = `
                <div class="booking-actions">

                    <button
                        class="action-btn confirm-btn"
                        onclick="completeBooking('${booking._id}')">
                        Mark Completed
                    </button>

                </div>
            `;
        }

        // ==================================
        // VEHICLE ICON
        // ==================================

        let icon = "🏍️";

        const type =
            String(
                booking.vehicleType || ""
            ).toLowerCase();

        if (type === "car") {
            icon = "🚗";
        }
        else if (
            type === "scooter" ||
            type === "scooty"
        ) {
            icon = "🛵";
        }
        else if (type === "van") {
            icon = "🚐";
        }

        // ==================================
        // CUSTOMER
        // ==================================

        const customerName =
            booking.customer ||
            booking.customerName ||
            "TripWheels User";

        // ==================================
        // LIVE LOCATION STATUS
        // ==================================

        let locationButton = `
            <button
                class="action-btn"
                onclick="viewLiveLocation('${booking._id}')"
                style="
                    margin-top:10px;
                    background:#218380;
                    color:white;
                    border:none;
                    border-radius:8px;
                    padding:9px 14px;
                    cursor:pointer;
                ">
                📍 View Live Location
            </button>
        `;

        // ==================================
        // CREATE BOOKING CARD
        // ==================================

        container.innerHTML += `

            <div class="booking-card">

                <div class="booking-left">

                    <div class="vehicle-icon">
                        ${icon}
                    </div>

                    <div class="booking-info">

                        <h2>
                            ${booking.vehicle || "Vehicle"}
                        </h2>

                        <p>
                            👤 Customer:
                            ${customerName}
                        </p>

                        <p>
                            📍
                            ${booking.location || "Location not specified"}
                        </p>

                        <p>
                            📅
                            ${booking.date || "N/A"}
                        </p>

                        <p>
                            🗓️
                            ${booking.days || 1}
                            day(s)
                        </p>

                        <p>
                            Booking ID:
                            ${booking._id}
                        </p>

                        <!-- LIVE LOCATION BUTTON -->

                        ${locationButton}

                    </div>

                </div>


                <div class="booking-right">

                    <span
                        class="status ${String(
                            booking.status || "Pending"
                        ).toLowerCase()}">

                        ${booking.status}

                    </span>

                    <div class="amount">
                        ₹${booking.amount || 0}
                    </div>

                    ${actionButtons}

                </div>

            </div>
        `;
    });
}

// ==========================================
// VIEW LIVE LOCATION
// ==========================================

async function viewLiveLocation(bookingId) {

    try {

        const response = await fetch(
            `http://localhost:5000/api/bookings/${bookingId}/location`
        );

        const data = await response.json();

        if (!response.ok) {

            alert(
                data.message ||
                "Unable to get live location."
            );

            return;
        }

        // ==================================
        // LOCATION NOT SHARED
        // ==================================

        if (!data.sharing) {

            alert(
                "📍 Live location is not being shared by the user."
            );

            return;
        }

        // ==================================
        // CHECK COORDINATES
        // ==================================

        if (
            data.latitude === null ||
            data.latitude === undefined ||
            data.longitude === null ||
            data.longitude === undefined
        ) {

            alert(
                "Location is being shared, but coordinates are not available yet."
            );

            return;
        }

        // ==================================
        // LOCATION DETAILS
        // ==================================

        const latitude =
            Number(data.latitude).toFixed(6);

        const longitude =
            Number(data.longitude).toFixed(6);

        // ==================================
        // LAST UPDATED
        // ==================================

        let updatedText = "Recently";

        if (data.updatedAt) {

            const updatedDate =
                new Date(data.updatedAt);

            updatedText =
                updatedDate.toLocaleString();
        }

        // ==================================
        // SHOW LOCATION
        // ==================================

        const openMap =
            confirm(
                `📍 LIVE LOCATION\n\n` +
                `Latitude: ${latitude}\n` +
                `Longitude: ${longitude}\n\n` +
                `Last updated: ${updatedText}\n\n` +
                `Press OK to open the location in Google Maps.`
            );

        if (openMap) {

            const mapsURL =
                `https://www.google.com/maps?q=${latitude},${longitude}`;

            window.open(
                mapsURL,
                "_blank"
            );
        }

    } catch (error) {

        console.error(
            "VIEW LIVE LOCATION ERROR:",
            error
        );

        alert(
            "Unable to connect to the location server."
        );
    }
}

// ==========================================
// FILTER BOOKINGS
// ==========================================

function filterBookings(status, button) {

    document
        .querySelectorAll(".filter-btn")
        .forEach(function (btn) {

            btn.classList.remove("active");

        });

    if (button) {
        button.classList.add("active");
    }

    if (status === "all") {

        displayBookings(bookings);
        return;
    }

    const filtered =
        bookings.filter(function (booking) {

            return booking.status === status;

        });

    displayBookings(filtered);
}

// ==========================================
// UPDATE BOOKING STATUS
// ==========================================

async function updateBookingStatus(id, status) {

    try {

        const response = await fetch(
            `http://localhost:5000/api/bookings/${id}/status`,
            {
                method: "PUT",

                headers: {
                    "Content-Type": "application/json"
                },

                body: JSON.stringify({
                    status: status
                })
            }
        );

        const data =
            await response.json();

        if (!response.ok) {

            alert(
                data.message ||
                "Failed to update booking."
            );

            return;
        }

        // Update local page data

        const booking =
            bookings.find(function (item) {

                return String(item._id) === String(id);

            });

        if (booking) {
            booking.status = status;
        }

        updateSummary();
        displayBookings(bookings);

    } catch (error) {

        console.error(
            "UPDATE BOOKING ERROR:",
            error
        );

        alert(
            "Unable to update booking."
        );
    }
}

// ==========================================
// CONFIRM BOOKING
// ==========================================

async function confirmBooking(id) {

    const result =
        confirm(
            "Confirm this booking?"
        );

    if (!result) {
        return;
    }

    await updateBookingStatus(
        id,
        "Confirmed"
    );

    alert(
        "Booking confirmed successfully!"
    );
}

// ==========================================
// CANCEL BOOKING
// ==========================================

async function cancelBooking(id) {

    const result =
        confirm(
            "Are you sure you want to cancel this booking?"
        );

    if (!result) {
        return;
    }

    await updateBookingStatus(
        id,
        "Cancelled"
    );

    alert(
        "Booking cancelled."
    );
}

// ==========================================
// COMPLETE BOOKING
// ==========================================

async function completeBooking(id) {

    const result =
        confirm(
            "Mark this booking as completed?"
        );

    if (!result) {
        return;
    }

    await updateBookingStatus(
        id,
        "Completed"
    );

    alert(
        "Booking marked as completed."
    );
}

// ==========================================
// DASHBOARD
// ==========================================

function goDashboard() {

    window.location.href =
        "owner-dashboard.html";
}