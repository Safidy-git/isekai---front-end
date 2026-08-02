document.addEventListener(
    "DOMContentLoaded",
    () => {
        const imageBtn =
            document.getElementById(
                "imageBtn"
            );

        const imageInput =
            document.getElementById(
                "imageInput"
            );

        const imagePreview =
            document.getElementById(
                "imagePreview"
            );


        function clearImagePreview() {

            imageInput.value = "";

            imagePreview.innerHTML = "";

            imagePreview.classList.remove(
                "active"
            );
        }
        window.clearImagePreview = clearImagePreview;
        imageBtn.addEventListener(
            "click",
            () => {
                imageInput.click();
            }
        );

        imageInput.addEventListener(
            "change",
            () => {
                const image =
                    imageInput.files[0];

                if (!image) {
                    return;
                }

                const imageUrl =
                    URL.createObjectURL(
                        image
                    );

                imagePreview.innerHTML = `
                    <div class="image-preview-content">

                        <img
                            src="${imageUrl}"
                            alt="Aperçu de l'image"
                        >

                        <button
                            id="removeImageBtn"
                            type="button"
                        >
                            <i
                                class="fa-solid fa-xmark"
                            ></i>
                        </button>

                    </div>
                `;

                imagePreview.classList.add(
                    "active"
                );

                const removeImageBtn =
                    document.getElementById(
                        "removeImageBtn"
                    );

                removeImageBtn.addEventListener(
                    "click",
                    () => {
                        imageInput.value =
                            "";

                        imagePreview.innerHTML =
                            "";

                        imagePreview.classList.remove(
                            "active"
                        );
                    }
                );
            }
        );
    }
);