document.addEventListener("DOMContentLoaded", () => {

    const user = JSON.parse(
        localStorage.getItem("user")
    );

    if(!user){

        window.location.href = "index.html";

        return;

    }

    const searchInput =
    document.getElementById("searchInput");

    const clearSearch =
    document.getElementById("clearSearch");

    const explorerResults =
    document.getElementById("explorerResults");

    const searchLoading =
    document.getElementById("searchLoading");

    const searchEmpty =
    document.getElementById("searchEmpty");

    const searchTabs =
    document.querySelectorAll(".search-tab");

    let currentType = "all";

    let searchTimeout;


    chargerAccueil();


    searchInput.addEventListener(
        "input",
        function(){

            const search =
            this.value.trim();

            clearTimeout(searchTimeout);

            if(search.length > 0){

                clearSearch.classList.add(
                    "visible"
                );

                searchTimeout = setTimeout(() => {

                    rechercher(search);

                }, 400);

            }
            else{

                clearSearch.classList.remove(
                    "visible"
                );

                chargerAccueil();

            }

        }
    );


    clearSearch.addEventListener(
        "click",
        function(){

            searchInput.value = "";

            clearSearch.classList.remove(
                "visible"
            );

            chargerAccueil();

            searchInput.focus();

        }
    );


    searchTabs.forEach(tab => {

        tab.addEventListener(
            "click",
            function(){

                searchTabs.forEach(t => {

                    t.classList.remove(
                        "active"
                    );

                });

                this.classList.add(
                    "active"
                );

                currentType =
                this.dataset.type;

                const search =
                searchInput.value.trim();

                if(search){

                    rechercher(search);

                }

            }

        );

    });


    async function chargerAccueil(){

        afficherLoading();

        try{

            const response = await fetch(
                `https://isekai-bfq3.onrender.com/api/suggestions/${user.id}`
            );

            const suggestions =
            await response.json();

            if(!Array.isArray(suggestions)){

                throw new Error(
                    "Les suggestions ne sont pas un tableau"
                );

            }

            afficherAccueil(
                suggestions
            );

        }
        catch(error){

            console.log(
                "Erreur chargement suggestions :",
                error
            );

            afficherAucunResultat();

        }

    }


    async function rechercher(search){

        afficherLoading();

        try{

            if(currentType === "users"){

                await rechercherPersonnes(
                    search
                );

            }
            else if(currentType === "posts"){

                await rechercherPublications(
                    search
                );

            }
            else{

                await rechercherTout(
                    search
                );

            }

        }
        catch(error){

            console.log(
                "Erreur recherche :",
                error
            );

            afficherAucunResultat();

        }

    }


    async function rechercherPersonnes(search){

        const response = await fetch(

            `http://localhost:3000/api/users/search?q=${encodeURIComponent(search)}`

        );

        const users =
        await response.json();

        if(!Array.isArray(users)){

            throw new Error(
                "Réponse utilisateurs invalide"
            );

        }

        afficherPersonnes(
            users
        );

    }


    async function rechercherPublications(search){

        const response = await fetch(

            `https://isekai-bfq3.onrender.com/api/posts/search?q=${encodeURIComponent(search)}&user_id=${user.id}`

        );

        const posts =
        await response.json();

        if(!Array.isArray(posts)){

            throw new Error(
                "Réponse publications invalide"
            );

        }

        afficherPublications(
            posts
        );

    }


 async function rechercherTout(search){

    const [

        usersResponse,

        postsResponse

    ] = await Promise.all([


       fetch(
    `https://isekai-bfq3.onrender.com/api/users/search?q=${encodeURIComponent(search)}`
        ),

        fetch(
            `https://isekai-bfq3.onrender.com/api/posts/search?q=${encodeURIComponent(search)}`
        )

            ]);


    const users =
    await usersResponse.json();


    const posts =
    await postsResponse.json();


    if(!Array.isArray(users)){

        throw new Error(
            "Réponse utilisateurs invalide"
        );

    }


    if(!Array.isArray(posts)){

        throw new Error(
            "Réponse publications invalide"
        );

    }


    afficherTout(

        users,

        posts

    );

}


    function afficherPersonnes(users){

        if(users.length === 0){

            afficherAucunResultat();

            return;

        }

        afficherResultats();


        explorerResults.innerHTML = `

            <section class="explorer-section">

                <div class="section-heading">

                    <h2>
                        Personnes
                    </h2>

                    <span>
                        ${users.length} résultat(s)
                    </span>

                </div>


                <div class="explorer-users">

                    ${

                        users.map(u => {

                            const imgSrc =
                            u.photo_profil
                            ?
                            `http://localhost:3000/uploads/profile/${u.photo_profil}`
                            :
                            "default.png";


                            const name =
                            u.pseudo
                            ||
                            `${u.nom || ""} ${u.prenom || ""}`;


                            return `

                                <article 
                                class="explorer-user-card">


                                    <div 
                                    class="explorer-user-avatar"
                                    onclick="goToProfile(${u.id})">


                                        <img 
                                        src="${imgSrc}"
                                        alt="Profil">


                                    </div>


                                    <strong>
                                        ${name}
                                    </strong>


                                    <span>

                                        ${
                                            u.pseudo
                                            ?
                                            "@" + u.pseudo
                                            :
                                            ""
                                        }

                                    </span>


                                    <button
                                    onclick="goToProfile(${u.id})">

                                        Voir le profil

                                    </button>


                                </article>

                            `;

                        }).join("")

                    }

                </div>

            </section>

        `;

    }


    function afficherPublications(posts){

        if(posts.length === 0){

            afficherAucunResultat();

            return;

        }

        afficherResultats();


        explorerResults.innerHTML = `

            <section class="explorer-section">

                <div class="section-heading">

                    <h2>
                        Publications
                    </h2>

                    <span>
                        ${posts.length} résultat(s)
                    </span>

                </div>


                <div class="explorer-posts">

                    ${

                        posts.map(post => {

                            const profileImg =
                            post.photo_profil
                            ?
                            `http://localhost:3000/uploads/profile/${post.photo_profil}`
                            :
                            "default.png";


                            return `

                                <article 
                                class="explorer-post-card">


                                    ${
                                        post.image
                                        ?
                                        `

                                        <img
                                        class="explorer-post-image"
                                        src="http://localhost:3000/uploads/posts/${post.image}"
                                        alt="Publication">

                                        `
                                        :
                                        ""
                                    }


                                    <div 
                                    class="explorer-post-info">


                                        <div 
                                        class="explorer-post-user"
                                        onclick="goToProfile(${post.user_id})">


                                            <img
                                            src="${profileImg}"
                                            alt="Profil">


                                            <strong>
                                                ${post.pseudo}
                                            </strong>


                                        </div>


                                        <p>
                                            ${post.content || ""}
                                        </p>


                                        ${
                                            post.location
                                            ?
                                            `

                                            <span>
                                                <i class="fa-solid fa-location-dot"></i>
                                                ${post.location}
                                            </span>

                                            `
                                            :
                                            ""
                                        }


                                    </div>


                                </article>

                            `;

                        }).join("")

                    }

                </div>

            </section>

        `;

    }


    function afficherTout(users, posts){

        if(
            users.length === 0 &&
            posts.length === 0
        ){

            afficherAucunResultat();

            return;

        }

        afficherResultats();


        explorerResults.innerHTML = "";


        if(users.length > 0){

            explorerResults.innerHTML += `

                <section class="explorer-section">

                    <div class="section-heading">

                        <h2>
                            Personnes
                        </h2>

                        <span>
                            ${users.length} résultat(s)
                        </span>

                    </div>


                    <div class="explorer-users">

                        ${

                            users
                            .slice(0, 5)
                            .map(u => {

                                const imgSrc =
                                u.photo_profil
                                ?
                                `http://localhost:3000/uploads/profile/${u.photo_profil}`
                                :
                                "default.png";


                                const name =
                                u.pseudo
                                ||
                                `${u.nom || ""} ${u.prenom || ""}`;


                                return `

                                    <article 
                                    class="explorer-user-card">


                                        <div 
                                        class="explorer-user-avatar"
                                        onclick="goToProfile(${u.id})">


                                            <img 
                                            src="${imgSrc}"
                                            alt="Profil">


                                        </div>


                                        <strong>
                                            ${name}
                                        </strong>


                                        <span>

                                            ${
                                                u.pseudo
                                                ?
                                                "@" + u.pseudo
                                                :
                                                ""
                                            }

                                        </span>


                                        <button
                                        onclick="goToProfile(${u.id})">

                                            Voir le profil

                                        </button>


                                    </article>

                                `;

                            }).join("")

                        }

                    </div>

                </section>

            `;

        }


        if(posts.length > 0){

            explorerResults.innerHTML += `

                <section class="explorer-section">

                    <div class="section-heading">

                        <h2>
                            Publications
                        </h2>

                        <span>
                            ${posts.length} résultat(s)
                        </span>

                    </div>


                    <div class="explorer-posts">

                        ${

                            posts
                            .slice(0, 6)
                            .map(post => {

                                return `

                                    <article 
                                    class="explorer-post-card">


                                        ${
                                            post.image
                                            ?
                                            `

                                            <img
                                            class="explorer-post-image"
                                            src="http://localhost:3000/uploads/posts/${post.image}"
                                            alt="Publication">

                                            `
                                            :
                                            ""
                                        }


                                        <div 
                                        class="explorer-post-info">


                                            <div 
                                            class="explorer-post-user"
                                            onclick="goToProfile(${post.user_id})">


                                                <img
                                                src="${
                                                    post.photo_profil
                                                    ?
                                                    "http://localhost:3000/uploads/profile/" + post.photo_profil
                                                    :
                                                    "default.png"
                                                }"
                                                alt="Profil">


                                                <strong>
                                                    ${post.pseudo}
                                                </strong>


                                            </div>


                                            <p>
                                                ${post.content || ""}
                                            </p>


                                        </div>


                                    </article>

                                `;

                            }).join("")

                        }

                    </div>

                </section>

            `;

        }

    }


    function afficherAccueil(suggestions){

        afficherResultats();


        explorerResults.innerHTML = `

            <div class="explorer-intro">

                <div class="intro-icon">

                    <i class="fa-solid fa-compass"></i>

                </div>

                <h2>
                    Découvre de nouvelles personnes
                </h2>

                <p>
                    Recherche des personnes ou explore les publications de la communauté.
                </p>

            </div>


            <section class="explorer-section">

                <div class="section-heading">

                    <h2>
                        Suggestions pour toi
                    </h2>

                    <span>
                        Découvre de nouveaux profils
                    </span>

                </div>


                <div 
                class="explorer-users"
                id="explorerSuggestions">


                    ${
                        suggestions
                        .filter(u => u.id !== user.id)
                        .sort(() => Math.random() - 0.5)
                        .slice(0, 10)
                        .map(u => {

                            const imgSrc =
                            u.photo_profil
                            ?
                            `http://localhost:3000/uploads/profile/${u.photo_profil}`
                            :
                            "default.png";


                            const name =
                            u.pseudo
                            ||
                            `${u.nom || ""} ${u.prenom || ""}`;


                            return `

                                <article 
                                class="explorer-user-card">


                                    <div 
                                    class="explorer-user-avatar"
                                    onclick="goToProfile(${u.id})">


                                        <img 
                                        src="${imgSrc}"
                                        alt="Profil">


                                    </div>


                                    <strong>
                                        ${name}
                                    </strong>


                                    <span>

                                        ${
                                            u.pseudo
                                            ?
                                            "@" + u.pseudo
                                            :
                                            ""
                                        }

                                    </span>


                                    <button
                                    onclick="goToProfile(${u.id})">

                                        Voir le profil

                                    </button>


                                </article>

                            `;

                        }).join("")

                    }

                </div>

            </section>

        `;

    }


    function afficherLoading(){

        explorerResults.style.display =
        "none";

        searchEmpty.style.display =
        "none";

        searchLoading.style.display =
        "flex";

    }


    function afficherResultats(){

        explorerResults.style.display =
        "block";

        searchLoading.style.display =
        "none";

        searchEmpty.style.display =
        "none";

    }


    function afficherAucunResultat(){

        explorerResults.style.display =
        "none";

        searchLoading.style.display =
        "none";

        searchEmpty.style.display =
        "flex";

    }


    window.goToProfile =
    function(user_id){

        window.location.href =
        `profil.html?id=${user_id}`;

    };

});