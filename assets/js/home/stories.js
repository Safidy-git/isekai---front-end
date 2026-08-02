let currentStories = [];
let currentStoryIndex = 0;
let storyTimer = null;
let currentStory = null;
document.addEventListener(
    "DOMContentLoaded",
    () => {
        loadStories();

        const nextStory =
    document.getElementById(
        "nextStory"
    );


const previousStory =
    document.getElementById(
        "previousStory"
    );
    const replyStoryForm =
    document.getElementById(
        "replyStoryForm"
    );

const replyStoryInput =
    document.getElementById(
        "replyStoryInput"
    );
    const deleteStoryButton =
    document.getElementById(
        "deleteStoryButton"
    );

    if(replyStoryForm){

    replyStoryForm.addEventListener(
        "submit",
        sendStoryReply
    );
    if(deleteStoryButton){

    deleteStoryButton.addEventListener(
        "click",
        () => {

            const confirmation =
                confirm(
                    "Supprimer vraiment cette story ?"
                );


            if(confirmation){

                deleteCurrentStory();

            }

        }
    );

}
    

}


if(nextStory){

    nextStory.addEventListener(
        "click",
        showNextStory
    );

}


if(previousStory){

    previousStory.addEventListener(
        "click",
        showPreviousStory
    );

}

        const closeStory =
            document.getElementById(
                "closeStory"
            );

        const storyModal =
            document.getElementById(
                "storyModal"
            );

        

        const closeStoryViewers =
            document.getElementById(
                "closeStoryViewers"
            );

        const storyViewersModal =
            document.getElementById(
                "storyViewersModal"
            );

        if (closeStory) {
            closeStory.addEventListener(
                "click",
                closeStoryViewer
            );
        }

        if (storyModal) {
            storyModal.addEventListener(
                "click",
                event => {
                    if (
                        event.target ===
                        storyModal
                    ) {
                        closeStoryViewer();
                    }
                }
            );
        }

        

        if (closeStoryViewers) {
            closeStoryViewers.addEventListener(
                "click",
                closeStoryViewersModal
            );
        }

        if (storyViewersModal) {
            storyViewersModal.addEventListener(
                "click",
                event => {
                    if (
                        event.target ===
                        storyViewersModal
                    ) {
                        closeStoryViewersModal();
                    }
                }
            );
        }
    }
);

function getCurrentUser() {
    return JSON.parse(
        localStorage.getItem("user")
    );
}

async function loadStories() {
    const user =
        getCurrentUser();

    if (!user) {
        window.location.href =
            "index.html";

        return;
    }

    const storiesContainer =
        document.getElementById(
            "storiesContainer"
        );

    if (!storiesContainer) {
        console.error(
            "storiesContainer introuvable"
        );

        return;
    }

    try {
        const response =
            await fetch(
                `https://isekai-bfq3.onrender.com/api/stories?user_id=${user.id}`
            );

        if (!response.ok) {
            throw new Error(
                "Erreur récupération stories"
            );
        }

        const stories =
            await response.json();

        displayStories(
            stories
        );

    } catch (error) {
        console.error(
            "Erreur chargement stories :",
            error
        );
    }
}

function displayStories(
    stories
) {
    const storiesContainer =
        document.getElementById(
            "storiesContainer"
        );

    if (!storiesContainer) {
        return;
    }

    storiesContainer.innerHTML =
        "";

    const storiesByUser =
        {};

    stories.forEach(
        story => {
            if (
                !storiesByUser[
                    story.user_id
                ]
            ) {
                storiesByUser[
                    story.user_id
                ] = [];
            }

            storiesByUser[
                story.user_id
            ].push(
                story
            );
        }
    );
    // Mettre la story de l'utilisateur connecté en premier
const currentUser = getCurrentUser();

let orderedStories = Object.values(storiesByUser);

if(currentUser){

    const myStoryIndex = orderedStories.findIndex(
        userStories =>
            Number(userStories[0].user_id) === Number(currentUser.id)
    );


    if(myStoryIndex !== -1){

        const myStory = orderedStories.splice(
            myStoryIndex,
            1
        )[0];


        orderedStories.unshift(
            myStory
        );

    }

}

   orderedStories.forEach(
    userStories => {
            const firstStory =
                userStories[0];

            const storyElement =
                document.createElement(
                    "div"
                );

            storyElement.className =
                "story";

            storyElement.innerHTML = `
                <div class="story-ring">
                    <img
                        src="https://isekai-bfq3.onrender.com/uploads/profile/${firstStory.photo_profil}"
                        class="story-avatar"
                        alt="Photo de profil"
                    >
                </div>

                <span>
                    ${firstStory.pseudo}
                </span>
            `;

            storyElement.addEventListener(
                "click",
                () => {
                    openStoryViewer(
                        userStories
                    );
                }
            );

            storiesContainer.appendChild(
                storyElement
            );
        }
    );
}

