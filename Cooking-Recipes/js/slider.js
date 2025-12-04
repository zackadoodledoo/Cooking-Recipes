// js/slider.js
export default function initSlider(selector){
  const root = typeof selector === 'string' ? document.querySelector(selector) : selector;
  if (!root) return;
  const slides = root.querySelector('.slides');
  const imgs = slides.querySelectorAll('img');
  const prev = root.querySelector('.prev');
  const next = root.querySelector('.next');
  let idx = 0;
  const total = imgs.length;

  function show(i){
    idx = (i + total) % total;
    slides.style.transform = `translateX(-${idx * 100}%)`;
  }
  prev.addEventListener('click', ()=> show(idx-1));
  next.addEventListener('click', ()=> show(idx+1));

  let interval = setInterval(()=> show(idx+1), 4500);

  root.addEventListener('mouseenter', ()=> clearInterval(interval));
  root.addEventListener('mouseleave', ()=> interval = setInterval(()=> show(idx+1), 4500));

  // touch support
  let startX = 0;
  slides.addEventListener('touchstart', (e) => startX = e.touches[0].clientX);
  slides.addEventListener('touchend', (e) => {
    const diff = startX - e.changedTouches[0].clientX;
    if (diff > 40) show(idx+1);
    if (diff < -40) show(idx-1);
  });
}

// If loaded directly (non-module use)
document.querySelectorAll('.slider').forEach(sl => {
  // initialize basic slider for each container
  try { initSlider(sl); } catch(e){ /* ignore in non-module contexts */ }
});
