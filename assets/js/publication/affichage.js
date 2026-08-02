const postsContainer = document.getElementById("postsContainer");

let publications = [];

let postEnModification = null;

let postASupprimer = null;


const user = JSON.parse(localStorage.getItem("user"));



async function chargerMesPublications(){


    if(!user){

        window.location.href="login.html";

        return;

    }


    try{


        const response = await fetch(
            `https://isekai-bfq3.onrender.com/api/posts/user/${user.id}`
        );


        publications = await response.json();



        postsContainer.innerHTML="";



        publications.forEach(post=>{


            postsContainer.innerHTML += `

            <article class="post-card">


                ${
                    post.image
                    ?
                    `<img src="https://isekai-bfq3.onrender.com/uploads/posts/${post.image}">`
                    :
                    ""
                }



                <div class="post-content">


                    <p class="post-text">

                        ${post.content}

                    </p>



                    <small>

                        <i class="fa-solid fa-location-dot"></i>

                        ${post.location ?? "Aucun lieu"}

                    </small>


                </div>




                <div class="post-actions">


                    <button
                    class="edit-btn"
                    onclick="modifierPost(${post.id})">


                        <i class="fa-solid fa-pen"></i>

                        Modifier


                    </button>





                    <button
                    class="delete-btn"
                    onclick="supprimerPost(${post.id})">


                        <i class="fa-solid fa-trash"></i>

                        Supprimer


                    </button>



                </div>



            </article>

            `;


        });



    }catch(error){


        console.log(
            "Erreur chargement publications :",
            error
        );


    }


}







/* =========================
      MODIFIER POST
========================= */


window.modifierPost=function(id){


    postEnModification=id;



    const post = publications.find(
        p=>p.id===id
    );



    if(!post){

        console.log(
            "Publication introuvable"
        );

        return;

    }



    document.getElementById("editContent").value =
    post.content;



    document.getElementById("editLocation").value =
    post.location ?? "";



    document
    .getElementById("editModal")
    .classList.add("active");


};







/* =========================
      ENREGISTRER MODIFICATION
========================= */


document.addEventListener(
"DOMContentLoaded",
()=>{


    const saveEdit =
    document.getElementById("saveEdit");



    if(saveEdit){


        saveEdit.addEventListener(
        "click",
        async()=>{


            const content =
            document.getElementById("editContent").value;



            const location =
            document.getElementById("editLocation").value;




            const response =
            await fetch(
                `https://isekai-bfq3.onrender.com/api/posts/${postEnModification}`,
                {

                    method:"PUT",

                    headers:{
                        "Content-Type":"application/json"
                    },


                    body:JSON.stringify({

                        content,

                        location

                    })

                }
            );



            const result =
            await response.json();



            console.log(result);



            document
            .getElementById("editModal")
            .classList.remove("active");



            chargerMesPublications();



        });


    }





    const closeModal =
    document.getElementById("closeModal");



    const editModal =
    document.getElementById("editModal");



    if(closeModal){


        closeModal.onclick=()=>{


            editModal.classList.remove("active");


        };


    }




    if(editModal){


        editModal.onclick=(e)=>{


            if(e.target===editModal){


                editModal.classList.remove("active");


            }


        };


    }




    /* =========================
          SUPPRESSION
    ========================= */


    const cancelDelete =
    document.getElementById("cancelDelete");



    const confirmDelete =
    document.getElementById("confirmDelete");



    const deleteModal =
    document.getElementById("deleteModal");




    if(cancelDelete){


        cancelDelete.onclick=()=>{


            deleteModal.classList.remove("active");


            postASupprimer=null;


        };


    }




    if(confirmDelete){


        confirmDelete.onclick=async()=>{



            if(!postASupprimer){

                return;

            }



            try{


                const response =
                await fetch(
                    `https://isekai-bfq3.onrender.com/api/posts/${postASupprimer}`,
                    {

                        method:"DELETE"

                    }
                );



                const result =
                await response.json();



                console.log(result);




                if(response.ok){


                    deleteModal.classList.remove("active");


                    postASupprimer=null;



                    chargerMesPublications();



                }



            }catch(error){


                console.log(
                    "Erreur suppression :",
                    error
                );


            }



        };


    }




    if(deleteModal){


        deleteModal.onclick=(e)=>{


            if(e.target===deleteModal){


                deleteModal.classList.remove("active");


                postASupprimer=null;


            }


        };


    }



});







/* =========================
      OUVRIR POPUP SUPPRESSION
========================= */


window.supprimerPost=function(id){


    console.log(
        "CLICK SUPPRIMER :",
        id
    );



    postASupprimer=id;



    const deleteModal =
    document.getElementById("deleteModal");



    if(deleteModal){


        deleteModal
        .classList
        .add("active");


    }


};







chargerMesPublications();