# NO SAINTS SOCIETY — setup

This is a complete static storefront with two interchangeable commerce adapters. It starts in **demo mode**. No Shopify account is connected and no payment can be taken. Product photos are AI-generated mockups; names, prices, descriptions and stock are demonstration content.

## Open locally

1. Unzip the package.
2. In the `no-saints-society` folder run `python3 -m http.server 8000` (Python 3), or use your editor's local web server.
3. Open http://localhost:8000. Do not double-click index.html: browser restrictions prevent JavaScript modules working reliably over file://.

There is no install or build step. Node.js 22+ is only needed to run the included tests (`npm test` or `node --test tests/*.test.js`).

## Add your branding and real products

Place your actual logo at the root alongside index.html, named exactly **nosaintssocietylogo.png**. The site already references that filename and displays a text wordmark until it exists. The original logo was not supplied, so it is intentionally not included.

For demo/static content edit `catalog.js`. Each product has an ordered `images` array (any length), descriptive alt text, a description and variants. Each variant has a unique ID, title (e.g. size or size/color combination), price, currency, availability and stock. Add real photography to `assets/` and replace the image paths. White image backgrounds work best. Set both `available: false` and `stock: 0` for a sold-out demo variant. All garments are displayed as unisex.

Exactly one collection should have `status: 'CURRENT'`. Move ANGEL 001 to `ARCHIVE`, add ANGEL 002 with `CURRENT`, and point its `productIds` to your new products. This changes the home collection and Fallen Angels menu without changing presentation code. Archive collections may contain purchasable or sold-out pieces; archive status alone does not determine inventory. Set premium archive prices in the product variants.

## Publish the files on GitHub Pages

Upload the contents of this folder to your chosen Pages source location, with index.html at that location's root. Keep the assets folder and filename case intact. Select that branch/folder in your repository's Pages settings. Relative paths support a repository subdirectory URL. The included `.nojekyll` disables Jekyll processing. You may omit tests and documentation from the deployed files. This package does not delete, change or publish your existing repository.

## Connect Shopify

You need:

- An operational Shopify store and its permanent `your-store.myshopify.com` domain.
- Shopify Headless sales channel access, a storefront created there, and its **public Storefront API access token**.
- Products and collections published to that Headless storefront/channel.
- Collection handles for the current drop and each archive collection.
- Real product images, descriptions, prices, sizes/other options and inventory in Shopify.
- Configured payments, shipping, taxes, policies and checkout settings before accepting real orders.

Never put an Admin API token, private Storefront token, client secret or password in these files. A public Storefront token is explicitly intended for browser use. Keep private integrations on a server.

1. In Shopify create your products and size variants. Enable inventory tracking and set quantities. Turn off “continue selling when out of stock” if you do not want backorders.
2. Publish products and collections to the Headless channel. Create a current collection, e.g. `angel-001`, and archives, e.g. `angel-000`. Product ordering follows each collection's Shopify order.
3. Configure public Storefront access for products/listings and checkout/cart access; enable inventory read access (`unauthenticated_read_product_inventory`) for `quantityAvailable`. Shopify's current setup may also expose `unauthenticated_read_product_listings`, `unauthenticated_read_checkouts` and `unauthenticated_write_checkouts`. Confirm granted scopes in the Headless channel. No customer or Admin API access is used.
4. Edit `config.js`: set `mode: 'shopify'`, `domain`, `publicAccessToken`, `currentCollection` and `archiveCollections`. The API version is pinned to `2026-07`; review Shopify version support before upgrading.
5. Serve the files and confirm products, prices, variant availability and images appear. Connection errors are shown; the site never silently falls back to demo data.
6. Add a product and verify a Shopify cart is created. Test changing quantity, removal, stale stock and sold-out variants. Click Checkout to use the HTTPS `checkoutUrl` supplied by Shopify. Complete a test-mode order and verify inventory and the order in Shopify before switching payments live.

The adapter loads product/variant IDs directly from Shopify; you do not manually copy variant IDs. A combined selector displays Shopify variant titles (e.g. `M / Black`), so products with several options work. Prices and availability refresh when the catalog loads; cart mutations and checkout are authoritative. Items in a bag do not reserve inventory. The bag persists a Shopify cart ID in browser local storage. Expired carts are cleared and can be recreated. Demo and Shopify bags use separate keys.

Shopify owns checkout, orders, customers and payment processing. This frontend does not collect card details. Cart subtotal comes from Shopify, including its subtotal calculation; line displays use variant unit prices. Complex discounts/bundles, subscriptions, localization/Markets switching, customer accounts, selling plans and advanced discount presentation are outside this starter.

## Replace a drop in Shopify mode

1. Create and publish the new collection/products in Shopify.
2. Change `currentCollection` to the new handle in config.js.
3. Add the previous handle to `archiveCollections`, in your preferred menu order.
4. Publish the updated config.js. Product edits, prices, photos and stock then come from Shopify without frontend changes.

This small configuration change chooses which collection is current. No custom admin panel is included. If you want to change CURRENT/archive membership entirely in Shopify's admin later, replace the handle list with a storefront-readable metaobject or navigation menu. That extension would stay in the commerce adapter; the presentation needs no redesign.

## Files and integration contract

- `index.html` / `style.css`: page shell and responsive presentation.
- `app.js`: collection, product, gallery and full-page bag interactions.
- `catalog.js`: demo collection/product data.
- `commerce.js`: demo cart, validation, storage and provider selection.
- `shopify.js`: Storefront GraphQL catalog, cart and checkout implementation.
- `config.js`: mode and public storefront configuration.
- `assets/`: included demo product mockups.
- `tests/commerce.test.js`: automated demo and mocked Shopify tests.

Both adapters expose `getCatalog`, `getCart`, `add`, `update`, `remove` and `checkout`. Collection product pagination is implemented. This starter supports up to 100 images and 100 variants per Shopify product and 100 distinct cart lines; it reports an explicit error if those limits are exceeded rather than silently truncating. Extend pagination if your store needs more. Image gallery lengths may vary within that limit.

The store uses a native modal dialog for full-page experiences, keyboard focus containment, Escape to close, descriptive labels and reduced-motion support. It does not install analytics, advertising trackers or third-party scripts. Cart persistence uses local storage and gracefully degrades if browser storage is unavailable.

## Official Shopify references

- Storefront API and public/private authentication: https://shopify.dev/docs/api/storefront/2026-07
- Headless channel: https://shopify.dev/docs/storefronts/headless/building-with-the-storefront-api/manage-headless-channels
- Cart implementation: https://shopify.dev/docs/storefronts/headless/building-with-the-storefront-api/cart/manage
- Cart and checkoutUrl: https://shopify.dev/docs/api/storefront/2026-07/objects/Cart

## Before launch

Replace demo content and logo, connect your public Storefront token, verify your selling currency and settings, provide your real policy/contact information through Shopify checkout and any additional storefront pages you require, then test an end-to-end order on your own store. Mock tests cannot validate your account permissions, actual inventory, checkout configuration or payments.
