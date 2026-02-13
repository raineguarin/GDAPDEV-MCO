const confirmationPopup = document.getElementById("confirmation");
const successPopup = document.getElementById("successPopup");


const submitBtn = document.getElementById("submitbtn"); 
const cancelBtn = document.getElementById("cancelBtn");
const confirmPopBtn = document.getElementById("confirmpop"); 
const okBtn = document.getElementById("okBtn");

submitBtn.onclick = function() {
    confirmationPopup.style.display = "block";
};

confirmPopBtn.onclick = function() {
    confirmationPopup.style.display = "none";
    successPopup.style.display = "block";
};

cancelBtn.onclick = function() {
    confirmationPopup.style.display = "none";
};

okBtn.onclick = function() {
    successPopup.style.display = "none";

};

window.onclick = function(event) {
    if (event.target == confirmationPopup) {
        confirmationPopup.style.display = "none";
    }
    if (event.target == successPopup) {
        successPopup.style.display = "none";
    }
};