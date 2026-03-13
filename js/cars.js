const Popup = document.getElementById("reviewPopup");
const reviewTitle = document.getElementById("reviewTitle");
const reviewbody = document.getElementById("reviewbody");
const reviewclose = document.querySelector(".reviewclose");
const reviewLinks = document.querySelectorAll(".disable-linkcars");
const reservePopup = document.getElementById("reservePopup");
const reserveClose = document.querySelector(".reserveclose");

document.querySelectorAll(".disable-linkcars").forEach(link => {
    link.addEventListener("click", function(e) {
        e.preventDefault();

        const carName = this.dataset.carname;
        const reviews = JSON.parse(this.dataset.reviews);

        showRealReviews(carName, reviews);
    });
});

//The like functionality
async function toggleLike(carId) {
    const response = await fetch('/like-vehicle', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ carId })
    });
    const data = await response.json();
    if (response.ok) {
        document.getElementById(`likes-${carId}`).innerText = `👍 ${data.likeCount}`;
    }
}

//reviews
function showRealReviews(carName, reviews) {
    const reviewTitle = document.getElementById("reviewTitle");
    const reviewbody = document.getElementById("reviewbody");
    const Popup = document.getElementById("reviewPopup");

    reviewTitle.innerText = `${carName} Reviews`;
    reviewbody.innerHTML = "";

    if (!reviews || reviews.length === 0) {
        reviewbody.innerHTML = "<p>No reviews yet for this vehicle.</p>";
    } else {
        reviews.forEach(rev => {
            const div = document.createElement("div");

            div.innerHTML = `
                <strong>${rev.title || "Review"}</strong><br>
                <small>By: ${rev.user?.name || "Anonymous"}</small>
                <p>“${rev.description}”</p>
                <hr>
            `;

            reviewbody.appendChild(div);
        });
    }

    Popup.style.display = "block";
}


//popups
function openReserveModal(carId, carName) {
    document.getElementById("reserveCarId").value = carId;
    document.getElementById("displayCarName").innerText = carName;
    reservePopup.style.display = "block";
}

if (reserveClose) {
    reserveClose.onclick = () => reservePopup.style.display = "none";
}


//time helper
reviewclose.onclick = () => Popup.style.display = "none";
window.onclick = (event) => { if (event.target == Popup) Popup.style.display = "none"; }

function formatTime12h(timeStr) {
    let [hours, minutes] = timeStr.split(':');
    let ampm = hours >= 12 ? 'PM' : 'AM';
    hours = hours % 12 || 12;
    return `${hours}:${minutes} ${ampm}`;
}

//reserve popup form
const reserveForm = document.getElementById("reserveForm");

reserveForm.addEventListener("submit", async (e) => {
    e.preventDefault();

    const startRaw = document.getElementById("startTime").value;
    const endRaw = document.getElementById("endTime").value;

    const formattedTimeRange = `${formatTime12h(startRaw)} - ${formatTime12h(endRaw)}`;

    const reservationData = {
        carId: document.getElementById("reserveCarId").value,
        date: document.getElementById("reserveDate").value,
        time: formattedTimeRange 
    };

    try {
        const response = await fetch('/reservation', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(reservationData)
        });

        if (response.ok) {
            alert("Reservation submitted successfully!");
            window.location.href = "/reservations"; 
        } else {
            const err = await response.json();
            alert("Error: " + err.error);
        }
    } catch (error) {
        console.error("Submission error:", error);
        alert("Could not connect to the server.");
    }
});


