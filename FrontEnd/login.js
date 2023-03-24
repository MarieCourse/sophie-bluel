const lien = "http://localhost:5678/api/users/login";
const form = document.querySelector("form");
const email = document.querySelector("input[type='email']");
const password = document.querySelector("input[type='password']");

//J'ajoute event quand on submit le formulaire
//J'essaye d'améliorer la méthode
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
  form.addEventListener("submit", (e) => {
    e.preventDefault();

    //Création de l'objet utilisateur
    const utilisateur = {
      email: e.target.email.value,
      password: e.target.password.value,
    };

    //Création de la charge utile au format Json
    const chargeUtile = JSON.stringify(utilisateur);
    //Appel de la fonction fetch
    fetch(lien, {
      method: "POST",
      headers: { Allow: POST, "Content-Type": "application/json" },
      body: chargeUtile,
    });
  });
}

//“Erreur dans l’identifiant ou le mot de passe”
