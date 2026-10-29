// ==========================================
// TRIPWHEELS OWNER EARNINGS
// ==========================================

let bookings = [];


// ==========================================
// PAGE LOAD
// ==========================================

document.addEventListener(
    "DOMContentLoaded",
    function () {

        loadEarnings();

    }
);


// ==========================================
// LOAD EARNINGS
// ==========================================

function loadEarnings() {

    bookings =
        JSON.parse(
            localStorage.getItem(
                "tripwheelsBookings"
            )
        ) || [];


    // Only completed bookings generate earnings

    const completed =
        bookings.filter(
            function (booking) {

                return booking.status === "Completed";

            }
        );


    let total = 0;

    let monthly = 0;


    const currentMonth =
        new Date().getMonth();


    const currentYear =
        new Date().getFullYear();


    completed.forEach(
        function (booking) {

            const amount =
                Number(booking.amount) || 0;


            total += amount;


            // Check booking month

            const bookingDate =
                new Date(
                    booking.createdAt ||
                    booking.date
                );


            if (
                bookingDate.getMonth() ===
                currentMonth
                &&
                bookingDate.getFullYear() ===
                currentYear
            ) {

                monthly += amount;

            }

        }
    );


    document.getElementById(
        "totalEarnings"
    ).innerText =
        "₹" + total;


    document.getElementById(
        "completedBookings"
    ).innerText =
        completed.length;


    document.getElementById(
        "monthlyEarnings"
    ).innerText =
        "₹" + monthly;


    displayTransactions(completed);

}


// ==========================================
// DISPLAY TRANSACTIONS
// ==========================================

function displayTransactions(completed) {

    const container =
        document.getElementById(
            "earningsList"
        );


    if (completed.length === 0) {

        container.innerHTML = `

            <div class="empty-state">

                <div class="empty-icon">
                    💰
                </div>

                <h3>
                    No earnings yet
                </h3>

                <p>
                    Earnings will appear here
                    after a booking is completed.
                </p>

            </div>

        `;

        return;
    }


    container.innerHTML = "";


    completed.forEach(
        function (booking) {

            let icon = "🏍️";


            const type =
                String(
                    booking.vehicleType || ""
                ).toLowerCase();


            if (type === "car") {

                icon = "🚗";

            } else if (type === "scooty") {

                icon = "🛵";

            } else if (type === "van") {

                icon = "🚐";

            }


            container.innerHTML += `

                <div class="transaction">

                    <div class="transaction-left">

                        <div class="vehicle-icon">

                            ${icon}

                        </div>


                        <div class="transaction-info">

                            <h3>
                                ${booking.vehicle || "Vehicle"}
                            </h3>

                            <p>
                                📍
                                ${booking.location || "Location"}
                            </p>

                            <p>
                                📅
                                ${booking.date || "Date not available"}
                            </p>

                            <p>
                                Booking ID:
                                ${booking.id}
                            </p>

                        </div>

                    </div>


                    <div class="amount">

                        + ₹${booking.amount || 0}

                    </div>

                </div>

            `;

        }
    );

}