function openStoryViewer(
    stories
) {
    currentStories =
        stories;

    currentStoryIndex =
        0;

    const storyModal =
        document.getElementById(
            "storyModal"
        );

    if (!storyModal) {
        console.error(
            "storyModal introuvable"
        );

        return;
    }

    storyModal.classList.add(
        "active"
    );

    displayCurrentStory();
}

async function displayCurrentStory() {
    const story =
        currentStories[
            currentStoryIndex
        ];

    if (!story) {
        closeStoryViewer();

        return;
    }
    currentStory = story;
    const user =
        getCurrentUser();

    const storyImage =
        document.getElementById(
            "storyImage"
        );

    const storyText =
        document.getElementById(
            "storyText"
        );

    const storyUserPhoto =
        document.getElementById(
            "storyUserPhoto"
        );

    const storyUserPseudo =
        document.getElementById(
            "storyUserPseudo"
        );

    const likeButton =
        document.getElementById(
            "likeStoryButton"
        );

    const storyViewsButton =
        document.getElementById(
            "storyViewsButton"
        );
    
    if (storyViewsButton) {

        storyViewsButton.onclick =
    () => {

        console.log(
            "Bouton vue cliqué"
        );

        const story =
            currentStories[
                currentStoryIndex
            ];
        currentStory = story;

        console.log(
            "Story actuelle :",
            story
        );

        if (!story) {
            console.log(
                "Aucune story trouvée"
            );
            return;
        }

        loadStoryViewers(
            story.id
        );

    };

    }

    const progress =
        document.getElementById(
            "storyProgress"
        );

    

    const storyOwnerViews =
        document.getElementById(
            "storyOwnerViews"
        );
    

    const storyViewerActions =
        document.getElementById(
            "storyViewerActions"
        );

    if (
        !storyImage ||
        !storyText ||
        !storyUserPhoto ||
        !storyUserPseudo ||
        !progress
    ) {
        console.error(
            "Un des éléments du story viewer est introuvable"
        );

        return;
    }

    storyImage.src =
        `https://isekai-bfq3.onrender.com/uploads/stories/${story.image}`;

    storyUserPhoto.src =
        `https://isekai-bfq3.onrender.com/uploads/profile/${story.photo_profil}`;

    storyUserPseudo.textContent =
        story.pseudo;

    storyText.textContent =
        story.text_content ||
        "";

    if (likeButton) {

    likeButton.classList.remove(
        "liked"
    );


    likeButton.innerHTML = `
        <i class="fa-regular fa-heart"></i>
    `;


    likeButton.onclick =
        () => {
            toggleStoryLike(
                story
            );
        };

}

  if (
    user &&
    Number(story.user_id) ===
    Number(user.id)
) {
        if(deleteStoryButton){
        deleteStoryButton.style.display="block";
    }


    if (storyOwnerViews) {
        storyOwnerViews.style.display =
            "flex";
    }

    // C'est ma story

    if (storyOwnerViews) {
        storyOwnerViews.style.display =
            "flex";
    }


    if (storyViewerActions) {
        storyViewerActions.style.display =
            "none";
    }


    await loadStoryViewsCount(
        story.id
    );


    } else {

        // Story d'un autre utilisateur


        if (storyOwnerViews) {
            storyOwnerViews.style.display =
                "none";
        }


        if (storyViewerActions) {
            storyViewerActions.style.display =
                "flex";
        }


        await registerStoryView(
            story.id
        );


        await loadStoryLikeStatus(
            story.id
        );
    }

    progress.style.width =
    "0%";


setTimeout(
    () => {

        progress.style.width =
            "100%";

    },
    50
);



clearTimeout(
    storyTimer
);


storyTimer =
setTimeout(
    () => {

        showNextStory();

    },
    5000
);
}

async function registerStoryView(
    storyId
) {
    const user =
        getCurrentUser();

    if (!user) {
        return;
    }

    try {
        const response =
            await fetch(
                `https://isekai-bfq3.onrender.com/api/stories/${storyId}/view`,
                {
                    method:
                        "POST",

                    headers: {
                        "Content-Type":
                            "application/json"
                    },

                    body:
                        JSON.stringify({
                            user_id:
                                user.id
                        })
                }
            );

        const data =
            await response.json();

        if (!response.ok) {
            console.error(
                data.message
            );
        }

    } catch (error) {
        console.error(
            "Erreur enregistrement vue :",
            error
        );
    }
}

