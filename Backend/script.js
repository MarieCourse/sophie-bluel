const reponse = fetch("http://localhost:5678/api/works").then((res) => {
  // if(res.ok == true)

  if (res.ok) {
    //res.json().then((data) => console.log(data));

    //loop du résultat

    //console.log(res.json);
    res.json().then(function (data) {
      console.log(data);
      genererWorks(data);
    });
  } else {
    console.log(
      "Erreur de conection avec le serveur - Impossible d'afficher les projects"
    );
  }
});

function genererWorks(data) {
  for (let i = 0; i < data.length; i++) {
    const article = data[i];

    // Récupération de l'élément du DOM qui accueillera les fiches
    const gallery = document.querySelector(".gallery");
    // Création d’une balise dédiée à un projet
    const figure = document.createElement("figure");
    //Création des balises
    const imageElement = document.createElement("img");
    imageElement.src = article.imageUrl;
    imageElement.alt = article.title;
    figure.appendChild(imageElement);

    //Création de l'élement figcaption
    const figcaption = document.createElement("figcaption");
    figcaption.innerText = article.title;
    figure.appendChild(figcaption);

    gallery.appendChild(figure);
  }
}

/*Generation des categories*/
const reponseCategories = fetch("http://localhost:5678/api/categories").then(
  (res) => {
    if (res.ok) {
      res.json().then(function (data) {
        console.log(data);
        genererCategories(data);
      });
    } else {
      console.log(
        "Erreur de conection avec le serveur - Impossible d'afficher les catégories"
      );
    }
  }
);

function genererCategories(value) {
  const categoriesSet = new Set();

  for (let i = 0; i < value.length; i++) {
    const categorie = value[i];
    categoriesSet.add(categorie.name);
  }

  const categoriesArray = Array.from(categoriesSet);

  const categories = document.querySelector("#categories");

  const btnTous = document.createElement("button");
  btnTous.innerText = "Tous";
  btnTous.setAttribute("class", "btn-tous");
  categories.appendChild(btnTous);

  for (let i = 0; i < categoriesArray.length; i++) {
    const categorie = categoriesArray[i];
    var btn = document.createElement("button");
    btn.innerText = categorie;
    categories.appendChild(btn);
  }
}
/*
const btn = document.querySelector("#categories button");

btn.addEventListener("click", function () {
  const worksFiltrees = data.filter(function (work) {
    return work.category.name == categorie;
  });
  console.log(worksFiltrees);
});*/
