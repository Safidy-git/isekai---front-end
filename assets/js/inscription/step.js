const steps = document.querySelectorAll(".form-step");
const nextBtns = document.querySelectorAll(".next-btn");
const prevBtns = document.querySelectorAll(".prev-btn");

let currentStep = 0;

function showStep(step){
    steps.forEach((s, i) => {
        s.classList.toggle("active", i === step);
    });
}

nextBtns.forEach(btn => {
    btn.addEventListener("click", () => {

       
        const inputs = steps[currentStep].querySelectorAll("input, select");
        for(let input of inputs){
            if(input.value === ""){
                alert("Remplis tous les champs");
                return;
            }
        }

        if(currentStep < steps.length - 1){
            currentStep++;
            showStep(currentStep);
        }

    });
});

prevBtns.forEach(btn => {
    btn.addEventListener("click", () => {
        if(currentStep > 0){
            currentStep--;
            showStep(currentStep);
        }
    });
});

document.getElementById("multiStepForm").addEventListener("submit", (e) => {

    const pass = document.getElementById("password").value;
    const confirm = document.getElementById("confirm_password").value;

    if(pass !== confirm){
        e.preventDefault();
        alert("Les mots de passe ne correspondent pas");
    }

});
document.getElementById("multiStepForm").addEventListener("submit", async (e) => {

    e.preventDefault();

    const pass = document.getElementById("password").value;
    const confirm = document.getElementById("confirm_password").value;

    if (pass !== confirm) {
        alert("Les mots de passe ne correspondent pas");
        return;
    }

    const data = {
        nom: document.getElementById("nom").value,
        prenom: document.getElementById("prenom").value,
        pseudo: document.getElementById("pseudo").value,
        email: document.getElementById("email").value,
        telephone: document.getElementById("telephone").value,
        date_naissance: document.getElementById("date_naissance").value,
        password: pass,
        sexe: document.getElementById("sexe").value,
        nationalite: document.getElementById("nationalite").value
    };

    const res = await fetch("https://isekai-bfq3.onrender.com/api/register", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(data)
    });

    const result = await res.json();
    localStorage.setItem("user", JSON.stringify(result.user));
    window.location.href = "bienvenu.html";
});