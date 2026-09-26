import { useEffect, useRef, useState, type FormEvent } from 'react';
import { ArrowDownRight, ArrowUpRight, Check, ChevronDown, ChevronLeft, ChevronRight, ChevronUp, Instagram, Menu, Minus, Plus, X } from 'lucide-react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ErrorBoundary } from '@/components/error-boundary';
import { Toaster } from '@/components/ui/toaster';
import { TooltipProvider } from '@/components/ui/tooltip';
import NotFound from '@/pages/not-found';
import { Route, Switch, Router as WouterRouter } from 'wouter';
import { products, type Product } from '@/data/products';
import './index.css';

const queryClient = new QueryClient();
const WHATSAPP_NUMBER = '905431945858';
const WHATSAPP_URL = `https://wa.me/${WHATSAPP_NUMBER}`;

function useReveal() {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const node = ref.current;
    if (!node) return;
    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) { node.classList.add('is-visible'); observer.disconnect(); }
    }, { threshold: .12 });
    observer.observe(node);
    return () => observer.disconnect();
  }, []);
  return ref;
}

function BrandMark({ light = false }: { light?: boolean }) {
  return <span className={`font-mono-ui text-[11px] tracking-[.28em] font-bold ${light ? 'text-[#f3eee6]' : ''}`}>OSOTTO</span>;
}

function OpeningReveal({ onDone }: { onDone: () => void }) {
  useEffect(() => { const timer = window.setTimeout(onDone, 280); return () => window.clearTimeout(timer); }, [onDone]);
  return (
    <div className="opening-exit fixed inset-0 z-[100] flex items-center justify-center bg-[#2b241f] text-[#f3eee6]" aria-label="OSOTTO yükleniyor">
      <div className="text-center">
        <div className="font-mono-ui text-[10px] tracking-[.42em] opacity-60">EVİN DOKUSU</div>
        <div className="font-display mt-4 text-6xl tracking-[.13em] md:text-8xl">OSOTTO</div>
        <div className="opening-line mx-auto mt-5 h-px w-24 bg-[#b86b4b]" />
      </div>
    </div>
  );
}

const weightOptions = ['Tümü', '4.5 KG', '5 KG', '6 KG', '7 KG'];

function Nav({ onMenu, onCollectionSelect }: { onMenu: () => void; onCollectionSelect: (weight: string) => void }) {
  const [scrolled, setScrolled] = useState(false);
  const [collectionOpen, setCollectionOpen] = useState(false);
  const navRef = useRef<HTMLElement>(null);
  useEffect(() => {
    const closeOnOutsideClick = (event: MouseEvent) => {
      if (collectionOpen && navRef.current && !navRef.current.contains(event.target as Node)) setCollectionOpen(false);
    };
    document.addEventListener('mousedown', closeOnOutsideClick);
    return () => document.removeEventListener('mousedown', closeOnOutsideClick);
  }, [collectionOpen]);
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener('scroll', onScroll, { passive: true }); onScroll();
    return () => window.removeEventListener('scroll', onScroll);
  }, []);
  const links = [['Koleksiyon', '#koleksiyon'], ['Hakkımızda', '#hikayemiz'], ['İletişim', '#iletisim']];
  return (
    <nav ref={navRef} onMouseLeave={() => setCollectionOpen(false)} className={`fixed left-0 top-0 z-50 w-full border-b border-transparent px-5 py-5 transition-all duration-500 md:px-10 md:py-6 ${scrolled ? 'nav-scrolled' : 'text-[#f3eee6]'}`}>
      <div className="mx-auto flex max-w-[1440px] items-center justify-between">
        <a href="#anasayfa" onClick={() => setCollectionOpen(false)} aria-label="OSOTTO ana sayfa" data-testid="link-home"><BrandMark light={!scrolled} /></a>
        <div className="hidden items-center gap-7 md:flex">
          <a href="#anasayfa" onClick={() => setCollectionOpen(false)} className="font-mono-ui text-[10px] uppercase tracking-[.18em] opacity-80 transition-opacity hover:opacity-100" data-testid="link-home-nav">Ana sayfa</a>
          <button type="button" onMouseEnter={() => setCollectionOpen(true)} onClick={() => { setCollectionOpen((open) => !open); document.getElementById('koleksiyon')?.scrollIntoView({ behavior: 'smooth' }); }} className="flex items-center gap-1 font-mono-ui text-[10px] uppercase tracking-[.18em] opacity-80 transition-opacity hover:opacity-100" aria-expanded={collectionOpen} data-testid="link-Koleksiyon">Koleksiyon <ChevronDown size={13} strokeWidth={1.2} className={`transition-transform ${collectionOpen ? 'rotate-180' : ''}`} /></button>
          {links.slice(1).map(([label, href]) => <a key={href} href={href} onClick={() => setCollectionOpen(false)} className="font-mono-ui text-[10px] uppercase tracking-[.18em] opacity-80 transition-opacity hover:opacity-100" data-testid={`link-${label}`}>{label}</a>)}
        </div>
        <div className="flex items-center gap-5">
          <a href="#iletisim" onClick={() => setCollectionOpen(false)} className="hidden border-b border-current pb-1 font-mono-ui text-[10px] uppercase tracking-[.16em] md:block" data-testid="link-quote-nav">Teklif alın</a>
          <a href="#bayimiz" onClick={() => setCollectionOpen(false)} className="hidden bg-[#b86b4b] px-3 py-2 font-mono-ui text-[9px] uppercase tracking-[.14em] text-[#f3eee6] transition-colors hover:bg-[#d9a387] md:block" data-testid="link-dealer-nav">Bayimiz olun</a>
          <button onClick={onMenu} className="md:hidden" aria-label="Menüyü aç" data-testid="button-open-menu"><Menu size={21} strokeWidth={1.4} /></button>
        </div>
      </div>
      {collectionOpen && <div className="absolute left-1/2 top-full mt-3 w-[min(92vw,540px)] -translate-x-1/2 origin-top animate-[collectionDrop_.28s_cubic-bezier(.2,.8,.2,1)] border border-[#2b241f]/10 bg-[#f3eee6]/95 p-5 text-[#2b241f] shadow-[0_18px_50px_rgba(51,38,27,.14)] backdrop-blur-md" onMouseEnter={() => setCollectionOpen(true)}>
        <div className="mb-4 flex items-end justify-between gap-4"><div><span className="font-mono-ui text-[9px] uppercase tracking-[.18em] text-[#b86b4b]">OSOTTO koleksiyonu</span><p className="mt-2 font-display text-2xl">Ağırlığını seç.</p></div><button type="button" onClick={() => setCollectionOpen(false)} className="font-mono-ui text-[9px] uppercase tracking-[.14em] text-[#65584d]">Kapat</button></div>
        <div className="grid grid-cols-5 gap-2">{weightOptions.map((weight) => <button type="button" key={weight} onClick={() => { onCollectionSelect(weight); setCollectionOpen(false); }} className="border border-[#2b241f]/15 px-2 py-4 font-mono-ui text-[9px] uppercase tracking-[.08em] transition-colors hover:border-[#b86b4b] hover:bg-[#b86b4b] hover:text-[#f3eee6]" data-testid={`nav-weight-${weight.replace(/\W/g, '')}`}>{weight}</button>)}</div>
      </div>}
    </nav>
  );
}

