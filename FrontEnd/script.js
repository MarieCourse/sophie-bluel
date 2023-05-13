let allProjects = []; //Test pour acceder aux projects et filtrer

const linkApi = "http://localhost:5678/api/works";
const linkApiCategories = "http://localhost:5678/api/categories";

getWorks()
  .then((data) => {
    allProjects = data;
    generateWorks(data);
    generateWorksModal(data);
  })
  .catch((error) => {
    // document.location = "./login.html";
    console.log(
      "Erreur de connexion avec le serveur, Veuillez vérifier l'état du serveur"
    );
  });

getCategories()
  .then((data) => {
    generateCategories(data);
    generateCategoriesModal(data);
  })
  .catch((error) => {
    console.log(
      "Erreur de connexion avec le serveur, Veuillez vérifier l'état du serveur"
    );
  });

//Génération des catégories à afficher

/*
  - Récupere tous les catégories
  - Affiche les données dans le DOM
*/
function generateCategories(categories) {
  getCategories().then((categories) => {
    displayGivenCategories(categories);
  });
}

//Affichage des buttons de filtrage
function displayGivenCategories(data) {
  const categoriesSet = new Set();
  const categories = document.querySelector("#filtres");

  //Création de button Tous
  let btnTous = document.createElement("button");
  btnTous.innerText = "Tous";
  btnTous.classList.add("btn-tous", "filter");
  categories.appendChild(btnTous);

  for (let i = 0; i < data.length; i++) {
    const currentCategorie = data[i].name;
    if (!categoriesSet.has(currentCategorie)) {
      const btn = document.createElement("button");
      btn.innerText = currentCategorie;
      btn.setAttribute("class", "filter");
      categories.appendChild(btn);
      categoriesSet.add(currentCategorie);
    }
  }
}

//Récuperation de données pour créer les categories depuis l'API
async function getCategories() {
  const response = await fetch(linkApiCategories);
  const categories = await response.json();
  return categories;
}

//Génération des projets à afficher

/*
  - Récuperer tous les Works
  - Affiche les données dans le DOM
*/

function generateWorks(works) {
  getWorks().then((works) => {
    displayGivenWorks(works);
  });
}

setTimeout(() => {
  worksFilter();
}, "500");

//Filtrer les works en fonction du nom
function worksFilter() {
  //Je récupère tous les filtres
  let filters = document.getElementsByClassName("filter");
  for (let i = 0; i < filters.length; i++) {
    filters[i].addEventListener("click", () => {
      let currentFilterName = filters[i].innerText;

      let filteredProjects = [];
      if ("Tous" == currentFilterName) {
        filteredProjects = allProjects;
      } else {
        filteredProjects = allProjects.filter((work) => {
          return work.category.name === currentFilterName;
        });
      }
      displayGivenWorks(filteredProjects);
    });
  }
}

// Verifier l'existence du token dans le local Storage

const logout = document.querySelector(".logout");
const unloggedHidden = document.querySelectorAll(".unlogged-hidden");
const loggedHidden = document.querySelectorAll(".logged-hidden");

logout.addEventListener("click", function () {
  checkIfTokenExist();
  window.localStorage.removeItem("token");
  window.localStorage.removeItem("userId");
  location.reload();
});

//Function pour vérifier l'existence du Token
function checkIfTokenExist() {
  return !(localStorage.getItem("token") === null);
}

//Cacher éléments du DOM selon conection
if (checkIfTokenExist()) {
  for (var i = 0; i < loggedHidden.length; i++) {
    loggedHidden[i].style.display = "none";
  }
  document.querySelector("#portfolio > div:first-child").style.marginBottom =
    "50px";
} else {
  for (var i = 0; i < unloggedHidden.length; i++) {
    unloggedHidden[i].style.display = "none";
  }
}

//Visualisation des boites modales
let modal = null;
const focusableSelector = "button, a, input, select, textarea";
let focusables = [];

