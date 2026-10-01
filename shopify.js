import {storage,quantity} from './commerce.js';
const imageFields='url altText';
const productFields=`id title description images(first:100){nodes{${imageFields}} pageInfo{hasNextPage}} variants(first:100){nodes{id title availableForSale quantityAvailable price{amount currencyCode}} pageInfo{hasNextPage}}`;
const cartFields=`id checkoutUrl cost{subtotalAmount{amount currencyCode}} lines(first:100){nodes{id quantity merchandise{... on ProductVariant{id title quantityAvailable price{amount currencyCode} image{${imageFields}} product{title}}}} pageInfo{hasNextPage}}`;
export function createShopifyCommerce(config, fetcher=fetch, store=storage) {
  if(!/^[a-z0-9][a-z0-9-]*\.myshopify\.com$/i.test(config.domain)||!config.publicAccessToken) throw new Error('Add your Shopify store domain and public Storefront token in config.js.');
  const key=`nss-shopify-cart-${config.domain}`;
  let cartId=store.get(key);
  async function request(query,variables={}) {
    const response=await fetcher(`https://${config.domain}/api/${config.apiVersion}/graphql.json`,{method:'POST',headers:{'Content-Type':'application/json','X-Shopify-Storefront-Access-Token':config.publicAccessToken},body:JSON.stringify({query,variables}),signal:AbortSignal.timeout(20000)});
    if(!response.ok)throw new Error(`Shopify could not be reached (${response.status}). Please try again.`);
    const body=await response.json();if(body.errors?.length)throw new Error(body.errors.map(e=>e.message).join(' '));return body.data;
  }
  const empty=()=>({lines:[],subtotal:0,currency:'USD',checkoutUrl:null});
  function normalize(c) {
    if(!c)return empty();
    if(c.lines.pageInfo.hasNextPage)throw new Error('This bag is too large to display. Contact the store for help.');
    return {lines:c.lines.nodes.map(l=>({id:l.id,variantId:l.merchandise.id,title:l.merchandise.product.title,variantTitle:l.merchandise.title,quantity:l.quantity,price:Number(l.merchandise.price.amount),currency:l.merchandise.price.currencyCode,image:l.merchandise.image?{url:l.merchandise.image.url,alt:l.merchandise.image.altText||l.merchandise.product.title}:null,max:99})),subtotal:Number(c.cost.subtotalAmount.amount),currency:c.cost.subtotalAmount.currencyCode,checkoutUrl:c.checkoutUrl};
  }
  async function mutate(name,args,definitions,variables) {
    const data=await request(`mutation(${definitions}){${name}(${args}){cart{${cartFields}} userErrors{message}}}`,variables);
    const result=data[name];if(result.userErrors.length)throw new Error(result.userErrors.map(e=>e.message).join(' '));if(!result.cart)throw new Error('Your bag could not be updated. Please try again.');cartId=result.cart.id;store.set(key,cartId);return normalize(result.cart);
  }
  async function getCart() {
    if(!cartId)return empty();
    const data=await request(`query($id:ID!){cart(id:$id){${cartFields}}}`,{id:cartId});
    if(!data.cart){cartId=null;store.set(key,null);}return normalize(data.cart);
  }
  return {
    async getCatalog() {
      const collections=[],products=new Map();
      const handles=[...new Set([config.currentCollection,...config.archiveCollections])];
      for(const handle of handles) {
        let after=null,collection;
        do {
          const data=await request(`query($handle:String!,$after:String){collection(handle:$handle){id title description products(first:30,after:$after){nodes{${productFields}} pageInfo{hasNextPage endCursor}}}}`,{handle,after});
          const c=data.collection;if(!c)throw new Error(`Collection "${handle}" is missing or not published to this storefront.`);
          if(!collection){collection={id:handle,title:c.title,description:c.description,status:handle===config.currentCollection?'CURRENT':'ARCHIVE',productIds:[]};collections.push(collection);}
          for(const p of c.products.nodes){
            if(p.variants.pageInfo.hasNextPage||p.images.pageInfo.hasNextPage)throw new Error(`"${p.title}" exceeds this starter's 100 variants/images limit. Extend pagination before publishing.`);
            collection.productIds.push(p.id);products.set(p.id,{id:p.id,title:p.title,description:p.description,images:p.images.nodes.map(i=>({url:i.url,alt:i.altText||p.title})),variants:p.variants.nodes.map(v=>({id:v.id,title:v.title,available:v.availableForSale,stock:v.quantityAvailable,price:Number(v.price.amount),currency:v.price.currencyCode}))});
          }
          after=c.products.pageInfo.hasNextPage?c.products.pageInfo.endCursor:null;
        }while(after);
      }
      return {collections,products:[...products.values()]};
    },getCart,
    async add(id,value) {const n=quantity(value);await getCart();if(!cartId)return mutate('cartCreate','input:$input','$input:CartInput!',{input:{lines:[{merchandiseId:id,quantity:n}]}});return mutate('cartLinesAdd','cartId:$id,lines:$lines','$id:ID!,$lines:[CartLineInput!]!',{id:cartId,lines:[{merchandiseId:id,quantity:n}]});},
    async update(id,value) {if(!cartId)throw new Error('Your bag has expired.');return mutate('cartLinesUpdate','cartId:$id,lines:$lines','$id:ID!,$lines:[CartLineUpdateInput!]!',{id:cartId,lines:[{id,quantity:quantity(value)}]});},
    async remove(id) {if(!cartId)throw new Error('Your bag has expired.');return mutate('cartLinesRemove','cartId:$id,lineIds:$lines','$id:ID!,$lines:[ID!]!',{id:cartId,lines:[id]});},
    async checkout() {const cart=await getCart();if(!cart.lines.length||!cart.checkoutUrl)throw new Error('Your bag is empty.');const url=new URL(cart.checkoutUrl);if(url.protocol!=='https:')throw new Error('Invalid checkout URL.');return url.href;},
  };
}
