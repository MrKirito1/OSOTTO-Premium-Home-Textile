import { useEffect, useRef, useState, type FormEvent } from 'react';
import { ArrowDownRight, ArrowUpRight, Check, ChevronDown, ChevronUp, Instagram, Menu, Minus, Plus, X } from 'lucide-react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ErrorBoundary } from '@/components/error-boundary';
import { Toaster } from '@/components/ui/toaster';
import { TooltipProvider } from '@/components/ui/tooltip';
import NotFound from '@/pages/not-found';
import { Route, Switch, Router as WouterRouter } from 'wouter';
import { products, type Product } from '@/data/products';
import './index.css';

const queryClient = new QueryClient();
const WHATSAPP_NUMBER = '905555555555';
const WHATSAPP_URL = `https://wa.me/${WHATSAPP_NUMBER}`;
const WHATSAPP_MESSAGE_URL = `${WHATSAPP_URL}?text=${encodeURIComponent('OSOTTO koleksiyonu hakkında bilgi almak istiyorum.')}`;

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
  useEffect(() => { const timer = window.setTimeout(onDone, 1850); return () => window.clearTimeout(timer); }, [onDone]);
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

function Nav({ onMenu }: { onMenu: () => void }) {
  const [scrolled, setScrolled] = useState(false);
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener('scroll', onScroll, { passive: true }); onScroll();
    return () => window.removeEventListener('scroll', onScroll);
  }, []);
  const links = [['Koleksiyon', '#koleksiyon'], ['Hakkımızda', '#hikayemiz'], ['İletişim', '#iletisim']];
  return (
    <nav className={`fixed left-0 top-0 z-50 w-full border-b border-transparent px-5 py-5 transition-all duration-500 md:px-10 md:py-6 ${scrolled ? 'nav-scrolled' : 'text-[#f3eee6]'}`}>
      <div className="mx-auto flex max-w-[1440px] items-center justify-between">
        <a href="#anasayfa" aria-label="OSOTTO ana sayfa" data-testid="link-home"><BrandMark light={!scrolled} /></a>
        <div className="hidden items-center gap-9 md:flex">
          {links.map(([label, href]) => <a key={href} href={href} className="font-mono-ui text-[10px] uppercase tracking-[.18em] opacity-80 transition-opacity hover:opacity-100" data-testid={`link-${label}`}>{label}</a>)}
        </div>
        <div className="flex items-center gap-5">
          <a href="#iletisim" className="hidden border-b border-current pb-1 font-mono-ui text-[10px] uppercase tracking-[.16em] md:block" data-testid="link-quote-nav">Teklif alın</a>
          <button onClick={onMenu} className="md:hidden" aria-label="Menüyü aç" data-testid="button-open-menu"><Menu size={21} strokeWidth={1.4} /></button>
        </div>
      </div>
    </nav>
  );
}

function MobileMenu({ open, onClose }: { open: boolean; onClose: () => void }) {
  if (!open) return null;
  return <div className="fixed inset-0 z-[60] flex flex-col bg-[#2b241f] px-6 py-6 text-[#f3eee6] md:hidden">
    <div className="flex items-center justify-between"><BrandMark light /><button onClick={onClose} aria-label="Menüyü kapat" data-testid="button-close-menu"><X size={23} strokeWidth={1.4} /></button></div>
    <div className="mt-28 flex flex-col gap-7">
    {[['Koleksiyon', '#koleksiyon'], ['Hakkımızda', '#hikayemiz'], ['İletişim', '#iletisim']].map(([label, href], index) =>
        <a key={href} href={href} onClick={onClose} className="font-display text-5xl" data-testid={`mobile-link-${index}`}>{label}</a>)}
    </div>
    <div className="mt-auto flex items-end justify-between"><span className="max-w-[190px] font-mono-ui text-[9px] uppercase leading-relaxed tracking-[.16em] opacity-50">Evin ritmine eşlik eden dokular.</span><a href={WHATSAPP_URL} target="_blank" rel="noreferrer" className="font-mono-ui text-[10px] uppercase tracking-[.14em]" data-testid="mobile-link-whatsapp">WhatsApp ↗</a></div>
  </div>;
}

