export type Product = {
  id: string;
  weight: string;
  name: string;
  description: string;
  details: string[];
  image: string;
  images: string[];
  tone: string;
};

export const products: Product[] = [
  {
    id: '45kg',
    weight: '4.5 KG',
    name: 'OSOTTO 220x240 Çift Katlı Embos Battaniye',
    description: 'Hafifliği, desen zenginliği ve yumuşak dokusuyla her mevsime eşlik eder.',
    details: ['220 × 240 cm', 'Çift katlı embos dokuma', '11 desen seçeneği', 'Yumuşak makine yıkama'],
    image: '/images/products/45kg/45kg-01.jpeg',
    images: [
      '/images/products/45kg/45kg-01.jpeg',
      '/images/products/45kg/45kg-02.jpeg',
      '/images/products/45kg/45kg-03.jpeg',
      '/images/products/45kg/45kg-04.jpeg',
      '/images/products/45kg/45kg-05.jpeg',
      '/images/products/45kg/45kg-06.jpeg',
      '/images/products/45kg/45kg-07.jpeg',
      '/images/products/45kg/45kg-08.jpeg',
      '/images/products/45kg/45kg-09.jpeg',
      '/images/products/45kg/45kg-10.jpeg',
      '/images/products/45kg/45kg-11.jpeg',
    ],
    tone: 'Desenli / Koleksiyon',
  },
  {
    id: '5kg',
    weight: '5 KG',
    name: 'OSOTTO 220x240 Çift Katlı Embos Battaniye',
    description: 'Hafif, zarif ve her mevsim için kusursuz bir dokunuş.',
    details: ['220 × 240 cm', 'Çift katlı embos dokuma', 'Özel dokulu kenar bitişi', 'Yumuşak makine yıkama'],
    image: '/images/products/5kg/5kg-01.jpeg',
    images: [
      '/images/products/5kg/5kg-01.jpeg',
      '/images/products/5kg/5kg-02.jpeg',
      '/images/products/5kg/5kg-03.jpeg',
      '/images/products/5kg/5kg-04.jpeg',
      '/images/products/5kg/5kg-05.jpeg',
      '/images/products/5kg/5kg-06.jpeg',
      '/images/products/5kg/5kg-07.jpeg',
      '/images/products/5kg/5kg-08.jpeg',
      '/images/products/5kg/5kg-09.jpeg',
      '/images/products/5kg/5kg-10.jpeg',
      '/images/products/5kg/5kg-11.jpeg',
      '/images/products/5kg/5kg-12.jpeg',
      '/images/products/5kg/5kg-13.jpeg',
      '/images/products/5kg/5kg-14.jpeg',
      '/images/products/5kg/5kg-15.jpeg',
      '/images/products/5kg/5kg-16.jpeg',
      '/images/products/5kg/5kg-17.jpeg',
      '/images/products/5kg/5kg-18.jpeg',
    ],
    tone: 'Desenli / Koleksiyon',
  },
  {
    id: '6kg',
    weight: '6 KG',
    name: 'OSOTTO 220x240 Çift Katlı Embos Battaniye',
    description: 'Günün sonunda ağırlaşan, sessizce saran bir sıcaklık.',
    details: ['220 × 240 cm', 'Çift katlı embos dokuma', 'Yoğun ve dengeli dolgunluk', 'Özel dokulu kenar bitişi'],
    image: '/images/osotto-product.jpg',
    images: ['/images/osotto-product.jpg'],
    tone: 'Kum / Sütlü Kahve',
  },
  {
    id: '7kg',
    weight: '7 KG',
    name: 'OSOTTO 220x240 Çift Katlı Embos Battaniye',
    description: 'Derin kış akşamları için en dolgun OSOTTO deneyimi.',
    details: ['220 × 240 cm', 'Çift katlı embos dokuma', 'Maksimum sıcaklık dengesi', 'Özel dokulu kenar bitişi'],
    image: '/images/osotto-product.jpg',
    images: ['/images/osotto-product.jpg'],
    tone: 'Fildişi / Toprak',
  },
];