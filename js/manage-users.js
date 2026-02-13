const manageRes = document.getElementById("manageconf");
const actionText = document.getElementById("actionText");
const targetUser = document.getElementById("targetUser");
const confirmBtn = document.getElementById("managuserConfirm");
const cancelBtn = document.getElementById("managuserCancel");

const usersGrid = document.querySelector(".users-grid");

usersGrid.addEventListener("click", function(e) {

    if (e.target.classList.contains("activate-btn") || e.target.classList.contains("suspend-btn")) {
        

        const isActivate = e.target.classList.contains("activate-btn");
        

        const userName = e.target.closest(".user-card").querySelector("h2").innerText;


        actionText.innerText = isActivate ? "activate" : "suspend";
        targetUser.innerText = userName;


        if (isActivate) {
            confirmBtn.style.backgroundColor = "#3db7dd"; 
            confirmBtn.innerText = "Yes, Activate";
        } else {
            confirmBtn.style.backgroundColor = "#ff4d4d"; 
            confirmBtn.innerText = "Yes, Suspend";
        }

        manageRes.style.display = "block";
    }
});


cancelBtn.onclick = () => manageRes.style.display = "none";


window.onclick = (event) => {
    if (event.target == manageRes) manageRes.style.display = "none";
};


confirmBtn.onclick = () => {
    alert("User status has been updated.");
    manageRes.style.display = "none";
};