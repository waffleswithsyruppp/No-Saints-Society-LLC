import {catalog} from './catalog.js';
export const storage = {
  get(key) { try {return JSON.parse(localStorage.getItem(key));} catch {return null;} },
  set(key,value) {try {localStorage.setItem(key,JSON.stringify(value));} catch {}},
};
export function quantity(value) {
  const n = Number(value);
  if (!Number.isInteger(n) || n < 1 || n > 99) throw new Error('Choose a quantity from 1 to 99.');
  return n;
}
export function createDemoCommerce(store = storage) {
  const key='nss-demo-cart-v1';
  let items = store.get(key);
  items = Array.isArray(items) ? items : [];
  const find = id => catalog.products.flatMap(p=>p.variants.map(v=>({p,v}))).find(x=>x.v.id===id);
  items = items.filter(l=>l && find(l.id)?.v.available && Number.isInteger(l.quantity) && l.quantity>0)
    .map(l=>({id:l.id,quantity:Math.min(l.quantity,find(l.id).v.stock,99)}));
  const getCart = async () => {
    const lines = items.map(l=>{const {p,v}=find(l.id);return {id:l.id,variantId:v.id,title:p.title,variantTitle:v.title,image:p.images[0],quantity:l.quantity,price:v.price,currency:v.currency,max:v.stock};});
    return {lines,subtotal:lines.reduce((s,l)=>s+l.price*l.quantity,0),currency:'USD',checkoutUrl:null};
  };
  const save = () => {store.set(key,items);return getCart();};
  return {
    getCatalog: async()=>structuredClone(catalog), getCart,
    async add(id,value) { const n=quantity(value), item=find(id); if(!item?.v.available) throw new Error('This size is sold out.'); const existing=items.find(l=>l.id===id); if((existing?.quantity||0)+n>item.v.stock) throw new Error(`Only ${item.v.stock} available in this size.`); if(existing)existing.quantity+=n;else items.push({id,quantity:n}); return save(); },
    async update(id,value) {const n=quantity(value),l=items.find(l=>l.id===id);if(!l)throw new Error('Item no longer in bag.');if(n>find(id).v.stock)throw new Error(`Only ${find(id).v.stock} available in this size.`);l.quantity=n;return save();},
    async remove(id) {items=items.filter(l=>l.id!==id);return save();},
    async checkout() {throw new Error('This is a demo. Checkout is not connected.');},
  };
}
export async function createCommerce(config) {
  if(config.mode==='demo') return createDemoCommerce();
  if(config.mode!=='shopify') throw new Error('Unknown commerce mode.');
  const {createShopifyCommerce}=await import('./shopify.js');
  return createShopifyCommerce(config.shopify);
}
