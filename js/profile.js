const logoutPopup = document.getElementById("logout"); 
const logoutTrigger = document.getElementById("logoutbtn"); 
const logoutCancel = document.getElementById("logoutCancel");
const logoutConfirm = document.getElementById("logoutConfirm");

logoutTrigger.onclick = function() {
    logoutPopup.style.display = "block";
};

logoutCancel.onclick = function() {
    logoutPopup.style.display = "none";
};

logoutConfirm.onclick = function() {
    window.location.href = "/logout";
};

window.onclick = function(event) {
    if (event.target == logoutPopup) {
        logoutPopup.style.display = "none";
    }
};