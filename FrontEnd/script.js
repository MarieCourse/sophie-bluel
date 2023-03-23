let allProjects = []; //Test pour acceder aux projects et filtrer

const reponse = fetch("http://localhost:5678/api/works").then((res) => {
  // if(res.ok == true)

  if (res.ok) {
    return res.json().then(function (data) {
      allProjects = data; //Réutiliser pour le filtre Tous
      console.log(allProjects);
      genererWorks(data);
      genererCategories(data);
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
