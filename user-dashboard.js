/* ==========================================
   TRIPWHEELS - USER DASHBOARD
========================================== */

document.addEventListener("DOMContentLoaded", function () {

    loadUserName();
    loadVehicles();
    setupSearch();
    setupBookingForm();

});


/* ==========================================
   LOAD USER NAME
========================================== */

function loadUserName() {

    const user = JSON.parse(
        localStorage.getItem("tripwheelsUser")
    );

    const nameElement =
        document.getElementById("userName");

    if (user && user.name && nameElement) {

        nameElement.innerText = user.name;

    }

}


/* ==========================================
   GET VEHICLES FROM MONGODB
========================================== */

async function getVehicles() {

    try {

        const response = await fetch(
            "http://localhost:5000/api/vehicles"
        );

        if (!response.ok) {

            throw new Error(
                "Failed to load vehicles"
            );

        }

        const vehicles =
            await response.json();

        return vehicles;

    } catch (error) {

        console.error(
            "GET VEHICLES ERROR:",
            error
        );

        alert(
            "Unable to load vehicles. Please make sure backend is running."
        );

        return [];

    }

}


/* ==========================================
   LOAD VEHICLES
========================================== */

async function loadVehicles() {

    const container =
        document.getElementById("vehicleList");

    if (container) {

        container.innerHTML = `
            <div class="loading">
                Loading available vehicles...
            </div>
        `;

    }

    const vehicles =
        await getVehicles();

    displayVehicles(vehicles);

}


/* ==========================================
   DISPLAY VEHICLES
========================================== */

function displayVehicles(vehicles) {

    const container =
        document.getElementById("vehicleList");

    const count =
        document.getElementById("vehicleCount");

    if (!container) {

        return;

    }

    container.innerHTML = "";


    if (!vehicles || vehicles.length === 0) {

        if (count) {

            count.innerText =
                "No vehicles are available right now.";

        }

        container.innerHTML = `
            <div class="empty-state">

                <div class="empty-icon">
                    🚗
                </div>

                <h3>
                    No vehicles available
                </h3>

                <p>
                    Owners have not added any vehicles yet.
                </p>

            </div>
        `;

        return;

    }


    if (count) {

        count.innerText =
            vehicles.length +
            " vehicle(s) available";

    }


    vehicles.forEach(function (vehicle) {

        const image = vehicle.image

            ? `
                <img
                    src="${vehicle.image}"
                    alt="${vehicle.brand || ""} ${vehicle.model || ""}"
                >
            `

            : `
                <div class="default-vehicle-icon">
                    ${getVehicleIcon(vehicle.type)}
                </div>
            `;


        const isAvailable =
            vehicle.available === true ||
            vehicle.available === "true" ||
            vehicle.available === "Available";


        const availabilityText =
            isAvailable
                ? "Available"
                : "Unavailable";


        const availabilityClass =
            isAvailable
                ? "available"
                : "unavailable";


        container.innerHTML += `

            <div class="vehicle-card">

                <div class="vehicle-image">

                    ${image}

                </div>


                <div class="vehicle-details">

                    <span class="vehicle-type">

                        ${vehicle.type || "Vehicle"}

                    </span>


                    <h3>

                        ${vehicle.brand || ""}

                        ${vehicle.model || ""}

                    </h3>


                    <p class="vehicle-location">

                        📍 ${vehicle.location || "Location not specified"}

                    </p>


                    <p class="vehicle-info">

                        Registration:

                        ${vehicle.registration || "N/A"}

                    </p>


                    <p class="vehicle-info">

                        Year:

                        ${vehicle.year || "N/A"}

                    </p>


                    <p class="vehicle-info">

                        Fuel:

                        ${vehicle.fuel || "N/A"}

                    </p>


                    <div class="vehicle-bottom">

                        <div class="price">

                            ₹${vehicle.price || 0}

                            <span>
                                / day
                            </span>

                        </div>


                        <span class="${availabilityClass}">

                            ● ${availabilityText}

                        </span>

                    </div>


                    <button
                        class="book-btn"
                        ${!isAvailable ? "disabled" : ""}
                        onclick="openBookingModal('${vehicle._id}')"
                    >

                        ${
                            isAvailable
                                ? "Book Now"
                                : "Currently Unavailable"
                        }

                    </button>

                </div>

            </div>

        `;

    });

}


/* ==========================================
   VEHICLE ICON
========================================== */

