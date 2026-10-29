// ==========================================
// GO TO ADD VEHICLE PAGE
// ==========================================

function goToAddVehicle() {
    window.location.href = "add-vehicle.html";
}


// ==========================================
// LOAD VEHICLES WHEN PAGE OPENS
// ==========================================

document.addEventListener("DOMContentLoaded", function () {
    loadVehicles();
});


// ==========================================
// LOAD VEHICLES FROM MONGODB
// ==========================================

async function loadVehicles() {

    const container = document.getElementById("vehiclesContainer");

    // Get logged-in owner
    const savedUser = localStorage.getItem("tripwheelsUser");

    if (!savedUser) {
        alert("Please login first.");
        window.location.href = "login.html";
        return;
    }

    const currentUser = JSON.parse(savedUser);
    const ownerId = currentUser.id;

    try {

        // Get vehicles from backend
        const response = await fetch(
            `http://localhost:5000/api/vehicles/owner/${ownerId}`
        );

        if (!response.ok) {
            throw new Error("Failed to load vehicles");
        }

        const vehicles = await response.json();

        console.log("My Vehicles from MongoDB:", vehicles);


        // ==========================================
        // IF NO VEHICLES
        // ==========================================

        if (vehicles.length === 0) {

            container.innerHTML = `
                <div class="empty-state">

                    <div class="empty-icon">
                        🚗
                    </div>

                    <h2>No vehicles added yet</h2>

                    <p>
                        Add your first bike or car to start
                        accepting bookings.
                    </p>

                    <button
                        class="add-btn"
                        onclick="goToAddVehicle()">
                        + Add Vehicle
                    </button>

                </div>
            `;

            return;
        }


        // ==========================================
        // CLEAR CONTAINER
        // ==========================================

        container.innerHTML = "";


        // ==========================================
        // DISPLAY VEHICLES
        // ==========================================

        vehicles.forEach(function (vehicle) {

            // Choose icon
            const icon =
                String(vehicle.type).toLowerCase() === "car"
                    ? "🚗"
                    : "🏍️";


            // Vehicle image
            const vehicleImage = vehicle.image
                ? `
                    <img
                        src="${vehicle.image}"
                        alt="${vehicle.brand} ${vehicle.model}">
                  `
                : `
                    <div class="default-vehicle-icon">
                        ${icon}
                    </div>
                  `;


            // Availability text
            const availabilityText =
                vehicle.available
                    ? "🟢 Available"
                    : "🔴 Not Available";


            // Create vehicle card
            container.innerHTML += `

                <div class="vehicle-card">

                    <!-- VEHICLE IMAGE -->

                    <div class="vehicle-image">
                        ${vehicleImage}
                    </div>


                    <!-- VEHICLE INFORMATION -->

                    <div class="vehicle-info">

                        <span class="vehicle-type">
                            ${vehicle.type}
                        </span>


                        <h2>
                            ${vehicle.brand}
                            ${vehicle.model}
                        </h2>


                        <p>
                            📍 ${vehicle.location}
                        </p>


                        <p>
                            Registration:
                            ${vehicle.registration}
                        </p>


                        <p>
                            Year:
                            ${vehicle.year}
                        </p>


                        <p>
                            Fuel:
                            ${vehicle.fuel}
                        </p>


                        <!-- PRICE -->

                        <div class="price">
                            ₹${vehicle.price}
                            <span>/ day</span>
                        </div>


                        <!-- AVAILABILITY -->

                        <span class="available">
                            ${availabilityText}
                        </span>


                        <!-- BUTTONS -->

                        <div class="actions">

                            <button
                                onclick="editVehicle('${vehicle._id}')">
                                Edit
                            </button>

                            <button
                                onclick="deleteVehicle('${vehicle._id}')">
                                Delete
                            </button>

                        </div>

                    </div>

                </div>

            `;
        });


    } catch (error) {

        console.error("My Vehicles Error:", error);

        container.innerHTML = `
            <div class="empty-state">

                <div class="empty-icon">
                    ⚠️
                </div>

                <h2>Unable to load vehicles</h2>

                <p>
                    Please make sure the TripWheels
                    backend is running.
                </p>

            </div>
        `;
    }
}


// ==========================================
// EDIT VEHICLE
// ==========================================

function editVehicle(id) {

    window.location.href =
        "edit-vehicle.html?id=" + id;
}


// ==========================================
// DELETE VEHICLE
// ==========================================

async function deleteVehicle(id) {

    const confirmDelete = confirm(
        "Are you sure you want to delete this vehicle?"
    );

    if (!confirmDelete) {
        return;
    }


    try {

        const response = await fetch(
            `http://localhost:5000/api/vehicles/${id}`,
            {
                method: "DELETE"
            }
        );


        const data = await response.json();


        if (!response.ok) {

            alert("❌ " + data.message);

            return;
        }


        alert("✅ Vehicle deleted successfully!");


        // Reload vehicles
        loadVehicles();


    } catch (error) {

        console.error("Delete Vehicle Error:", error);

        alert(
            "❌ Cannot connect to TripWheels server."
        );
    }
}