async function loadStoryViewsCount(
    storyId
) {
    console.log(
        "Chargement des vues pour la story :",
        storyId);
    const storyViewsCount =
        document.getElementById(
            "storyViewsCount"
        );

    if (!storyViewsCount) {
        return;
    }

    try {
        const response =
            await fetch(
                `https://isekai-bfq3.onrender.com/api/stories/${storyId}/views`
            );

        const views =
            await response.json();

        if (!response.ok) {
            console.error(
                views.message
            );

            return;
        }

        storyViewsCount.textContent =
            `${views.length} vue${
                views.length > 1
                    ? "s"
                    : ""
            }`;

    } catch (error) {
        console.error(
            "Erreur chargement vues :",
            error
        );
    }
}

async function loadStoryViewers(
    storyId
) {
    console.log(
        "loadStoryViewers appelée avec :",
        storyId
    );

    const storyViewersModal =
        document.getElementById(
            "storyViewersModal"
        );

    const storyViewersList =
        document.getElementById(
            "storyViewersList"
        );

    console.log(
        "Modal :",
        storyViewersModal
    );

    console.log(
        "Liste :",
        storyViewersList
    );

    if (
        !storyViewersModal ||
        !storyViewersList
    ) {
        return;
    }
    console.log(
    "Modal trouvé :",
    storyViewersModal
);

console.log(
    "Liste trouvée :",
    storyViewersList
);

    storyViewersModal.classList.add(
        "active"
    );

    storyViewersList.innerHTML =
        `
            <p>
                Chargement...
            </p>
        `;

    try {
        const response =
    await fetch(
        `https://isekai-bfq3.onrender.com/api/stories/${storyId}/views`
    );

console.log(
    "Status API :",
    response.status
);

const viewers =
    await response.json();

console.log(
    "Réponse API :",
    viewers
);

        if (!response.ok) {
            console.error(
                viewers.message
            );

            return;
        }

        storyViewersList.innerHTML =
            "";

        if (
            viewers.length ===
            0
        ) {
            storyViewersList.innerHTML =
                `
                    <p>
                        Personne n'a encore vu cette story.
                    </p>
                `;

            return;
        }

        viewers.forEach(
            viewer => {
                const viewerElement =
                    document.createElement(
                        "div"
                    );

                viewerElement.className =
                    "story-viewer";

                viewerElement.innerHTML = `

    <img
        src="https://isekai-bfq3.onrender.com/uploads/profile/${viewer.photo_profil}"
        alt="Photo de profil"
    >

    <div>

        <strong>
            ${viewer.pseudo}
        </strong>

        ${
            viewer.liked
            ?
            `
            <span>
                <i class="fa-solid fa-heart test"></i>
                A aimé
            </span>
            `
            :
            `
            <span>
                <i class="fa-regular fa-eye"></i>
                Vu
            </span>
            `
        }

    </div>

`;

                storyViewersList.appendChild(
                    viewerElement
                );

                viewerElement.style.cursor = "pointer";

viewerElement.addEventListener(
    "click",
    () => {

        window.location.href =
            `profil.html?id=${viewer.user_id}`;

    }
);
            }
        );

    } catch (error) {
        console.error(
            "Erreur chargement personnes :",
            error
        );
    }
}

function closeStoryViewersModal() {
    const storyViewersModal =
        document.getElementById(
            "storyViewersModal"
        );

    if (!storyViewersModal) {
        return;
    }

    storyViewersModal.classList.remove(
        "active"
    );
}

async function loadStoryLikeStatus(
    storyId
) {

    const user =
        getCurrentUser();

    const likeButton =
        document.getElementById(
            "likeStoryButton"
        );


    if (
        !user ||
        !likeButton
    ) {
        return;
    }


    try {

        const response =
            await fetch(
                `https://isekai-bfq3.onrender.com/api/stories/${storyId}/like/${user.id}`
            );


        const data =
            await response.json();


        console.log(
            "Statut like reçu :",
            data
        );


        if (data.liked) {

            likeButton.classList.add(
                "liked"
            );

            likeButton.innerHTML = `
                <i class="fa-solid fa-heart"></i>
            `;


        } else {

            likeButton.classList.remove(
                "liked"
            );

            likeButton.innerHTML = `
                <i class="fa-regular fa-heart"></i>
            `;
        }


    } catch(error) {

        console.error(
            "Erreur récupération like story :",
            error
        );
    }
}