function getVehicleIcon(type) {

    const vehicleType =
        String(type || "").toLowerCase();


    if (vehicleType === "car") {

        return "🚗";

    }


    if (vehicleType === "van") {

        return "🚐";

    }


    if (
        vehicleType === "scooty" ||
        vehicleType === "scooter"
    ) {

        return "🛵";

    }


    return "🏍️";

}


/* ==========================================
   SEARCH & FILTER
========================================== */

function setupSearch() {

    const searchInput =
        document.getElementById("searchInput");

    const typeFilter =
        document.getElementById("typeFilter");

    const locationFilter =
        document.getElementById("locationFilter");


    if (searchInput) {

        searchInput.addEventListener(
            "input",
            filterVehicles
        );

    }


    if (typeFilter) {

        typeFilter.addEventListener(
            "change",
            filterVehicles
        );

    }


    if (locationFilter) {

        locationFilter.addEventListener(
            "input",
            filterVehicles
        );

    }

}


/* ==========================================
   FILTER VEHICLES
========================================== */

async function filterVehicles() {

    const searchInput =
        document.getElementById("searchInput");

    const typeFilter =
        document.getElementById("typeFilter");

    const locationFilter =
        document.getElementById("locationFilter");


    const search =
        searchInput
            ? searchInput.value.toLowerCase().trim()
            : "";


    const type =
        typeFilter
            ? typeFilter.value
            : "all";


    const location =
        locationFilter
            ? locationFilter.value.toLowerCase().trim()
            : "";


    const vehicles =
        await getVehicles();


    const filtered =
        vehicles.filter(function (vehicle) {

            const vehicleText =
                (
                    (vehicle.brand || "") +
                    " " +
                    (vehicle.model || "") +
                    " " +
                    (vehicle.type || "")
                ).toLowerCase();


            const vehicleLocation =
                String(
                    vehicle.location || ""
                ).toLowerCase();


            const matchesSearch =
                vehicleText.includes(search);


            const matchesType =
                type === "all" ||
                String(
                    vehicle.type || ""
                ).toLowerCase() ===
                type.toLowerCase();


            const matchesLocation =
                location === "" ||
                vehicleLocation.includes(location);


            return (
                matchesSearch &&
                matchesType &&
                matchesLocation
            );

        });


    displayVehicles(filtered);

}


/* ==========================================
   CLEAR FILTERS
========================================== */

function clearFilters() {

    const searchInput =
        document.getElementById("searchInput");

    const typeFilter =
        document.getElementById("typeFilter");

    const locationFilter =
        document.getElementById("locationFilter");


    if (searchInput) {

        searchInput.value = "";

    }


    if (typeFilter) {

        typeFilter.value = "all";

    }


    if (locationFilter) {

        locationFilter.value = "";

    }


    loadVehicles();

}


/* ==========================================
   BOOKING
========================================== */

let selectedVehicle = null;


/* ==========================================
   OPEN BOOKING MODAL
========================================== */

async function openBookingModal(vehicleId) {

    const vehicles =
        await getVehicles();


    selectedVehicle =
        vehicles.find(function (vehicle) {

            return String(vehicle._id) ===
                String(vehicleId);

        });


    if (!selectedVehicle) {

        alert(
            "Vehicle could not be found."
        );

        return;

    }


    const modal =
        document.getElementById("bookingModal");


    if (!modal) {

        alert(
            "Booking modal not found."
        );

        return;

    }


    /* VEHICLE NAME */

    const vehicleName =
        document.getElementById(
            "bookingVehicleName"
        );


    if (vehicleName) {

        vehicleName.innerText =
            `${selectedVehicle.brand || ""} ${selectedVehicle.model || ""}`;

    }


    /* VEHICLE TYPE */

    const vehicleType =
        document.getElementById(
            "bookingVehicleType"
        );


    if (vehicleType) {

        vehicleType.innerText =
            selectedVehicle.type ||
            "Vehicle";

    }


    /* VEHICLE PRICE */

    const vehiclePrice =
        document.getElementById(
            "bookingVehiclePrice"
        );


    if (vehiclePrice) {

        vehiclePrice.innerText =
            `₹${selectedVehicle.price || 0} / day`;

    }


    /* REGISTRATION */

    const vehicleRegistration =
        document.getElementById(
            "bookingVehicleRegistration"
        );


    if (vehicleRegistration) {

        vehicleRegistration.innerText =
            selectedVehicle.registration ||
            "N/A";

    }


    /* RENTAL DAYS */

    const rentalDays =
        document.getElementById(
            "rentalDays"
        );


    if (rentalDays) {

        rentalDays.value = 1;

    }


    updateTotal();


    /* SHOW MODAL */

    modal.style.display = "flex";

}


