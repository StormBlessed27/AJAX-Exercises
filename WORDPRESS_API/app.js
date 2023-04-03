/*
Primero declaramos constantes para contener el objeto document y el objeto window,
segundo: Declaramos los nodos o elementos del DOM con los que interactuaremos 
Tercero: Declarar constantes con respecto al uso de la API de WordPress y el sitio que consultaremos*/

const d = document,
  w = window,
  $site = d.getElementById("site-header"),
  $posts = d.getElementById("posts"),
  $loader = d.querySelector(".loader"),
  $postTemplate = d.getElementById("post-template").content,
  //Fragmento que agilizara la insercion de elementos al DOM
  $domFragment = d.createDocumentFragment(),
  //Dominio del sitio del que traeremos contenido
  DOMAIN = "https://css-tricks.com",
  //Accediendo al contenido del sitio a traves del la API de WP
  SITE = `${DOMAIN}/wp-json`,
  API_WP = `${SITE}/wp/v2`,
  //Accediendo a los posts del sitio y toda la informacion relacioanada a ellos
  POSTS = `${API_WP}/posts?_embed`;
//Variables controladoras para el scroll infinito
let page = 1,
  //Variable que controla que tantos posts consultamos
  perPage = 6;

//funcion que trae la informacion basica del Sitio consultado
const getSiteData = async function () {
    try {
      //Dispones el Loader
      $loader.classList.remove("hide");
      //Realizamos la peticion GET
      let siteRes = await fetch(SITE);
      //En caso de que la peticion no se cumpla con un codigo 200 al 300 tiramos una exception
      if (!siteRes.ok)
        throw { status: siteRes.status, statusText: siteRes.statusText };
      //Si la peticion fue exitosa entonces parseamos sus datos
      let siteData = await siteRes.json();
      console.log(siteData);
      //Insertamos la informacion basica del sitio al elemento respectivo en el DOM
      $site.innerHTML = `
      <h2>Sitio Web</h2>
      <h3>
      <a href="${siteData.url}" target="_blank">${siteData.name}</a>
      </h3>
      <p>${siteData.description}</p>
      <p>${siteData.timezone_string}</p>
      `;
    } catch (err) {
      //Manejo de errores
      console.log(err);
      let message = err.statusText || "Ha ocurrido un error inesperado";
      $site.innerHTML = `<p>Error ${err.status}: ${message}</p>`;
    }
  },
  //Funcion que trae la informacion de los posts
  getSitePosts = async function () {
    //Mostramos el Loader
    $loader.classList.remove("hide");
    try {
      //Hacemos la peticion GET, dandole la URL principal, la cantidad y la pagina
      let postsRes = await fetch(`${POSTS}&per_page=${perPage}&page=${page}`);
      if (!postsRes.ok)
        throw { status: postsRes.status, statusText: postsRes.statusText };
      //Parseamos la respuesta a formato JSON
      let postsData = await postsRes.json();
      console.log(postsData);

      //Obtendremos informacion de cada Post en la respuesta
      postsData.forEach((post) => {
        //Variables que contendran la informacion de las categories
        let categories = "",
          tags = "";

        //En el caso de que exista una lista de terminos relacionados al post los guardaremos en cada una de las variables correspondientes
        if (post._embedded["wp:term"]) {
          post._embedded["wp:term"][0].forEach(
            (categorie) => (categories += `<li>${categorie.name}</li>`)
          );
          post._embedded["wp:term"][1].forEach((tag) => {
            tags += `<li>${tag.name}</li>`;
          });
        }
        //Obtenemos e insertamos al respectivo elemento de la template en el DOM la url de la imagen principal del post en caso de que exista.
        $postTemplate.querySelector(".post-img").src = post._embedded[
          "wp:featuredmedia"
        ][0].source_url
          ? post._embedded["wp:featuredmedia"][0].source_url
          : "";
        //Obtenemos e Insertamos al respectivo elemento de la template en el DOM la el texto alternativo de la imagen principal del post en caso de que exista.
        $postTemplate.querySelector(".post-img").alt = post.title.rendered
          ? post.title.rendered
          : "";
        //Obtenemos e Insertamos al respectivo elemento de la template en el DOM el titulo del post en caso de que exista.
        $postTemplate.querySelector(".post-title").innerHTML = post.title
          .rendered
          ? post.title.rendered
          : "";
        //Obtenemos e Insertamos al respectivo elemento de la template en el DOM la url de la imagen principal del post en caso de que exista.
        $postTemplate.querySelector(".post-author").innerHTML = post._embedded
          .author[0].avatar_urls
          ? `
        <img src="${post._embedded.author[0].avatar_urls["48"]}" alt="${post._embedded.author[0].name}">
        <figcaption>${post._embedded.author[0].name}</figcaption>
        `
          : "<p><mark>No se encontraron Autores</mark></p>";
        //Obtenemos e Insertamos al respectivo elemento de la template en el DOM la fecha de publicacion del post en caso de que exista.
        $postTemplate.querySelector(".post-date").innerHTML = post.date
          ? new Date(post.date).toLocaleDateString()
          : post.date;
        //Obtenemos e Insertamos al respectivo elemento de la template en el DOM  el link a la publicacion original
        $postTemplate.querySelector(".post-link").href = post.link
          ? post.link
          : "";
        //Obtenemos e Insertamos al respectivo elemento de la template en el DOM  el resumen de la publicacion, en caso de que el resumen exista
        $postTemplate.querySelector(".post-excerpt").innerHTML = post.excerpt
          .rendered
          ? post.excerpt.rendered.replace(" [&hellip;]", "...")
          : "";
        //Obtenemos e Insertamos al respectivo elemento de la template en el DOM las categorias de la publicacion que ya previamente habiamos guardado
        $postTemplate.querySelector(".post-categories").innerHTML = categories
          ? `<p>Categorias:</p>
            <ul>${categories}</ul>`
          : "<p><mark>No se encontraron Categorias</mark></p>";
        //Obtenemos e insertamos al respectivo elemento en la template en el DOM las etiquetas de la publicacion que ya previamente habiamos guardado
        $postTemplate.querySelector(".post-tags").innerHTML = tags
          ? `<p>Tags:</p>
            <ul>${tags}</ul>
          `
          : "<p><mark>No se encontraron etiquetas</mark></p>";

        //Obtenemos el cotenido de la publicacion y lo insertamos al elemento correspondiente de la template
        $postTemplate.querySelector(".post-content > article").innerHTML = post
          .content.rendered
          ? post.content.rendered
          : "";
        //Creamos un clon de la template con todo su contenido
        let $clone = d.importNode($postTemplate, true);
        //Insertamos ese clon al fragmento que ya creamos al inicio del programa
        $domFragment.appendChild($clone);
      });

      //Una vez concluido el recorrido del arreglo de publicaciones insertamos el contenido que este en el fragment a la seccion de posts en el DOM
      $posts.appendChild($domFragment);
      //Ocultamos el loader
      $loader.classList.add("hide");
    } catch (err) {
      //Manejo de posibles errores
      console.log(err);
      let message = err.statusText || "Ha ocurrido un error inesperado";
      $site.innerHTML = `<p>Error ${err.status}: ${message}</p>`;
      $loader.classList.add("hide");
    }
  };

//Cargar los datos basicos del sitio y los primeros posts al cargar el documento HTML
d.addEventListener("DOMContentLoaded", (e) => {
  getSiteData();
  getSitePosts();
});

//Creando una Infinite Scroll bar page
w.addEventListener("scroll", (e) => {
  const { scrollTop, clientHeight, scrollHeight } = d.documentElement;

  if (scrollTop + clientHeight >= scrollHeight) {
    page++;
    getSitePosts();
  }
});
