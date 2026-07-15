# SonicBuds

A responsive, multi-page storefront demo for SonicBuds Pro wireless earbuds. It is built with plain HTML, CSS, and JavaScript, so no build step or package installation is required.

## Pages

- `index.html` — landing page
- `product.html` — product details and variants
- `cart.html` — shopping cart
- `checkout.html` — checkout demo
- `account.html` — account dashboard demo
- `about.html` — brand story

## Run locally

Open `index.html` in a browser, or serve the project directory with any static-file server.

## Deploy with GitHub Pages

1. Create a new GitHub repository and upload this project's files.
2. In the repository, open **Settings → Pages**.
3. Set the deployment source to **Deploy from a branch**.
4. Choose the branch containing the site and the `/(root)` folder, then save.

GitHub Pages will publish `index.html` as the site entry point.

## Notes

Cart data is stored only in the browser's `localStorage`. Checkout and account data are demonstration interactions; no payment processing or backend is included.
