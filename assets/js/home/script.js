document.addEventListener("DOMContentLoaded", () => {

    const user = JSON.parse(localStorage.getItem("user"));

    if (!user) {
        window.location.href = "index.html";
        return;
    }
    loadHomePostsCount();
    document.getElementById("namm").innerText = user.pseudo;

    document.getElementById("bio").innerHTML =
    user.description?.trim() || "Aucune description";

    document.getElementById("photoProfil").src =
    user.photo_profil
    ? `https://isekai-bfq3.onrender.com/uploads/profile/${user.photo_profil}`
    : "default.png";


    loadUsers();
    

    async function loadUsers(){

        try{

            const res = await fetch(
                `https://isekai-bfq3.onrender.com/api/suggestions/${user.id}`
            );

            const users = await res.json();


            const container = document.getElementById("suggestion-list");

            const mobileContainer = document.getElementById("mobileSuggestions");


            container.innerHTML = "";


            if(mobileContainer){

                mobileContainer.innerHTML = `
                   
                `;

            }


            const filtered = users.filter(
                u => u.id !== user.id
            );


            const randomUsers = filtered
            .sort(() => Math.random() - 0.5)
            .slice(0,10);



            randomUsers.forEach(u=>{


                const imgSrc = u.photo_profil
                ?
                `https://isekai-bfq3.onrender.com/uploads/profile/${u.photo_profil}`
                :
                "default.png";



                // VERSION DESKTOP

                const div = document.createElement("div");

                div.classList.add("suggestion-item");


                div.innerHTML = `

                    <div class="suggestion-avatar">

                        <img class="imag" src="${imgSrc}">

                    </div>


                    <div class="suggestion-info">

                        <strong>
                            ${u.nom} ${u.prenom}
                        </strong>


                        <span>
                            ${u.description?.trim() ? u.description : ""}
                        </span>

                    </div>


                    <button 
                    class="follow-btn"
                    data-id="${u.id}">
                        Voir
                    </button>

                `;


                container.appendChild(div);



                // VERSION MOBILE CARTE

                if(mobileContainer){


                    const card = document.createElement("div");


                    card.classList.add(
                        "mobile-suggestion-card"
                    );


                    card.innerHTML = `

                        <img cl src="${imgSrc}">


                        <strong>
                            ${u.nom} ${u.prenom}
                        </strong>


                        <span>
                            ${u.description?.trim() ? u.description : ""}
                        </span>


                        <button 
                        class="follow-btn"
                        data-id="${u.id}">
                            Voir
                        </button>

                    `;


                    mobileContainer.appendChild(card);

                }


            });


        }
        catch(error){

            console.log(
                "Erreur suggestions :",
                error
            );

        }

    }



    document.addEventListener("click",(e)=>{


        if(e.target.classList.contains("follow-btn")){


            const userId = e.target.dataset.id;


            window.location.href =
            `profil.html?id=${userId}`;


        }


    });



    const userId = user.id;


    fetch(`https://isekai-bfq3.onrender.com/api/count/${userId}`)
    .then(res=>res.json())
    .then(data=>{

        const el = document.getElementById("followersCount");

        if(el)
        el.innerText = data.total;

    });



    fetch(`https://isekai-bfq3.onrender.com/api/following-count/${userId}`)
    .then(res=>res.json())
    .then(data=>{

        const el = document.getElementById("followingCount");

        if(el)
        el.innerText = data.total;

    });



    window.redirection_publication = function(){

        window.location.href="publication.html";

    };


});

async function checkUnreadMessages() {
    const user = JSON.parse(
        localStorage.getItem("user")
    );

    if (!user) {
        return;
    }

    try {
        const response = await fetch(
            `https://isekai-bfq3.onrender.com/api/messages/unread/${user.id}`
        );

        const data = await response.json();

        const badge =
            document.getElementById(
                "unreadMessageBadge"
            );

        if (!badge) {
            return;
        }

        if (data.unread_count > 0) {
            badge.textContent =
                data.unread_count;

            badge.style.display =
                "flex";
        } else {
            badge.style.display =
                "none";
        }
    } catch (error) {
        console.error(
            "Erreur lors de la vérification des messages non lus :",
            error
        );
    }
}


function logout(){

    localStorage.removeItem("user");

    window.location.href="index.html";

}

checkUnreadMessages();

setInterval(
    checkUnreadMessages,
    5000
);


function redirection_message(){
    window.location.href = "message.html"
}

async function loadHomePostsCount(){

    const user =
        JSON.parse(
            localStorage.getItem("user")
        );


    if(!user){
        return;
    }


    try{

        const response =
            await fetch(
                `https://isekai-bfq3.onrender.com/api/posts/count/${user.id}`
            );


        const data =
            await response.json();


        const postsCount =
            document.getElementById(
                "homePostsCount"
            );


        if(postsCount){

            postsCount.textContent =
                data.totalPosts;

        }


    }
    catch(error){

        console.error(
            "Erreur chargement nombre posts home :",
            error
        );

    }

}