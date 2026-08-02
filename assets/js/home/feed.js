const feed = document.getElementById("feed");



async function chargerPublications(){

    const user = JSON.parse(localStorage.getItem("user"));

    const user_id = user ? user.id : 0;

    try{

        const response = await fetch(
            `https://isekai-bfq3.onrender.com/api/posts?user_id=${user_id}`
        );

        const posts = await response.json();

        const suggestionsResponse = await fetch(
            `https://isekai-bfq3.onrender.com/api/suggestions/${user_id}`
        );

        const suggestions = await suggestionsResponse.json();

        feed.innerHTML = "";

        const filteredSuggestions = suggestions
            .filter(u => u.id !== user_id)
            .sort(() => Math.random() - 0.5)
            .slice(0, 5);

        posts.forEach((post, index) => {

            feed.innerHTML += `

                <article class="post">

                    <header class="post-head">

                        <div onclick="goToProfile(${post.user_id})">

                            <img 
                            class="post-avatar"
                            src="${
                                post.photo_profil
                                ?
                                "https://isekai-bfq3.onrender.com/uploads/profile/" + post.photo_profil
                                :
                                "default.png"
                            }">

                        </div>

                        <div 
                        class="post-who"
                        onclick="goToProfile(${post.user_id})">

                            <strong>
                                ${post.pseudo}
                            </strong>

                            <span>
                                ${post.location || ""}
                            </span>

                        </div>

                       

                    </header>

                    <div>

                        ${
                            post.image
                            ?
                            `
                            <img 
                            class="post-img"
                            src="https://isekai-bfq3.onrender.com/uploads/posts/${post.image}">
                            `
                            :
                            ""
                        }

                    </div>

                    <div class="post-actions">

                        <i
                        class="${
                            Number(post.liked) === 1
                            ?
                            "fa-solid fa-heart liked"
                            :
                            "fa-regular fa-heart"
                        }"
                        onclick="toggleLike(${post.id}, ${post.liked})">
                        </i>

                        <i 
                        class="fa-regular fa-comment"
                        onclick="setPostCommentId(${post.id})">
                        </i>



                    </div>

                    <div class="post-content">

                        <p 
                        class="likes"
                        onclick="openLikes(${post.id})">

                            <strong>
                                ${post.likes}
                            </strong>

                            ${post.likes > 1 ? "likes" : "like"}

                        </p>

                        <p class="caption">

                            ${post.content}

                        </p>

                    </div>

                </article>

            `;

            if(index === 6 && filteredSuggestions.length > 0){

                feed.innerHTML += `

                    <section class="feed-suggestions">

                        <div class="feed-suggestions-header">

                            <h3>
                                Suggestions pours toi
                            </h3>

                            <button onclick="voirToutesSuggestions()">
                                Voir tout
                            </button>

                        </div>

                        <div class="feed-suggestions-list">

                            ${filteredSuggestions.map(u => {

                                const imgSrc = u.photo_profil
                                ?
                                `https://isekai-bfq3.onrender.com/uploads/profile/${u.photo_profil}`
                                :
                                "default.png";

                                return `

                                    <div class="feed-suggestion-card">

                                        <div 
                                        class="feed-suggestion-profile"
                                        onclick="goToProfile(${u.id})">

                                            <img 
                                            src="${imgSrc}">

                                            <strong>
                                                ${u.pseudo || `${u.nom} ${u.prenom}`}
                                            </strong>

                                        </div>

                                        <button 
                                        onclick="goToProfile(${u.id})">

                                            Voir

                                        </button>

                                    </div>

                                `;

                            }).join("")}

                        </div>

                    </section>

                `;

            }

        });

    }
    catch(error){

        console.log(
            "Erreur chargement posts :",
            error
        );

    }

}



chargerPublications();








async function toggleLike(post_id, liked){

    const user = JSON.parse(
        localStorage.getItem("user")
    );


    if(!user){

        alert("Connectez-vous pour liker");

        return;

    }

    const url = liked == 1

    ?

    "https://isekai-bfq3.onrender.com/api/posts/unlike"


    :

    "https://isekai-bfq3.onrender.com/api/posts/like";

    try{

        const response = await fetch(url,{

            method:"POST",

            headers:{

                "Content-Type":"application/json"
            },


            body:JSON.stringify({


                user_id:user.id,

                post_id:post_id


            })


        });





        if(response.ok){


            chargerPublications();


        }


    }
    catch(error){

        console.log(
            "Erreur like :",
            error
        );


    }

}





async function openLikes(post_id){



    const modal=document.getElementById("likesModal");

    const list=document.getElementById("likesList");



    modal.style.display="flex";



    const response=await fetch(

        `https://isekai-bfq3.onrender.com/api/posts/likes/${post_id}`

    );



    const users=await response.json();




    list.innerHTML="";





    if(users.length===0){


        list.innerHTML="<p>Aucun j'aime</p>";

        return;


    }






    users.forEach(user=>{


        list.innerHTML += `



        <div 
        class="like-user"
        onclick="goToProfile(${user.id})">





            <img src="${
                user.photo_profil
                ?
                "https://isekai-bfq3.onrender.com/uploads/profile/"+user.photo_profil
                :
                "default.png"
            }">





            <div class="like-user-info">


                <strong>

                    ${user.pseudo}

                </strong>



            </div>





        </div>



        `;


    });


}







function closeLikes(){


    document
    .getElementById("likesModal")
    .style.display="none";


}







function goToProfile(user_id){


    window.location.href =
    `profil.html?id=${user_id}`;


}
function voirToutesSuggestions(){
     window.location.href ="explorer.html"
}