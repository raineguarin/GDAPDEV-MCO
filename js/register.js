const togglePass = document.getElementById("togglePass");
const passInput = document.getElementById("regPass");

togglePass.onclick = function() {
    if (passInput.type === "password") {
        passInput.type = "text";
        togglePass.innerText = "Hide";
    } else {
        passInput.type = "password";
        togglePass.innerText = "Show";
    }
};

const inputs = {
    regName: {
        errorId: "nameError",
        validate: (val) => val.trim() !== "" ? "" : "Full name is required."
    },
    regEmail: {
        errorId: "emailError",
        validate: (val) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(val) ? "" : "Enter a valid email address."
    },
    regNumber: {
        errorId: "numberError",
        validate: (val) => (!isNaN(val) && val.length >= 11) ? "" : "Enter a valid 11-digit number."
    },
    regPass: {
        errorId: "passError",
        validate: (val) => val.length >= 8 ? "" : "Password must be at least 8 characters."
    }
};

Object.keys(inputs).forEach(id => {
    const inputEl = document.getElementById(id);
    inputEl.addEventListener("input", function() {
        const errorMessage = inputs[id].validate(this.value);
        document.getElementById(inputs[id].errorId).innerText = errorMessage;
        this.style.border = errorMessage ? "2px solid #ff4d4d" : "2px solid #28a745";
    });
});

// new logic for submission
async function validateForm() {
    let allValid = true;
    
    Object.keys(inputs).forEach(id => {
        const inputEl = document.getElementById(id);
        const errorMessage = inputs[id].validate(inputEl.value);
        document.getElementById(inputs[id].errorId).innerText = errorMessage;
        if (errorMessage) {
            allValid = false;
            inputEl.style.border = "2px solid #ff4d4d";
        }
    });

    if (allValid) {
        const formData = {
            name: document.getElementById('regName').value,
            email: document.getElementById('regEmail').value,
            number: document.getElementById('regNumber').value,
            password: document.getElementById('regPass').value,
            username: document.getElementById('regEmail').value // username is email
        };

        try {
            // sending data to customer router
            const response = await fetch('/register', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData)
            });

            const result = await response.json();

            if (response.ok) {
                alert("Account created successfully!");
                window.location.href = "/login"; // login redirext
            } else {
                alert("Registration Error: " + result.error);
            }
        } catch (error) {
            console.error("Fetch error:", error);
            alert("Could not connect to the server.");
        }
    }
}

document.getElementById("regNumber").addEventListener("keypress", function(e) {
    if (e.which < 48 || e.which > 57) e.preventDefault(); 
});