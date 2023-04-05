//J'ajoute event quand on submit le formulaire
//J'essaye d'améliorer la méthode en bas
/*form.addEventListener("submit", (e) => {
  e.preventDefault();*/

//Je récupére les données des inputs (ok)
/*let emailData = "";
  let passwordData = "";
  
  email.addEventListener("input", (e) => {
    emailData = e.target.value;
  });
  
  password.addEventListener("input", (e) => {
    passwordData = e.target.value;
  });
*/

//J'ajoute event au submit du form
function submitForm() {
  const form = document.querySelector("form");
  form.addEventListener("submit", (e) => {
    e.preventDefault();

    const lien = "http://localhost:5678/api/users/login";
    let userEmail = document.getElementById("email").value;

    let userPassword = document.getElementById("password").value;

    //Création de l'objet utilisateur
    let utilisateur = {
      email: userEmail,
      password: userPassword,
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
          window.localStorage.setItem("token", finalResult.token); //NB toujours tester la présence de la propriété

          window.localStorage.setItem("userId", finalResult.userId);
          window.location = "/FrontEnd/index.html";
        });
      } else {
        alert("Erreur dans l’identifiant ou le mot de passe");
      }
    });
  });
}

submitForm();
