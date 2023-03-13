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
    console.log("ERREUR");
  }
});

function genererWorks(works) {
  for (let i = 0; i < works.length; i++) {
    const article = works[i];

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

    /*

          <figure>
            <img src="assets/images/abajour-tahina.png" alt="Abajour Tahina" />
            <figcaption>Abajour Tahina</figcaption>
          </figure>
    */
  }
}
