document.addEventListener(
    "DOMContentLoaded",
    () => {

        loadNotificationBadge();

        setInterval(
            loadNotificationBadge,
            5000
        );

    }
);


async function loadNotificationBadge(){

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
            `https://isekai-bfq3.onrender.com/api/notifications/count/${user.id}`
        );


        const data =
        await response.json();



        const badge =
        document.getElementById(
            "notificationBadge"
        );



        if(!badge){

            return;

        }



        if(data.total > 0){


            badge.style.display =
            "flex";


            badge.textContent =
            data.total;


        }
        else{


            badge.style.display =
            "none";


        }



    }
    catch(error){


        console.error(
            "Erreur chargement badge notifications :",
            error
        );


    }

}



// ======================
// REDIRECTION NOTIFICATION
// ======================

function notification_redirection(){

    window.location.href =
    "notification.html";

}