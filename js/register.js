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
        
        if (errorMessage) {
            this.style.border = "2px solid #ff4d4d";
        } else {
            this.style.border = "2px solid #28a745";
        }
    });
});

function validateForm() {
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
        window.location.href = "cars.html";
    }
}

document.getElementById("regNumber").addEventListener("keypress", function(e) {
    if (e.which < 48 || e.which > 57) {
        e.preventDefault(); 
    }
});