function MobileMenu({ open, onClose, onCollectionSelect }: { open: boolean; onClose: () => void; onCollectionSelect: (weight: string) => void }) {
  if (!open) return null;
  return <div className="fixed inset-0 z-[60] flex flex-col bg-[#2b241f] px-6 py-6 text-[#f3eee6] md:hidden">
    <div className="flex items-center justify-between"><BrandMark light /><button onClick={onClose} aria-label="Menüyü kapat" data-testid="button-close-menu"><X size={23} strokeWidth={1.4} /></button></div>
    <div className="mt-28 flex flex-col gap-7">
    <div><a href="#koleksiyon" onClick={onClose} className="font-display text-5xl" data-testid="mobile-link-collection">Koleksiyon</a><div className="mt-5 flex flex-wrap gap-2">{weightOptions.map((weight) => <button type="button" key={weight} onClick={() => { onCollectionSelect(weight); onClose(); }} className="border border-[#f3eee6]/25 px-3 py-2 font-mono-ui text-[9px] uppercase tracking-[.08em]" data-testid={`mobile-weight-${weight.replace(/\W/g, '')}`}>{weight}</button>)}</div></div>
    {[['Hakkımızda', '#hikayemiz'], ['İletişim', '#iletisim'], ['Bayimiz olun', '#bayimiz']].map(([label, href], index) =>
        <a key={href} href={href} onClick={onClose} className="font-display text-5xl" data-testid={`mobile-link-${index + 1}`}>{label}</a>)}
    </div>
    <div className="mt-auto flex items-end justify-between"><span className="max-w-[190px] font-mono-ui text-[9px] uppercase leading-relaxed tracking-[.16em] opacity-50">Evin ritmine eşlik eden dokular.</span><a href={WHATSAPP_URL} target="_blank" rel="noreferrer" className="font-mono-ui text-[10px] uppercase tracking-[.14em]" data-testid="mobile-link-whatsapp">WhatsApp ↗</a></div>
  </div>;
}

