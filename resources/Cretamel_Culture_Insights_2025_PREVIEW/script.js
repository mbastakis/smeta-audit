
// Active section highlight
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

// Donuts
function donut(el, percent, label){
  const size = 120, stroke = 16;
  const r = (size-stroke)/2;
  const c = Math.PI * 2 * r;
  const off = c * (1 - percent/100);
  el.innerHTML = `
  <svg width="${size}" height="${size}" viewBox="0 0 ${size} ${size}" aria-label="${label}">
    <circle cx="${size/2}" cy="${size/2}" r="${r}" fill="none" stroke="#e6e8ea" stroke-width="${stroke}" />
    <circle cx="${size/2}" cy="${size/2}" r="${r}" fill="none" stroke="#B31217" stroke-width="${stroke}"
      stroke-linecap="round" stroke-dasharray="${c.toFixed(2)}" stroke-dashoffset="${off.toFixed(2)}"
      transform="rotate(-90 ${size/2} ${size/2})"/>
  </svg>`;
}
[{id:'pie1',p:70,t:'Εξωστρέφεια–Εσωστρέφεια'},
 {id:'pie2',p:70,t:'Πραγματισμός–Διαισθητικότητα'},
 {id:'pie3',p:89,t:'Λογική–Συναισθηματισμός'},
 {id:'pie4',p:86,t:'Δομή–Ευελιξία'}].forEach(x=>donut(document.getElementById(x.id), x.p, x.t));
