const d = document,
  $main = d.querySelector("main");

fetch("MARKDOWN/content.md")
  .then((res) => (res.ok ? res.text() : Promise.reject(res)))
  .then((text) => {
    $main.innerHTML = new showdown.Converter().makeHtml(text);
  })
  .catch((err) => {
    console.log(err);
    let errMessage = err.statusText || "Ha ocurrido un error";

    $main.innerHTML = `<p>Error ${err.status}: ${errMessage}</p>`;
  });
