const d = document,
  $loader = d.querySelector(".contact-form-loader"),
  $response = d.querySelector(".contact-form-response"),
  $btn = d.querySelector(".form-btn"),
  $form = d.querySelector(".contact-form");

const getData = async function (e) {
    try {
      console.log("entre a la funcion get data");
      let res = await fetch("https://formsubmit.co/ajax/hjballent@gmail.com", {
          method: "POST",
          body: new FormData(e.target),
        }),
        jsonRes = await res.json();
      if (!res.ok)
        throw { status: response.status, statusText: response.statusText };

      $loader.classList.add("none");
      $btn.classList.remove("none");
      $response.innerHTML = `<p>${jsonRes.message}</p>`;
      $response.classList.remove("none");
      $form.reset();
    } catch (err) {
      let message =
        err.statusText || "We Sorry, an error sending the data has occurred :(";
      $response.innerHTML = `<p>Error ${err.status}: ${message}</p>`;
    } finally {
      setTimeout(() => {
        $response.classList.add("none");
      }, 3000);
    }
  },
  contactForm = function () {
    const $inputs = d.querySelectorAll(".contact-form *[required]");

    $inputs.forEach((input) => {
      const $span = d.createElement("span");
      $span.id = input.name;
      $span.textContent = input.title;
      $span.classList.add("contact-form-error", "none");
      input.insertAdjacentElement("afterend", $span);
    });

    d.addEventListener("keyup", (e) => {
      if (e.target.matches(".contact-form [required]")) {
        let $input = e.target,
          pattern = $input.pattern || $input.dataset.pattern;

        if (pattern && $input.value !== "") {
          let regExp = RegExp(pattern);
          return !regExp.exec($input.value)
            ? d.getElementById($input.name).classList.add("is-active")
            : d.getElementById($input.name).classList.remove("is-active");
        }
        if (!pattern) {
          return $input.value === ""
            ? d.getElementById($input.name).classList.add("is-active")
            : d.getElementById($input.name).classList.remove("is-active");
        }
      }
    }),
      d.addEventListener("submit", (e) => {
        e.preventDefault();

        $btn.classList.add("none");
        $loader.classList.remove("none");
        getData(e);
      });
  };

d.addEventListener("DOMContentLoaded", (e) => {
  contactForm();
});
