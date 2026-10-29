let selectedRating = 0;


/* =====================================
   PAGE LOAD
===================================== */

document.addEventListener(
    "DOMContentLoaded",
    function () {

        loadUserDetails();

        setupRating();

        setupCharacterCounter();

        setupSubmit();

    }
);


/* =====================================
   LOAD USER DETAILS
===================================== */

function loadUserDetails() {

    const user =
        JSON.parse(
            localStorage.getItem(
                "tripwheelsUser"
            )
        );


    const nameInput =
        document.getElementById(
            "feedbackName"
        );


    if (
        user &&
        user.name &&
        nameInput
    ) {

        nameInput.value =
            user.name;

    }

}


/* =====================================
   STAR RATING
===================================== */

function setupRating() {

    const stars =
        document.querySelectorAll(
            "#rating span"
        );


    stars.forEach(
        function (star) {

            star.addEventListener(
                "click",
                function () {

                    selectedRating =
                        Number(
                            star.dataset.rating
                        );


                    updateStars();

                }
            );

        }
    );

}


/* =====================================
   UPDATE STARS
===================================== */

function updateStars() {

    const stars =
        document.querySelectorAll(
            "#rating span"
        );


    const ratingText =
        document.getElementById(
            "ratingText"
        );


    stars.forEach(
        function (star) {

            const value =
                Number(
                    star.dataset.rating
                );


            if (
                value <= selectedRating
            ) {

                star.classList.add(
                    "active"
                );

            } else {

                star.classList.remove(
                    "active"
                );

            }

        }
    );


    const messages = {

        1: "Very Poor",

        2: "Needs Improvement",

        3: "Good",

        4: "Very Good",

        5: "Excellent"

    };


    if (ratingText) {

        ratingText.innerText =
            messages[selectedRating];

    }

}


/* =====================================
   CHARACTER COUNTER
===================================== */

function setupCharacterCounter() {

    const textarea =
        document.getElementById(
            "feedbackMessage"
        );


    const counter =
        document.getElementById(
            "characterCount"
        );


    if (!textarea) {
        return;
    }


    textarea.addEventListener(
        "input",
        function () {

            counter.innerText =
                textarea.value.length;

        }
    );

}


/* =====================================
   SUBMIT FEEDBACK
===================================== */

function setupSubmit() {

    const button =
        document.getElementById(
            "submitFeedback"
        );


    button.addEventListener(
        "click",
        async function () {

            const name =
                document.getElementById(
                    "feedbackName"
                ).value.trim();


            const message =
                document.getElementById(
                    "feedbackMessage"
                ).value.trim();


            const status =
                document.getElementById(
                    "feedbackMessageStatus"
                );


            /* =========================
               VALIDATION
            ========================= */

            if (!name) {

                status.innerText =
                    "Please enter your name.";

                status.style.color =
                    "#d81159";

                return;
            }


            if (selectedRating === 0) {

                status.innerText =
                    "Please select a rating.";

                status.style.color =
                    "#d81159";

                return;
            }


            if (!message) {

                status.innerText =
                    "Please share your experience.";

                status.style.color =
                    "#d81159";

                return;
            }


            /* =========================
               USER
            ========================= */

            const user =
                JSON.parse(
                    localStorage.getItem(
                        "tripwheelsUser"
                    )
                );


            const feedbackData = {

                userId:
                    user?.id || null,

                name:
                    name,

                rating:
                    selectedRating,

                message:
                    message

            };


            try {

                button.disabled = true;

                button.innerText =
                    "Submitting...";


                const response =
                    await fetch(
                        "http://localhost:5000/api/feedback/create",
                        {
                            method: "POST",

                            headers: {
                                "Content-Type":
                                    "application/json"
                            },

                            body:
                                JSON.stringify(
                                    feedbackData
                                )
                        }
                    );


                const data =
                    await response.json();


                if (!response.ok) {

                    throw new Error(
                        data.message ||
                        "Feedback submission failed"
                    );

                }


                status.innerText =
                    "Thank you! Your feedback has been submitted successfully. ❤️";


                status.style.color =
                    "#218380";


                document.getElementById(
                    "feedbackMessage"
                ).value = "";


                selectedRating = 0;

                updateStars();


                document.getElementById(
                    "characterCount"
                ).innerText = "0";


                button.innerText =
                    "Feedback Submitted ✓";


            } catch (error) {

                console.error(
                    "FEEDBACK ERROR:",
                    error
                );


                status.innerText =
                    "Unable to submit feedback. Please make sure the backend is running.";


                status.style.color =
                    "#d81159";


                button.disabled = false;

                button.innerText =
                    "Submit Feedback";

            }

        }
    );

}