function Hero() {
  const imageRef = useRef<HTMLImageElement>(null);
  useEffect(() => {
    const onScroll = () => {
      if (imageRef.current) imageRef.current.style.transform = `translate3d(0, ${window.scrollY * 0.04}px, 0) scale(1.035)`;
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return <section id="anasayfa" className="relative flex min-h-[760px] items-end overflow-hidden bg-[#2b241f] text-[#f3eee6] md:min-h-[100svh]">
    <img
      ref={imageRef}
      src="https://images.pexels.com/photos/5998043/pexels-photo-5998043.jpeg?auto=compress&dpr=1&w=1800"
      alt="OSOTTO premium ev tekstili"
      className="hero-image absolute inset-0 h-full w-full object-cover opacity-75"
      loading="eager"
      fetchPriority="high"
    />
    <div className="absolute inset-0 bg-gradient-to-r from-[#211b17]/72 via-[#2b241f]/18 to-transparent" />
    <div className="absolute inset-0 bg-gradient-to-t from-[#211b17]/65 via-transparent to-[#2b241f]/10" />

    <div className="relative mx-auto flex min-h-[760px] w-full max-w-[1440px] items-end px-5 pb-16 md:min-h-[100svh] md:px-10 md:pb-20">
      <div className="max-w-[760px]">
        <div className="hero-reveal flex items-center gap-3 font-mono-ui text-[10px] uppercase tracking-[.28em] text-[#e6c0ad]">
          <span className="h-px w-8 bg-[#b86b4b]" />
          PREMIUM HOME TEXTILE
        </div>

        <h1 className="hero-reveal hero-delay-1 mt-5 font-display text-[18vw] leading-[.78] tracking-[.02em] text-[#f3eee6] md:text-[10.5vw]">
          OSOTTO
        </h1>

        <div className="hero-reveal hero-delay-2 mt-7 flex flex-col gap-7 md:flex-row md:items-end md:justify-between md:gap-12">
          <div>
            <p className="max-w-[470px] font-display text-[clamp(1.35rem,2.5vw,2.35rem)] leading-[1.05] tracking-[-.025em]">
              Modern yaşam alanları için <i className="font-normal text-[#d9b29c]">premium</i> ev tekstili.
            </p>
            <p className="mt-5 max-w-[390px] text-[13px] leading-[1.8] text-[#f3eee6]/72 md:text-[14px]">
              Konfor, kalite ve zamansız tasarımı bir araya getiren OSOTTO koleksiyonunu keşfedin.
            </p>
          </div>

          <a href="#koleksiyon" className="group flex w-fit shrink-0 items-center gap-3 font-mono-ui text-[10px] uppercase tracking-[.16em]" data-testid="link-explore-collection">
            <span className="flex h-12 w-12 items-center justify-center rounded-full border border-[#f3eee6]/45 transition-all duration-200 group-hover:bg-[#f3eee6] group-hover:text-[#2b241f]">
              <ArrowDownRight size={16} strokeWidth={1.2} />
            </span>
            Koleksiyonu keşfet
          </a>
        </div>
      </div>
    </div>

    <div className="absolute bottom-7 right-5 hidden items-center gap-3 font-mono-ui text-[9px] uppercase tracking-[.18em] text-[#f3eee6]/50 md:flex">
      <span className="h-px w-12 bg-[#f3eee6]/30" /> Aşağı kaydır
    </div>
  </section>;
}

function Intro() {
  const ref = useReveal();
  return <section className="bg-[#f3eee6] px-5 py-24 md:px-10 md:py-40">
      <div ref={ref} className="reveal mx-auto grid max-w-[1180px] gap-12 md:grid-cols-[.75fr_1.25fr] md:gap-28">
      <div><span className="font-mono-ui text-[10px] uppercase tracking-[.2em] text-[#b86b4b]">01 / Yaklaşımımız</span></div>
      <div><p className="font-display text-[clamp(2.5rem,5vw,5.2rem)] leading-[.95] tracking-[-.035em] text-[#2b241f]">Sade olanın<br /><i className="font-normal text-[#b86b4b]">iyi yapılmış</i> hâli.</p><p className="mt-9 max-w-[520px] text-[13px] leading-[1.9] text-[#65584d] md:text-[14px]">OSOTTO, her gün kullandığınız tekstillerin de bir karakteri olması gerektiğine inanır. Kusursuz hissi ararken gösterişten uzak durur; iyi malzemenin, doğru oranların ve yılların zanaat bilgisinin peşinden gider.</p></div>
    </div>
  </section>;
}

function ProductCard({ product, onOpen }: { product: Product; onOpen: (product: Product) => void }) {
  const ref = useReveal();
  const images = product.images?.slice(0, 2) ?? [product.image];
  const [activeImage, setActiveImage] = useState(0);
  const pointerStartX = useRef<number | null>(null);

  useEffect(() => {
    setActiveImage(0);
    pointerStartX.current = null;
    images.slice(0, 2).forEach((src) => { const image = new Image(); image.src = src; });
  }, [product.id]);

  const changeImage = (direction: number) => {
    if (images.length < 2) return;
    setActiveImage((current) => (current + direction + 2) % 2);
  };

  const handlePointerDown = (event: React.PointerEvent<HTMLDivElement>) => {
    pointerStartX.current = event.clientX;
  };
  const handlePointerUp = (event: React.PointerEvent<HTMLDivElement>) => {
    if (pointerStartX.current === null) return;
    const delta = event.clientX - pointerStartX.current;
    pointerStartX.current = null;
    if (Math.abs(delta) >= 35) changeImage(delta > 0 ? -1 : 1);
  };

  return <article ref={ref} className="product-card reveal group cursor-pointer" onClick={() => onOpen(product)} data-testid={`card-product-${product.id}`}>
    <div className="relative aspect-[.84] touch-pan-y select-none overflow-hidden bg-[#ded4c6]" onPointerDown={handlePointerDown} onPointerUp={handlePointerUp} onPointerCancel={() => { pointerStartX.current = null; }}>
      <img src={images[activeImage]} alt={`${product.name} ${product.weight}`} className="product-image h-full w-full object-cover transition-opacity duration-150" loading="lazy" draggable={false} />
      {images.length > 1 && <><button type="button" className="absolute left-3 top-1/2 flex h-9 w-9 -translate-y-1/2 items-center justify-center rounded-full bg-[#f3eee6]/80 text-[#2b241f] opacity-0 transition-opacity duration-200 group-hover:opacity-100" onClick={(event) => { event.stopPropagation(); changeImage(-1); }} aria-label="Önceki fotoğraf"><ChevronLeft size={16} /></button><button type="button" className="absolute right-3 top-1/2 flex h-9 w-9 -translate-y-1/2 items-center justify-center rounded-full bg-[#f3eee6]/80 text-[#2b241f] opacity-0 transition-opacity duration-200 group-hover:opacity-100" onClick={(event) => { event.stopPropagation(); changeImage(1); }} aria-label="Sonraki fotoğraf"><ChevronRight size={16} /></button><div className="absolute bottom-4 left-1/2 flex -translate-x-1/2 gap-1.5 rounded-full bg-[#2b241f]/50 px-2.5 py-1.5">{images.slice(0, 2).map((src, index) => <span key={src} className={`h-1.5 rounded-full transition-all duration-150 ${index === activeImage ? 'w-5 bg-[#f3eee6]' : 'w-1.5 bg-[#f3eee6]/50'}`} />)}</div></>}
      <div className="absolute inset-0 bg-[#2b241f]/0 transition-colors duration-300 group-hover:bg-[#2b241f]/10" />
      <span className="absolute left-5 top-5 font-mono-ui text-[10px] uppercase tracking-[.18em] text-[#2b241f]">{product.weight}</span>
      <button className="absolute bottom-5 right-5 flex h-11 w-11 items-center justify-center rounded-full bg-[#f3eee6] text-[#2b241f] opacity-0 transition-opacity duration-300 group-hover:opacity-100" onClick={(event) => { event.stopPropagation(); onOpen(product); }} aria-label={`${product.weight} detayını aç`} data-testid={`button-view-${product.id}`}><ArrowUpRight size={17} strokeWidth={1.3} /></button>
    </div>
    <div className="flex items-start justify-between gap-4 pt-5"><div><span className="font-mono-ui text-[9px] uppercase tracking-[.16em] text-[#b86b4b]">OSOTTO / 220 × 240 CM</span><h3 className="font-display mt-2 text-[27px] leading-[.95] text-[#2b241f]">{product.weight}</h3><p className="mt-2 max-w-[240px] text-[12px] leading-[1.6] text-[#65584d]">{product.description}</p></div><ArrowUpRight className="magnetic-arrow mt-1 text-[#b86b4b]" size={17} strokeWidth={1.2} /></div>
  </article>;
}

function Collection({ onOpen, selectedWeight, onWeightChange }: { onOpen: (product: Product) => void; selectedWeight: string; onWeightChange: (weight: string) => void }) {
  const visibleProducts = selectedWeight === 'Tümü' ? products : products.filter((product) => product.weight === selectedWeight);
  const categoryTitle = selectedWeight === 'Tümü' ? 'Tüm ağırlıklar' : `${selectedWeight} battaniye`;
  const categoryDescription = selectedWeight === 'Tümü' ? 'OSOTTO’nun tüm çift katlı embos battaniye seçeneklerini keşfedin.' : `OSOTTO’nun ${selectedWeight} çift katlı embos battaniye koleksiyonu.`;
  return <section id="koleksiyon" className="bg-[#e5ddcf] px-5 py-24 md:px-10 md:py-36">
    <div className="mx-auto max-w-[1240px]">
      <div className="reveal flex flex-col justify-between gap-7 md:flex-row md:items-end"><div><span className="font-mono-ui text-[10px] uppercase tracking-[.2em] text-[#b86b4b]">02 / Koleksiyon</span><h2 className="font-display mt-5 text-[clamp(3.4rem,7vw,7.4rem)] leading-[.8] tracking-[-.05em] text-[#2b241f]">Ağırlığın<br /><i className="font-normal text-[#b86b4b]">hâlleri.</i></h2></div><p className="max-w-[245px] text-[12px] leading-[1.8] text-[#65584d] md:pb-2">Aynı ölçü, farklı bir his. Evinizin sıcaklığı için doğru ağırlığı bulun.</p></div>
      <div className="mt-12 flex flex-wrap gap-2 border-y border-[#2b241f]/15 py-4 md:mt-16" role="tablist" aria-label="Ağırlık filtreleri">{weightOptions.map((weight) => <button type="button" key={weight} onClick={() => onWeightChange(weight)} className={`px-4 py-3 font-mono-ui text-[9px] uppercase tracking-[.12em] transition-all ${selectedWeight === weight ? 'bg-[#2b241f] text-[#f3eee6]' : 'text-[#65584d] hover:bg-[#f3eee6]'}`} role="tab" aria-selected={selectedWeight === weight} data-testid={`filter-weight-${weight.replace(/\W/g, '')}`}>{weight}</button>)}</div>
      <div className="mt-12 flex flex-col justify-between gap-3 md:flex-row md:items-end"><div><span className="font-mono-ui text-[9px] uppercase tracking-[.18em] text-[#b86b4b]">OSOTTO COLLECTION</span><h3 className="font-display mt-2 text-4xl text-[#2b241f]">{categoryTitle}</h3></div><p className="max-w-[360px] text-[12px] leading-[1.8] text-[#65584d] md:text-right">{categoryDescription}</p></div>
      <div key={selectedWeight} className="collection-products mt-12 grid gap-12 md:mt-16 md:grid-cols-2 md:gap-x-7 md:gap-y-16 lg:grid-cols-4">{visibleProducts.map((product) => <ProductCard key={product.id} product={product} onOpen={onOpen} />)}</div>
    </div>
  </section>;
}

function Story() {
  const ref = useReveal();
  return <section id="hikayemiz" className="overflow-hidden bg-[#2b241f] text-[#f3eee6]">
    <div className="mx-auto grid max-w-[1440px] md:grid-cols-[.95fr_1.05fr]">
      <div className="relative min-h-[580px] md:min-h-[760px]"><img src="/images/osotto-story.jpg" alt="OSOTTO atölyesinde tekstil işçiliği" className="absolute inset-0 h-full w-full object-cover opacity-85" /><div className="absolute inset-0 bg-gradient-to-t from-[#2b241f]/40 to-transparent" /><span className="absolute bottom-7 left-5 font-mono-ui text-[9px] uppercase tracking-[.18em] text-[#f3eee6]/60 md:left-10">Bursa, Türkiye</span></div>
      <div ref={ref} className="reveal flex flex-col justify-center px-5 py-24 md:px-20 md:py-32">
        <span className="font-mono-ui text-[10px] uppercase tracking-[.2em] text-[#d9a387]">03 / Bizi tanıyın</span>
        <h2 className="font-display mt-8 max-w-[580px] text-[clamp(3rem,5.7vw,6.3rem)] leading-[.86] tracking-[-.045em]">Bir ev,<br />bir <i className="font-normal text-[#d9a387]">his.</i></h2>
        <p className="mt-10 max-w-[445px] text-[13px] leading-[1.9] text-[#f3eee6]/65 md:text-[14px]">OSOTTO’nun hikâyesi, Bursa’da bir tezgâhın başında başladı. Bugün hâlâ aynı şeye inanıyoruz: Bir tekstil ürünü yalnızca kumaştan ibaret değildir. Bir mevsimi, bir alışkanlığı, bir evin sesini taşır.</p>
        <p className="mt-5 max-w-[445px] text-[13px] leading-[1.9] text-[#f3eee6]/65 md:text-[14px]">Bu yüzden her koleksiyonu; doğru ağırlık, dengeli doku ve uzun süre iyi hissettiren renklerle tasarlıyoruz. Bursa’daki üretim kültürünü çağdaş evlerin ritmine taşıyoruz.</p>
        <div className="mt-10 grid max-w-[480px] grid-cols-3 gap-4 border-t border-[#f3eee6]/20 pt-5">{[['Bursa', 'üretim'], ['4', 'ağırlık'], ['220×240', 'ölçü']].map(([value, label]) => <div key={label}><strong className="font-display text-3xl font-normal text-[#d9a387]">{value}</strong><span className="mt-1 block font-mono-ui text-[8px] uppercase tracking-[.12em] text-[#f3eee6]/50">{label}</span></div>)}</div>
        <a href="#iletisim" className="mt-10 flex w-fit items-center gap-3 border-b border-[#f3eee6]/30 pb-2 font-mono-ui text-[10px] uppercase tracking-[.15em] transition-colors hover:border-[#d9a387] hover:text-[#d9a387]" data-testid="link-read-story">Bizi tanıyın <ArrowUpRight size={15} strokeWidth={1.2} /></a>
      </div>
    </div>
  </section>;
}

function Stats() {
  const ref = useReveal();
  const [count, setCount] = useState(0);
  useEffect(() => {
    let frame = 0;
    const start = performance.now();
    const tick = (now: number) => {
      const progress = Math.min((now - start) / 900, 1);
      setCount(Math.round(7000 * (1 - Math.pow(1 - progress, 3))));
      if (progress < 1) frame = requestAnimationFrame(tick);
    };
    frame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame);
  }, []);
  const stats = [[`${count.toLocaleString('tr-TR')}+`, 'ürün çeşidi'], ['YILLIK', 'üretim'], ['GÜVENİLİR', 'tedarik'], ['PROFESYONEL', 'hizmet']];
  return <section className="bg-[#b86b4b] px-5 py-20 text-[#f3eee6] md:px-10 md:py-28"><div ref={ref} className="reveal mx-auto grid max-w-[1280px] gap-10 sm:grid-cols-2 md:grid-cols-4 md:gap-16 lg:gap-24">{stats.map(([number, label], index) => <div key={label} className="border-t border-[#f3eee6]/35 pt-4" style={{ transitionDelay: `${index * 100}ms` }}><div className="whitespace-nowrap font-display text-[clamp(2.45rem,3.35vw,4.25rem)] leading-none tracking-[-.065em]">{number}</div><p className="mt-4 font-mono-ui text-[10px] uppercase tracking-[.16em] text-[#f3eee6]/70">{label}</p></div>)}</div></section>;
}

function QuoteSection({ prefillProduct }: { prefillProduct: Product | null }) {
  const [sent, setSent] = useState(false);
  const [sending, setSending] = useState(false);
  const [submitError, setSubmitError] = useState('');
  const [selectedProducts, setSelectedProducts] = useState<string[]>(prefillProduct ? [prefillProduct.id] : []);
  const [selectedWeights, setSelectedWeights] = useState<string[]>(prefillProduct ? [prefillProduct.weight] : []);
  const formRef = useRef<HTMLFormElement>(null);
  const allProductIds = products.map((item) => item.id);
  const availableWeights = weightOptions.slice(1);
  const toggleAllProducts = (checked: boolean) => setSelectedProducts(checked ? allProductIds : []);
  const toggleProduct = (id: string, checked: boolean) => setSelectedProducts((current) => checked ? [...current.filter((value) => value !== id), id] : current.filter((value) => value !== id));
  const toggleAllWeights = (checked: boolean) => setSelectedWeights(checked ? availableWeights : []);
  const toggleWeight = (weight: string, checked: boolean) => setSelectedWeights((current) => checked ? [...current.filter((value) => value !== weight), weight] : current.filter((value) => value !== weight));
  const submit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!formRef.current || sending) return;
    setSending(true);
    setSubmitError('');
    const formData = new FormData(formRef.current);
    const payload: Record<string, string | string[]> = {};
    for (const [key, value] of formData.entries()) {
      const textValue = String(value);
      if (key in payload) payload[key] = [...(Array.isArray(payload[key]) ? payload[key] as string[] : [payload[key] as string]), textValue];
      else payload[key] = textValue;
    }
    try {
      const response = await fetch('/api/quote', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ type: 'quote', ...payload }),
      });
      const result = await response.json().catch(() => ({}));
      if (!response.ok) throw new Error(result.error || 'Başvuru gönderilemedi. Lütfen tekrar deneyin.');
      setSent(true);
    } catch (error) {
      setSubmitError(error instanceof Error ? error.message : 'Bir hata oluştu. Lütfen tekrar deneyin.');
    } finally {
      setSending(false);
    }
  };
  const openWhatsApp = () => {
    if (!formRef.current) return;
    const data = new FormData(formRef.current);
    const value = (key: string) => String(data.get(key) || 'Belirtilmedi');
    const selectedProductNames = data.getAll('productIds').map((id) => products.find((item) => item.id === id)?.name || String(id));
    const message = ['Merhaba, OSOTTO ürünleri hakkında teklif almak istiyorum.', `Ad Soyad: ${value('name')}`, `Firma: ${value('company')}`, `E-posta: ${value('email')}`, `Telefon: ${value('phone')}`, `Ülke: ${value('country')}`, `Ürün: ${selectedProductNames.length ? selectedProductNames.join(', ') : 'Belirtilmedi'}`, `Ağırlık: ${data.getAll('weights').join(', ') || 'Belirtilmedi'}`, `Ölçü: 220x240 cm`, `Adet: ${value('quantity')}`, `Mesaj: ${value('message')}`].join('\n');
    window.open(`${WHATSAPP_URL}?text=${encodeURIComponent(message)}`, '_blank', 'noopener,noreferrer');
  };
  const inputClass = 'mt-3 block w-full bg-transparent font-display text-2xl text-[#2b241f] outline-none placeholder:text-[#2b241f]/25';
  return <section id="iletisim" className="bg-[#f3eee6] px-5 py-24 md:px-10 md:py-36"><div className="relative z-10 mx-auto grid max-w-[1180px] gap-16 md:grid-cols-[.85fr_1.15fr] md:gap-28">
    <div className="reveal"><span className="font-mono-ui text-[10px] uppercase tracking-[.2em] text-[#b86b4b]">04 / Teklif alın</span><h2 className="font-display mt-6 text-[clamp(3.3rem,6.5vw,6.8rem)] leading-[.82] tracking-[-.05em] text-[#2b241f]">İhtiyacınıza<br /><i className="font-normal text-[#b86b4b]">uygun teklif.</i></h2><p className="mt-9 max-w-[320px] text-[13px] leading-[1.8] text-[#65584d]">İhtiyacınıza uygun ürün ve fiyat bilgileri için bizimle iletişime geçin. Toplu alım, ürün seçenekleri ve kurumsal talepler için buradayız.</p><div className="mt-9 space-y-3 border-t border-[#2b241f]/15 pt-5 font-mono-ui text-[9px] uppercase tracking-[.13em] text-[#65584d]"><div className="flex items-center gap-3"><span className="h-1.5 w-1.5 rounded-full bg-[#b86b4b]" /> Ürün ve ağırlık seçimi</div><div className="flex items-center gap-3"><span className="h-1.5 w-1.5 rounded-full bg-[#b86b4b]" /> Toplu alım ve kurumsal talepler</div><div className="flex items-center gap-3"><span className="h-1.5 w-1.5 rounded-full bg-[#b86b4b]" /> Bursa’dan doğrudan iletişim</div></div><div className="mt-10 space-y-2 font-mono-ui text-[10px] uppercase tracking-[.14em] text-[#2b241f]"><a href="mailto:merhaba@osotto.com.tr" className="block w-fit border-b border-[#b86b4b]/50 pb-1" data-testid="link-email">merhaba@osotto.com.tr</a><a href="tel:+905431945858" className="block w-fit border-b border-[#b86b4b]/50 pb-1" data-testid="link-phone">0543 194 58 58</a></div></div>
    <div className="opacity-100">{sent ? <div className="flex min-h-[460px] flex-col justify-center border-t border-[#2b241f]/20"><Check className="text-[#b86b4b]" size={28} strokeWidth={1.2} /><h3 className="font-display mt-7 text-5xl text-[#2b241f]">Talebiniz<br /><i className="font-normal text-[#b86b4b]">başarıyla alındı.</i></h3><p className="mt-5 text-[13px] text-[#65584d]">En kısa sürede sizinle iletişime geçeceğiz.</p><button onClick={() => setSent(false)} className="mt-8 w-fit border-b border-[#2b241f]/40 pb-1 font-mono-ui text-[10px] uppercase tracking-[.15em]" data-testid="button-new-quote">Yeni teklif</button></div> : <form ref={formRef} key={prefillProduct?.id || 'quote'} onSubmit={submit} className="border-t border-[#2b241f]/20">
      <div className="grid gap-x-7 md:grid-cols-2"><label className="block border-b border-[#2b241f]/20 py-5"><span className="font-mono-ui text-[9px] uppercase tracking-[.16em] text-[#65584d]">Ad Soyad *</span><input required name="name" className={inputClass} placeholder="Ad Soyad" data-testid="quote-name" /></label><label className="block border-b border-[#2b241f]/20 py-5"><span className="font-mono-ui text-[9px] uppercase tracking-[.16em] text-[#65584d]">Firma Adı *</span><input required name="company" className={inputClass} placeholder="Firma adı" data-testid="quote-company" /></label><label className="block border-b border-[#2b241f]/20 py-5"><span className="font-mono-ui text-[9px] uppercase tracking-[.16em] text-[#65584d]">E-posta *</span><input required type="email" name="email" className={inputClass} placeholder="ornek@mail.com" data-testid="quote-email" /></label><label className="block border-b border-[#2b241f]/20 py-5"><span className="font-mono-ui text-[9px] uppercase tracking-[.16em] text-[#65584d]">Telefon *</span><input required type="tel" name="phone" className={inputClass} placeholder="05xx xxx xx xx" data-testid="quote-phone" /></label><label className="block border-b border-[#2b241f]/20 py-5"><span className="font-mono-ui text-[9px] uppercase tracking-[.16em] text-[#65584d]">Ülke</span><input name="country" className={inputClass} placeholder="Türkiye" data-testid="quote-country" /></label><label className="block border-b border-[#2b241f]/20 py-5"><span className="font-mono-ui text-[9px] uppercase tracking-[.16em] text-[#65584d]">Talep edilen adet</span><input type="number" min="1" name="quantity" className={inputClass} placeholder="Adet" data-testid="quote-quantity" /></label><div className="border-b border-[#2b241f]/20 py-5 md:col-span-2"><span className="font-mono-ui text-[9px] uppercase tracking-[.16em] text-[#65584d]">İlgilendiğiniz ürün</span><details className="mt-3"><summary className="cursor-pointer list-none font-display text-2xl text-[#2b241f]">{selectedProducts.length === allProductIds.length ? 'TÜMÜ' : selectedProducts.length ? `${selectedProducts.length} ürün seçildi` : 'Ürün seçiniz'} <span className="float-right text-base">⌄</span></summary><div className="mt-4 max-h-64 space-y-3 overflow-y-auto border border-[#2b241f]/15 p-4"><label className="flex items-center gap-3 font-mono-ui text-xs"><input type="checkbox" checked={selectedProducts.length === allProductIds.length} onChange={(e) => toggleAllProducts(e.target.checked)} /> TÜMÜ</label>{products.map((item) => <label key={item.id} className="flex items-center gap-3 text-sm"><input type="checkbox" name="productIds" value={item.id} checked={selectedProducts.includes(item.id)} onChange={(e) => toggleProduct(item.id, e.target.checked)} /> {item.weight} — {item.name}</label>)}</div></details></div><div className="border-b border-[#2b241f]/20 py-5 md:col-span-2"><span className="font-mono-ui text-[9px] uppercase tracking-[.16em] text-[#65584d]">Ürün ağırlığı</span><details className="mt-3"><summary className="cursor-pointer list-none font-display text-2xl text-[#2b241f]">{selectedWeights.length === availableWeights.length ? 'TÜMÜ' : selectedWeights.length ? selectedWeights.join(', ') : 'Ağırlık seçiniz'} <span className="float-right text-base">⌄</span></summary><div className="mt-4 space-y-3 border border-[#2b241f]/15 p-4"><label className="flex items-center gap-3 font-mono-ui text-xs"><input type="checkbox" checked={selectedWeights.length === availableWeights.length} onChange={(e) => toggleAllWeights(e.target.checked)} /> TÜMÜ</label>{availableWeights.map((weight) => <label key={weight} className="flex items-center gap-3 text-sm"><input type="checkbox" name="weights" value={weight} checked={selectedWeights.includes(weight)} onChange={(e) => toggleWeight(weight, e.target.checked)} /> {weight}</label>)}</div></details></div></div>
      <label className="block border-b border-[#2b241f]/20 py-5"><span className="font-mono-ui text-[9px] uppercase tracking-[.16em] text-[#65584d]">Mesaj</span><textarea name="message" rows={3} className={`${inputClass} resize-none`} placeholder="İhtiyacınızı ve teslimat beklentinizi yazın." data-testid="quote-message" /></label>{submitError && <p role="alert" className="mt-5 text-sm text-red-700">{submitError}</p>}<div className="flex flex-wrap items-center gap-4 pt-8"><button type="submit" disabled={sending} className="group flex items-center gap-4 font-mono-ui text-[10px] uppercase tracking-[.16em] text-[#2b241f] disabled:opacity-50" data-testid="button-submit-quote"><span className="flex h-12 w-12 items-center justify-center rounded-full bg-[#2b241f] text-[#f3eee6] transition-transform group-hover:translate-x-1"><ArrowUpRight size={17} strokeWidth={1.2} /></span>{sending ? 'Gönderiliyor…' : 'Teklif isteyin'}</button><button type="button" onClick={openWhatsApp} className="border-b border-[#687358] pb-2 font-mono-ui text-[10px] uppercase tracking-[.14em] text-[#687358]" data-testid="button-whatsapp-quote">WhatsApp’tan teklif al</button></div></form>}</div>
  </div></section>;
}

