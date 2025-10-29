
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