async function toggleStoryLike(
    story
) {
    const user =
        getCurrentUser();

    if (!user) {
        return;
    }

    const likeButton =
        document.getElementById(
            "likeStoryButton"
        );

    if (!likeButton) {
        return;
    }

    const isLiked =
        likeButton.classList.contains(
            "liked"
        );

    try {
        const response =
            await fetch(
                `https://isekai-bfq3.onrender.com/api/stories/${story.id}/like`,
                {
                    method:
                        isLiked
                            ? "DELETE"
                            : "POST",

                    headers: {
                        "Content-Type":
                            "application/json"
                    },

                    body:
                        JSON.stringify({
                            user_id:
                                user.id
                        })
                }
            );

        const data =
            await response.json();

        if (!response.ok) {
            console.error(
                data.message
            );

            return;
        }

        if (isLiked) {
            likeButton.classList.remove(
                "liked"
            );

            likeButton.innerHTML = `
                <i class="fa-regular fa-heart"></i>
            `;

        } else {
            likeButton.classList.add(
                "liked"
            );

            likeButton.innerHTML = `
                <i class="fa-solid fa-heart"></i>
            `;
        }

    } catch (error) {
        console.error(
            "Erreur like story :",
            error
        );
    }
}

function closeStoryViewer() {
    const storyModal =
        document.getElementById(
            "storyModal"
        );

    if (!storyModal) {
        return;
    }

    storyModal.classList.remove(
        "active"
    );

    closeStoryViewersModal();

    currentStories =
        [];

    currentStoryIndex =
        0;
    currentStory = null;
}

function showNextStory(){

    currentStoryIndex++;


    if(
        currentStoryIndex <
        currentStories.length
    ){

        displayCurrentStory();

    }
    else{

        closeStoryViewer();

    }

}
function showPreviousStory(){

    if(
        currentStoryIndex > 0
    ){

        currentStoryIndex--;

        displayCurrentStory();

    }


}

async function sendStoryReply(event){

    event.preventDefault();


    const message =
        document.getElementById(
            "replyStoryInput"
        ).value.trim();


    if(!message){
        return;
    }


    const user =
        getCurrentUser();


    const story =
        currentStories[
            currentStoryIndex
        ];


    if(!story){
        return;
    }


    try {


        // 1) créer ou récupérer conversation

        const conversationResponse =
            await fetch(
                "https://isekai-bfq3.onrender.com/api/conversations",
                {
                    method:"POST",

                    headers:{
                        "Content-Type":
                        "application/json"
                    },

                    body:JSON.stringify({

                        user1_id:
                            user.id,

                        user2_id:
                            story.user_id

                    })

                }
            );


        const conversationData =
            await conversationResponse.json();



        if(!conversationResponse.ok){

            console.error(
                conversationData.message
            );

            return;
        }



        const conversation =
            conversationData.conversation;



        // 2) envoyer le message


        const formData =
            new FormData();


        formData.append(
            "conversation_id",
            conversation.id
        );


        formData.append(
            "sender_id",
            user.id
        );


        formData.append(
            "message",
            message
        );
        formData.append(
            "story_id",
            story.id
        );



        const messageResponse =
            await fetch(

                "https://isekai-bfq3.onrender.com/api/messages",

                {
                    method:"POST",

                    body:
                    formData
                }

            );


        const messageData =
            await messageResponse.json();



        if(!messageResponse.ok){

            console.error(
                messageData.message
            );

            return;
        }



        // vider le champ

        document.getElementById(
            "replyStoryInput"
        ).value="";



        console.log(
            "Réponse story envoyée"
        );



    }
    catch(error){

        console.error(
            "Erreur réponse story :",
            error
        );

    }

}

async function deleteCurrentStory(){

    const user =
        getCurrentUser();


    if(!currentStory || !user){
        return;
    }


    try{

        const response =
            await fetch(
                `https://isekai-bfq3.onrender.com/api/stories/${currentStory.id}`,
                {
                    method:"DELETE",

                    headers:{
                        "Content-Type":
                        "application/json"
                    },

                    body:JSON.stringify({

                        user_id:user.id

                    })
                }
            );


        const data =
            await response.json();


        if(!response.ok){

            console.error(
                data.message
            );

            return;

        }


        alert(
            "Story supprimée"
        );


        closeStoryViewer();


        loadStories();


    }
    catch(error){

        console.error(
            "Erreur suppression story :",
            error
        );

    }

}