function DealerSection() {
  const [sent, setSent] = useState(false);
  const [sending, setSending] = useState(false);
  const [submitError, setSubmitError] = useState('');
  const formRef = useRef<HTMLFormElement>(null);
  const submit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!formRef.current || sending) return;
    setSending(true);
    setSubmitError('');
    const formData = new FormData(formRef.current);
    const payload: Record<string, string | string[]> = {};
    for (const [key, value] of formData.entries()) {
      const textValue = String(value);
      if (key in payload) payload[key] = [...(Array.isArray(payload[key]) ? payload[key] as string[] : [payload[key] as string]), textValue];
      else payload[key] = textValue;
    }
    try {
      const response = await fetch('/api/quote', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ type: 'dealer', ...payload }),
      });
      const result = await response.json().catch(() => ({}));
      if (!response.ok) throw new Error(result.error || 'Başvuru gönderilemedi. Lütfen tekrar deneyin.');
      setSent(true);
    } catch (error) {
      setSubmitError(error instanceof Error ? error.message : 'Bir hata oluştu. Lütfen tekrar deneyin.');
    } finally {
      setSending(false);
    }
  };
  const openWhatsApp = () => {
    if (!formRef.current) return;
    const data = new FormData(formRef.current);
    const value = (key: string) => String(data.get(key) || 'Belirtilmedi');
    const productsValue = data.getAll('dealerProducts').join(', ') || 'Belirtilmedi';
    const message = ['Merhaba, OSOTTO bayiliği hakkında bilgi almak istiyorum.', `Ad Soyad: ${value('name')}`, `Firma: ${value('company')}`, `E-posta: ${value('email')}`, `Telefon: ${value('phone')}`, `Ülke: ${value('country')}`, `Şehir: ${value('city')}`, `Web Sitesi: ${value('website')}`, `Instagram: ${value('instagram')}`, `İşletme Türü: ${value('businessType')}`, `Satış Kanalları: ${value('channels')}`, `İlgilendiğim Ürünler: ${productsValue}`, `Tahmini Aylık Alım: ${value('monthly')}`, `Mesaj: ${value('message')}`].join('\n');
    window.open(`${WHATSAPP_URL}?text=${encodeURIComponent(message)}`, '_blank', 'noopener,noreferrer');
  };
  const inputClass = 'mt-3 block w-full bg-transparent font-display text-xl text-[#f3eee6] outline-none placeholder:text-[#f3eee6]/30';
  return <section id="bayimiz" style={{ display: "block", opacity: 1, visibility: "visible", position: "relative", zIndex: 100 }} className="min-h-[900px] overflow-visible bg-[#687358] px-5 py-24 text-[#f3eee6] md:px-10 md:py-32"><div style={{ display: "grid", opacity: 1, visibility: "visible" }} className="mx-auto grid max-w-[1180px] gap-16 md:grid-cols-[.85fr_1.15fr] md:gap-28">
    <div><span className="font-mono-ui text-[10px] uppercase tracking-[.2em] text-[#d9e3c2]">05 / Bayimiz olun</span><h2 className="font-display mt-7 text-[clamp(3.5rem,6.5vw,7rem)] leading-[.82] tracking-[-.05em]">OSOTTO ile<br /><i className="font-normal text-[#d9e3c2]">büyüyün.</i></h2><p className="mt-9 max-w-[360px] text-[13px] leading-[1.9] text-[#f3eee6]/75">OSOTTO ürünlerini işletmenizde sunmak ve iş ortaklığımız hakkında bilgi almak için başvurun.</p><div className="mt-10 border-t border-[#f3eee6]/25 pt-5 font-mono-ui text-[9px] uppercase tracking-[.14em] text-[#f3eee6]/70">Seçili ürünler · Esnek çalışma · Doğrudan iletişim</div></div>
    <div>{sent ? <div className="flex min-h-[520px] flex-col justify-center border-t border-[#f3eee6]/25"><Check size={28} /><h3 className="font-display mt-7 text-5xl">Başvurunuz<br /><i className="font-normal text-[#d9e3c2]">başarıyla alındı.</i></h3><p className="mt-5 text-[13px] text-[#f3eee6]/75">Ekibimiz başvurunuzu inceleyerek sizinle iletişime geçecektir.</p><button onClick={() => setSent(false)} className="mt-8 w-fit border-b border-[#f3eee6]/40 pb-1 font-mono-ui text-[10px] uppercase tracking-[.15em]" data-testid="button-new-dealer">Yeni başvuru</button></div> : <form ref={formRef} onSubmit={submit} className="border-t border-[#f3eee6]/25">
      <div className="grid gap-x-7 md:grid-cols-2"><label className="block border-b border-[#f3eee6]/25 py-4"><span className="font-mono-ui text-[9px] uppercase tracking-[.14em] text-[#d9e3c2]">Ad Soyad *</span><input required name="name" className={inputClass} placeholder="Ad Soyad" data-testid="dealer-name" /></label><label className="block border-b border-[#f3eee6]/25 py-4"><span className="font-mono-ui text-[9px] uppercase tracking-[.14em] text-[#d9e3c2]">Firma Adı *</span><input required name="company" className={inputClass} placeholder="Firma adı" data-testid="dealer-company" /></label><label className="block border-b border-[#f3eee6]/25 py-4"><span className="font-mono-ui text-[9px] uppercase tracking-[.14em] text-[#d9e3c2]">E-posta *</span><input required type="email" name="email" className={inputClass} placeholder="ornek@mail.com" data-testid="dealer-email" /></label><label className="block border-b border-[#f3eee6]/25 py-4"><span className="font-mono-ui text-[9px] uppercase tracking-[.14em] text-[#d9e3c2]">Telefon *</span><input required type="tel" name="phone" className={inputClass} placeholder="05xx xxx xx xx" data-testid="dealer-phone" /></label><label className="block border-b border-[#f3eee6]/25 py-4"><span className="font-mono-ui text-[9px] uppercase tracking-[.14em] text-[#d9e3c2]">Ülke *</span><input required name="country" className={inputClass} placeholder="Türkiye" data-testid="dealer-country" /></label><label className="block border-b border-[#f3eee6]/25 py-4"><span className="font-mono-ui text-[9px] uppercase tracking-[.14em] text-[#d9e3c2]">Şehir</span><input name="city" className={inputClass} placeholder="Şehir" data-testid="dealer-city" /></label><label className="block border-b border-[#f3eee6]/25 py-4"><span className="font-mono-ui text-[9px] uppercase tracking-[.14em] text-[#d9e3c2]">Web sitesi</span><input type="url" name="website" className={inputClass} placeholder="https://" data-testid="dealer-website" /></label><label className="block border-b border-[#f3eee6]/25 py-4"><span className="font-mono-ui text-[9px] uppercase tracking-[.14em] text-[#d9e3c2]">Instagram / sosyal medya</span><input name="instagram" className={inputClass} placeholder="@kullanici" data-testid="dealer-instagram" /></label><label className="block border-b border-[#f3eee6]/25 py-4"><span className="font-mono-ui text-[9px] uppercase tracking-[.14em] text-[#d9e3c2]">Mağaza / işletme türü</span><select name="businessType" defaultValue="" className={`${inputClass} cursor-pointer`} data-testid="dealer-business"><option value="" className="text-[#2b241f]">Seçiniz</option>{['Mağaza', 'E-ticaret', 'Toptan Satış', 'Distribütör', 'Diğer'].map((item) => <option key={item} value={item} className="text-[#2b241f]">{item}</option>)}</select></label><label className="block border-b border-[#f3eee6]/25 py-4"><span className="font-mono-ui text-[9px] uppercase tracking-[.14em] text-[#d9e3c2]">Mevcut satış kanalları</span><input name="channels" className={inputClass} placeholder="Mağaza, web, pazar yeri..." data-testid="dealer-channels" /></label></div>
      <fieldset className="border-b border-[#f3eee6]/25 py-5"><legend className="font-mono-ui text-[9px] uppercase tracking-[.14em] text-[#d9e3c2]">İlgilenilen ürünler</legend><div className="mt-4 flex flex-wrap gap-3">{[...weightOptions.slice(1), 'Diğer OSOTTO ürünleri'].map((item) => <label key={item} className="flex items-center gap-2 font-mono-ui text-[9px] uppercase tracking-[.08em] text-[#f3eee6]/80"><input type="checkbox" name="dealerProducts" value={item} className="accent-[#d9e3c2]" /> {item}</label>)}</div></fieldset><label className="block border-b border-[#f3eee6]/25 py-4"><span className="font-mono-ui text-[9px] uppercase tracking-[.14em] text-[#d9e3c2]">Tahmini aylık alım miktarı</span><input name="monthly" className={inputClass} placeholder="Örneğin 100 adet" data-testid="dealer-monthly" /></label><label className="block border-b border-[#f3eee6]/25 py-4"><span className="font-mono-ui text-[9px] uppercase tracking-[.14em] text-[#d9e3c2]">Mesaj</span><textarea name="message" rows={3} className={`${inputClass} resize-none`} placeholder="İşletmeniz ve beklentiniz hakkında bilgi verin." data-testid="dealer-message" /></label><>{submitError && <p role="alert" className="mt-5 text-sm text-[#fff1e8]">{submitError}</p>}<div className="flex flex-wrap items-center gap-4 pt-8"><button type="submit" disabled={sending} className="bg-[#f3eee6] px-5 py-4 font-mono-ui text-[10px] uppercase tracking-[.14em] text-[#2b241f] transition-colors hover:bg-[#d9e3c2] disabled:opacity-50" data-testid="button-submit-dealer">{sending ? "Gönderiliyor…" : "Bayilik başvurusu gönder"}</button><button type="button" onClick={openWhatsApp} className="border-b border-[#d9e3c2] pb-2 font-mono-ui text-[10px] uppercase tracking-[.14em] text-[#d9e3c2]" data-testid="button-whatsapp-dealer">WhatsApp’tan bayilik bilgisi al</button></div></>}</form>}</div>
  </div></section>;
}

