let allProjects = []; //Test pour acceder aux projects et filtrer

const reponse = fetch("http://localhost:5678/api/works").then((res) => {
  // if(res.ok == true)

  if (res.ok) {
    return res.json().then(function (data) {
      allProjects = data; //Réutiliser pour le filtre Tous
      console.log(allProjects);
      genererWorks(data);
      genererCategories(data);
      genererWorksModal(data);
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
  console.log(filters);
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
let modal = null;
const focusableSelector = "button, a, input, textarea";
let focusables = [];

const openModal = function (e) {
  e.preventDefault();
  modal = document.querySelector(e.target.getAttribute("href"));
  focusables = Array.from(modal.querySelectorAll(focusableSelector));
  modal.style.display = null;
  modal.removeAttribute("aria-hidden");
  modal.setAttribute("aria-modal", "true");
  //Fermeture de la boite
  modal.addEventListener("click", closeModal);
  modal.querySelector(".close-modal").addEventListener("click", closeModal);
  modal.querySelector(".modal-stop").addEventListener("click", stopPropagation);
};

//Fermeture de la boite modale
const closeModal = function (e) {
  if (modal === null) return;
  e.preventDefault();
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
  }
}

// //Verifier l'existence du token dans le local Storage
// function checkIfTokenExit() {
//   const unloggedHidden = document.querySelectorAll(".unlogged-hidden");
//   console.log(unloggedHidden);
//   return !(localStorage.getItem("token") === null);
// }

// if (checkIfTokenExit()) {
//   alert("Un token exist");
// } else {
//   alert("pas de token trouvé");
// }

//Pour la fonction logout il faut effacer les données de connexion dans le localStorage (token, id)