function Hero() {
  return <section id="anasayfa" className="relative flex min-h-[760px] items-end overflow-hidden bg-[#2b241f] text-[#f3eee6] md:min-h-[100svh]">
    <img src="/images/osotto-hero.jpg" alt="OSOTTO battaniye ile sakin bir yaşam alanı" className="hero-image absolute inset-0 h-full w-full object-cover opacity-70" />
    <div className="absolute inset-0 bg-gradient-to-r from-[#2b241f]/80 via-[#2b241f]/25 to-transparent" />
    <div className="absolute inset-0 bg-gradient-to-t from-[#2b241f]/70 via-transparent to-[#2b241f]/10" />
    <div className="relative mx-auto w-full max-w-[1440px] px-5 pb-16 md:px-10 md:pb-20">
      <div className="max-w-[780px]">
        <div className="reveal flex items-center gap-3 font-mono-ui text-[10px] uppercase tracking-[.24em] text-[#e6c0ad]"><span className="h-px w-8 bg-[#b86b4b]" /> 1998'den beri, Denizli</div>
        <h1 className="reveal delay-1 font-display mt-6 text-[17vw] leading-[.79] tracking-[-.055em] md:text-[11.5vw]">Eve<br /><i className="font-normal text-[#d9b29c]">iyi</i> gelen.</h1>
        <div className="reveal delay-2 mt-8 flex max-w-[520px] items-end justify-between gap-8 md:mt-10">
          <p className="text-balance max-w-[330px] text-[13px] leading-[1.8] text-[#f3eee6]/75 md:text-[14px]">Dokunmanın hafızası, uykunun en derin hâli. Türk ev tekstilini sessiz bir lüksle yeniden yorumluyoruz.</p>
          <a href="#koleksiyon" className="group hidden shrink-0 items-center gap-3 font-mono-ui text-[10px] uppercase tracking-[.16em] md:flex" data-testid="link-explore-collection"><span className="flex h-12 w-12 items-center justify-center rounded-full border border-[#f3eee6]/40 transition-colors group-hover:bg-[#f3eee6] group-hover:text-[#2b241f]"><ArrowDownRight size={16} strokeWidth={1.2} /></span> Keşfet</a>
        </div>
      </div>
    </div>
    <div className="absolute bottom-7 right-5 hidden items-center gap-3 font-mono-ui text-[9px] uppercase tracking-[.18em] text-[#f3eee6]/50 md:flex"><span className="h-px w-12 bg-[#f3eee6]/30" /> Aşağı kaydır</div>
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
  return <article ref={ref} className="product-card reveal group cursor-pointer" onClick={() => onOpen(product)} data-testid={`card-product-${product.id}`}>
    <div className="relative aspect-[.84] overflow-hidden bg-[#ded4c6]">
      <img src={product.image} alt={`${product.name} ${product.weight}`} className="product-image h-full w-full object-cover" />
      <div className="absolute inset-0 bg-[#2b241f]/0 transition-colors duration-500 group-hover:bg-[#2b241f]/10" />
      <span className="absolute left-5 top-5 font-mono-ui text-[10px] uppercase tracking-[.18em] text-[#2b241f]">{product.weight}</span>
      <button className="absolute bottom-5 right-5 flex h-11 w-11 items-center justify-center rounded-full bg-[#f3eee6] text-[#2b241f] opacity-0 transition-opacity duration-300 group-hover:opacity-100" onClick={(event) => { event.stopPropagation(); onOpen(product); }} aria-label={`${product.weight} detayını aç`} data-testid={`button-view-${product.id}`}><ArrowUpRight size={17} strokeWidth={1.3} /></button>
    </div>
    <div className="flex items-start justify-between gap-4 pt-5"><div><h3 className="font-display text-[27px] leading-[.95] text-[#2b241f]">{product.weight}</h3><p className="mt-2 max-w-[240px] text-[12px] leading-[1.6] text-[#65584d]">{product.description}</p></div><ArrowUpRight className="magnetic-arrow mt-1 text-[#b86b4b]" size={17} strokeWidth={1.2} /></div>
  </article>;
}

