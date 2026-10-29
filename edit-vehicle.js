// ==========================================
// GET VEHICLE ID FROM URL
// ==========================================

const urlParams = new URLSearchParams(window.location.search);
const vehicleId = urlParams.get("id");

let vehicle = null;


// ==========================================
// LOAD VEHICLE FROM MONGODB
// ==========================================

document.addEventListener("DOMContentLoaded", async function () {

    if (!vehicleId) {
        alert("Vehicle ID not found.");
        window.location.href = "my-vehicles.html";
        return;
    }

    try {

        const response = await fetch(
            `http://localhost:5000/api/vehicles/${vehicleId}`
        );

        const data = await response.json();

        if (!response.ok) {
            alert("❌ " + data.message);
            window.location.href = "my-vehicles.html";
            return;
        }

        vehicle = data;

        // ==========================================
        // LOAD DATA INTO FORM
        // ==========================================

        document.getElementById("vehicleType").value =
            vehicle.type || "";

        document.getElementById("brand").value =
            vehicle.brand || "";

        document.getElementById("model").value =
            vehicle.model || "";

        document.getElementById("registration").value =
            vehicle.registration || "";

        document.getElementById("vehicleYear").value =
            vehicle.year || "";

        document.getElementById("price").value =
            vehicle.price || "";

        document.getElementById("location").value =
            vehicle.location || "";

        document.getElementById("fuelType").value =
            vehicle.fuel || "";

        // MongoDB stores boolean
        document.getElementById("availability").value =
            vehicle.available ? "Available" : "Unavailable";


        // ==========================================
        // CURRENT IMAGE
        // ==========================================

        const currentImage =
            document.getElementById("currentImage");

        if (vehicle.image) {

            currentImage.innerText =
                "Current image: Image selected";

        } else {

            currentImage.innerText =
                "Current image: No image selected";

        }

    } catch (error) {

        console.error("Load Vehicle Error:", error);

        alert(
            "❌ Cannot connect to TripWheels server."
        );

        window.location.href = "my-vehicles.html";
    }
});


// ==========================================
// IMAGE CHANGE
// ==========================================

document
    .getElementById("vehicleImage")
    .addEventListener("change", function () {

        if (this.files.length === 0) {
            return;
        }

        const file = this.files[0];

        // Maximum 5 MB
        if (file.size > 5 * 1024 * 1024) {

            alert(
                "Image size must be less than 5 MB."
            );

            this.value = "";
            return;
        }

        document.getElementById("currentImage").innerText =
            "New image: " + file.name;
    });


// ==========================================
// SAVE CHANGES
// ==========================================

document
    .getElementById("editVehicleForm")
    .addEventListener("submit", async function (event) {

        event.preventDefault();


        // ======================================
        // GET UPDATED VALUES
        // ======================================

        const updatedType =
            document.getElementById("vehicleType").value;

        const updatedBrand =
            document.getElementById("brand").value.trim();

        const updatedModel =
            document.getElementById("model").value.trim();

        const updatedRegistration =
            document
                .getElementById("registration")
                .value
                .trim()
                .toUpperCase();

        const updatedYear =
            Number(
                document.getElementById("vehicleYear").value
            );

        const updatedPrice =
            Number(
                document.getElementById("price").value
            );

        const updatedLocation =
            document
                .getElementById("location")
                .value
                .trim();

        const updatedFuel =
            document.getElementById("fuelType").value;

        const updatedAvailability =
            document.getElementById("availability").value;


        // ======================================
        // VALIDATION
        // ======================================

        if (
            !updatedType ||
            !updatedBrand ||
            !updatedModel ||
            !updatedRegistration ||
            !updatedYear ||
            !updatedPrice ||
            !updatedLocation ||
            !updatedFuel
        ) {

            alert("Please fill all required fields.");
            return;
        }


        if (updatedPrice <= 0) {

            alert("Price must be greater than 0.");
            return;
        }


        if (
            updatedYear < 1990 ||
            updatedYear > 2030
        ) {

            alert(
                "Please enter a valid manufacturing year."
            );

            return;
        }


        // ======================================
        // IMAGE
        // ======================================

        let imageData = vehicle.image || "";

        const imageInput =
            document.getElementById("vehicleImage");

        if (imageInput.files.length > 0) {

            const file = imageInput.files[0];

            imageData = await new Promise(
                function (resolve, reject) {

                    const reader = new FileReader();

                    reader.onload = function (event) {
                        resolve(event.target.result);
                    };

                    reader.onerror = function () {
                        reject(
                            new Error("Image reading failed")
                        );
                    };

                    reader.readAsDataURL(file);
                }
            );
        }


        // ======================================
        // UPDATE MONGODB
        // ======================================

        try {

            const response = await fetch(
                `http://localhost:5000/api/vehicles/${vehicleId}`,
                {
                    method: "PUT",

                    headers: {
                        "Content-Type": "application/json"
                    },

                    body: JSON.stringify({

                        type: updatedType,

                        brand: updatedBrand,

                        model: updatedModel,

                        registration: updatedRegistration,

                        year: updatedYear,

                        price: updatedPrice,

                        location: updatedLocation,

                        fuel: updatedFuel,

                        available:
                            updatedAvailability === "Available",

                        image: imageData

                    })
                }
            );


            const data = await response.json();


            if (!response.ok) {

                alert("❌ " + data.message);
                return;
            }


            // ======================================
            // SUCCESS
            // ======================================

            alert(
                "✅ Vehicle updated successfully!"
            );


            window.location.href =
                "my-vehicles.html";


        } catch (error) {

            console.error(
                "Update Vehicle Error:",
                error
            );

            alert(
                "❌ Cannot connect to TripWheels server."
            );
        }

    });


// ==========================================
// BACK BUTTON
// ==========================================

function goBack() {

    window.location.href =
        "my-vehicles.html";
}