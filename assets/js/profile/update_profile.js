const user = JSON.parse(localStorage.getItem("user"));

if (!user) {
    window.location.href = "index.html";
}

const profile = document.getElementById("profile-preview");

document.getElementById("user_name").innerText =
    user.nom + " " + user.prenom;

document.getElementById("name").value =
    user.nom ;
document.getElementById("surname").value =
    user.prenom ;

document.getElementById("username-input").value =
    user.pseudo;

document.getElementById("bio").value =
    user.description || "";

profile.src =
    `https://isekai-bfq3.onrender.com/uploads/profile/${user.photo_profil}`;






document.querySelector(".edit-profile-form").addEventListener("submit", async (e) => {
    e.preventDefault();

    const user = JSON.parse(localStorage.getItem("user"));

    const formData = new FormData();

    formData.append("id", user.id);
    formData.append("nom", document.getElementById("name").value);
    formData.append("prenom", document.getElementById("surname").value);
    formData.append("pseudo", document.getElementById("username-input").value);
    formData.append("bio", document.getElementById("bio").value);

    const file = document.getElementById("file-upload").files[0];
    if (file) {
        formData.append("photo", file);
    }

    const res = await fetch("https://isekai-bfq3.onrender.com/api/profile/update", {
        method: "POST",
        body: formData
    });

    const result = await res.json();

    
    localStorage.setItem("user", JSON.stringify(result.user));

    alert("Profil mis à jour !");
    location.reload();
});