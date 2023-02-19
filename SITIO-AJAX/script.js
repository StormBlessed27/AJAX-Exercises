const d = document,
  $main = d.querySelector("main"),
  $fragment = d.createDocumentFragment();

const getHtml = async (url) => {
  try {
    let res = await fetch(url),
      html = await res.text();
    if (!res.ok) throw { status: res.status, statusText: res.statusText };
    $main.innerHTML = html;
  } catch (err) {
    let message = err.statusText || "Ocurrio Un Error";
    $main.innerHTML = `<p>Error: ${err.status} ${message}</p>`;
  }
};

d.addEventListener("DOMContentLoaded", (e) => {
  getHtml("assets/home.html");
});
d.addEventListener("click", (e) => {
  if (e.target.matches(".menu a")) {
    e.preventDefault();
    getHtml(e.target.href);
  }
});
