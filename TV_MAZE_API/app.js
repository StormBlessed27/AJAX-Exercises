const d = document,
  $shows = d.getElementById("shows"),
  $template = d.getElementById("show-template").content,
  $fragment = d.createDocumentFragment();

const searchShow = async (url, query) => {
  try {
    let res = await fetch(url),
      dataRes = await res.json();
    console.log(url, res, dataRes);
    if (!res.ok) throw { status: res.status, statusText: res.statusText };
    if (dataRes.length === 0) {
      $shows.innerHTML = `<h2>No existen resultados para tu criterio de busqueda: <mark>${query}</mark></h2>`;
    } else {
      dataRes.forEach((showInfo) => {
        $template.querySelector("h3").textContent = showInfo.show.name;
        $template.querySelector("div").innerHTML = showInfo.show.summary
          ? showInfo.show.summary
          : "Aun no hay descripcion de este show en la base de datos";
        $template.querySelector("img").src = showInfo.show.image
          ? showInfo.show.image.medium
          : "http://static.tvmaze.com/images/no-img/no-img-portrait-text.png";
        $template.querySelector("a").href = showInfo.show.url
          ? showInfo.show.url
          : "#";
        $template.querySelector("a").target = showInfo.show.url
          ? "_blank"
          : "self";
        $template.querySelector("a").textContent = showInfo.show.url
          ? "Ver más"
          : "";
        let $clone = d.importNode($template, true);

        $fragment.appendChild($clone);
      });
      $shows.innerHTML = "";
      $shows.appendChild($fragment);
    }
  } catch (err) {
    let message = err.statusText || "Ha ocurrido un error";
    $shows.innerHTML = `<h3>Error ${err.status}: ${message}</h3>`;
  }
};

d.addEventListener("keypress", async (e) => {
  if (e.target.matches("#search")) {
    if (e.key === "Enter") {
      try {
        $shows.innerHTML = `<img class ="loader" src="assets/loader.svg" alt="Cargando...">`;
        let query = e.target.value.toLocaleLowerCase(),
          api = `https://api.tvmaze.com/search/shows?q=${query}`;

        searchShow(api, query);
      } catch (err) {}
    }
  }
});
