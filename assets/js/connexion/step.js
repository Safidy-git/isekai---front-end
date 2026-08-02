document.querySelector("form").addEventListener("submit", async (e) => {

    e.preventDefault();

    const identifier = document.querySelector('input[type="text"]').value;
    const password = document.querySelector('input[type="password"]').value;

    if (!identifier || !password) {
        alert("Remplis tous les champs");
        return;
    }

    try {

        const res = await fetch("https://isekai-bfq3.onrender.com/api/login", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                identifier: identifier, 
                password: password
            })
        });

        const result = await res.json();

        if (!res.ok) {
            alert(result.message || "Erreur de connexion");
            return;
        }

        localStorage.setItem("user", JSON.stringify(result.user));

        localStorage.setItem(
            "user_id",
            result.user.id
        );

        window.location.href = "home.html";

    } catch (error) {
        console.error(error);
        alert("Serveur inaccessible");
    }

});