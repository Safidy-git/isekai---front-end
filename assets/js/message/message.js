function redirection_message() {
    window.location.href = "message.html";
}

document.addEventListener("DOMContentLoaded", () => {
    const user = JSON.parse(localStorage.getItem("user"));

    if (!user) {
        window.location.href = "index.html";
        return;
    }

    const conversationsList = document.getElementById("conversationsList");
    const messagesContainer = document.getElementById("messagesContainer");
    const messageInput = document.getElementById("messageInput");
    const sendMessageBtn = document.getElementById("sendMessageBtn");
    const conversationSearch = document.getElementById("conversationSearch");
    const newMessageBtn = document.getElementById("newMessageBtn");
    const newMessageModal = document.getElementById("newMessageModal");
    const closeNewMessage = document.getElementById("closeNewMessage");
    const followingList = document.getElementById("followingList");
    const followingSearch = document.getElementById("followingSearch");
    const chatPanel = document.querySelector(".chat-panel");
    const homeBtn = document.getElementById("homeBtn");
    const imageBtn =document.getElementById("imageBtn");
    const imageInput = document.getElementById("imageInput");
    
    

    if (homeBtn) {
    homeBtn.addEventListener(
        "click",
        () => {
            window.location.href =
                "home.html";
        }
    );
}
    let currentConversationId = null;
    let conversations = [];
    let followingUsers = [];

    async function loadConversations() {
        try {
            const response = await fetch(
                `https://isekai-bfq3.onrender.com/api/conversations/${user.id}`
            );

            const data = await response.json();

            if (!response.ok) {
                console.error(data.message);
                return;
            }

            conversations = data.conversations;
            displayConversations(conversations);
        } catch (error) {
            console.error(
                "Erreur lors du chargement des conversations :",
                error
            );
        }
    }

    function displayConversations(conversationsToDisplay) {
        conversationsList.innerHTML = "";

        if (conversationsToDisplay.length === 0) {
            conversationsList.innerHTML = `
                <div class="no-conversations">
                    Aucune conversation
                </div>
            `;
            return;
        }

        conversationsToDisplay.forEach(conversation => {
            console.log(
                    "Conversation :",
                    conversation.pseudo,
                    "is_read :",
                    conversation.is_read
                );
            const item = document.createElement("div");

            item.classList.add("conversation-item");

            if (Number(conversation.is_read) === 0) {
                item.classList.add("unread");
            }

            item.dataset.conversationId =
                conversation.conversation_id;

            item.innerHTML = `
                <img
                    src="https://isekai-bfq3.onrender.com/uploads/profile/${conversation.photo_profil}"
                    alt="Photo de profil"
                >

                <div class="conversation-info">
                    <strong>
                        ${conversation.pseudo}
                    </strong>

                    <p>
                        ${
                            conversation.last_message
                                ? conversation.last_message
                                : conversation.last_image
                                    ? "A envoyé une image"
                                    : "Aucun message"
                        }
                    </p>
                </div>

                <span class="conversation-time">
                    ${
                        conversation.last_message_date ||
                        ""
                    }
                </span>
            `;

            item.addEventListener("click", () => {
                openConversation(conversation);
            });

            conversationsList.appendChild(item);
        });
    }

    async function markMessagesAsRead(conversationId) {
        try {
            const response = await fetch(
                `https://isekai-bfq3.onrender.com/api/messages/read/${conversationId}`,
                {
                    method: "PUT",
                    headers: {
                        "Content-Type": "application/json"
                    },
                    body: JSON.stringify({
                        user_id: user.id
                    })
                }
            );

            const data = await response.json();

            if (!response.ok) {
                console.error(data.message);
                return false;
            }

            return true;
        } catch (error) {
            console.error(
                "Erreur lors du marquage des messages comme lus :",
                error
            );

            return false;
        }
    }

    async function openConversation(conversation) {
        currentConversationId =
            conversation.conversation_id;

        chatPanel.classList.add("chat-open");

        await markMessagesAsRead(
            currentConversationId
        );

        await loadConversations();

        document
            .querySelectorAll(".conversation-item")
            .forEach(item => {
                item.classList.remove("active");
            });

        const selectedItem = document.querySelector(
            `[data-conversation-id="${conversation.conversation_id}"]`
        );

        if (selectedItem) {
            selectedItem.classList.add("active");
        }

        const chatUser =
            document.querySelector(".chat-user");

        chatUser.innerHTML = `
            <img
                src="https://isekai-bfq3.onrender.com/uploads/profile/${conversation.photo_profil}"
                alt="Photo de profil"
                class="chat-profile-image"
                data-user-id="${conversation.other_user_id}"
            >

            <div>
                <strong>
                    ${conversation.pseudo}
                </strong>

                <span>
                    Actif maintenant
                </span>
            </div>
        `;
        const chatProfileImage =
            chatUser.querySelector(
                ".chat-profile-image"
            );

        chatProfileImage.addEventListener(
            "click",
            event => {

                event.stopPropagation();

                const userId =
                    chatProfileImage.dataset.userId;

                window.location.href =
                    `profil.html?id=${userId}`;

            }
        );

        await loadMessages(
            currentConversationId
        );
    }

    async function loadMessages(conversationId) {
        try {
            const response = await fetch(
                `https://isekai-bfq3.onrender.com/api/messages/${conversationId}`
            );

            const data = await response.json();

            if (!response.ok) {
                console.error(data.message);
                return;
            }

            displayMessages(data.messages);
        } catch (error) {
            console.error(
                "Erreur lors du chargement des messages :",
                error
            );
        }
    }

    function displayMessages(messages) {

    messagesContainer.innerHTML = "";

    if (
        !messages ||
        messages.length === 0
    ) {
        messagesContainer.innerHTML = `
            <div class="empty-chat">

                <i
                    class="fa-regular fa-comments"
                ></i>

                <h2>
                    Aucun message
                </h2>

                <p>
                    Envoyez le premier message.
                </p>

            </div>
        `;

        return;
    }

    messages.forEach(message => {

        const messageElement =
            document.createElement("div");

        messageElement.classList.add(
            "message"
        );

        if (
            Number(message.sender_id) ===
            Number(user.id)
        ) {
            messageElement.classList.add(
                "sent"
            );
        } else {
            messageElement.classList.add(
                "received"
            );
        }

        messageElement.innerHTML = `

            ${
                Number(message.sender_id) !==
                Number(user.id)

                    ? `

                        <img
                            src="https://isekai-bfq3.onrender.com/uploads/profile/${message.photo_profil}"
                            alt="Photo"
                            class="message-profile-image"
                            data-user-id="${message.sender_id}"
                        >

                    `

                    : ""
            }

            <div class="message-content">


${
    message.story_id
    ?
    `
        <div class="story-reply-box">

            <small>
                A répondu à votre story
            </small>

            <img
                src="https://isekai-bfq3.onrender.com/uploads/stories/${message.story_image}"
                class="story-reply-image"
            >

        </div>
    `
    :
    ""
}


${
    message.message
        ? `
            <p class="message-text">
                ${message.message}
            </p>
        `
        : ""
}


${
    message.image
        ? `
            <img
                src="https://isekai-bfq3.onrender.com/uploads/messages/${message.image}"
                class="message-image"
            >
        `
        : ""
}


<span>
    ${formatTime(message.created_at)}
</span>


</div>
        `;
        const profileImage =
            messageElement.querySelector(
                ".message-profile-image"
            );

        if (profileImage) {

            profileImage.addEventListener(
                "click",
                event => {

                    event.stopPropagation();

                    const userId =
                        profileImage.dataset.userId;

                    window.location.href =
                        `profil.html?id=${userId}`;

                }
            );

        }

        messagesContainer.appendChild(
            messageElement
        );

        const messageImage =
            messageElement.querySelector(
                ".message-image"
            );

        if (messageImage) {

            messageImage.addEventListener(
                "click",
                () => {

                    downloadImage(
                        messageImage.src,
                        message.image
                    );

                }
            );

}
    });

    messagesContainer.scrollTop =
        messagesContainer.scrollHeight;

    
}
    async function downloadImage(
    imageUrl,
    imageName
) {

    try {

        const response =
            await fetch(imageUrl);

        const blob =
            await response.blob();

        const url =
            window.URL.createObjectURL(
                blob
            );

        const link =
            document.createElement(
                "a"
            );

        link.href = url;

        link.download =
            imageName;

        document.body.appendChild(
            link
        );

        link.click();

        document.body.removeChild(
            link
        );

        window.URL.revokeObjectURL(
            url
        );

    } catch (error) {

        console.error(
            "Erreur lors du téléchargement :",
            error
        );

    }

}

    async function sendMessage() {
        const message =
            messageInput.value.trim();

        const image =
            imageInput.files[0];

        if (
            !message &&
            !image
        ) {
            return;
        }

        if (!currentConversationId) {
            return;
        }

        try {
            const formData =
                new FormData();

            formData.append(
                "conversation_id",
                currentConversationId
            );

            formData.append(
                "sender_id",
                user.id
            );

            formData.append(
                "message",
                message
            );

            if (image) {
                formData.append(
                    "image",
                    image
                );
            }

            const response =
                await fetch(
                    "https://isekai-bfq3.onrender.com/api/messages",
                    {
                        method: "POST",
                        body: formData
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

            messageInput.value = "";

            imageInput.value = "";

            if (
                typeof window.clearImagePreview ===
                "function"
            ) {
                window.clearImagePreview();
            }

            await loadMessages(
                currentConversationId
            );

            await loadConversations();

        } catch (error) {
            console.error(
                "Erreur lors de l'envoi du message :",
                error
            );
        }
    }

    sendMessageBtn.addEventListener(
        "click",
        sendMessage
    );

    messageInput.addEventListener(
        "keydown",
        event => {
            if (event.key === "Enter") {
                event.preventDefault();
                sendMessage();
            }
        }
    );

    conversationSearch.addEventListener(
        "input",
        () => {
            const search =
                conversationSearch.value.toLowerCase();

            const filtered =
                conversations.filter(
                    conversation =>
                        conversation.pseudo
                            .toLowerCase()
                            .includes(search)
                );

            displayConversations(filtered);
        }
    );

    newMessageBtn.addEventListener(
        "click",
        () => {
            newMessageModal.classList.add(
                "active"
            );

            followingSearch.value = "";

            loadFollowingUsers();
        }
    );

    closeNewMessage.addEventListener(
        "click",
        () => {
            newMessageModal.classList.remove(
                "active"
            );
        }
    );

    async function loadFollowingUsers() {
        try {
            const response = await fetch(
                `https://isekai-bfq3.onrender.com/api/following/${user.id}`
            );

            const data =
                await response.json();

            if (!response.ok) {
                console.error(data.message);
                return;
            }

            followingUsers = data;

            displayFollowingUsers(
                followingUsers
            );
        } catch (error) {
            console.error(
                "Erreur lors du chargement des utilisateurs suivis :",
                error
            );
        }
    }

    function displayFollowingUsers(users) {
        followingList.innerHTML = "";

        if (users.length === 0) {
            followingList.innerHTML = `
                <p class="no-following">
                    Tu ne suis encore personne.
                </p>
            `;

            return;
        }

        users.forEach(followingUser => {
            const userElement =
                document.createElement("div");

            userElement.classList.add(
                "following-user"
            );

            userElement.innerHTML = `
                <img
                    src="https://isekai-bfq3.onrender.com/uploads/profile/${followingUser.photo_profil}"
                    alt="Photo de profil"
                >

                <div class="following-user-info">
                    <strong>
                        ${followingUser.pseudo}
                    </strong>

                    <span>
                        ${followingUser.nom}
                        ${followingUser.prenom}
                    </span>
                </div>
            `;

            userElement.addEventListener(
                "click",
                () => {
                    startConversation(
                        followingUser.id
                    );
                }
            );

            followingList.appendChild(
                userElement
            );
        });
    }

    followingSearch.addEventListener(
        "input",
        () => {
            const search =
                followingSearch.value.toLowerCase();

            const filtered =
                followingUsers.filter(
                    followingUser =>
                        followingUser.pseudo
                            .toLowerCase()
                            .includes(search)
                );

            displayFollowingUsers(filtered);
        }
    );

    async function startConversation(otherUserId) {
        try {
            const response = await fetch(
                "https://isekai-bfq3.onrender.com/api/conversations",
                {
                    method: "POST",
                    headers: {
                        "Content-Type":
                            "application/json"
                    },
                    body: JSON.stringify({
                        user1_id:
                            user.id,
                        user2_id:
                            otherUserId
                    })
                }
            );

            const data =
                await response.json();

            if (!response.ok) {
                console.error(data.message);
                return;
            }

            newMessageModal.classList.remove(
                "active"
            );

            await loadConversations();

            const conversation =
                data.conversation;

            const conversationFromList =
                conversations.find(
                    item =>
                        Number(
                            item.conversation_id
                        ) ===
                        Number(
                            conversation.id
                        )
                );

            if (conversationFromList) {
                openConversation(
                    conversationFromList
                );
            }
        } catch (error) {
            console.error(
                "Erreur lors de la création de la conversation :",
                error
            );
        }
    }

    function formatTime(date) {
        return new Date(date).toLocaleTimeString(
            "fr-FR",
            {
                hour: "2-digit",
                minute: "2-digit"
            }
        );
    }

    loadConversations();
});