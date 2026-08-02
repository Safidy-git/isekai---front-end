const postsGrid = document.getElementById("postsGrid");

const postModal = document.getElementById("postModal");
const modalProfil = document.getElementById("modalProfil");
const modalPseudo = document.getElementById("modalPseudo");
const modalLocation = document.getElementById("modalLocation");
const modalImages = document.getElementById("modalImages");
const modalLikes = document.getElementById("modalLikes");
const modalComments = document.getElementById("modalComments");
const modalDescription = document.getElementById("modalDescription");
const closeModal = document.querySelector(".close-modal");

let toutesLesPublications = [];


// récupérer l'id du profil visité

const params = new URLSearchParams(window.location.search);
const profilId = params.get("id");


async function afficherPostsUtilisateur(){

    const user = JSON.parse(localStorage.getItem("user"));
    
    
    // si on visite un autre profil
    // sinon on affiche son propre profil
    const idUtilisateur = profilId ? profilId : user.id;
    const response = await fetch(
        `https://isekai-bfq3.onrender.com/api/posts/user/${idUtilisateur}`
    );

    const posts = await response.json();
    toutesLesPublications = posts;

    postsGrid.innerHTML = "";
    posts.forEach((post,index)=>{

        postsGrid.innerHTML += `
        <div class="post-item" onclick="ouvrirPublication(${index})">

            <img src="https://isekai-bfq3.onrender.com/uploads/posts/${post.image}" class="post-image">

            <div class="post-overlay">
                <div class="post-stats">
                    <span>
                    <i class="fa-solid fa-heart"></i>
                    ${post.likes || 0}
                    </span>

                    <span>
                    <i class="fa-solid fa-comment"></i>
                    ${post.comments || 0}
                    </span>
                </div>
            </div>
        </div>
        `;
    });
}

function ouvrirPublication(index){
    

    const post = toutesLesPublications[index];

    
    if(window.setLikePostId){
        setLikePostId(post.id);
    }


    if(window.setPostCommentId){
    setPostCommentId(post.id);
    }

    if(window.chargerCommentaires){
        
        chargerCommentaires();
    }
    modalProfil.src =
    post.photo_profil
    ? `https://isekai-bfq3.onrender.com/uploads/profile/${post.photo_profil}`
    : "default.png";

    modalPseudo.textContent =
    post.pseudo || "Utilisateur";
    modalPseudoInline.textContent = post.pseudo
    modalLocation.textContent =
    post.location || "";
    modalImages.src =
    `https://isekai-bfq3.onrender.com/uploads/posts/${post.image}`;
    modalLikes.textContent =
    post.likes || 0;
    modalComments.textContent =
    post.comments || 0;
    modalDescription.textContent =
    post.content || "";
    postModal.style.display = "flex";
}

closeModal.onclick = function(){

    postModal.style.display = "none";

    commentsContainer.innerHTML = "";

    currentPostId = null;

};
postModal.onclick = function(e){
    if(e.target === postModal){

        postModal.style.display = "none";

        commentsContainer.innerHTML = "";

        currentPostId = null;

    }
};
afficherPostsUtilisateur();
window.ouvrirPublication = ouvrirPublication;