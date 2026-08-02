const likeIcon = document.getElementById("likeIcon");
const modalLikess = document.getElementById("modalLikes");

let currentLikePostId = null;
let liked = false;


// définir le post actuellement ouvert
function setLikePostId(id){

    currentLikePostId = id;

    verifierLike();

}

window.setLikePostId = setLikePostId;


// vérifier si l'utilisateur a déjà liké
async function verifierLike(){

    const user = JSON.parse(localStorage.getItem("user"));

    if(!user || !currentLikePostId){
        return;
    }


    try{

        const response = await fetch(
            `https://isekai-bfq3.onrender.com/api/posts/check-like/${user.id}/${currentLikePostId}`
        );


        const data = await response.json();


        liked = data.liked;


        if(liked){

            likeIcon.innerHTML =
            `<i class="fa-solid fa-heart"></i>`;

            likeIcon.classList.add("like-active");


        }else{

            likeIcon.innerHTML =
            `<i class="fa-regular fa-heart"></i>`;

            likeIcon.classList.remove("like-active");

        }


    }catch(error){

        console.log(
            "Erreur vérification like :",
            error
        );

    }

}



// cliquer sur le coeur

if(likeIcon){

    likeIcon.addEventListener("click", async()=>{


        const user = JSON.parse(localStorage.getItem("user"));


        if(!user){

            alert("Connectez-vous pour aimer");

            return;

        }


        if(!currentLikePostId){

            console.log("Aucun post");

            return;

        }



        if(!liked){


            await fetch(
                "https://isekai-bfq3.onrender.com/api/posts/like",
                {

                    method:"POST",

                    headers:{
                        "Content-Type":"application/json"
                    },


                    body:JSON.stringify({

                        user_id:user.id,

                        post_id:currentLikePostId

                    })

                }
            );



            liked = true;



            likeIcon.innerHTML =
            `<i class="fa-solid fa-heart"></i>`;


            likeIcon.classList.add("like-active");



            modalLikess.textContent =
            Number(modalLikess.textContent)+1;



        }else{



            await fetch(
                "https://isekai-bfq3.onrender.com/api/posts/unlike",
                {

                    method:"POST",

                    headers:{
                        "Content-Type":"application/json"
                    },


                    body:JSON.stringify({

                        user_id:user.id,

                        post_id:currentLikePostId

                    })

                }
            );



            liked = false;



            likeIcon.innerHTML =
            `<i class="fa-regular fa-heart"></i>`;


            likeIcon.classList.remove("like-active");



            modalLikess.textContent =
            Number(modalLikess.textContent)-1;



        }


    });

}