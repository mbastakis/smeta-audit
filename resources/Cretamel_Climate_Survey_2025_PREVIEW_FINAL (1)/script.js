
// Donut helper
function donut(el, percent, label){
  const size = 120, stroke = 16;
  const r = (size-stroke)/2;
  const c = Math.PI * 2 * r;
  const p = Math.max(0, Math.min(100, Number(percent)||0));
  const off = c * (1 - p/100);
  el.innerHTML = `
  <svg width="${size}" height="${size}" viewBox="0 0 ${size} ${size}" aria-label="${label}">
    <circle cx="${size/2}" cy="${size/2}" r="${r}" fill="none" stroke="#e6e8ea" stroke-width="${stroke}" />
    <circle cx="${size/2}" cy="${size/2}" r="${r}" fill="none" stroke="#B31217" stroke-width="${stroke}"
      stroke-linecap="round" stroke-dasharray="${c.toFixed(2)}" stroke-dashoffset="${off.toFixed(2)}"
      transform="rotate(-90 ${size/2} ${size/2})"/>
  </svg>`;
}

const KPIS = [
  {id:'k1', t:'Επικοινωνία & Διαφάνεια', v:68},
  {id:'k2', t:'Υποστήριξη & Σεβασμός', v:82},
  {id:'k3', t:'Ανάπτυξη & Ευκαιρίες', v:60},
  {id:'k4', t:'Εργασιακές Συνθήκες & Ασφάλεια', v:90},
  {id:'k5', t:'Work-Life & Wellbeing', v:88},
  {id:'k6', t:'Engagement & Δέσμευση', v:92},
];

function renderKPIs(){
  KPIS.forEach((k,i)=>{
    donut(document.getElementById('donut_'+k.id), k.v, k.t);
    document.getElementById('num_'+k.id).textContent = k.v + '%';
  });
}
renderKPIs();

// Nav highlight
const links = Array.from(document.querySelectorAll('.nav a'));
const sections = Array.from(document.querySelectorAll('.section'));
const io = new IntersectionObserver(entries=>{
  entries.forEach(e=>{
    if(e.isIntersecting){
      links.forEach(a=>a.classList.toggle('active', a.getAttribute('href')==='#'+e.target.id));
    }
  });
},{rootMargin:'-30% 0px -60% 0px', threshold:[0,1]});
sections.forEach(s=>io.observe(s));

document.getElementById('print').addEventListener('click', ()=>window.print());
