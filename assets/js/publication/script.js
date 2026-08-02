const menuToggle = document.getElementById("menuToggle");

const sidebar = document.getElementById("sidebar");

const closeSidebar = document.getElementById("closeSidebar");

const overlay = document.getElementById("sidebarOverlay");




function ouvrirSidebar(){

    sidebar.classList.add("active");

    overlay.classList.add("active");

}




function fermerSidebar(){

    sidebar.classList.remove("active");

    overlay.classList.remove("active");

}





menuToggle.addEventListener(
    "click",
    ouvrirSidebar
);



closeSidebar.addEventListener(
    "click",
    fermerSidebar
);



overlay.addEventListener(
    "click",
    fermerSidebar
);
