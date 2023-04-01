const d = document,
  $main = d.querySelector("main"),
  $links = d.querySelector(".links");

let pokeUrl = "https://pokeapi.co/api/v2/pokemon/";

const getPokemon = async function (url) {
    try {
      let res = await fetch(url),
        pokeData = await res.json();
      if (!res.ok) throw { status: res.status, statusText: res.statusText };

      return pokeData;
    } catch (error) {
      let message = error.statusText || "Ha ocurrido un error";

      $main.innerHTML = `<h3>Error ${error.status}: ${message}</h3>`;
    }
  },
  loadPokemons = async function (url) {
    try {
      $main.innerHTML = `<img class="loader" src="assets/loader.svg" alt="Loading...">`;

      let res = await fetch(pokeUrl),
        pokemons = await res.json(),
        $template = "",
        $prevLink,
        $nextLink;
      console.log(pokemons);
      if (!res.ok) throw { status: res.status, statusText: res.statusText };

      for (let i = 0; i < pokemons.results.length; i++) {
        let pokemon = await getPokemon(pokemons.results[i].url);

        $template += `
        <figure>
        <img src="${pokemon.sprites.front_default}" alt="${pokemon.name}">
        <figcaption>${pokemon.name.toLocaleUpperCase()}</figcaption>
        </figure>
        `;
      }
      $prevLink = pokemons.previous
        ? `<a href="${pokemons.previous}">⏪</a>`
        : "";
      $nextLink = pokemons.next ? `<a href="${pokemons.next}">⏩</a>` : "";
      $links.innerHTML = $prevLink + " " + $nextLink;
      $main.innerHTML = $template;
    } catch (error) {
      let message = error.statusText || "Ha ocurrido un error";

      $main.innerHTML = `<h3>Error ${error.status}: ${message}</h3>`;
    }
  };

d.addEventListener("DOMContentLoaded", (e) => loadPokemons(pokeUrl));
d.addEventListener("click", (e) => {
  if (e.target.matches("a")) {
    e.preventDefault();
    pokeUrl = e.target.href || pokeUrl;
    loadPokemons(pokeUrl);
  }
});
