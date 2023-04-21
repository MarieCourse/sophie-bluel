let allProjects = []; //Test pour acceder aux projects et filtrer

const lienApi = "http://localhost:5678/api/works";

const reponse = fetch(lienApi).then((res) => {
  // if(res.ok == true)

  if (res.ok) {
    return res.json().then(function (data) {
      allProjects = data; //Réutiliser pour le filtre Tous
      //console.log(allProjects);
      genererWorks(data);
      genererCategories(data);
      genererWorksModal(data);
      genererCategoriesModal(data);
    });
  } else {
    console.log(
      "Erreur de conection avec le serveur - Impossible d'afficher les projects"
    );
  }
});

//Création des buttons de filtrage
function genererCategories(data) {
  const categoriesSet = new Set();
  const categories = document.querySelector("#filtres");

  //Création de button Tous
  let btnTous = document.createElement("button");
  btnTous.innerText = "Tous";
  btnTous.classList.add("btn-tous", "filter");
  categories.appendChild(btnTous);

  //Création des autres buttons
  //Avec cette méthode les boutons se creent plusieurs fois

  /*
  for (let i = 0; i < data.length; i++) {
    let currentButton = document.createElement("button");
    currentButton.innerText = data[i].category.name;
    currentButton.setAttribute("class", "filter");
    categories.appendChild(currentButton);
  }
  */

  for (let i = 0; i < data.length; i++) {
    const currentCategorie = data[i].category.name;
    if (!categoriesSet.has(currentCategorie)) {
      const btn = document.createElement("button");
      btn.innerText = currentCategorie;
      btn.setAttribute("class", "filter");
      categories.appendChild(btn);
      categoriesSet.add(currentCategorie);
    }
  }
}

