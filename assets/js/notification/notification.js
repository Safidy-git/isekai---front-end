document.addEventListener(
    "DOMContentLoaded",
    loadNotifications
);


async function loadNotifications(){

    const user =
    JSON.parse(
        localStorage.getItem("user")
    );


    if(!user){

        window.location.href =
        "index.html";

        return;

    }


    try{

        // marquer toutes les notifications comme lues

        await fetch(
            `https://isekai-bfq3.onrender.com/api/notifications/read/${user.id}`,
            {
                method:"PUT"
            }
        );


        const response =
        await fetch(
            `https://isekai-bfq3.onrender.com/api/notifications/${user.id}`
        );


        const notifications =
        await response.json();


        displayNotifications(
            notifications
        );

    }
    catch(error){

        console.error(
            "Erreur chargement notifications :",
            error
        );

    }

}



function displayNotifications(
    notifications
){

    const container =
    document.getElementById(
        "notificationList"
    );


    container.innerHTML = "";


    if(notifications.length === 0){

        container.innerHTML = `

            <p>
                Aucune notification
            </p>

        `;

        return;

    }


    notifications.forEach(
        notification=>{

            const div =
            document.createElement(
                "div"
            );


            div.className =
            "notification-item";


            if(notification.is_read == 0){

                div.classList.add(
                    "unread"
                );

            }


            const photo =
            notification.photo_profil
            ?
            `https://isekai-bfq3.onrender.com/uploads/profile/${notification.photo_profil}`
            :
            "default.png";


            div.innerHTML = `

                <img
                src="${photo}">

                <div>

                    <strong>
                        ${notification.pseudo}
                    </strong>

                    <p>
                        ${notification.message}
                    </p>

                    <small>
                        ${new Date(
                            notification.created_at
                        ).toLocaleString()}
                    </small>

                </div>

            `;


            div.onclick = ()=>{

                openNotification(
                    notification
                );

            };


            container.appendChild(
                div
            );

        }
    );

}



// ======================
// REDIRECTION PROFIL
// ======================

function openNotification(
    notification
){

    window.location.href =
    `profil.html?id=${notification.sender_id}`;

}