function Collection({ onOpen }: { onOpen: (product: Product) => void }) {
  return <section id="koleksiyon" className="bg-[#e5ddcf] px-5 py-24 md:px-10 md:py-36">
    <div className="mx-auto max-w-[1240px]">
      <div className="reveal flex flex-col justify-between gap-7 md:flex-row md:items-end"><div><span className="font-mono-ui text-[10px] uppercase tracking-[.2em] text-[#b86b4b]">02 / Koleksiyon</span><h2 className="font-display mt-5 text-[clamp(3.4rem,7vw,7.4rem)] leading-[.8] tracking-[-.05em] text-[#2b241f]">Ağırlığın<br /><i className="font-normal text-[#b86b4b]">hâlleri.</i></h2></div><p className="max-w-[245px] text-[12px] leading-[1.8] text-[#65584d] md:pb-2">Aynı ölçü, üç farklı his. Sizin evinizdeki sıcaklık için doğru ağırlığı bulun.</p></div>
      <div className="mt-16 grid gap-12 md:mt-24 md:grid-cols-3 md:gap-7">{products.map((product) => <ProductCard key={product.id} product={product} onOpen={onOpen} />)}</div>
    </div>
  </section>;
}

function Story() {
  const ref = useReveal();
  return <section id="hikayemiz" className="overflow-hidden bg-[#2b241f] text-[#f3eee6]">
    <div className="mx-auto grid max-w-[1440px] md:grid-cols-[.95fr_1.05fr]">
      <div className="relative min-h-[580px] md:min-h-[760px]"><img src="/images/osotto-story.jpg" alt="OSOTTO atölyesinde tekstil işçiliği" className="absolute inset-0 h-full w-full object-cover opacity-85" /><div className="absolute inset-0 bg-gradient-to-t from-[#2b241f]/40 to-transparent" /><span className="absolute bottom-7 left-5 font-mono-ui text-[9px] uppercase tracking-[.18em] text-[#f3eee6]/60 md:left-10">Denizli, Türkiye / 1998—</span></div>
      <div ref={ref} className="reveal flex flex-col justify-center px-5 py-24 md:px-20 md:py-32">
        <span className="font-mono-ui text-[10px] uppercase tracking-[.2em] text-[#d9a387]">03 / Hikâyemiz</span>
        <h2 className="font-display mt-8 max-w-[580px] text-[clamp(3rem,5.7vw,6.3rem)] leading-[.86] tracking-[-.045em]">Bir ev,<br />bir <i className="font-normal text-[#d9a387]">his.</i></h2>
        <p className="mt-10 max-w-[445px] text-[13px] leading-[1.9] text-[#f3eee6]/65 md:text-[14px]">OSOTTO’nun hikâyesi, Denizli’de bir tezgâhın başında başladı. Bugün hâlâ aynı şeye inanıyoruz: Bir tekstil ürünü yalnızca kumaştan ibaret değildir. Bir mevsimi, bir alışkanlığı, bir evin sesini taşır.</p>
        <a href="#iletisim" className="mt-10 flex w-fit items-center gap-3 border-b border-[#f3eee6]/30 pb-2 font-mono-ui text-[10px] uppercase tracking-[.15em] transition-colors hover:border-[#d9a387] hover:text-[#d9a387]" data-testid="link-read-story">Bizi tanıyın <ArrowUpRight size={15} strokeWidth={1.2} /></a>
      </div>
    </div>
  </section>;
}

