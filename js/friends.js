document.addEventListener("DOMContentLoaded", function() {
    const friend = document.getElementById("friendAdd");

    document.body.addEventListener("click", function(e) {
        
        if (e.target.classList.contains("addfriend")) {
            
            friend.classList.add("show");

            e.target.innerText = "Pending";
            e.target.style.backgroundColor = "#6c757d";
            e.target.disabled = true;

            setTimeout(function() {
                friend.classList.remove("show");
            }, 4000);
        }
    });
});