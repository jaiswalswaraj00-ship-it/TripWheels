/* =========================
   OWNER ACCESS CHECK
========================= */

document.addEventListener("DOMContentLoaded", function () {
    const role = localStorage.getItem("tripwheelsRole");

    if (role !== "owner") {
        alert("Owner access required.");
        window.location.href = "login.html";
        return;
    }

    loadDashboard();
});


/* =========================
   DASHBOARD DATA FROM MONGODB
========================= */

async function loadDashboard() {
    const savedUser = localStorage.getItem("tripwheelsUser");

    if (!savedUser) {
        alert("Please login first.");
        window.location.href = "login.html";
        return;
    }

    const currentUser = JSON.parse(savedUser);
    const ownerId = currentUser.id;

    try {
        const response = await fetch(
            `http://localhost:5000/api/vehicles/owner/${ownerId}`
        );

        if (!response.ok) {
            throw new Error("Failed to load vehicles");
        }

        const vehicles = await response.json();

        // TOTAL VEHICLES
        document.getElementById("totalVehicles").innerText =
            vehicles.length;

        // ACTIVE VEHICLES
        const activeVehicles = vehicles.filter(
            vehicle => vehicle.available === true
        );

        document.getElementById("activeVehicles").innerText =
            activeVehicles.length;

        // BOOKINGS AND EARNINGS: connect later
        document.getElementById("totalBookings").innerText = "0";
        document.getElementById("totalEarnings").innerText = "₹0";

        // DISPLAY VEHICLES
        const vehicleList = document.getElementById("vehicleList");

        if (vehicles.length === 0) {
            vehicleList.innerHTML = `
                <div class="empty-state">
                    <div class="empty-icon">🚗</div>
                    <h3>No vehicles added yet</h3>
                    <p>
                        Add your first vehicle to start
                        accepting bookings.
                    </p>
                    <button class="primary-btn" onclick="addVehicle()">
                        Add Vehicle
                    </button>
                </div>
            `;
            return;
        }

        vehicleList.innerHTML = vehicles.map(vehicle => {
            return `
                <div class="vehicle-card">

                    <div class="vehicle-image">
                        ${
                            vehicle.image
                                ? `<img src="${vehicle.image}"
                                    alt="Vehicle image">`
                                : `<div class="empty-icon">🚗</div>`
                        }
                    </div>

                    <div class="vehicle-info">
                        <h3>
                            ${vehicle.brand} ${vehicle.model}
                        </h3>

                        <p>
                            ${vehicle.type} • ${vehicle.year}
                        </p>

                        <p>
                            Registration: ${vehicle.registration}
                        </p>

                        <p>
                            📍 ${vehicle.location}
                        </p>

                        <p>
                            ⛽ ${vehicle.fuel}
                        </p>

                        <strong>
                            ₹${vehicle.price}/day
                        </strong>

                        <p>
                            ${
                                vehicle.available
                                    ? "🟢 Available"
                                    : "🔴 Not Available"
                            }
                        </p>
                    </div>

                </div>
            `;
        }).join("");

        console.log("Vehicles from MongoDB:", vehicles);

    } catch (error) {
        console.error("Dashboard Error:", error);

        alert(
            "Cannot load vehicle data. Check that the backend is running."
        );
    }
}


/* =========================
   NAVIGATION
========================= */

function addVehicle() {
    window.location.href = "add-vehicle.html";
}

function openVehicles() {
    window.location.href = "my-vehicles.html";
}

function openBookings() {
    window.location.href = "bookings.html";
}

function openEarnings() {
    window.location.href = "earnings.html";
}


/* =========================
   LOGOUT
========================= */

function logout() {
    localStorage.removeItem("tripwheelsRole");
    localStorage.removeItem("tripwheelsPhone");
    localStorage.removeItem("tripwheelsUser");

    window.location.href = "login.html";
}