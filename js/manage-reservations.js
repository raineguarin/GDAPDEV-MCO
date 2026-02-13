const managRes = document.getElementById("managres");
const managResText = document.getElementById("managresText");
const managResIDDisplay = managRes.querySelector("span"); 
const managResConfirm = document.getElementById("managresConfirm");
const managResCancel = document.getElementById("managresCancel");

document.querySelector(".reservation-grid").addEventListener("click", function(e) {
    const btn = e.target;
    
    const validActions = ["approve", "decline", "cancel"];
    const btnClass = validActions.find(cls => btn.classList.contains(cls));

    if (btnClass) {
        const resCard = btn.closest(".reservation-card");
        const resID = resCard.querySelector("h2").innerText;

        managResIDDisplay.innerText = resID;
        managResText.innerText = btnClass; 
        
        let actionColor = "#3db7dd"; 
        if (btnClass === "approve") actionColor = "#28a745"; 
        if (btnClass === "decline") actionColor = "#dc3545"; 
        if (btnClass === "cancel") actionColor = "#6c757d";  

        managResConfirm.style.backgroundColor = actionColor;
        managRes.style.display = "block";
    }
    
});

managResCancel.onclick = () => managRes.style.display = "none";
window.onclick = (event) => {
    if (event.target == managRes) managRes.style.display = "none";
};