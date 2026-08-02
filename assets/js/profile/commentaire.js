// ===============================
// GESTION DES COMMENTAIRES
// ===============================

const commentsOverlay = document.getElementById("commentsOverlay");
const commentButton = document.getElementById("commentButton");
const commentsBox = document.getElementById("commentsBox");
const commentsContainer = document.getElementById("commentsContainer");
const sendComment = document.getElementById("sendComment");
const commentText = document.getElementById("commentText");


let commentaireParent = null;
let currentPostId = null;



// récupérer l'id du post ouvert
function setPostCommentId(id){

    currentPostId = id;

}



// ===============================
// OUVERTURE / FERMETURE
// ===============================

if(commentButton){


    commentButton.addEventListener("click",()=>{


        commentsBox.classList.add("active");

        commentsOverlay.classList.add("active");


        chargerCommentaires();


    });



}



if(commentsOverlay){


    commentsOverlay.addEventListener("click",()=>{


        commentsBox.classList.remove("active");

        commentsOverlay.classList.remove("active");


        commentsContainer.innerHTML="";


        commentaireParent=null;


        commentText.value="";


        commentText.placeholder=
        "Ajouter un commentaire...";


    });


}






// ===============================
// CHARGER COMMENTAIRES
// ===============================


async function chargerCommentaires(){


    if(!currentPostId)
        return;



    try{


        const response = await fetch(

            `https://isekai-bfq3.onrender.com/api/posts/comments/${currentPostId}`

        );


        const commentaires = await response.json();



        const user = JSON.parse(
            localStorage.getItem("user")
        );



        commentsContainer.innerHTML="";




        if(commentaires.length === 0){


            commentsContainer.innerHTML=`

                <p class="no-comment">
                    Aucun commentaire
                </p>

            `;


            return;


        }





        commentaires.forEach(comment=>{



            commentsContainer.innerHTML += `



<div class="comment-item">



    <img 
    src="${
        comment.photo_profil
        ?
        "https://isekai-bfq3.onrender.com/uploads/profile/"+comment.photo_profil
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
        comment.replies > 0

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




    }
    catch(error){


        console.log(
            "Erreur chargement commentaires :",
            error
        );


    }


}









// ===============================
// CHARGER REPONSES
// ===============================


async function chargerReponses(commentId){



    const container =
    document.getElementById(
        `replies-${commentId}`
    );



    if(!container)
        return;




    try{


        const response = await fetch(

            `https://isekai-bfq3.onrender.com/api/posts/comments/replies/${commentId}`

        );



        const reponses = await response.json();



        const user = JSON.parse(
            localStorage.getItem("user")
        );



        container.innerHTML="";





        reponses.forEach(reponse=>{



            container.innerHTML += `



<div class="comment-item reply-item">



<img 
src="${
reponse.photo_profil
?
"https://isekai-bfq3.onrender.com/uploads/profile/"+reponse.photo_profil
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





${
user && user.id === reponse.user_id

?

`

<button
class="delete-comment"
onclick="supprimerComment(${reponse.id})">

<i class="fa-solid fa-trash"></i>

Supprimer

</button>

`

:

""

}



</div>



</div>



`;



        });



    }
    catch(error){



        console.log(
            "Erreur chargement réponses :",
            error
        );



    }



}









// ===============================
// AJOUTER COMMENTAIRE
// ===============================


if(sendComment){



sendComment.addEventListener(
"click",
async()=>{



const user = JSON.parse(
localStorage.getItem("user")
);



const content =
commentText.value.trim();





if(!content)
    return;




if(!user){


alert(
"Vous devez être connecté"
);


return;


}





if(!currentPostId){


console.log(
"Aucun post sélectionné"
);


return;


}





try{


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


commentText.placeholder =
"Ajouter un commentaire...";



chargerCommentaires();



}
catch(error){



console.log(
"Erreur ajout commentaire :",
error
);



}



});



}









// ===============================
// SUPPRIMER COMMENTAIRE
// ===============================


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





const result =
await response.json();





console.log(result);





if(response.ok){


chargerCommentaires();


}




}
catch(error){


console.log(
"Erreur suppression commentaire :",
error
);



}



}









// ===============================
// EVENEMENTS
// ===============================


document.addEventListener(
"click",
async(e)=>{


if(e.target.classList.contains("reply-btn")){


commentaireParent =
Number(
e.target.dataset.id
);



commentText.placeholder =
"Répondre au commentaire...";



commentText.focus();



}




if(
e.target.classList.contains(
"show-replies-btn"
)
){


const button=e.target;


const commentId =
button.dataset.id;



const container =
document.getElementById(
`replies-${commentId}`
);





if(container.dataset.loaded==="true"){



container.innerHTML="";


container.dataset.loaded="false";



button.textContent =
`Voir les ${button.dataset.count} réponses`;



return;


}




await chargerReponses(commentId);



container.dataset.loaded="true";



button.textContent =
"Masquer les réponses";



}



});







// rendre disponible

window.setPostCommentId =
setPostCommentId;


window.chargerCommentaires =
chargerCommentaires;


window.supprimerComment =
supprimerComment;