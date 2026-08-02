// Gestion du modal pour la photo de profil
const photoProfil = document.getElementById('photoProfil');
const profileModal = document.getElementById('profileModal');
const modalImage = document.getElementById('modalImage');
const modalClose = document.getElementById('modalClose');
const modalOverlay = document.getElementById('modalOverlay');
const addPostBtn = document.getElementById('addPostBtn');

// Ouvrir le modal au clic sur la photo de profil
photoProfil.addEventListener('click', function() {
    modalImage.src = this.src;
    profileModal.classList.add('active');
    document.body.style.overflow = 'hidden';
});

// Fermer le modal au clic sur le bouton fermeture
modalClose.addEventListener('click', function() {
    profileModal.classList.remove('active');
    document.body.style.overflow = 'auto';
});

// Fermer le modal au clic sur l'overlay
modalOverlay.addEventListener('click', function() {
    profileModal.classList.remove('active');
    document.body.style.overflow = 'auto';
});

// Fermer le modal avec la touche Echap
document.addEventListener('keydown', function(e) {
    if (e.key === 'Escape' && profileModal.classList.contains('active')) {
        profileModal.classList.remove('active');
        document.body.style.overflow = 'auto';
    }
});

const followModal = document.getElementById("followModal");
const followTitle = document.getElementById("followModalTitle");
const followList = document.getElementById("followList");

document.getElementById("closeFollowModal").onclick = () => {

    followModal.style.display="none";

};

async function openFollowModal(type){

    const params=new URLSearchParams(window.location.search);

    const currentUser=JSON.parse(localStorage.getItem("user"));

    const profileId=params.get("id")||currentUser.id;

    followTitle.innerText=type==="followers"
        ?"Abonnés"
        :"Suivis";

    const res=await fetch(`https://isekai-bfq3.onrender.com/api/${type}/${profileId}`);

    const users=await res.json();

    followList.innerHTML="";

    if(users.length===0){

        followList.innerHTML="<p>Aucun utilisateur.</p>";

    }

  users.forEach(user => {

    followList.innerHTML += `

        <div class="follow-user" data-id="${user.id}">

            <img class="imagess" src="${
                user.photo_profil
                ? `https://isekai-bfq3.onrender.com/uploads/profile/${user.photo_profil}`
                : "default.png"
            }">

            <div class="follow-info">
                <strong>${user.pseudo}</strong>
                <span>${user.description || ""}</span>
            </div>

        </div>

    `;
});

    followModal.style.display="flex";

}

document.getElementById("followersCount").onclick=()=>{

    openFollowModal("followers");

};

document.getElementById("followingCount").onclick=()=>{

    openFollowModal("following");

};

followList.addEventListener("click", (e) => {

    const item = e.target.closest(".follow-user");

    if (!item) return;

    const id = item.dataset.id;

    if (!id) return;

    // fermer le modal
    followModal.style.display = "none";

    // redirection vers profil
    window.location.href = `profil.html?id=${id}`;
});

window.onclick=(e)=>{

    if(e.target===followModal){

        followModal.style.display="none";

    }

};