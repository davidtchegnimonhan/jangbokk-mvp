(function(){
  // Theme persistence
  const themeToggle = document.getElementById('themeToggle');
  const themeIcon = document.getElementById('themeIcon');
  const savedTheme = localStorage.getItem('theme') || 'dark';
  document.documentElement.dataset.theme = savedTheme;
  if (themeIcon) themeIcon.textContent = savedTheme === 'dark' ? '🌙' : '☀️';

  if (themeToggle) {
    themeToggle.addEventListener('click', () => {
      const current = document.documentElement.dataset.theme || 'dark';
      const next = current === 'dark' ? 'light' : 'dark';
      document.documentElement.dataset.theme = next;
      localStorage.setItem('theme', next);
      if (themeIcon) themeIcon.textContent = next === 'dark' ? '🌙' : '☀️';
    });
  }

  // Year
  const yearEl = document.getElementById('year');
  if (yearEl) yearEl.textContent = String(new Date().getFullYear());

  // Background particles
  const canvas = document.getElementById('bgParticles');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  let width, height, particles;

  function resize(){
    width = canvas.width = window.innerWidth;
    height = canvas.height = window.innerHeight;
    particles = new Array(60).fill(0).map(() => ({
      x: Math.random()*width,
      y: Math.random()*height,
      r: Math.random()*2+0.5,
      dx: (Math.random()-0.5)*0.3,
      dy: (Math.random()-0.5)*0.3,
      o: Math.random()*0.4+0.2
    }));
  }
  resize();
  window.addEventListener('resize', resize);

  function draw(){
    ctx.clearRect(0,0,width,height);
    particles.forEach(p => {
      p.x += p.dx; p.y += p.dy;
      if (p.x < 0 || p.x > width) p.dx *= -1;
      if (p.y < 0 || p.y > height) p.dy *= -1;
      ctx.beginPath();
      ctx.fillStyle = `rgba(245,197,66,${p.o})`;
      ctx.arc(p.x,p.y,p.r,0,Math.PI*2);
      ctx.fill();
    });
    requestAnimationFrame(draw);
  }
  requestAnimationFrame(draw);
})();
