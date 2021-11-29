function hamburgerMenu() {
    var x = document.getElementById("nav-container");
    if (x.style.display === "block") {
        x.style.display = "none";
    } else {
        x.style.display = "block";
    }
}