//Génération des projets à afficher
function genererWorks(works) {
  for (let i = 0; i < works.length; i++) {
    const article = works[i];

    // Récupération de l'élément du DOM qui accueillera les fiches
    const gallery = document.querySelector(".gallery");
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

setTimeout(() => {
  worksFilter();
}, "500");

//Filter les works en fonction du nom
function worksFilter() {
  //Je récupère tous les filtres
  let filters = document.getElementsByClassName("filter");
  for (let i = 0; i < filters.length; i++) {
    filters[i].addEventListener("click", () => {
      console.log(filters[i]);
      let currentFilterName = filters[i].innerText;

      let filteredProjects = [];
      if ("Tous" == currentFilterName) {
        filteredProjects = allProjects;
      } else {
        filteredProjects = allProjects.filter((work) => {
          return work.category.name === currentFilterName;
        });
      }

      console.log(filteredProjects);
      const gallery = document.querySelector(".gallery");
      gallery.innerHTML = "";
      genererWorks(filteredProjects);
    });
  }
}

//Visualisation de la boite modale
let modal1 = null;
const focusableSelector = "button, a, input, select, textarea";
let focusables = [];

const openModal = function (e) {
  e.preventDefault();
  modal1 = document.querySelector(e.target.getAttribute("href"));
  formHidden = document.querySelector(".form-hidden");
  galleryHidden = document.querySelector(".gallery-hidden");

  focusables = Array.from(modal1.querySelectorAll(focusableSelector));
  modal1.style.display = null;
  modal1.removeAttribute("aria-hidden");
  modal1.setAttribute("aria-modal", "true");
  formHidden.style.display = "none";

  //Appel function fermeture de la boite
  modal1.addEventListener("click", closeModal);
  modal1.querySelector(".close-modal").addEventListener("click", closeModal);
  modal1
    .querySelector(".modal-stop")
    .addEventListener("click", stopPropagation);

  //Visualisation de la modal "ajout photo"
  const btnAjouterPhoto = document.querySelector(".gallery-hidden .btn-vert");
  btnAjouterPhoto.addEventListener("click", function () {
    galleryHidden.style.display = "none";
    formHidden.style.display = null;
  });

  //Revenir à la modal "galerie"
  const revenir = document.querySelector(".fa-arrow-left-long");
  revenir.addEventListener("click", function () {
    galleryHidden.style.display = null;
    formHidden.style.display = "none";
  });
};

//Function pour fermeture de la boite modale
const closeModal = function (e) {
  if (modal1 === null) return;
  e.preventDefault();
  modal1.style.display = "none";
  modal1.setAttribute("aria-hidden", "true");
  modal1.removeAttribute("aria-modal");
  modal1.removeEventListener("click", closeModal);
  modal1.querySelector(".close-modal").removeEventListener("click", closeModal);
  modal1
    .querySelector(".modal-stop")
    .removeEventListener("click", stopPropagation);
  modal1 = null;
};

//Evite que la boite se ferme quand on click dessous
const stopPropagation = function (e) {
  e.stopPropagation();
};

//Tab sur les différents éléments de la modale
const focusInModal = function (e) {
  e.preventDefault();
  let index = focusables.findIndex((f) => f === modal1.querySelector(":focus"));
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

document.querySelector(".open-modal").addEventListener("click", openModal);

//Fermeture de la boite avec la touche Escape
window.addEventListener("keydown", function (e) {
  if (e.key === "Escape" || e.key === "Esc") {
    closeModal(e);
  }
  if (e.key === "Tab" && modal1 !== null) {
    focusInModal(e);
  }
});

//Creation de galerie dans la boite modale
function genererWorksModal(works) {
  for (let i = 0; i < works.length; i++) {
    const article = works[i];

    const gallery = document.querySelector("#galerie-modal");

    const figure = document.createElement("figure");
    gallery.appendChild(figure);

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

    //Delete d'un projet
    trash.addEventListener("click", function () {
      if (confirm("Êtes-vous sûr de vouloir supprimer le projet?")) {
        gallery.removeChild(figure);
        id = article.id;
        fetch(lienApi + "/" + id, {
          method: "DELETE",
          headers: {
            Accept: "*/*",
            Authorization: `Bearer ${window.localStorage.token}`,
          },
        }).then((res) => {
          if (res.ok) {
            alert("Le projet a été supprimé correctement");
            location.reload();
          } else {
            alert("Le projet n'a pas pu etre supprimé. Veuillez réessayer");
          }
        });
      }
    });
  }
}

// Verifier l'existence du token dans le local Storage

const logout = document.querySelector(".logout");
const unloggedHidden = document.querySelectorAll(".unlogged-hidden");
const loggedHidden = document.querySelectorAll(".logged-hidden");

logout.addEventListener("click", function () {
  checkIfTokenExit();
  window.localStorage.removeItem("token");
  window.localStorage.removeItem("userId");
  location.reload();
});

//Function pour vérifier l'existence du Token
function checkIfTokenExit() {
  return !(localStorage.getItem("token") === null);
}

//Cacher éléments du DOM selon conection
if (checkIfTokenExit()) {
  for (var i = 0; i < loggedHidden.length; i++) {
    loggedHidden[i].style.display = "none";
  }
} else {
  for (var i = 0; i < unloggedHidden.length; i++) {
    unloggedHidden[i].style.display = "none";
  }
}

//On cache le button par default de l'input "file"
const inputFile = document.querySelector('input[type = "file"]');
inputFile.style.display = "none";

//Création des balises pour le formulaire modal2
const formElement = document.querySelector(".form-hidden form");
const formModal = document.querySelector("#form-modal");
//Balise Titre
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
const buttonValider = document.createElement("input");
buttonValider.classList.add("btn-vert");
buttonValider.type = "button";
buttonValider.value = "Valider";
buttonValider.disabled = true;
buttonValider.setAttribute("id", "valid-form");
formElement.appendChild(buttonValider); //

//Récuperation des catégories depuis l'API
function genererCategoriesModal(data) {
  const categoriesSet = new Set();

  for (let i = 0; i < data.length; i++) {
    const currentCategorie = data[i].category.name;
    let categoryId = data[i].category.id;
    if (!categoriesSet.has(currentCategorie)) {
      const option = document.createElement("option");
      option.innerText = currentCategorie;
      option.setAttribute("value", categoryId);
      selectCategory.appendChild(option);
      categoriesSet.add(currentCategorie);
    }
  }
}

//Ajouter une nouvelle photo
//Container button + image
const previewImage = document.querySelector("#preview-image");
//Container button et icone pour selectionner le fichier
const previewInput = document.querySelector(".preview-input");
const inputImage = document.querySelector(".preview-input input");

//Utiliser le container pour choisir le fichier
previewInput.addEventListener("click", function () {
  document.getElementById("file").click();
});

// const btnAjouterFichier = document.querySelector(".form-hidden div button");
// btnAjouterFichier.classList.add("file-input-button");
// btnAjouterFichier.addEventListener("click", function () {
//   document.getElementById("file").click();
// });

// Faire apparaitre l'image selectionnée
inputImage.addEventListener("change", function () {
  const image = inputImage.files[0];
  const reader = new FileReader();
  //Vérification de la taille de fichier
  const fileSize = image.size;
  const maxSize = 4 * 1024 * 1024;

  if (fileSize > maxSize) {
    alert(
      "Le fichier sélectionné est trop volumineux. Le poids maximum autorisé est de 4 Mo"
    );
    inputImage.value = "";
  }
  if ((image.type !== ".jpg", ".jpeg", ".png")) {
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
      const ancienneImage = document.querySelector(".nouvelle-image");
      if (ancienneImage) {
        ancienneImage.remove();
      }

      previewImage.appendChild(img);
    };
    //On cache le button mais reste cliquable
    previewImage.style.position = "relative";
    previewInput.style.position = "absolute";
    previewInput.style.opacity = "0";
    previewInput.style.zIndex = "1";

    reader.readAsDataURL(image);
  }
});

//Activer le button Valider quand le formulaire est rempli
function verifierValidForm() {
  if (
    document.querySelector("#file").files.length === 0 ||
    document.querySelector("#title").value === ""
  ) {
    buttonValider.disabled = true;
  } else {
    buttonValider.disabled = false;
  }
}

document.querySelector("#file").addEventListener("change", verifierValidForm);
document.querySelector("#title").addEventListener("input", verifierValidForm);

buttonValider.addEventListener("click", function (e) {
  e.preventDefault();
  let formData = new FormData();

  let newProjetImage = document.querySelector("#file").files[0];
  let newProjetTitle = document.querySelector("#title").value;
  let newProjetCategory = document.querySelector("#category").value;

  formData.append("image", newProjetImage);
  formData.append("title", newProjetTitle);
  formData.append("category", newProjetCategory);

  console.log(formData);

  console.log(formData.get("image"));
  console.log(formData.get("title"));
  console.log(formData.get("category"));

  //Envoyer la requete à l'API
  fetch(lienApi, {
    method: "POST",
    body: formData,
    headers: {
      Authorization: `Bearer ${window.localStorage.token}`,
    },
  }).then((res) => {
    if (res.ok) {
      return res.json().then((data) => {
        alert("Le projet à été envoyé correctement");
        location.reload(); //La page s'actualise automatiquement pour afficher le nouveau projet
      });
    } else {
      alert("Une erreur s'est produite");
      console.log(res);
    }
  });
});