//Modal 1 (Galerie)
galleryHidden = document.querySelector(".gallery-hidden");
//Modal 2 (Formulaire)
formHidden = document.querySelector(".form-hidden");
const modales = "galleryHidden, formHidden";

const openModal = function (e) {
  e.preventDefault();
  modal = document.querySelector(e.target.getAttribute("href"));
  focusables = Array.from(modal.querySelectorAll(focusableSelector));
  modal.style.display = null;
  modal.removeAttribute("aria-hidden");
  modal.setAttribute("aria-modal", "true");
  formHidden.style.display = "none";

  //Appel function fermeture de la boite
  modal.addEventListener("click", closeModal);
  modal.querySelector(".close-modal").addEventListener("click", closeModal);
  modal.querySelector(".modal-stop").addEventListener("click", stopPropagation);

  //Visualisation de la modal 2 (Formulaire)
  const buttonAddPhoto = document.querySelector(".gallery-hidden .btn-vert");
  buttonAddPhoto.addEventListener("click", function () {
    displayModalFormulaireAjout();
  });

  //Revenir à la modal 1 (galerie)
  const goBack = document.querySelector(".fa-arrow-left-long");
  goBack.addEventListener("click", function () {
    // Réinitialiser les valeurs
    viderInputsValues();

    // Cacher le preview de l'image
    if (document.querySelector(".nouvelle-image")) {
      document.querySelector(".nouvelle-image").style.display = "none";
    }

    // Appel a function afficher la modal 1 et cacher la modal 2
    displayModalGalerie();
  });
};

function displayModalGalerie() {
  galleryHidden.style.display = null;
  formHidden.style.display = "none";
}

function displayModalFormulaireAjout() {
  galleryHidden.style.display = "none";
  formHidden.style.display = null;
}

//Function pour fermeture de la boite modale
const closeModal = function (e) {
  if (modal === null) return;
  e.preventDefault();
  viderInputsValues();
  displayModalGalerie();
  modal.style.display = "none";
  modal.setAttribute("aria-hidden", "true");
  modal.removeAttribute("aria-modal");
  modal.removeEventListener("click", closeModal);
  modal.querySelector(".close-modal").removeEventListener("click", closeModal);
  modal
    .querySelector(".modal-stop")
    .removeEventListener("click", stopPropagation);
  modal = null;
};

//Vider les inputs du formulaire modal2
function viderInputsValues() {
  if (inputTitle || selectCategory) {
    inputTitle.value = "";
    inputPreview.style.opacity = "1";
  }

  // Cacher le preview de l'image
  if (document.querySelector(".nouvelle-image")) {
    document.querySelector(".nouvelle-image").style.display = "none";
  }
}

//Evite que la boite se ferme quand on click dessous
const stopPropagation = function (e) {
  e.stopPropagation();
};

//Tab sur les différents éléments de la modale
const focusInModal = function (e) {
  e.preventDefault();
  let index = focusables.findIndex((f) => f === modal.querySelector(":focus"));
  if (e.shiftKey === true) {
    index--;
  } else {
    index++;
  }
  if (index >= focusables.length) {
    index = 0;
  }
  if (index < 0) {
    index = focusables.length - 1;
  }
  focusables[index].focus();
};

//Ouverture de la modal
document.querySelector(".open-modal").addEventListener("click", openModal);

//Fermeture de la boite avec la touche Escape
window.addEventListener("keydown", function (e) {
  if (e.key === "Escape" || e.key === "Esc") {
    closeModal(e);
  }
  if (e.key === "Tab" && modal !== null) {
    focusInModal(e);
  }
});

//Création de la galerie dans la boite modale
const galleryModal = document.querySelector("#galerie-modal");

