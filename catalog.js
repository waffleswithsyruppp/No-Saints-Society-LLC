// NO SAINTS SOCIETY — PRODUCT CATALOG

const variants = (id, price, stock = 8) => ['XS','S','M','L','XL'].map((size,i) => ({
  id: `${id}-${size}`,
  title: size,
  price,
  currency: 'USD',
  available: stock > 0 && i !== 0,
  stock: i === 0 ? 0 : stock
}));

export const catalog = {
  collections: [
    {
      id: 'angel-001',
      title: 'ANGEL 001',
      status: 'CURRENT',
      description: 'The first chapter.',
      productIds: ['tee','hoodie','pants']
    },
    {
      id: 'angel-000',
      title: 'ANGEL 000',
      status: 'ARCHIVE',
      description: 'From the beginning. Forever in the archive.',
      productIds: ['archive']
    }
  ],

  products: [

    {
  id: 'tee',
  title: 'OVERSIZED TEE',
  description: 'Oversized streetwear tee.',
  images: [
    {url:'assets/000-tshirt-front.png', alt:'NO SAINTS SOCIETY oversized tee front'},
    {url:'assets/000-tshirt-back.png', alt:'NO SAINTS SOCIETY oversized tee back'}
  ],
  variants: variants('tee',65)
},
    
  {
    id: 'hoodie',
    title: 'ANGEL HOODIE',
    description: 'A relaxed oversized silhouette.',
    images: [
      {url:'assets/000-hoodie-front.png', alt:'Angel Hoodie front view'},
      {url:'assets/000-hoodie-back.png', alt:'Angel Hoodie back view'}
    ],
    variants: variants('hoodie',140,4)
  },
    
  {
  id: 'hoodie',
  title: 'ANGEL HOODIE',
  description: 'A relaxed oversized silhouette.',
  images: [
    {url:'assets/000-hoodie-front.png', alt:'Angel Hoodie front view'},
    {url:'assets/000-hoodie-back.png', alt:'Angel Hoodie back view'}
  ],
  variants: variants('hoodie',140,4)
},
    {
      id: 'pants',
      title: 'SWEATPANTS',
      description: 'A loose silhouette. Final fabric, fit and care details to follow.',
      images: [
        {url:'assets/pants.png', alt:'Black loose sweatpants, front view'}
      ],
      variants: variants('pants',110,6)
    },

    {
      id: 'archive',
      title: 'ORIGINAL HOODIE',
      description: 'An earlier chapter, preserved in the archive.',
      images: [
        {url:'assets/hoodie-back.png', alt:'Original Hoodie back view'}
      ],
      variants: variants('archive',180,0)
    }
  ]
};