function Stats() {
  const stats = [['26', 'yıl', 'Aynı özenle'], ['14', 'ülke', 'Dünyaya açılan'], ['03', 'ağırlık', 'Tek bir ölçüde']];
  return <section className="bg-[#b86b4b] px-5 py-20 text-[#f3eee6] md:px-10 md:py-28"><div className="mx-auto grid max-w-[1180px] gap-12 md:grid-cols-3 md:gap-8">{stats.map(([number, unit, label], index) => <div key={number} className="reveal border-t border-[#f3eee6]/35 pt-4" style={{ transitionDelay: `${index * 120}ms` }}><div className="flex items-baseline gap-3"><span className="font-display text-7xl leading-none tracking-[-.05em]">{number}</span><span className="font-mono-ui text-[10px] uppercase tracking-[.16em]">{unit}</span></div><p className="mt-4 font-mono-ui text-[10px] uppercase tracking-[.16em] text-[#f3eee6]/70">{label}</p></div>)}</div></section>;
}

function Contact() {
  const [sent, setSent] = useState(false);
  const submit = (event: FormEvent<HTMLFormElement>) => { event.preventDefault(); setSent(true); };
  return <section id="iletisim" className="bg-[#f3eee6] px-5 py-24 md:px-10 md:py-36"><div className="mx-auto grid max-w-[1180px] gap-16 md:grid-cols-[.85fr_1.15fr] md:gap-28">
    <div className="reveal"><span className="font-mono-ui text-[10px] uppercase tracking-[.2em] text-[#b86b4b]">04 / İletişim</span><h2 className="font-display mt-6 text-[clamp(3.3rem,6.5vw,6.8rem)] leading-[.82] tracking-[-.05em] text-[#2b241f]">Birlikte<br /><i className="font-normal text-[#b86b4b]">konuşalım.</i></h2><p className="mt-9 max-w-[270px] text-[13px] leading-[1.8] text-[#65584d]">Koleksiyon, kurumsal talepler veya eviniz için doğru seçim hakkında bize yazın.</p><div className="mt-10 space-y-2 font-mono-ui text-[10px] uppercase tracking-[.14em] text-[#2b241f]"><a href="mailto:merhaba@osotto.com.tr" className="block w-fit border-b border-[#b86b4b]/50 pb-1" data-testid="link-email">merhaba@osotto.com.tr</a><a href="tel:+905431945858" className="block w-fit border-b border-[#b86b4b]/50 pb-1" data-testid="link-phone">0543 194 58 58</a></div></div>
    <div className="reveal delay-1">{sent ? <div className="flex min-h-[360px] flex-col justify-center border-t border-[#2b241f]/20"><Check className="text-[#b86b4b]" size={28} strokeWidth={1.2} /><h3 className="font-display mt-7 text-5xl text-[#2b241f]">Mesajınız<br /><i className="font-normal text-[#b86b4b]">ulaştı.</i></h3><p className="mt-5 text-[13px] text-[#65584d]">En kısa zamanda sizinle iletişime geçeceğiz.</p><button onClick={() => setSent(false)} className="mt-8 w-fit border-b border-[#2b241f]/40 pb-1 font-mono-ui text-[10px] uppercase tracking-[.15em]" data-testid="button-new-message">Yeni mesaj</button></div> : <form onSubmit={submit} className="border-t border-[#2b241f]/20"><label className="block border-b border-[#2b241f]/20 py-5"><span className="font-mono-ui text-[9px] uppercase tracking-[.16em] text-[#65584d]">Adınız</span><input required name="name" className="mt-3 block w-full bg-transparent font-display text-2xl text-[#2b241f] outline-none placeholder:text-[#2b241f]/25" placeholder="Ad Soyad" data-testid="input-name" /></label><label className="block border-b border-[#2b241f]/20 py-5"><span className="font-mono-ui text-[9px] uppercase tracking-[.16em] text-[#65584d]">E-posta</span><input required type="email" name="email" className="mt-3 block w-full bg-transparent font-display text-2xl text-[#2b241f] outline-none placeholder:text-[#2b241f]/25" placeholder="ornek@mail.com" data-testid="input-email" /></label><label className="block border-b border-[#2b241f]/20 py-5"><span className="font-mono-ui text-[9px] uppercase tracking-[.16em] text-[#65584d]">Mesajınız</span><textarea required name="message" rows={3} className="mt-3 block w-full resize-none bg-transparent font-display text-2xl text-[#2b241f] outline-none placeholder:text-[#2b241f]/25" placeholder="Size nasıl yardımcı olabiliriz?" data-testid="input-message" /></label><button type="submit" className="group mt-8 flex items-center gap-4 font-mono-ui text-[10px] uppercase tracking-[.16em] text-[#2b241f]" data-testid="button-submit-contact"><span className="flex h-12 w-12 items-center justify-center rounded-full bg-[#2b241f] text-[#f3eee6] transition-transform group-hover:translate-x-1"><ArrowUpRight size={17} strokeWidth={1.2} /></span> Gönder</button></form>}</div>
  </div></section>;
}

