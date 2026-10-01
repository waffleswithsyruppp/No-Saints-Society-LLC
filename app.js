import {config} from './config.js';
import {createCommerce} from './commerce.js';
const $=s=>document.querySelector(s), esc=s=>String(s??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const money=(n,c='USD')=>new Intl.NumberFormat('en-US',{style:'currency',currency:c,maximumFractionDigits:Number.isInteger(n)?0:2}).format(n);
const img=(i,cls='')=>i?`<img class="${cls}" src="${esc(i.url)}" alt="${esc(i.alt)}" loading="lazy">`:'<p class="fine-print">Photography coming soon</p>';
let commerce,data,cart,activeCollection,view='',busy=false,opener;
const layer=$('#layer');
function notice(message){const n=$('#notice');n.textContent=message;n.classList.add('show');clearTimeout(notice.timer);notice.timer=setTimeout(()=>n.classList.remove('show'),6500);}
function count(){ $('#bag-count').textContent=cart.lines.reduce((s,l)=>s+l.quantity,0); }
async function action(fn){if(busy)return;busy=true;layer.setAttribute('aria-busy','true');try{await fn();}catch(e){notice(e.message);}finally{busy=false;layer.removeAttribute('aria-busy');}}
function open(title,type){opener=layer.open?opener:document.activeElement;view=type;$('#layer-title').textContent=title;$('#layer-content').innerHTML='';layer.append($('#notice'));if(!layer.open)layer.showModal();layer.scrollTop=0;$('#close-layer').focus();}
function close(){layer.close();view='';opener?.focus();}
$('#close-layer').onclick=close;layer.addEventListener('close',()=>{view='';document.body.append($('#notice'));});
$('#logo').onload=()=>{$('#logo').hidden=false;$('#wordmark').hidden=true;};
if($('#logo').complete&&$('#logo').naturalWidth)$('#logo').onload();
function renderCollection(id){
  activeCollection=data.collections.find(c=>c.id===id)||data.collections.find(c=>c.status==='CURRENT');
  if(!activeCollection)throw new Error('No collection is configured.');
  const products=activeCollection.productIds.map(id=>data.products.find(p=>p.id===id)).filter(Boolean);
  $('#main').innerHTML=`<section class="collection-heading"><span class="eyebrow">${activeCollection.status==='FALLEN ANGELS / ARCHIVE'}</span><h1>${esc(activeCollection.title)}</h1></section><section class="grid" aria-label="Products">${products.map(p=>{const v=p.variants[0],sold=!p.variants.some(v=>v.available);return `<button class="product-card" data-product="${esc(p.id)}"><div class="photo">${img(p.images[0])}</div><div class="card-meta"><span>${esc(p.title)}</span><span class="price">${v?money(Math.min(...p.variants.map(v=>v.price)),v.currency):'Unavailable'}</span></div><div class="card-note">${sold?'SOLD OUT':'UNISEX'}</div></button>`;}).join('')}</section>${products.length?'':'<p class="empty">This collection is coming soon.</p>'}`;
  document.title=`${activeCollection.title} — NO SAINTS SOCIETY`;
  $('#main').querySelectorAll('[data-product]').forEach(b=>b.onclick=()=>showProduct(b.dataset.product));
}
$('.brand').onclick=e=>{e.preventDefault();if(!data)return;if(layer.open)close();renderCollection();window.scrollTo(0,0);};
$('#archive-button').onclick=()=>{if(!data)return;open('COLLECTION','archive');$('#layer-content').innerHTML=`<nav class="archive-menu"><p class="eyebrow">CURRENT</p>${data.collections.filter(c=>c.status==='CURRENT').map(collectionLink).join('')}<p class="eyebrow">FALLEN ANGELS</p>${data.collections.filter(c=>c.status==='ARCHIVE').map(collectionLink).join('')||'<p>No archived collections yet.</p>'}</nav>`;$('#layer-content').querySelectorAll('[data-collection]').forEach(b=>b.onclick=()=>{renderCollection(b.dataset.collection);close();window.scrollTo(0,0);$('#main').focus();});};
function collectionLink(c){return `<button class="archive-link" data-collection="${esc(c.id)}"><span>${esc(c.title)}</span><small>VIEW COLLECTION</small></button>`;}
function showProduct(id){
  const p=data.products.find(p=>p.id===id);let index=0;
  open(activeCollection.title,'product');
  $('#layer-content').innerHTML=`<div class="detail"><section class="gallery" aria-label="Product images"><div id="image-stage"></div><div class="gallery-controls"><button id="previous" aria-label="Previous image">‹</button><span id="image-count" aria-live="polite"></span><button id="next" aria-label="Next image">›</button></div><div class="thumbs">${p.images.map((i,n)=>`<button data-image="${n}" aria-label="View image ${n+1}" aria-pressed="false">${img(i)}</button>`).join('')}</div></section><section class="product-info"><span class="eyebrow">${esc(activeCollection.title)} / UNISEX</span><h3>${esc(p.title)}</h3><p id="product-price"></p><p class="description">${esc(p.description)}</p><form id="product-form"><label for="variant">SIZE / VARIANT</label><select id="variant" required><option value="">SELECT SIZE / VARIANT</option>${p.variants.map(v=>`<option value="${esc(v.id)}" ${v.available?'':'disabled'}>${esc(v.title)}${v.available?'':' — SOLD OUT'}</option>`).join('')}</select><p class="availability" id="availability"></p><label for="quantity">QUANTITY</label><div class="buy-row"><input id="quantity" type="number" value="1" min="1" max="99" required aria-label="Quantity"><button class="primary" id="add" disabled>${p.variants.some(v=>v.available)?'SELECT A SIZE':'SOLD OUT'}</button></div></form><p class="fine-print">${config.mode==='demo'?'Demo product. Images and prices are placeholders.':'Availability is confirmed when added to your bag.'}</p></section></div>`;
  const gallery=()=>{$('#image-stage').innerHTML=img(p.images[index],'main-image');$('#image-count').textContent=p.images.length?`${index+1} / ${p.images.length}`:'0 / 0';$('#previous').disabled=$('#next').disabled=p.images.length<2;$('.thumbs').querySelectorAll('button').forEach(b=>b.setAttribute('aria-pressed',Number(b.dataset.image)===index));};
  $('#previous').onclick=()=>{index=(index-1+p.images.length)%p.images.length;gallery();};$('#next').onclick=()=>{index=(index+1)%p.images.length;gallery();};$('.thumbs').querySelectorAll('button').forEach(b=>b.onclick=()=>{index=Number(b.dataset.image);gallery();});gallery();
  const first=p.variants[0];$('#product-price').textContent=first?money(first.price,first.currency):'Unavailable';
  $('#variant').onchange=()=>{const v=p.variants.find(v=>v.id===$('#variant').value);$('#add').disabled=!v?.available;$('#add').textContent=v?.available?'ADD TO BAG':'SELECT A SIZE';$('#availability').textContent=v?.available?'Available':'Choose a size';if(v){$('#product-price').textContent=money(v.price,v.currency);$('#quantity').max=config.mode==='demo'?Math.min(v.stock,99):99;}};
  $('#product-form').onsubmit=e=>{e.preventDefault();action(async()=>{const b=$('#add');b.disabled=true;b.textContent='ADDING…';try{cart=await commerce.add($('#variant').value,$('#quantity').value);count();await showCart();notice('Added to your bag.');}finally{if(b.isConnected){b.disabled=false;b.textContent='ADD TO BAG';}}});};
}
async function showCart(){
  open('SHOPPING BAG','cart');$('#layer-content').innerHTML='<p class="loading">Loading bag…</p>';
  try{cart=await commerce.getCart();count();renderCart();}catch(e){$('#layer-content').innerHTML='<div class="empty"><p>Your bag could not be loaded.</p><button id="retry-cart">TRY AGAIN</button></div>';$('#retry-cart').onclick=showCart;notice(e.message);}
}
function renderCart(){
  $('#layer-content').innerHTML=`<section class="cart">${cart.lines.length?cart.lines.map(l=>`<article class="cart-line">${img(l.image)}<div><h3>${esc(l.title)}</h3><p>${esc(l.variantTitle)} / UNISEX</p><div class="cart-actions"><input type="number" min="1" max="${l.max||99}" value="${l.quantity}" data-line="${esc(l.id)}" aria-label="Quantity for ${esc(l.title)} ${esc(l.variantTitle)}"><button class="remove" data-remove="${esc(l.id)}">REMOVE</button></div></div><span class="line-total">${money(l.price*l.quantity,l.currency)}</span></article>`).join('')+`<div class="cart-summary"><div class="subtotal"><span>SUBTOTAL</span><span>${money(cart.subtotal,cart.currency)}</span></div><p class="fine-print">Shipping and taxes calculated at checkout.</p><button class="primary" id="checkout" ${config.mode==='demo'?'disabled':''}>${config.mode==='demo'?'DEMO — CHECKOUT UNAVAILABLE':'CHECKOUT'}</button>${config.mode==='demo'?'<p class="fine-print">Your bag is saved on this device. No payment can be taken in demo mode.</p>':''}</div>`:'<div class="empty"><h3>Your bag is empty.</h3><button id="continue">EXPLORE THE COLLECTION</button></div>'}</section>`;
  $('#continue')?.addEventListener('click',close);
  $('#layer-content').querySelectorAll('[data-line]').forEach(input=>input.onchange=()=>action(async()=>{try{cart=await commerce.update(input.dataset.line,input.value);count();}finally{renderCart();}}));
  $('#layer-content').querySelectorAll('[data-remove]').forEach(b=>b.onclick=()=>action(async()=>{cart=await commerce.remove(b.dataset.remove);count();renderCart();}));
  $('#checkout')?.addEventListener('click',()=>action(async()=>{const b=$('#checkout');b.disabled=true;b.textContent='OPENING CHECKOUT…';try{location.assign(await commerce.checkout());}catch(e){b.disabled=false;b.textContent='CHECKOUT';throw e;}}));
}
$('#bag-button').onclick=()=>{if(commerce)showCart();};
async function init(){try{commerce=await createCommerce(config);data=await commerce.getCatalog();renderCollection();cart=await commerce.getCart();count();$('#demo-label').textContent=config.mode==='demo'?'DEMO STORE / PURCHASES UNAVAILABLE':'';}catch(e){$('#main').innerHTML='<div class="empty"><h1>Unable to load the store.</h1><p id="load-error"></p><button id="retry">TRY AGAIN</button></div>';$('#load-error').textContent=e.message;$('#retry').onclick=init;}}
init();