function Footer() {
  return <footer className="bg-[#2b241f] px-5 pb-8 pt-16 text-[#f3eee6] md:px-10 md:pt-20"><div className="mx-auto max-w-[1440px]"><div className="flex flex-col justify-between gap-12 md:flex-row"><div><BrandMark light /><p className="mt-7 max-w-[200px] font-display text-3xl leading-[.95] text-[#d9b29c]">Evin dokusuna<br />iyi bakın.</p></div><div className="flex gap-16 font-mono-ui text-[10px] uppercase tracking-[.15em]"><div className="space-y-4"><span className="block text-[#f3eee6]/40">Gezin</span><a href="#koleksiyon" className="block hover:text-[#d9b29c]" data-testid="footer-link-collection">Koleksiyon</a><a href="#hikayemiz" className="block hover:text-[#d9b29c]" data-testid="footer-link-story">Hakkımızda</a><a href="#iletisim" className="block hover:text-[#d9b29c]" data-testid="footer-link-quote">Teklif alın</a><a href="#bayimiz" className="block hover:text-[#d9b29c]" data-testid="footer-link-dealer">Bayimiz olun</a></div><div className="space-y-4"><span className="block text-[#f3eee6]/40">Takip</span><a href="https://www.instagram.com/osottoweb/" target="_blank" rel="noreferrer" className="flex items-center gap-2 hover:text-[#d9b29c]" data-testid="footer-link-instagram">Instagram <Instagram size={13} strokeWidth={1.4} /></a><a href={WHATSAPP_URL} target="_blank" rel="noreferrer" className="block hover:text-[#d9b29c]" data-testid="footer-link-whatsapp">WhatsApp ↗</a></div></div></div><div className="mt-20 flex flex-col justify-between gap-3 border-t border-[#f3eee6]/15 pt-5 font-mono-ui text-[9px] uppercase tracking-[.14em] text-[#f3eee6]/40 md:flex-row"><span>© 2026 OSOTTO Tekstil</span><span>Bursa · Türkiye</span><span>İyi hisler için üretildi.</span></div></div></footer>;
}

