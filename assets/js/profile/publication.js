document.addEventListener("DOMContentLoaded", () => {

    const user = JSON.parse(localStorage.getItem("user"));

    if (!user) {
        window.location.href = "index.html";
        return;
    }

    // USER INFO
    document.getElementById("userName").innerText = user.pseudo;
    document.getElementById("userPhoto").src =
        `https://isekai-bfq3.onrender.com/uploads/profile/${user.photo_profil}`;

    const imageInput = document.getElementById("image");
    const preview = document.getElementById("imagePreview");
    const publishBtn = document.getElementById("publishBtn");
    const contentInput = document.getElementById("content");

    let selectedFile = null;

    // TOAST
    function showToast(msg, type = "success") {
        const toast = document.getElementById("toast");
        toast.innerText = msg;
        toast.className = "toast show " + type;

        setTimeout(() => {
            toast.className = "toast";
        }, 2500);
    }

    // IMAGE PREVIEW
    imageInput.addEventListener("change", (e) => {

        selectedFile = e.target.files[0];

        if (selectedFile) {
            const reader = new FileReader();

            reader.onload = (event) => {
                preview.innerHTML = `<img src="${event.target.result}">`;
            };

            reader.readAsDataURL(selectedFile);
        }
    });

    // ENABLE BUTTON
    function checkForm() {
        publishBtn.disabled = !(contentInput.value.trim() || selectedFile);
    }

    contentInput.addEventListener("input", checkForm);
    imageInput.addEventListener("change", checkForm);

    // PUBLISH
    publishBtn.addEventListener("click", async () => {

        const location = document.getElementById("location").value;

        const formData = new FormData();
        formData.append("user_id", user.id);
        formData.append("content", contentInput.value);
        formData.append("location", location);

        if (selectedFile) {
            formData.append("image", selectedFile);
        }

        try {

            publishBtn.disabled = true;
            publishBtn.innerText = "Publication...";

            showToast("Publication en cours...", "loading");

            const res = await fetch("https://isekai-bfq3.onrender.com/api/posts", {
                method: "POST",
                body: formData
            });

            const text = await res.text();
            console.log("REPONSE SERVER:", text);

            if (res.ok) {

                showToast("Publication réussie ✔", "success");

                contentInput.value = "";
                document.getElementById("location").value = "";
                preview.innerHTML = `
                    <div class="preview-placeholder">
                        <i class="fa-regular fa-image"></i>
                        <span>Aucune image</span>
                    </div>
                `;

                selectedFile = null;

                checkForm();

            } else {
                showToast("Erreur publication", "error");
            }

        } catch (err) {
            showToast("Erreur serveur", "error");
        }

        publishBtn.disabled = false;
        publishBtn.innerText = "Publier";
    });

});