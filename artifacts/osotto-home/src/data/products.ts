export type Product = {
  id: string;
  weight: string;
  name: string;
  description: string;
  details: string[];
  image: string;
  tone: string;
};

export const products: Product[] = [
  {
    id: '5kg',
    weight: '5 KG',
    name: 'OSOTTO 220x240 Çift Katlı Embos Battaniye',
    description: 'Hafif, zarif ve her mevsim için kusursuz bir dokunuş.',
    details: ['220 × 240 cm', 'Çift katlı embos dokuma', 'Özel dokulu kenar bitişi', 'Yumuşak makine yıkama'],
    image: '/images/osotto-product.jpg',
    tone: 'Keten / Krem',
  },
  {
    id: '6kg',
    weight: '6 KG',
    name: 'OSOTTO 220x240 Çift Katlı Embos Battaniye',
    description: 'Günün sonunda ağırlaşan, sessizce saran bir sıcaklık.',
    details: ['220 × 240 cm', 'Çift katlı embos dokuma', 'Yoğun ve dengeli dolgunluk', 'Özel dokulu kenar bitişi'],
    image: '/images/osotto-product.jpg',
    tone: 'Kum / Sütlü Kahve',
  },
  {
    id: '7kg',
    weight: '7 KG',
    name: 'OSOTTO 220x240 Çift Katlı Embos Battaniye',
    description: 'Derin kış akşamları için en dolgun OSOTTO deneyimi.',
    details: ['220 × 240 cm', 'Çift katlı embos dokuma', 'Maksimum sıcaklık dengesi', 'Özel dokulu kenar bitişi'],
    image: '/images/osotto-product.jpg',
    tone: 'Fildişi / Toprak',
  },
];