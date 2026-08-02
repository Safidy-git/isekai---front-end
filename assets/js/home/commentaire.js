const commentsOverlay=document.getElementById("commentsOverlay");
const commentsBox=document.getElementById("commentsBox");
console.log("overlay :",commentsOverlay);
console.log("box :",commentsBox);
const commentsContainer=document.getElementById("commentsContainer");
const commentText=document.getElementById("commentText");
const sendComment=document.getElementById("sendComment");
const closeComments=document.getElementById("closeComments");

let commentaireParent=null;
let currentPostId=null;

function setPostCommentId(id){

    console.log("Post commentaire :",id);

    currentPostId=id;

    commentsBox.classList.add("active");
    commentsOverlay.classList.add("active");

    console.log("box après :",commentsBox.className);
    console.log("overlay après :",commentsOverlay.className);

    chargerCommentaires();

}

function fermerCommentaires(){

    if(commentsBox && commentsOverlay){

        commentsBox.classList.remove("active");
        commentsOverlay.classList.remove("active");

    }

    if(commentsContainer){

        commentsContainer.innerHTML="";

    }

    commentaireParent=null;

    if(commentText){

        commentText.value="";
        commentText.placeholder="Ajouter un commentaire...";

    }

}

if(closeComments){

    closeComments.addEventListener("click",()=>{

        fermerCommentaires();

    });

}

if(commentsOverlay){

    commentsOverlay.addEventListener("click",()=>{

        fermerCommentaires();

    });

}

async function chargerCommentaires(){

    if(!currentPostId || !commentsContainer)
        return;

    try{

        const response=await fetch(
            `https://isekai-bfq3.onrender.com/api/posts/comments/${currentPostId}`
        );

        const commentaires=await response.json();

        commentsContainer.innerHTML="";

        if(commentaires.length===0){

            commentsContainer.innerHTML=`

                <p>
                    Aucun commentaire
                </p>

            `;

            return;

        }

            const user = JSON.parse(
                localStorage.getItem("user")
            );


            commentaires.forEach(comment=>{

                commentsContainer.innerHTML+=`

            <div class="comment-item">

                <img src="${
                    comment.photo_profil
                    ?
                    "http://localhost:3000/uploads/profile/"+comment.photo_profil
                    :
                    "default.png"
                }">

                <div class="comment-content">

                    <strong>
                        ${comment.pseudo}
                    </strong>

                    <p>
                        ${comment.content}
                    </p>


                    ${
                    user && user.id === comment.user_id
                    ?
                    `

                    <button 
                    class="delete-comment"
                    onclick="supprimerComment(${comment.id})">

                    <i class="fa-solid fa-trash"></i>
                    Supprimer

                    </button>

                    `
                    :
                    ""
                    }

                    <button 
                    class="reply-btn"
                    data-id="${comment.id}">
                        Répondre
                    </button>

                    ${
                    comment.replies>0
                    ?
                    `

                    <button
                    class="show-replies-btn"
                    data-id="${comment.id}"
                    data-count="${comment.replies}">
                        Voir les ${comment.replies} réponses
                    </button>

                    <div
                    class="replies-container"
                    id="replies-${comment.id}">
                    </div>

                    `
                    :
                    ""
                    }

                </div>

            </div>

            `;

        });

    }catch(error){

        console.log(
            "Erreur chargement commentaires :",
            error
        );

    }

}

async function chargerReponses(commentId){

    const container=document.getElementById(
        `replies-${commentId}`
    );

    if(!container)
        return;

    try{

        const response=await fetch(
            `https://isekai-bfq3.onrender.com/api/posts/comments/replies/${commentId}`
        );

        const reponses=await response.json();

        container.innerHTML="";

        reponses.forEach(reponse=>{

            container.innerHTML+=`

            <div class="comment-item reply-item">

                <img src="${
                    reponse.photo_profil
                    ?
                    "http://localhost:3000/uploads/profile/"+reponse.photo_profil
                    :
                    "default.png"
                }">

                <div class="comment-content">

                    <strong>
                        ${reponse.pseudo}
                    </strong>

                    <p>
                        ${reponse.content}
                    </p>

                </div>

            </div>

            `;

        });

    }catch(error){

        console.log(
            "Erreur chargement réponses :",
            error
        );

    }

}

if(sendComment){

    sendComment.addEventListener("click",async()=>{

        const user=JSON.parse(
            localStorage.getItem("user")
        );

        const content=commentText.value.trim();

        if(!content)
            return;

        if(!user){

            alert("Vous devez être connecté");

            return;

        }

        await fetch(
            "https://isekai-bfq3.onrender.com/api/posts/comment",
            {
                method:"POST",
                headers:{
                    "Content-Type":"application/json"
                },
                body:JSON.stringify({

                    user_id:user.id,

                    post_id:currentPostId,

                    content:content,

                    parent_id:commentaireParent

                })
            }
        );

        commentText.value="";

        commentaireParent=null;

        commentText.placeholder=
        "Ajouter un commentaire...";

        chargerCommentaires();

    });

}

document.addEventListener("click",async(e)=>{

    if(e.target.classList.contains("reply-btn")){

        commentaireParent=Number(
            e.target.dataset.id
        );

        commentText.placeholder=
        "Répondre au commentaire...";

        commentText.focus();

    }

    if(e.target.classList.contains("show-replies-btn")){

        const button=e.target;

        const id=button.dataset.id;

        const container=document.getElementById(
            `replies-${id}`
        );

        if(container.dataset.loaded==="true"){

            container.innerHTML="";

            container.dataset.loaded="false";

            button.textContent=
            `Voir les ${button.dataset.count} réponses`;

            return;

        }

        await chargerReponses(id);

        container.dataset.loaded="true";

        button.textContent=
        "Masquer les réponses";

    }

});

async function supprimerComment(comment_id){
    const confirmation = confirm(
        "Voulez-vous vraiment supprimer ce commentaire ?"
    );
    if(!confirmation)
        return;



    const user = JSON.parse(
        localStorage.getItem("user")
    );


    if(!user)
        return;



    try{


        const response = await fetch(
            "https://isekai-bfq3.onrender.com/api/posts/comment/delete",
            {

                method:"DELETE",

                headers:{
                    "Content-Type":"application/json"
                },

                body:JSON.stringify({

                    comment_id:comment_id,

                    user_id:user.id

                })

            }
        );



        const result = await response.json();


        console.log(result);



        if(response.ok){

            chargerCommentaires();

        }



    }catch(error){


        console.log(
            "Erreur suppression commentaire :",
            error
        );


    }


}


window.supprimerComment=supprimerComment;

window.setPostCommentId=setPostCommentId;
window.chargerCommentaires=chargerCommentaires;