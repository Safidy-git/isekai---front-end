document.addEventListener("DOMContentLoaded", () => {
    const user = JSON.parse(
        localStorage.getItem("user")
    );

    if (!user) {
        window.location.href = "index.html";
        return;
    }

    const storyForm =
        document.getElementById("storyForm");

    const storyImage =
        document.getElementById("storyImage");

    const storyPreview =
        document.getElementById("storyPreview");

    const uploadPlaceholder =
        document.getElementById("uploadPlaceholder");

    const largeStoryPreview =
        document.getElementById("largeStoryPreview");

    const emptyPreview =
        document.getElementById("emptyPreview");

    const storyText =
        document.getElementById("storyText");

    const previewText =
        document.getElementById("previewText");

    const storyMessage =
        document.getElementById("storyMessage");

    storyImage.addEventListener(
        "change",
        () => {
            const file =
                storyImage.files[0];

            if (!file) {
                return;
            }

            const imageUrl =
                URL.createObjectURL(file);

            storyPreview.src =
                imageUrl;

            storyPreview.style.display =
                "block";

            uploadPlaceholder.style.display =
                "none";

            largeStoryPreview.src =
                imageUrl;

            largeStoryPreview.style.display =
                "block";

            emptyPreview.style.display =
                "none";
        }
    );

    storyText.addEventListener(
        "input",
        () => {
            const text =
                storyText.value.trim();

            if (text === "") {
                previewText.textContent =
                    "";

                previewText.style.display =
                    "none";

                return;
            }

            previewText.textContent =
                text;

            previewText.style.display =
                "block";
        }
    );

    storyForm.addEventListener(
        "submit",
        async (event) => {
            event.preventDefault();

            const file =
                storyImage.files[0];

            if (!file) {
                storyMessage.textContent =
                    "Veuillez sélectionner une image";

                return;
            }

            const formData =
                new FormData();

            formData.append(
                "user_id",
                user.id
            );

            formData.append(
                "image",
                file
            );

            formData.append(
                "text_content",
                storyText.value.trim()
            );

            try {
                storyMessage.textContent =
                    "Publication en cours...";

                const response =
                    await fetch(
                        "https://isekai-bfq3.onrender.com/api/stories",
                        {
                            method: "POST",
                            body: formData
                        }
                    );

                const result =
                    await response.json();

                if (!response.ok) {
                    throw new Error(
                        result.message
                    );
                }

                storyMessage.textContent =
                    "Story publiée avec succès";

                storyForm.reset();

                storyPreview.src =
                    "";

                storyPreview.style.display =
                    "none";

                uploadPlaceholder.style.display =
                    "flex";

                largeStoryPreview.src =
                    "";

                largeStoryPreview.style.display =
                    "none";

                emptyPreview.style.display =
                    "flex";

                previewText.textContent =
                    "";

                previewText.style.display =
                    "none";

            } catch (error) {
                console.error(
                    "Erreur publication story :",
                    error
                );

                storyMessage.textContent =
                    error.message ||
                    "Erreur lors de la publication";
            }
        }
    );
});