/* ==========================================
   UPDATE TOTAL
========================================== */

function updateTotal() {

    if (!selectedVehicle) {

        return;

    }


    const rentalDays =
        document.getElementById(
            "rentalDays"
        );


    const totalAmount =
        document.getElementById(
            "totalAmount"
        );


    if (!rentalDays || !totalAmount) {

        return;

    }


    let days =
        Number(rentalDays.value);


    if (days < 1) {

        days = 1;

        rentalDays.value = 1;

    }


    const total =
        Number(selectedVehicle.price || 0) *
        days;


    totalAmount.innerText =
        `₹${total}`;

}


/* ==========================================
   CLOSE BOOKING MODAL
========================================== */

function closeBookingModal() {

    const modal =
        document.getElementById(
            "bookingModal"
        );


    if (modal) {

        modal.style.display = "none";

    }


    selectedVehicle = null;

}


/* ==========================================
   BOOKING FORM
========================================== */

function setupBookingForm() {

    const bookingForm =
        document.getElementById(
            "bookingForm"
        );


    if (!bookingForm) {

        return;

    }


    bookingForm.addEventListener(
        "submit",
        async function (event) {

            event.preventDefault();


            if (!selectedVehicle) {

                alert(
                    "Please select a vehicle first."
                );

                return;

            }


            const user =
                JSON.parse(
                    localStorage.getItem(
                        "tripwheelsUser"
                    )
                );


            if (!user || !user.id) {

                alert(
                    "Please login first."
                );

                return;

            }


            const rentalDays =
                Number(
                    document.getElementById(
                        "rentalDays"
                    ).value
                );


            const total =
                Number(
                    selectedVehicle.price || 0
                ) *
                rentalDays;


            try {

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
                                JSON.stringify({

                                    userId:
                                        user.id,

                                    ownerId:
                                        selectedVehicle.ownerId,

                                    vehicleId:
                                        selectedVehicle._id,

                                    vehicle:
                                        `${selectedVehicle.brand || ""} ${selectedVehicle.model || ""}`.trim(),

                                    vehicleType:
                                        selectedVehicle.type ||
                                        "Vehicle",

                                    location:
                                        selectedVehicle.location ||
                                        "Amravati",

                                    date:
                                        new Date()
                                            .toISOString()
                                            .split("T")[0],

                                    days:
                                        rentalDays,

                                    amount:
                                        total

                                })

                        }
                    );


                const data =
                    await response.json();


                if (!response.ok) {

                    alert(
                        data.message ||
                        "Booking failed."
                    );

                    return;

                }


                alert(
                    "✅ Booking created successfully!"
                );


                closeBookingModal();


                loadVehicles();


            } catch (error) {

                console.error(
                    "BOOKING ERROR:",
                    error
                );


                alert(
                    "Unable to connect to backend."
                );

            }

        }
    );

}


/* ==========================================
   CLOSE MODAL WHEN CLICKING OUTSIDE
========================================== */

window.addEventListener(
    "click",
    function (event) {

        const modal =
            document.getElementById(
                "bookingModal"
            );


        if (
            modal &&
            event.target === modal
        ) {

            closeBookingModal();

        }

    }
);


/* ==========================================
   LIVE LOCATION
========================================== */

let locationWatchId = null;

let currentLocationBookingId = null;


/* ==========================================
   START LIVE LOCATION
========================================== */

