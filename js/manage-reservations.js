document.addEventListener("DOMContentLoaded", () => {
    const grid = document.getElementById("reservationGrid");
    const searchInput = document.getElementById("searchInput");
    const filterStatus = document.getElementById("filterStatus");
    const filterPayment = document.getElementById("filterPayment");

    const approveBtn = document.getElementById("approveBtn");
    const completeBtn = document.getElementById("completeBtn");
    const cancelBtn = document.getElementById("cancelBtn");

    const manageModal = document.getElementById("manageconf");
    const manageText = document.getElementById("managresText");
    const manageTarget = document.getElementById("managresTarget");
    const manageConfirm = document.getElementById("managresConfirm");
    const manageCancel = document.getElementById("managresCancel");

    const addBtn = document.getElementById("addBtn");
    const walkinModal = document.getElementById("walkinModal");
    const walkinCancelBtn = document.getElementById("walkinCancelBtn");
    const walkinForm = document.getElementById("walkinForm");

    let selectedRes = null;
    let targetStatus = ""; 

    grid.addEventListener("click", (e) => {
        const card = e.target.closest(".reservation-card");
        if (!card) return;

        document.querySelectorAll(".reservation-card").forEach(c => c.classList.remove("selected"));
        card.classList.add("selected");

        selectedRes = {
            id: card.dataset.id,
            customer: card.dataset.customer,
            vehicle: card.dataset.vehicle,
            status: card.dataset.status
        };

        approveBtn.disabled = true;
        completeBtn.disabled = true;
        cancelBtn.disabled = true;

        if (selectedRes.status === "Pending") {
            approveBtn.disabled = false;
            cancelBtn.disabled = false;
        } else if (selectedRes.status === "Approved") {
            completeBtn.disabled = false;
            cancelBtn.disabled = false;
        } 
    
    });

    function applyFilters() {
        const search = searchInput.value.toLowerCase();
        const statusVal = filterStatus.value;
        const paymentVal = filterPayment.value;

        document.querySelectorAll(".reservation-card").forEach(card => {
            const customer = (card.dataset.customer || "").toLowerCase();
            const vehicle = (card.dataset.vehicle || "").toLowerCase();
            const status = card.dataset.status || "";
            const payment = card.dataset.payment || "";

            const matchesSearch = customer.includes(search) || vehicle.includes(search);
            const matchesStatus = (statusVal === "all") || (status === statusVal);
            const matchesPayment = (paymentVal === "all") || (payment === paymentVal);

            card.style.display = (matchesSearch && matchesStatus && matchesPayment) ? "grid" : "none";
        });
    }

    searchInput.addEventListener("input", applyFilters);
    filterStatus.addEventListener("change", applyFilters);
    filterPayment.addEventListener("change", applyFilters);

    function openModal(actionText, targetDbStatus, btnColor) {
        if (!selectedRes) return;
        targetStatus = targetDbStatus;
        
        manageText.innerText = actionText;
        manageTarget.innerText = `${selectedRes.customer} - ${selectedRes.vehicle}`;
        manageConfirm.style.backgroundColor = btnColor;
        
        manageModal.style.display = "block";
    }

    approveBtn.onclick = () => openModal("approve", "Approved", "#28a745");
    completeBtn.onclick = () => openModal("complete", "Completed", "#3db7dd");
    cancelBtn.onclick = () => openModal("cancel", "Cancelled", "#ff9800");


    manageConfirm.addEventListener("click", async () => {
        if (!selectedRes || !targetStatus) return;

        try {
            const response = await fetch('/update-reservation-status', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ 
                    id: selectedRes.id, 
                    status: targetStatus 
                })
            });

            if (response.ok) {
                window.location.reload(); 
            } else {
                const result = await response.json();
                alert("Error: " + (result.error || "Failed to update reservation."));
            }
        } catch (error) {
            console.error("Fetch error:", error);
            alert("Could not connect to the server.");
        }
    });

    manageCancel.onclick = () => manageModal.style.display = "none";
    window.onclick = (event) => {
        if (event.target == manageModal) manageModal.style.display = "none";
    };

    addBtn.onclick = () => {
        walkinForm.reset();
        walkinModal.style.display = "block";
    };

    walkinCancelBtn.onclick = () => {
        walkinModal.style.display = "none";
    };

    walkinForm.addEventListener("submit", async (e) => {
        e.preventDefault();

        const walkinData = {
            customerEmail: document.getElementById("walkinCustomer").value,
            vehicleId: document.getElementById("walkinVehicle").value,
            date: document.getElementById("walkinDate").value,
            time: document.getElementById("walkinTime").value
        };

        try {
            const response = await fetch('/admin-add-reservation', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(walkinData)
            });

            if (response.ok) {
                window.location.reload(); // Refresh to see the new reservation
            } else {
                const result = await response.json();
                alert("Error: " + (result.error || "Failed to add walk-in."));
            }
        } catch (error) {
            console.error("Fetch error:", error);
        }
    });

    window.addEventListener("click", (event) => {
        if (event.target == walkinModal) walkinModal.style.display = "none";
    });
    
});

    