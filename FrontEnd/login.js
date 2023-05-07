//J'ajoute event au submit du form
function submitForm() {
  const form = document.querySelector("form");
  const errorMessage = document.querySelector(".error-message");
  errorMessage.style.display = "none";

  form.addEventListener("submit", (e) => {
    e.preventDefault();

    const lien = "http://localhost:5678/api/users/login";

    const inputPassword = document.getElementById("password");
    const inputEmail = document.getElementById("email");

    //Création de l'objet utilisateur
    let utilisateur = {
      email: inputEmail.value,
      password: inputPassword.value,
    };

    //Création de la charge utile au format Json
    let chargeUtile = JSON.stringify(utilisateur);

    //Appel de la fonction fetch
    fetch(lien, {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      body: chargeUtile,
    }).then(function (response) {
      if (response.ok) {
        return response.json().then(function (finalResult) {
          console.log(finalResult);
          window.localStorage.setItem("token", finalResult.token);

          window.localStorage.setItem("userId", finalResult.userId);
          window.location = "./index.html";
        });
      } else {
        errorMessage.style.display = null;

        inputEmail.addEventListener("click", function () {
          errorMessage.style.display = "none";
        });
      }
    });
  });
}

submitForm();