async function startLiveLocation() {

    if (!navigator.geolocation) {

        alert(
            "Your browser does not support location."
        );

        return;

    }


    const user =
        JSON.parse(
            localStorage.getItem(
                "tripwheelsUser"
            )
        );


    if (!user || !user.id) {

        alert(
            "Please login first."
        );

        return;

    }


    const status =
        document.getElementById(
            "locationStatus"
        );


    const startButton =
        document.getElementById(
            "startLocationBtn"
        );


    const stopButton =
        document.getElementById(
            "stopLocationBtn"
        );


    if (status) {

        status.innerText =
            "Checking your booking...";

    }


    try {

        const response =
            await fetch(
                `http://localhost:5000/api/bookings/user/${user.id}`
            );


        if (!response.ok) {

            throw new Error(
                "Unable to get bookings"
            );

        }


        const bookings =
            await response.json();


        if (
            !bookings ||
            bookings.length === 0
        ) {

            alert(
                "Please make a booking first."
            );


            if (status) {

                status.innerText =
                    "No booking found.";

            }


            return;

        }


        const booking =
            bookings[0];


        if (!booking._id) {

            alert(
                "Booking not found."
            );

            return;

        }


        currentLocationBookingId =
            booking._id;


        if (status) {

            status.innerText =
                "Requesting your location permission...";

        }


        locationWatchId =
            navigator.geolocation.watchPosition(

                async function (position) {

                    const latitude =
                        position.coords.latitude;


                    const longitude =
                        position.coords.longitude;


                    console.log(
                        "USER LOCATION:",
                        latitude,
                        longitude
                    );


                    try {

                        const locationResponse =
                            await fetch(
                                `http://localhost:5000/api/bookings/${currentLocationBookingId}/location`,
                                {

                                    method: "PUT",

                                    headers: {

                                        "Content-Type":
                                            "application/json"

                                    },

                                    body:
                                        JSON.stringify({

                                            latitude:
                                                latitude,

                                            longitude:
                                                longitude

                                        })

                                }
                            );


                        const data =
                            await locationResponse.json();


                        if (!locationResponse.ok) {

                            console.error(
                                "Location update failed:",
                                data
                            );

                            return;

                        }


                        if (status) {

                            status.innerText =
                                "✅ Live location is being shared with the vehicle owner.";

                        }


                        if (startButton) {

                            startButton.style.display =
                                "none";

                        }


                        if (stopButton) {

                            stopButton.style.display =
                                "inline-block";

                        }


                        console.log(
                            "✅ Location sent:",
                            latitude,
                            longitude
                        );


                    } catch (error) {

                        console.error(
                            "LOCATION UPDATE ERROR:",
                            error
                        );

                    }

                },


                function (error) {

                    console.error(
                        "LOCATION ERROR:",
                        error
                    );


                    if (startButton) {

                        startButton.style.display =
                            "inline-block";

                    }


                    if (stopButton) {

                        stopButton.style.display =
                            "none";

                    }


                    switch (error.code) {

                        case error.PERMISSION_DENIED:

                            if (status) {

                                status.innerText =
                                    "Location permission was denied.";

                            }


                            alert(
                                "Please allow location permission to share your live location."
                            );

                            break;


                        case error.POSITION_UNAVAILABLE:

                            if (status) {

                                status.innerText =
                                    "Your location is currently unavailable.";

                            }

                            break;


                        case error.TIMEOUT:

                            if (status) {

                                status.innerText =
                                    "Location request timed out. Please try again.";

                            }

                            break;


                        default:

                            if (status) {

                                status.innerText =
                                    "Unable to get your location.";

                            }

                    }

                },


                {

                    enableHighAccuracy: true,

                    maximumAge: 5000,

                    timeout: 10000

                }

            );


    } catch (error) {

        console.error(
            "LIVE LOCATION ERROR:",
            error
        );


        if (status) {

            status.innerText =
                "Unable to connect to the backend.";

        }


        alert(
            "Unable to connect to the backend."
        );

    }

}


/* ==========================================
   STOP LIVE LOCATION
========================================== */

function stopLiveLocation() {

    if (locationWatchId !== null) {

        navigator.geolocation.clearWatch(
            locationWatchId
        );

        locationWatchId = null;

    }


    currentLocationBookingId = null;


    const status =
        document.getElementById(
            "locationStatus"
        );


    const startButton =
        document.getElementById(
            "startLocationBtn"
        );


    const stopButton =
        document.getElementById(
            "stopLocationBtn"
        );


    if (status) {

        status.innerText =
            "Location sharing stopped.";

    }


    if (startButton) {

        startButton.style.display =
            "inline-block";

    }


    if (stopButton) {

        stopButton.style.display =
            "none";

    }


    console.log(
        "Live location sharing stopped."
    );

}


/* ==========================================
   LOGOUT
========================================== */

function logout() {

    localStorage.removeItem(
        "tripwheelsRole"
    );


    localStorage.removeItem(
        "tripwheelsPhone"
    );


    localStorage.removeItem(
        "tripwheelsUserName"
    );


    localStorage.removeItem(
        "tripwheelsUser"
    );


    localStorage.removeItem(
        "selectedVehicle"
    );


    sessionStorage.removeItem(
        "tripwheelsPhone"
    );


    sessionStorage.removeItem(
        "tripwheelsRole"
    );


    sessionStorage.removeItem(
        "tripwheelsUserName"
    );


    window.location.href =
        "login.html";

}