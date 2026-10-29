document.addEventListener("DOMContentLoaded", function () {

    const vehicleForm = document.getElementById("vehicleForm");
    const vehicleImage = document.getElementById("vehicleImage");
    const fileName = document.getElementById("fileName");

    // =========================
    // GET LOGGED-IN OWNER
    // =========================

    const savedUser = localStorage.getItem("tripwheelsUser");

    if (!savedUser) {
        alert("Please login first.");
        window.location.href = "login.html";
        return;
    }

    const currentUser = JSON.parse(savedUser);

    if (currentUser.role !== "owner") {
        alert("Only owners can add vehicles.");
        window.location.href = "login.html";
        return;
    }

    const ownerId = currentUser.id;

    // =========================
    // IMAGE SELECTION
    // =========================

    vehicleImage.addEventListener("change", function () {

        if (vehicleImage.files.length === 0) {
            fileName.innerText = "";
            return;
        }

        const file = vehicleImage.files[0];
        const maxSize = 5 * 1024 * 1024;

        if (file.size > maxSize) {
            alert("Image size must be less than 5 MB.");
            vehicleImage.value = "";
            fileName.innerText = "";
            return;
        }

        fileName.innerText = "Selected: " + file.name;
    });

    // =========================
    // FORM SUBMIT
    // =========================

    vehicleForm.addEventListener("submit", async function (event) {

        event.preventDefault();

        const vehicleType =
            document.getElementById("vehicleType").value;

        const brand =
            document.getElementById("brand").value.trim();

        const model =
            document.getElementById("model").value.trim();

        const registration =
            document.getElementById("registration").value
                .trim()
                .toUpperCase();

        const vehicleYear =
            document.getElementById("vehicleYear").value;

        const price =
            document.getElementById("price").value;

        const location =
            document.getElementById("location").value.trim();

        const fuelType =
            document.getElementById("fuelType").value;

        const availability =
            document.getElementById("availability").checked;

        // =========================
        // VALIDATION
        // =========================

        if (
            vehicleType === "" ||
            brand === "" ||
            model === "" ||
            registration === "" ||
            vehicleYear === "" ||
            price === "" ||
            location === "" ||
            fuelType === ""
        ) {
            alert("Please complete all required fields.");
            return;
        }

        if (Number(price) <= 0) {
            alert("Rental price must be greater than 0.");
            return;
        }

        if (
            Number(vehicleYear) < 1990 ||
            Number(vehicleYear) > 2030
        ) {
            alert("Please enter a valid vehicle year.");
            return;
        }

        // =========================
        // IMAGE
        // =========================

        let imageData = "";

        if (vehicleImage.files.length > 0) {

            const file = vehicleImage.files[0];

            imageData = await new Promise((resolve, reject) => {

                const reader = new FileReader();

                reader.onload = function (event) {
                    resolve(event.target.result);
                };

                reader.onerror = function () {
                    reject(new Error("Image reading failed"));
                };

                reader.readAsDataURL(file);
            });
        }

        // =========================
        // SEND TO BACKEND
        // =========================

        try {

            const response = await fetch(
                "http://localhost:5000/api/vehicles/add",
                {
                    method: "POST",

                    headers: {
                        "Content-Type": "application/json"
                    },

                    body: JSON.stringify({

                        ownerId: ownerId,

                        type: vehicleType,

                        brand: brand,

                        model: model,

                        registration: registration,

                        year: Number(vehicleYear),

                        price: Number(price),

                        location: location,

                        fuel: fuelType,

                        available: availability,

                        image: imageData
                    })
                }
            );

            const data = await response.json();

            console.log("Vehicle API Response:", data);

            if (!response.ok) {

                alert("❌ " + data.message);

                return;
            }

            alert("✅ Vehicle added successfully!");

            window.location.href =
                "owner-dashboard.html#vehicles";

        } catch (error) {

            console.error("Vehicle Error:", error);

            alert(
                "❌ Cannot connect to TripWheels server."
            );
        }
    });

    // =========================
    // LOGOUT
    // =========================

    const logoutBtn =
        document.getElementById("logoutBtn");

    if (logoutBtn) {

        logoutBtn.addEventListener(
            "click",
            function () {

                const confirmLogout =
                    confirm(
                        "Are you sure you want to logout?"
                    );

                if (confirmLogout) {

                    localStorage.removeItem(
                        "tripwheelsRole"
                    );

                    localStorage.removeItem(
                        "tripwheelsUser"
                    );

                    window.location.href =
                        "login.html";
                }
            }
        );
    }

});