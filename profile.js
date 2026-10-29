// ================= PROFILE PAGE =================

document.addEventListener("DOMContentLoaded", function () {

    console.log("TripWheels Profile JS Loaded");


    // ================= USER DATA =================

    let user = {};

    try {
        user =
            JSON.parse(
                localStorage.getItem("tripwheelsUser")
            ) || {};
    } catch (error) {
        console.error("User data error:", error);
        user = {};
    }


    // ================= FIND NAME FIELD =================
    // First try ID, then placeholder

    let nameInput =
        document.getElementById("name");

    if (!nameInput) {

        nameInput =
            document.querySelector(
                'input[placeholder="Enter your full name"]'
            );
    }


    // ================= EMAIL =================

    const emailInput =
        document.getElementById("email");


    // ================= PHONE =================

    const phoneInput =
        document.getElementById("phone");


    // ================= LOAD EXISTING DATA =================

    if (nameInput) {

        nameInput.value =
            user.name || "";

    }


    if (emailInput) {

        emailInput.value =
            user.email || "";

    }


    if (phoneInput) {

        phoneInput.value =
            user.mobile ||
            user.phone ||
            "";

    }


    // ================= ID FILE =================

    const idFile =
        document.getElementById("idFile");

    const fileText =
        document.getElementById("fileText");


    if (idFile) {

        idFile.addEventListener(
            "change",
            function () {

                if (
                    !idFile.files ||
                    idFile.files.length === 0
                ) {
                    return;
                }


                const file =
                    idFile.files[0];


                // Maximum 5 MB

                const maxSize =
                    5 * 1024 * 1024;


                if (file.size > maxSize) {

                    alert(
                        "File size must be less than 5 MB."
                    );

                    idFile.value = "";


                    if (fileText) {

                        fileText.textContent =
                            "JPG, PNG or PDF • Max 5 MB";

                    }

                    return;
                }


                if (fileText) {

                    fileText.textContent =
                        file.name;

                }

            }
        );

    }


    // ================= PROFILE FORM =================

    const profileForm =
        document.getElementById("profileForm");


    if (!profileForm) {

        console.error(
            "profileForm not found"
        );

        return;
    }


    // ================= FORM SUBMIT =================

    profileForm.addEventListener(
        "submit",
        function (event) {

            event.preventDefault();


            // ================= FIND NAME AGAIN =================

            let nameField =
                document.getElementById("name");


            if (!nameField) {

                nameField =
                    document.querySelector(
                        'input[placeholder="Enter your full name"]'
                    );

            }


            // ================= OTHER FIELDS =================

            const emailField =
                document.getElementById("email");


            const idTypeField =
                document.getElementById("idType");


            const idNumberField =
                document.getElementById("idNumber");


            const agreementField =
                document.getElementById("agreement");


            const idFileField =
                document.getElementById("idFile");


            // ================= NAME CHECK =================

            if (!nameField) {

                alert(
                    "Please enter your full name."
                );

                return;
            }


            // ================= EMAIL CHECK =================

            if (!emailField) {

                alert(
                    "Email field is missing."
                );

                return;
            }


            // ================= ID TYPE CHECK =================

            if (!idTypeField) {

                alert(
                    "ID proof type field is missing."
                );

                return;
            }


            // ================= ID NUMBER CHECK =================

            if (!idNumberField) {

                alert(
                    "ID number field is missing."
                );

                return;
            }


            // ================= AGREEMENT CHECK =================

            if (!agreementField) {

                alert(
                    "Agreement checkbox is missing."
                );

                return;
            }


            // ================= GET VALUES =================

            const name =
                nameField.value.trim();


            const email =
                emailField.value.trim();


            const idType =
                idTypeField.value;


            const idNumber =
                idNumberField.value.trim();


            const agreement =
                agreementField.checked;


            // ================= VALIDATION =================

            if (name === "") {

                alert(
                    "Please enter your full name."
                );

                nameField.focus();

                return;
            }


            if (email === "") {

                alert(
                    "Please enter your email address."
                );

                emailField.focus();

                return;
            }


            if (idType === "") {

                alert(
                    "Please select your ID proof type."
                );

                idTypeField.focus();

                return;
            }


            if (idNumber === "") {

                alert(
                    "Please enter your ID number."
                );

                idNumberField.focus();

                return;
            }


            if (
                !idFileField ||
                idFileField.files.length === 0
            ) {

                alert(
                    "Please upload your ID proof."
                );

                return;
            }


            if (!agreement) {

                alert(
                    "Please confirm that the information provided is correct."
                );

                agreementField.focus();

                return;
            }


            // ================= SAVE USER =================

            const savedUser =
                JSON.parse(
                    localStorage.getItem(
                        "tripwheelsUser"
                    )
                ) || {};


            savedUser.name =
                name;


            savedUser.email =
                email;


            savedUser.mobile =
                savedUser.mobile ||
                savedUser.phone ||
                (
                    phoneInput
                        ? phoneInput.value
                        : ""
                );


            savedUser.idType =
                idType;


            savedUser.idNumber =
                idNumber;


            // ================= SAVE =================

            localStorage.setItem(
                "tripwheelsUser",
                JSON.stringify(
                    savedUser
                )
            );


            sessionStorage.setItem(
                "tripwheelsProfileCompleted",
                "true"
            );


            // ================= SUCCESS =================

            alert(
                "Profile completed successfully! 🎉"
            );


            // ================= DASHBOARD =================

            window.location.href =
                "user-dashboard.html";

        }
    );

});