function Footer() {
  return <footer className="bg-[#2b241f] px-5 pb-8 pt-16 text-[#f3eee6] md:px-10 md:pt-20"><div className="mx-auto max-w-[1440px]"><div className="flex flex-col justify-between gap-12 md:flex-row"><div><BrandMark light /><p className="mt-7 max-w-[200px] font-display text-3xl leading-[.95] text-[#d9b29c]">Evin dokusuna<br />iyi bakın.</p></div><div className="flex gap-16 font-mono-ui text-[10px] uppercase tracking-[.15em]"><div className="space-y-4"><span className="block text-[#f3eee6]/40">Gezin</span><a href="#koleksiyon" className="block hover:text-[#d9b29c]" data-testid="footer-link-collection">Koleksiyon</a><a href="#hikayemiz" className="block hover:text-[#d9b29c]" data-testid="footer-link-story">Hakkımızda</a></div><div className="space-y-4"><span className="block text-[#f3eee6]/40">Takip</span><a href="https://instagram.com" target="_blank" rel="noreferrer" className="flex items-center gap-2 hover:text-[#d9b29c]" data-testid="footer-link-instagram">Instagram <Instagram size={13} strokeWidth={1.4} /></a><a href={WHATSAPP_URL} target="_blank" rel="noreferrer" className="block hover:text-[#d9b29c]" data-testid="footer-link-whatsapp">WhatsApp ↗</a></div></div></div><div className="mt-20 flex flex-col justify-between gap-3 border-t border-[#f3eee6]/15 pt-5 font-mono-ui text-[9px] uppercase tracking-[.14em] text-[#f3eee6]/40 md:flex-row"><span>© 2026 OSOTTO Tekstil</span><span>Denizli · Türkiye</span><span>İyi hisler için üretildi.</span></div></div></footer>;
}

function ProductModal({ product, onClose }: { product: Product | null; onClose: () => void }) {
  if (!product) return null;
  return <div className="fixed inset-0 z-[80] flex items-end justify-center bg-[#2b241f]/70 p-0 backdrop-blur-sm md:items-center md:p-8" role="dialog" aria-modal="true" aria-label={`${product.weight} ürün detayları`}><div className="relative grid max-h-[92vh] w-full max-w-[980px] overflow-auto bg-[#f3eee6] md:grid-cols-2">
    <div className="relative min-h-[330px] md:min-h-[590px]"><img src={product.image} alt={product.name} className="absolute inset-0 h-full w-full object-cover" /><span className="absolute left-5 top-5 font-mono-ui text-[10px] uppercase tracking-[.18em] text-[#2b241f]">{product.tone}</span></div>
    <div className="relative p-7 md:p-12"><button onClick={onClose} className="absolute right-5 top-5 text-[#2b241f]/65 hover:text-[#b86b4b]" aria-label="Detay penceresini kapat" data-testid="button-close-modal"><X size={21} strokeWidth={1.2} /></button><span className="font-mono-ui text-[10px] uppercase tracking-[.2em] text-[#b86b4b]">{product.weight} / OSOTTO</span><h2 className="font-display mt-7 text-5xl leading-[.88] tracking-[-.035em] text-[#2b241f] md:text-6xl">Sizin için<br /><i className="font-normal text-[#b86b4b]">doğru</i> ağırlık.</h2><p className="mt-8 text-[13px] leading-[1.8] text-[#65584d]">{product.description} Her dokunuşta aynı titizlik, her uykuda başka bir huzur.</p><div className="my-9 border-y border-[#2b241f]/15 py-5">{product.details.map((detail) => <div key={detail} className="flex items-center gap-3 py-2 font-mono-ui text-[10px] uppercase tracking-[.08em] text-[#65584d]"><Check size={13} className="text-[#b86b4b]" strokeWidth={1.4} /> {detail}</div>)}</div><a href={WHATSAPP_MESSAGE_URL} target="_blank" rel="noreferrer" className="flex items-center justify-center gap-3 bg-[#2b241f] px-5 py-4 font-mono-ui text-[10px] uppercase tracking-[.14em] text-[#f3eee6] transition-colors hover:bg-[#b86b4b]" data-testid={`button-whatsapp-${product.id}`}>WhatsApp’tan bilgi alın <ArrowUpRight size={15} strokeWidth={1.2} /></a><a href="#iletisim" onClick={onClose} className="mt-4 flex items-center justify-center border border-[#2b241f]/25 px-5 py-4 font-mono-ui text-[10px] uppercase tracking-[.14em] text-[#2b241f] hover:border-[#b86b4b]" data-testid={`button-quote-${product.id}`}>Teklif isteyin</a></div>
  </div></div>;
}