function ProductModal({ product, onClose, onQuote }: { product: Product | null; onClose: () => void; onQuote: (product: Product) => void }) {
  const [activeImage, setActiveImage] = useState(0);
  const pointerStartX = useRef<number | null>(null);
  const images = product?.images?.slice(0, 2) ?? (product ? [product.image] : []);

  useEffect(() => {
    setActiveImage(0);
    pointerStartX.current = null;
    product?.images.slice(0, 2).forEach((src) => { const image = new Image(); image.src = src; });
  }, [product]);

  if (!product) return null;
  const productWhatsAppUrl = `${WHATSAPP_URL}?text=${encodeURIComponent(`Merhaba, ${product.weight} ${product.name} hakkında teklif almak istiyorum. Ölçü: 220x240 cm.`)}`;
  const goToImage = (index: number) => {
    setActiveImage((index + images.length) % images.length);
  };
  const handlePointerStart = (event: React.PointerEvent<HTMLDivElement>) => {
    pointerStartX.current = event.clientX;
  };
  const handlePointerEnd = (event: React.PointerEvent<HTMLDivElement>) => {
    if (pointerStartX.current === null) return;
    const delta = event.clientX - pointerStartX.current;
    pointerStartX.current = null;
    if (Math.abs(delta) < 40 || images.length < 2) return;
    goToImage(activeImage + (delta > 0 ? 1 : -1));
  };

  return <div className="fixed inset-0 z-[80] flex items-end justify-center bg-[#2b241f]/70 p-0 backdrop-blur-sm md:items-center md:p-8" role="dialog" aria-modal="true" aria-label={`${product.weight} ürün detayları`}><div className="product-modal relative grid max-h-[92vh] w-full max-w-[980px] overflow-auto bg-[#f3eee6] md:grid-cols-2">
    <div className="relative min-h-[330px] touch-pan-y select-none overflow-hidden md:min-h-[590px]" onPointerDown={handlePointerStart} onPointerUp={handlePointerEnd} onPointerCancel={() => { pointerStartX.current = null; }}>
      <img src={images[activeImage]} alt={`${product.name} ${activeImage + 1}. fotoğraf`} className="absolute inset-0 h-full w-full object-cover transition-opacity duration-200" />
      <span className="absolute left-5 top-5 font-mono-ui text-[10px] uppercase tracking-[.18em] text-[#2b241f]">{product.tone}</span>
      {images.length > 1 && <>
        <button type="button" onClick={() => goToImage(activeImage - 1)} className="absolute left-4 top-1/2 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full bg-[#f3eee6]/85 text-[#2b241f] transition-colors hover:bg-[#f3eee6]" aria-label="Önceki ürün fotoğrafı" data-testid="button-previous-product-image"><ChevronLeft size={18} strokeWidth={1.3} /></button>
        <button type="button" onClick={() => goToImage(activeImage + 1)} className="absolute right-4 top-1/2 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full bg-[#f3eee6]/85 text-[#2b241f] transition-colors hover:bg-[#f3eee6]" aria-label="Sonraki ürün fotoğrafı" data-testid="button-next-product-image"><ChevronRight size={18} strokeWidth={1.3} /></button>
        <div className="absolute bottom-5 left-1/2 flex -translate-x-1/2 items-center gap-1.5 rounded-full bg-[#2b241f]/55 px-3 py-2 backdrop-blur-sm" aria-label={`${activeImage + 1} / ${images.length}`}>
          {images.map((image, index) => <button type="button" key={image} onClick={() => goToImage(index)} className={`h-1.5 rounded-full transition-all ${index === activeImage ? 'w-5 bg-[#f3eee6]' : 'w-1.5 bg-[#f3eee6]/50'}`} aria-label={`${index + 1}. fotoğrafı göster`} aria-current={index === activeImage} />)}
        </div>
      </>}
    </div>
     <div className="relative p-7 md:p-12"><button onClick={onClose} className="absolute right-5 top-5 text-[#2b241f]/65 hover:text-[#b86b4b]" aria-label="Detay penceresini kapat" data-testid="button-close-modal"><X size={21} strokeWidth={1.2} /></button><span className="font-mono-ui text-[10px] uppercase tracking-[.2em] text-[#b86b4b]">{product.weight} / OSOTTO</span><h2 className="font-display mt-7 text-5xl leading-[.88] tracking-[-.035em] text-[#2b241f] md:text-6xl">Sizin için<br /><i className="font-normal text-[#b86b4b]">doğru</i> ağırlık.</h2><p className="mt-8 text-[13px] leading-[1.8] text-[#65584d]">{product.description} Her dokunuşta aynı titizlik, her uykuda başka bir huzur.</p><div className="my-9 border-y border-[#2b241f]/15 py-5">{product.details.map((detail) => <div key={detail} className="flex items-center gap-3 py-2 font-mono-ui text-[10px] uppercase tracking-[.08em] text-[#65584d]"><Check size={13} className="text-[#b86b4b]" strokeWidth={1.4} /> {detail}</div>)}</div><a href={productWhatsAppUrl} target="_blank" rel="noreferrer" className="flex items-center justify-center gap-3 bg-[#2b241f] px-5 py-4 font-mono-ui text-[10px] uppercase tracking-[.14em] text-[#f3eee6] transition-colors hover:bg-[#b86b4b]" data-testid={`button-whatsapp-${product.id}`}>WhatsApp’tan teklif al <ArrowUpRight size={15} strokeWidth={1.2} /></a><button type="button" onClick={() => { onQuote(product); onClose(); }} className="mt-4 flex w-full items-center justify-center border border-[#2b241f]/25 px-5 py-4 font-mono-ui text-[10px] uppercase tracking-[.14em] text-[#2b241f] hover:border-[#b86b4b]" data-testid={`button-quote-${product.id}`}>Teklif al</button></div>
  </div></div>;
}

