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
async function validateForm(event) {
    // Prevents default HTML form submission
    if (event) event.preventDefault();

    let allValid = true;
    
    // Validate text inputs
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
        // Uses FormData API for automatic file handling
        const formElement = document.getElementById('registrationForm');
        const formData = new FormData(formElement);

        try {
            const response = await fetch('/register', {
                method: 'POST',
                body: formData 
            });

            if (response.ok) {
                alert("Account created successfully!");
                window.location.href = "/login";
            } else {
                const result = await response.json();
                alert("Registration Error: " + (result.error || "Something went wrong"));
            }
        } catch (error) {
            console.error("Fetch error:", error);
            alert("Could not connect to the server.");
        }
    }
}

// 4. Attach the event listener to the form instead of just the button
document.getElementById('registrationForm').addEventListener('submit', validateForm);

document.getElementById("regNumber").addEventListener("keypress", function(e) {
    if (e.which < 48 || e.which > 57) e.preventDefault(); 
});