function generateWorksModal() {
  getWorks().then((works) => {
    galleryModal.innerHTML = "";
    for (let i = 0; i < works.length; i++) {
      const article = works[i];
      const figure = document.createElement("figure");
      galleryModal.appendChild(figure);
      const trash = document.createElement("i");
      trash.className = "fa-regular fa-trash-can";
      figure.appendChild(trash);
      const image = document.createElement("img");
      image.src = article.imageUrl;
      figure.appendChild(image);
      //function pour faire apparaitre l'icone d'expansion de l'image
      let expand;
      image.addEventListener("pointerover", function () {
        expand = document.createElement("i");
        expand.className = "fa-solid fa-arrows-up-down-left-right";
        figure.appendChild(expand);
      });
      image.addEventListener("pointerout", function () {
        figure.removeChild(expand);
      });
      const figcaption = document.createElement("figcaption");
      figcaption.innerText = "éditer";
      figure.appendChild(figcaption);
      trash.addEventListener("click", function () {
        if (confirm("Êtes-vous sûr de vouloir supprimer le projet?")) {
          galleryModal.removeChild(figure);
          let id = works[i].id;
          fetch(linkApi + "/" + id, {
            method: "DELETE",
            headers: {
              Accept: "*/*",
              Authorization: `Bearer ${window.localStorage.token}`,
            },
          }).then((res) => {
            if (res.ok) {
              // Mettre à jour le tableau "works" en supprimant le projet
              works.splice(i, 1);
              generateWorksModal(works);
              generateWorks(works);
            } else {
              returnToLogin(res.status);
              alert("Le projet n'a pas pu etre supprimé. Veuillez réessayer");
            }
          });
        }
      });
    }
  });
}

//On cache le button de l'input "file" par default
const inputFile = document.querySelector('input[type = "file"]');
inputFile.style.display = "none";

//Création des balises pour le formulaire modal2
const formElement = document.querySelector(".form-hidden form");
const formModal = document.querySelector("#form-modal");

//Ajout de la balise Titre
const labelTitle = document.createElement("label");
labelTitle.innerText = "Titre";
labelTitle.setAttribute("for", "title");
const inputTitle = document.createElement("input");
inputTitle.setAttribute("required", true);
inputTitle.id = "title";
inputTitle.name = "title";
inputTitle.type = "text";

formModal.appendChild(labelTitle);
formModal.appendChild(inputTitle);

//Ajout de la balise Categorie
const labelCategory = document.createElement("label");
labelCategory.innerText = "Catégorie";
labelCategory.setAttribute("for", "category");
const selectCategory = document.createElement("select");
selectCategory.setAttribute("required", true);
selectCategory.id = "category";
selectCategory.name = "category";

formModal.appendChild(labelCategory);
formModal.appendChild(selectCategory);

//Ajout du button Submit
const submitButton = document.createElement("input");
submitButton.classList.add("btn-vert");
submitButton.type = "button";
submitButton.value = "Valider";
submitButton.disabled = true;
submitButton.setAttribute("id", "valid-form");

formElement.appendChild(submitButton); //

//Récuperation des catégories depuis l'API
function generateCategoriesModal(data) {
  getCategories().then((data) => {
    const categoriesSet = new Set();

    //Création des options d'après les données recuperées depuis l'API
    for (let i = 0; i < data.length; i++) {
      const currentCategorie = data[i].name;
      let categoryId = data[i].id;
      if (!categoriesSet.has(currentCategorie)) {
        const option = document.createElement("option");
        option.innerText = currentCategorie;
        option.setAttribute("value", categoryId);
        selectCategory.appendChild(option);
        categoriesSet.add(currentCategorie);
      }
    }
  });
}

//Ajouter une nouvelle photo
//Container button + image
const imagePreview = document.querySelector("#preview-image");
//Container button et icone pour selectionner le fichier
const inputPreview = document.querySelector(".preview-input");
const inputImage = document.querySelector(".preview-input input");

//Utiliser le container pour choisir le fichier
inputPreview.addEventListener("click", function () {
  document.getElementById("file").click();
});

