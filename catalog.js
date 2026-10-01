// Demo content and prices only. Replace with your real product information.
const variants = (id, price, stock = 8) => ['XS','S','M','L','XL'].map((size,i) => ({
  id: `${id}-${size}`, title: size, price, currency: 'USD', available: stock > 0 && i !== 0,
  stock: i === 0 ? 0 : stock,
}));
export const catalog = {
  collections: [
    { id:'angel-001', title:'ANGEL 001', status:'CURRENT', description:'The first chapter.', productIds:['tee','hoodie','pants'] },
    { id:'angel-000', title:'ANGEL 000', status:'ARCHIVE', description:'From the beginning. Forever in the archive.', productIds:['archive'] },
  ],
  products: [
    {id:'tee',title:'OVERSIZED TEE',description:'An oversized, unisex silhouette. Demo product — final fabric, fit and care details to follow.',images:[{url:'assets/tee.png',alt:'Black oversized tee, front view'}],variants:variants('tee',65)},
    {id:'hoodie',title:'ANGEL HOODIE',description:'A relaxed, unisex silhouette. Demo product — final fabric, fit and care details to follow.',images:[{url:'assets/hoodie.png',alt:'Black oversized hoodie, front view'},{url:'assets/hoodie-back.png',alt:'Black oversized hoodie, back view'}],variants:variants('hoodie',140,4)},
    {id:'pants',title:'SWEATPANTS',description:'A loose, unisex silhouette. Demo product — final fabric, fit and care details to follow.',images:[{url:'assets/pants.png',alt:'Black loose sweatpants, front view'}],variants:variants('pants',110,6)},
    {id:'archive',title:'ORIGINAL HOODIE',description:'An earlier chapter, preserved in the archive. Unisex. Demo product.',images:[{url:'assets/hoodie-back.png',alt:'Archive black hoodie, back view'}],variants:variants('archive',180,0)},
  ],
};