function Home() {
  const [loading, setLoading] = useState(true);
  const [menuOpen, setMenuOpen] = useState(false);
  const [selected, setSelected] = useState<Product | null>(null);
  const finishLoading = () => setLoading(false);
  useEffect(() => { document.title = 'OSOTTO — Evin dokusuna iyi gelen'; const description = 'OSOTTO, Denizli’den dünyaya uzanan premium Türk ev tekstili. Çift katlı embos battaniyeler ve iyi hissettiren dokular.'; let meta = document.querySelector('meta[name="description"]'); if (!meta) { meta = document.createElement('meta'); meta.setAttribute('name', 'description'); document.head.appendChild(meta); } meta.setAttribute('content', description); [['og:title', 'OSOTTO — Evin dokusuna iyi gelen'], ['og:description', description], ['og:type', 'website']].forEach(([property, content]) => { let tag = document.querySelector(`meta[property="${property}"]`); if (!tag) { tag = document.createElement('meta'); tag.setAttribute('property', property); document.head.appendChild(tag); } tag.setAttribute('content', content); }); }, []);
  return <div className="grain min-h-[100dvh] overflow-x-hidden"><OpeningReveal onDone={finishLoading} />{loading && <div className="pointer-events-none fixed inset-0 z-[99] bg-[#2b241f]" />}{!loading && <><Nav onMenu={() => setMenuOpen(true)} /><MobileMenu open={menuOpen} onClose={() => setMenuOpen(false)} /><main><Hero /><Intro /><Collection onOpen={setSelected} /><Story /><Stats /><Contact /></main><Footer /><a href={WHATSAPP_URL} target="_blank" rel="noreferrer" className="fixed bottom-5 right-5 z-40 flex items-center gap-2 rounded-full bg-[#687358] px-4 py-3 font-mono-ui text-[9px] uppercase tracking-[.12em] text-[#f3eee6] shadow-lg transition-transform hover:-translate-y-1 md:bottom-7 md:right-7" data-testid="button-fixed-whatsapp"><span className="h-1.5 w-1.5 rounded-full bg-[#d9e3c2]" /> WhatsApp</a><ProductModal product={selected} onClose={() => setSelected(null)} /></>}</div>;
}

function Router() {
  return <ErrorBoundary resetKey={window.location.pathname}><Switch><Route path="/" component={Home} /><Route component={NotFound} /></Switch></ErrorBoundary>;
}

function App() {
  return <QueryClientProvider client={queryClient}><TooltipProvider><WouterRouter base={import.meta.env.BASE_URL.replace(/\/$/, '')}><Router /></WouterRouter><Toaster /></TooltipProvider></QueryClientProvider>;
}

export default App;