document.addEventListener("DOMContentLoaded", () => {
    const grid = document.getElementById("usersGrid");
    const searchInput = document.getElementById("searchInput");
    const filterRole = document.getElementById("filterRole");
    const filterStatus = document.getElementById("filterStatus");
    const filterVerified = document.getElementById("filterVerified");
    
    const addBtn = document.getElementById("addBtn");
    const editBtn = document.getElementById("editBtn");
    const deleteBtn = document.getElementById("deleteBtn");

    const userFormModal = document.getElementById("userFormModal");
    const deleteModal = document.getElementById("manageconf"); 
    
    const formTitle = document.getElementById("formModalTitle");
    const userForm = document.getElementById("userForm");
    
    const formUserId = document.getElementById("formUserId");
    const formRole = document.getElementById("formRole");
    const formName = document.getElementById("formName");
    const formUsername = document.getElementById("formUsername");
    const formEmail = document.getElementById("formEmail");
    
    const customerFields = document.getElementById("customerFields");
    const formLicense = document.getElementById("formLicense");
    const formIsVerified = document.getElementById("formIsVerified");
    const formStatus = document.getElementById("formStatus");

    let selectedUser = null;

    function toggleRoleFields(role) {
        if (role === 'Admin') {
            customerFields.style.display = 'none'; 
        } else {
            customerFields.style.display = 'flex'; 
        }
    }

 formRole.addEventListener("change", (e) => toggleRoleFields(e.target.value));


    grid.addEventListener("click", (e) => {
        const card = e.target.closest(".user-card");
        if (!card) return;

        document.querySelectorAll(".user-card").forEach(c => c.classList.remove("selected"));
        
        card.classList.add("selected");

        selectedUser = {
            id: card.dataset.id,
            username: card.dataset.username,
            name: card.dataset.name,
            email: card.dataset.email,
            role: card.dataset.role,
            status: card.dataset.status,
            verified: card.dataset.verified,
            license: card.dataset.license 
        };

        editBtn.disabled = false;
        deleteBtn.disabled = false;
    });


    function applyFilters() {
        const search = searchInput.value.toLowerCase();
        const roleFilter = filterRole.value;
        const statusFilter = filterStatus.value;
        const verifiedFilter = filterVerified.value;

        document.querySelectorAll(".user-card").forEach(card => {
            const name = card.dataset.name.toLowerCase();
            const email = card.dataset.email.toLowerCase();
            const username = card.dataset.username.toLowerCase();
            const role = card.dataset.role;
            const status = card.dataset.status;
            const verified = card.dataset.verified;

            const matchSearch = name.includes(search) || email.includes(search) || username.includes(search);
            const matchRole = roleFilter === "all" || role === roleFilter;
            const matchStatus = statusFilter === "all" || status === statusFilter;
            const matchVerified = verifiedFilter === "all" || verified === verifiedFilter || role === "Admin";

            if (matchSearch && matchRole && matchStatus && matchVerified) {
                card.style.display = "grid"; 
            } else {
                card.style.display = "none";
            }
        });

        if (selectedUser) {
            const selectedCardElem = document.querySelector(`.user-card[data-id="${selectedUser.id}"]`);
            if (selectedCardElem && selectedCardElem.style.display === "none") {
                selectedCardElem.classList.remove("selected");
                selectedUser = null;
                editBtn.disabled = true;
                deleteBtn.disabled = true;
            }
        }
    }

    searchInput.addEventListener("input", applyFilters);
    filterRole.addEventListener("change", applyFilters);
    filterStatus.addEventListener("change", applyFilters);
    filterVerified.addEventListener("change", applyFilters);

    addBtn.addEventListener("click", () => {
        formTitle.innerText = "Add New User";
        userForm.reset(); 
        formUserId.value = ""; 
        formRole.disabled = false; 
        toggleRoleFields(formRole.value);
        userFormModal.style.display = "block";
    });

    editBtn.addEventListener("click", () => {
        if (!selectedUser) return;
        
        formTitle.innerText = "Edit User";
        formUserId.value = selectedUser.id;
        formRole.value = selectedUser.role;
        formName.value = selectedUser.name;
        formUsername.value = selectedUser.username;
        formEmail.value = selectedUser.email;
        
        formRole.disabled = true; 

        if (selectedUser.role === 'Customer') {
            formStatus.value = selectedUser.status || "Active";
            formLicense.value = selectedUser.license || "";
            formIsVerified.value = selectedUser.verified === "true" ? "true" : "false";
        }
        
        toggleRoleFields(selectedUser.role);
        userFormModal.style.display = "block";
    });


    deleteBtn.addEventListener("click", () => {
        if (!selectedUser) return;
        document.getElementById("deleteTargetName").innerText = selectedUser.name;
        deleteModal.style.display = "block";
    });

    document.getElementById("formCancelBtn").addEventListener("click", () => userFormModal.style.display = "none");
    document.getElementById("deleteCancelBtn").addEventListener("click", () => deleteModal.style.display = "none");

    window.addEventListener("click", (e) => {
        if (e.target == userFormModal) userFormModal.style.display = "none";
        if (e.target == deleteModal) deleteModal.style.display = "none";
    });


    userForm.addEventListener("submit", async (e) => {
        e.preventDefault();

        const userData = {
            id: formUserId.value,
            role: formRole.value, 
            name: formName.value,
            username: formUsername.value,
            email: formEmail.value,
            status: formStatus.value,
            licenseNumber: formLicense.value,
            isVerified: formIsVerified.value === "true"
        };

        try {
            const response = await fetch('/save-user', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(userData)
            });

            if (response.ok) {
                window.location.reload(); 
            } else {
                alert("Error saving user.");
            }
        } catch (error) {
            console.error("Fetch error:", error);
        }
    });

    document.getElementById("deleteConfirmBtn").addEventListener("click", async () => {
        if (!selectedUser) return;

        try {
            const response = await fetch('/delete-user', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ id: selectedUser.id })
            });

            if (response.ok) {
                window.location.reload(); 
            } else {
                alert("Error deleting user.");
            }
        } catch (error) {
            console.error("Fetch error:", error);
        }
    });
});