import STRIPE_KEYS from "./stripe-keys.js";

const d = document,
  $products = d.getElementById("products"),
  $productTemplate = d.getElementById("product-template").content,
  $fragment = d.createDocumentFragment(),
  fetchOptions = {
    headers: {
      Authorization: `Bearer ${STRIPE_KEYS.secret}`,
    },
  };

let prices, products;

const priceFormat = (num) => `$${num.slice(0, -2)}.${num.slice(-2)}`;

Promise.all([
  fetch("https://api.stripe.com/v1/products", fetchOptions),
  fetch("https://api.stripe.com/v1/prices", fetchOptions),
])
  .then((responses) => Promise.all(responses.map((res) => res.json())))
  .then((json) => {
    products = json[0].data;
    prices = json[1].data;
    console.log(products, prices);
    prices.forEach((price) => {
      let productData = products.filter(
        (product) => product.id === price.product
      );
      console.log(productData);
      $productTemplate
        .querySelector(".product")
        .setAttribute("data-price", price.id);
      $productTemplate.querySelector("img").src = productData[0].images[0];
      $productTemplate.querySelector("img").alt = productData[0].name;
      $productTemplate.querySelector("figcaption").innerHTML = `
      ${productData[0].name}
      <br>
      ${priceFormat(price.unit_amount_decimal)}
      `;

      let $clone = d.importNode($productTemplate, true);
      $fragment.appendChild($clone);
    });
    $products.appendChild($fragment);
  })
  .catch((err) => {
    console.log(err);
    let errMesssage =
      err.statusText || "Ha ocurrido un error al conectar con Stripe Api";

    $products.innerHTML = `<p>Error ${err.status}: ${errMesssage}</p>`;
  });

d.addEventListener("click", (e) => {
  console.log(e.target);
  if (e.target.matches(".product *") || e.target.matches(".product")) {
    let priceId =
      e.target.parentElement.getAttribute("data-price") ||
      e.target.getAttribute("data-price");
    Stripe(STRIPE_KEYS.public)
      .redirectToCheckout({
        lineItems: [{ price: priceId, quantity: 1 }],
        mode: "payment",
        successUrl: "http://127.0.0.1:5500/pages/stripe_success.html",
        cancelUrl: "http://127.0.0.1:5500/pages/stripe_cancel.html",
      })
      .then((res) => {
        console.log(res);
        if (res.error) {
          $products.insertAdjacentHTML("afterend", res.error.message);
        }
      });
  }
});
