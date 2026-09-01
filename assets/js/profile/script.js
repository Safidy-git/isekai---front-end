document.addEventListener("DOMContentLoaded", async () => {

    const currentUser = JSON.parse(localStorage.getItem("user"));
    loadPostsCount();
    if (!currentUser) {
        window.location.replace("index.html");
        return;
    }

    // ======================
    // ID PROFIL DANS URL
    // ======================
    const params = new URLSearchParams(window.location.search);
    const profileId = params.get("id") || currentUser.id;

    let profileUser = null;

    try {
        const res = await fetch(`https://isekai-bfq3.onrender.com/api/users/${profileId}`);

        if (!res.ok) {
            console.error("Erreur API:", res.status);
            return;
        }

        profileUser = await res.json();

        if (!profileUser) {
            console.error("Utilisateur introuvable");
            return;
        }

    } catch (err) {
        console.error("Erreur chargement profil :", err);
        return;
    }

    // ======================
    // AFFICHAGE PROFIL
    // ======================
    document.getElementById("nom").innerText =
        profileUser.pseudo || "";

    document.getElementById("nom_complet").innerText =
        `${profileUser.nom || ""} ${profileUser.prenom || ""}`;

    document.getElementById("bio").innerHTML =
        profileUser.description || "";

    document.getElementById("photoProfil").src =
        profileUser.photo_profil
            ? `https://isekai-bfq3.onrender.com/uploads/profile/${profileUser.photo_profil}`
            : "default.png";

    // ======================
    // BOUTONS PROFIL
    // ======================
    const btnRedirect = document.getElementById("redirection");
    const followBtn = document.getElementById("followbtn");

    if (currentUser.id === profileUser.id) {
        btnRedirect.style.display = "inline-flex";
        followBtn.style.display = "none";
    } else {
        btnRedirect.style.display = "none";
        followBtn.style.display = "inline-flex";
    }

    const addPostBtn = document.getElementById("addPostBtn");

    if (addPostBtn) {
        if (currentUser.id === profileUser.id) {
            addPostBtn.style.display = "inline-flex";
        } else {
            addPostBtn.style.display = "none";
        }
    }

    // ======================
    // BLOQUER SELF FOLLOW
    // ======================
    if (currentUser.id === profileUser.id) {
        followBtn.style.display = "none";
    }

    // ======================
    // CHECK FOLLOW STATUS
    // ======================
    try {
        const checkRes = await fetch(
            `https://isekai-bfq3.onrender.com/api/check?follower_id=${currentUser.id}&followed_id=${profileId}`
        );

        const checkData = await checkRes.json();

        followBtn.dataset.following = checkData.isFollowing ? "true" : "false";

        followBtn.innerHTML = checkData.isFollowing
            ? `<i class="fa-solid fa-user-check"></i> Suivi`
            : `<i class="fa-solid fa-user-plus"></i> Suivre`;

    } catch (err) {
        console.error("Erreur check follow :", err);
    }

    // ======================
    // FOLLOW / UNFOLLOW ACTION
    // ======================
    followBtn.addEventListener("click", async () => {

        const isFollowing = followBtn.dataset.following === "true";

        if (!isFollowing) {

            await fetch("https://isekai-bfq3.onrender.com/api/follow", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    follower_id: currentUser.id,
                    followed_id: profileId
                })
            });

            followBtn.dataset.following = "true";
            followBtn.innerHTML = `<i class="fa-solid fa-user-check"></i> Suivi`;

        } else {

            await fetch("https://isekai-bfq3.onrender.com/api/unfollow", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    follower_id: currentUser.id,
                    followed_id: profileId
                })
            });

            followBtn.dataset.following = "false";
            followBtn.innerHTML = `<i class="fa-solid fa-user-plus"></i> Suivre`;
        }
    });

    // ======================
    // FOLLOWERS COUNT
    // ======================
    try {
        const countRes = await fetch(`https://isekai-bfq3.onrender.com/api/count/${profileId}`);
        const countData = await countRes.json();

        document.getElementById("followersCount").innerText = countData.total;

    } catch (err) {
        console.error("Erreur count followers :", err);
    }

    // ======================
    // FOLLOWING COUNT
    // ======================
    try {
        const followingRes = await fetch(`https://isekai-bfq3.onrender.com/api/following-count/${profileId}`);
        const followingData = await followingRes.json();

        document.getElementById("followingCount").innerText = followingData.total;

    } catch (err) {
        console.error("Erreur count following :", err);
    }

    // ======================
    // REDIRECTION EDIT PROFILE
    // ======================
    window.redirectionn = function () {
        window.location.href = "modifier_profile.html";
    };

    //========================
    // redirection pour publication
    // ============================
    window.redirection_publication = function(){
        window.location.href = "publication.html";
    };

    // ======================
    // TABS (POSTS / SAVED)
    // ======================
    const tabBtns = document.querySelectorAll('.tab-btn');
    const postsGrid = document.getElementById('postsGrid');
    const savedGrid = document.getElementById('savedGrid');

    if (tabBtns && postsGrid && savedGrid) {

        tabBtns.forEach(btn => {
            btn.addEventListener('click', () => {

                tabBtns.forEach(b => b.classList.remove('active'));
                btn.classList.add('active');

                const tabName = btn.getAttribute('data-tab');

                if (tabName === 'posts') {
                    postsGrid.style.display = 'grid';
                    savedGrid.style.display = 'none';
                } else {
                    postsGrid.style.display = 'none';
                    savedGrid.style.display = 'grid';
                }
            });
        });
    }

    

});



async function loadPostsCount(profileId) {

    try {

        const response = await fetch(
            `https://isekai-bfq3.onrender.com/api/posts/count/${profileId}`
        );

        if (!response.ok) {
            throw new Error("Erreur API : " + response.status);
        }

        const data = await response.json();

        const postsCount = document.getElementById("postsCount");

        if (postsCount) {
            postsCount.textContent = data.totalPosts;
        }

    } catch (error) {

        console.error(
            "Erreur chargement nombre posts :",
            error
        );

    }
}