// Faire apparaitre l'image selectionnée
inputImage.addEventListener("change", function () {
  const image = inputImage.files[0];
  const reader = new FileReader();
  //Vérification de la taille du fichier
  const fileSize = image.size;
  const maxSize = 4 * 1024 * 1024;

  if (fileSize > maxSize) {
    alert(
      "Le fichier sélectionné est trop volumineux. Le poids maximum autorisé est de 4 Mo"
    );
    inputImage.value = "";
  }
  let allowedExtension = ["image/png", "image/jpeg", "image/jpg"];
  if (!allowedExtension.includes(image.type)) {
    alert(
      "Le format de fichier choisi n'est pas autorisé. Veuillez choisir un fichier en format .JPG, .JPEG ou .PNG"
    );
    inputImage.value = "";
  } else {
    reader.onload = function (e) {
      const img = new Image();
      img.src = e.target.result;
      img.classList.add("nouvelle-image");

      // Supprime l'ancienne image de la zone d'aperçu
      const previousImage = document.querySelector(".nouvelle-image");
      if (previousImage) {
        previousImage.remove();
      }

      imagePreview.appendChild(img);
    };
    //On cache le button mais reste cliquable
    imagePreview.style.position = "relative";
    inputPreview.style.position = "absolute";
    inputPreview.style.opacity = "0";
    inputPreview.style.zIndex = "1";

    reader.readAsDataURL(image);
  }
});

//Activer le button Valider quand le formulaire est rempli
function checkValidForm() {
  if (
    document.querySelector("#file").files.length === 0 ||
    document.querySelector("#title").value === "" ||
    document.querySelector("#category").value === ""
  ) {
    submitButton.disabled = true;
  } else {
    submitButton.disabled = false;
  }
}

document.querySelector("#file").addEventListener("change", checkValidForm);
document.querySelector("#title").addEventListener("input", checkValidForm);
document.querySelector("#category").addEventListener("change", checkValidForm);

submitButton.addEventListener("click", function (e) {
  e.preventDefault();
  let formData = new FormData();

  let newProjetImage = document.querySelector("#file").files[0];
  let newProjetTitle = document.querySelector("#title").value;
  let newProjetCategory = document.querySelector("#category").value;

  formData.append("image", newProjetImage);
  formData.append("title", newProjetTitle);
  formData.append("category", newProjetCategory);

  //Envoyer la requete à l'API
  fetch(linkApi, {
    method: "POST",
    body: formData,
    headers: {
      Authorization: `Bearer ${window.localStorage.token}`,
    },
  }).then((res) => {
    if (res.ok) {
      return res.json().then((data) => {
        //On retourne à la modal 1
        displayModalGalerie();
        //Génération des projets sur la modal
        generateWorksModal();
        //Génération des projets sur la galerie
        generateWorks();
      });
    } else {
      returnToLogin(res.status);
      alert("Une erreur s'est produite");
    }
  });
});

function returnToLogin(errorCode) {
  if (errorCode == 401) {
    alert("Veuillez vous reconecter");
    document.location = "./login.html";
  }
}

//Function qui récupère tous les works
async function getWorks() {
  const response = await fetch(linkApi);
  const works = await response.json();
  return works;
}

//Display works in the DOM
function displayGivenWorks(worksToDisplay) {
  // Récupération de l'élément du DOM qui accueillera les fiches
  const gallery = document.querySelector(".gallery");
  gallery.innerHTML = "";
  for (let i = 0; i < worksToDisplay.length; i++) {
    const article = worksToDisplay[i];
    // Création d’une balise dédiée à un projet
    const figure = document.createElement("figure");
    gallery.appendChild(figure);
    //Création des balises
    const imageElement = document.createElement("img");
    imageElement.src = article.imageUrl;
    imageElement.alt = article.title;
    figure.appendChild(imageElement);

    //Création de l'élement figcaption
    const figcaption = document.createElement("figcaption");
    figcaption.innerText = article.title;
    figure.appendChild(figcaption);
  }
}
