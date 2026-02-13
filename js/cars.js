const mockReviews = {
    car1: {
        name: "Honda Sedan Reviews",
        reviews: ["Amazing sedan, my dog loved it" , "It sucks, i drove into a pothole", "the design is very human"]
    },
    car2: {
        name: "Toyota SUV Reviews",
        reviews: ["Why is it so slow", "My children love it", "the design is very human"]
    },
    car3: {
        name: "Ford Van Reviews",
        reviews: ["too big, hard to drive", "i drove from quezon city to laguna in 6 hours, but in comfort", "the design is very human"]
    }
};

const Popup = document.getElementById("reviewPopup");
const reviewTitle = document.getElementById("reviewTitle");
const reviewbody = document.getElementById("reviewbody");
const reviewclose = document.querySelector(".reviewclose");
const reviewLinks = document.querySelectorAll(".disable-linkcars");

reviewLinks.forEach(link => {
    link.addEventListener("click", function(event) {
        event.preventDefault();
        
        const carType = this.getAttribute("data-car");
        const data = mockReviews[carType];

        reviewTitle.innerText = data.name;
        
        reviewbody.innerHTML = ""; 
        data.reviews.forEach(rev => {
            const p = document.createElement("p");
            p.innerText = `“${rev}”`;
            reviewbody.appendChild(p);
        });

        Popup.style.display = "block";
    });
});

reviewclose.onclick = () => Popup.style.display = "none";
window.onclick = (event) => { if (event.target == Popup) Popup.style.display = "none"; }