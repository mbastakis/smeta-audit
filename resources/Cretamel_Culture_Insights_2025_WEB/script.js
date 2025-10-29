
const slides = Array.from(document.querySelectorAll('.slide'));
const navBtns = Array.from(document.querySelectorAll('.nav button'));
let idx = 0;

function show(i){
  idx = (i+slides.length)%slides.length;
  slides.forEach((s,k)=>s.classList.toggle('active', k===idx));
  navBtns.forEach((b,k)=>b.classList.toggle('active', k===idx));
  window.scrollTo({top:0, behavior:'instant'});
}

document.getElementById('prev').addEventListener('click', ()=>show(idx-1));
document.getElementById('next').addEventListener('click', ()=>show(idx+1));
navBtns.forEach((b,k)=>b.addEventListener('click', ()=>show(k)));

document.getElementById('print').addEventListener('click', ()=>window.print());

// Draw donut pies
function donut(el, percent, label){
  const size = 120, stroke = 16;
  const r = (size-stroke)/2;
  const c = Math.PI * 2 * r;
  const off = c * (1 - percent/100);
  el.innerHTML = `
  <svg width="${size}" height="${size}" viewBox="0 0 ${size} ${size}" aria-label="${label}">
    <circle cx="${size/2}" cy="${size/2}" r="${r}" fill="none" stroke="#eceeef" stroke-width="${stroke}" />
    <circle cx="${size/2}" cy="${size/2}" r="${r}" fill="none" stroke="#B31217" stroke-width="${stroke}"
      stroke-linecap="round" stroke-dasharray="${c.toFixed(2)}" stroke-dashoffset="${off.toFixed(2)}"
      transform="rotate(-90 ${size/2} ${size/2})"/>
  </svg>`;
}

const pies = [
  {id:'pie1', p:70, t:'Εξωστρέφεια–Εσωστρέφεια'},
  {id:'pie2', p:70, t:'Πραγματισμός–Διαισθητικότητα'},
  {id:'pie3', p:89, t:'Λογική–Συναισθηματισμός'},
  {id:'pie4', p:86, t:'Δομή–Ευελιξία'},
];
pies.forEach(x=>donut(document.getElementById(x.id), x.p, x.t));

show(0);