function Home() {
  const [loading, setLoading] = useState(true);
  const [menuOpen, setMenuOpen] = useState(false);
  const [selected, setSelected] = useState<Product | null>(null);
  const [quoteProduct, setQuoteProduct] = useState<Product | null>(null);
  const [selectedWeight, setSelectedWeight] = useState('Tümü');
  const finishLoading = () => setLoading(false);
  const changeWeight = (weight: string) => {
    setSelectedWeight(weight);
    const hash = weight === 'Tümü' ? '#koleksiyon' : `#koleksiyon?weight=${encodeURIComponent(weight.toLowerCase().replace(' ', ''))}`;
    window.history.replaceState(null, '', hash);
    window.requestAnimationFrame(() => document.getElementById('koleksiyon')?.scrollIntoView({ behavior: 'smooth' }));
  };
  useEffect(() => {
    if ('scrollRestoration' in window.history) window.history.scrollRestoration = 'manual';
    window.scrollTo({ top: 0, left: 0, behavior: 'instant' });
  }, []);
  useEffect(() => {
    setSelectedWeight('Tümü');
  }, []);
  useEffect(() => { document.title = 'OSOTTO | Premium Home Textile'; const description = 'OSOTTO premium ev tekstili ve battaniye koleksiyonları. Bursa’dan dünyaya uzanan kaliteli, modern ve iyi hissettiren dokular.'; let meta = document.querySelector('meta[name="description"]'); if (!meta) { meta = document.createElement('meta'); meta.setAttribute('name', 'description'); document.head.appendChild(meta); } meta.setAttribute('content', description); [['og:title', 'OSOTTO | Premium Home Textile'], ['og:description', description], ['og:type', 'website'], ['og:image', 'https://images.pexels.com/photos/5998043/pexels-photo-5998043.jpeg?auto=compress&dpr=1&w=1800']].forEach(([property, content]) => { let tag = document.querySelector(`meta[property="${property}"]`); if (!tag) { tag = document.createElement('meta'); tag.setAttribute('property', property); document.head.appendChild(tag); } tag.setAttribute('content', content); }); }, []);
  return <div className="grain min-h-[100dvh] overflow-x-hidden"><OpeningReveal onDone={finishLoading} />{loading && <div className="pointer-events-none fixed inset-0 z-[99] bg-[#2b241f]" />}{!loading && <><Nav onMenu={() => setMenuOpen(true)} onCollectionSelect={changeWeight} /><MobileMenu open={menuOpen} onClose={() => setMenuOpen(false)} onCollectionSelect={changeWeight} /><main><Hero /><Intro /><Collection onOpen={setSelected} selectedWeight={selectedWeight} onWeightChange={changeWeight} /><Story /><Stats /><QuoteSection prefillProduct={quoteProduct} /><DealerSection /></main><Footer /><a href={WHATSAPP_URL} target="_blank" rel="noreferrer" className="fixed bottom-5 right-5 z-40 flex items-center gap-2 rounded-full bg-[#687358] px-4 py-3 font-mono-ui text-[9px] uppercase tracking-[.12em] text-[#f3eee6] shadow-lg transition-transform hover:-translate-y-1 md:bottom-7 md:right-7" data-testid="button-fixed-whatsapp"><span className="h-1.5 w-1.5 rounded-full bg-[#d9e3c2]" /> WhatsApp</a><ProductModal product={selected} onClose={() => setSelected(null)} onQuote={(product) => { setQuoteProduct(product); window.requestAnimationFrame(() => document.getElementById('iletisim')?.scrollIntoView({ behavior: 'smooth' })); }} /></>}</div>;
}

function Router() {
  return <ErrorBoundary resetKey={window.location.pathname}><Switch><Route path="/" component={Home} /><Route component={NotFound} /></Switch></ErrorBoundary>;
}

function App() {
  return <QueryClientProvider client={queryClient}><TooltipProvider><WouterRouter base={import.meta.env.BASE_URL.replace(/\/$/, '')}><Router /></WouterRouter><Toaster /></TooltipProvider></QueryClientProvider>;
}


export default App;
