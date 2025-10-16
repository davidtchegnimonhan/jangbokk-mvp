(function(){
  const session = window.JBAuth?.getSession?.();
  const users = JSON.parse(localStorage.getItem('jb_users') || '[]');
  const user = users.find(u => u.id === session?.userId);
  if (!user) { window.location.href = '/login.html'; return; }

  const productsKey = 'jb_products';
  const products = JSON.parse(localStorage.getItem(productsKey) || '[]');

  const grid = document.getElementById('productsGrid');
  const searchInput = document.getElementById('searchInput');
  const categoryFilter = document.getElementById('categoryFilter');
  const openSeller = document.getElementById('openSeller');
  const sellDialog = document.getElementById('sellDialog');
  const saveListing = document.getElementById('saveListing');
  const sellFile = document.getElementById('sellFile');
  const sellCamera = document.getElementById('sellCamera');

  const invoiceDialog = document.getElementById('invoiceDialog');
  const invoiceBolt11 = document.getElementById('invoiceBolt11');
  const invoiceStatus = document.getElementById('invoiceStatus');


document.addEventListener('DOMContentLoaded', function() {
  const createInvoiceBtn = document.getElementById('createInvoiceBtn');
  const copyInvoiceBtn = document.getElementById('copyInvoiceBtn');
  const invoiceOutput = document.getElementById('invoiceOutput');
  const recvAmount = document.getElementById('recvAmount');
  const recvMemo = document.getElementById('recvMemo');

  if (createInvoiceBtn) {
    createInvoiceBtn.addEventListener('click', async function(e) {
      e.preventDefault();
      const amount = recvAmount.value;
      const memo = recvMemo.value;
      if (!amount || isNaN(amount) || amount <= 0) {
        invoiceOutput.textContent = 'Please enter a valid amount.';
        return;
      }
      invoiceOutput.textContent = 'Creating invoice...';
      try {
        // Replace with your actual API call to create a Lightning invoice
        const response = await fetch('/api/create-invoice', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ amount, memo })
        });
        const data = await response.json();
        if (data && data.invoice) {
          invoiceOutput.textContent = data.invoice;
        } else {
          invoiceOutput.textContent = 'Failed to create invoice.';
        }
      } catch (err) {
        invoiceOutput.textContent = 'Error creating invoice.';
      }
    });
  }

  if (copyInvoiceBtn) {
    copyInvoiceBtn.addEventListener('click', function(e) {
      e.preventDefault();
      if (invoiceOutput.textContent) {
        navigator.clipboard.writeText(invoiceOutput.textContent)
          .then(() => {
            copyInvoiceBtn.textContent = 'Copied!';
            setTimeout(() => {
              copyInvoiceBtn.textContent = 'Copy';
            }, 1200);
          })
          .catch(() => {
            copyInvoiceBtn.textContent = 'Failed!';
            setTimeout(() => {
              copyInvoiceBtn.textContent = 'Copy';
            }, 1200);
          });
      }
    });
  }
});

  function seed(){
    if (products.length) return;
    const sample = [
      { id:'p1', title:'Thiebou Dienne', desc:'Senegalese national dish', price:500, image:'https://images.unsplash.com/photo-1504674900247-0877df9cc836?q=80&w=800&auto=format&fit=crop', category:'food' },
      { id:'p2', title:'Phone Credit Top-up', desc:'Instant mobile top-up', price:800, image:'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?q=80&w=800&auto=format&fit=crop', category:'digital' },
      { id:'p3', title:'Haircut', desc:'Local barber service', price:1200, image:'https://images.unsplash.com/photo-1503951914875-452162b0f3f1?q=80&w=800&auto=format&fit=crop', category:'services' },
    ];
    localStorage.setItem(productsKey, JSON.stringify(sample));
    return sample;
  }

  function getAll(){
    return JSON.parse(localStorage.getItem(productsKey) || '[]') || seed();
  }

  function render(){
    grid.innerHTML = '';
    const term = (searchInput.value||'').toLowerCase();
    const cat = categoryFilter.value;
    getAll().filter(p => {
      const matchesTerm = !term || p.title.toLowerCase().includes(term) || p.desc.toLowerCase().includes(term);
      const matchesCat = cat === 'all' || p.category === cat;
      return matchesTerm && matchesCat;
    }).forEach(p => {
      const card = document.createElement('div');
      card.className = 'card';
      card.innerHTML = `
        <img src="${p.image}" alt="${p.title}" />
        <div class="content">
          <div>
            <h3 class="font-poppins font-semibold">${p.title}</h3>
            <p class="text-sm text-white/70">${p.desc}</p>
          </div>
          <div class="meta">
            <span class="text-bitcoin-500 font-semibold">${p.price} ⚡</span>
            <button class="btn btn-primary" data-buy="${p.id}">${window.t ? window.t('buy') : 'Buy ⚡'}</button>
          </div>
        </div>`;
      grid.appendChild(card);
    });
  }
  render();

  searchInput.addEventListener('input', render);
  categoryFilter.addEventListener('change', render);

  openSeller.addEventListener('click', () => {
    if (typeof sellDialog.showModal === 'function') sellDialog.showModal(); else sellDialog.setAttribute('open','open');
  });

  saveListing.addEventListener('click', (e) => {
    e.preventDefault();
    const p = {
      id: 'p'+Date.now(),
      title: document.getElementById('sellTitle').value.trim(),
      desc: document.getElementById('sellDesc').value.trim(),
      price: Number(document.getElementById('sellPrice').value),
      image: document.getElementById('sellImage').value.trim() || 'https://images.unsplash.com/photo-1542831371-29b0f74f9713?q=80&w=1200&auto=format&fit=crop',
      category: document.getElementById('sellCategory').value,
      sellerId: user.id
    };
    if (!p.title || !p.price) return alert(window.t ? window.t('missing_fields') : 'Missing fields');
    const list = getAll();
    list.push(p);
    localStorage.setItem(productsKey, JSON.stringify(list));
    if (sellDialog.close) sellDialog.close(); else sellDialog.removeAttribute('open');
    render();
  });

  async function fileToDataUrl(file){
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result);
      reader.onerror = reject;
      reader.readAsDataURL(file);
    });
  }

  async function handleImageFile(input){
    const file = input?.files?.[0];
    if (!file) return;
    if (!file.type.startsWith('image/')) { input.value = ''; return; }
    const MAX_BYTES = 1.2 * 1024 * 1024; // 1.2MB limit
    if (file.size > MAX_BYTES) {
      // downscale via canvas
      const dataUrl = await fileToDataUrl(file);
      const img = new Image();
      img.src = dataUrl;
      await new Promise(r => { img.onload = r; img.onerror = r; });
      const canvas = document.createElement('canvas');
      const scale = Math.sqrt((MAX_BYTES / file.size));
      const w = Math.max(320, Math.floor(img.width * Math.min(1, scale)));
      const h = Math.max(320, Math.floor(img.height * Math.min(1, scale)));
      canvas.width = w; canvas.height = h;
      const ctx = canvas.getContext('2d');
      ctx.drawImage(img, 0, 0, w, h);
      const compressed = canvas.toDataURL('image/jpeg', 0.8);
      document.getElementById('sellImage').value = compressed;
    } else {
      const url = await fileToDataUrl(file);
      document.getElementById('sellImage').value = url;
    }
  }

  if (sellFile) sellFile.addEventListener('change', () => handleImageFile(sellFile));
  if (sellCamera) sellCamera.addEventListener('change', () => handleImageFile(sellCamera));

  grid.addEventListener('click', async (e) => {
    const btn = e.target.closest('button[data-buy]');
    if (!btn) return;
    const pid = btn.getAttribute('data-buy');
    const prod = getAll().find(x => x.id === pid);
    if (!prod) return;

    try {
      const res = await fetch('/api/lnbits/invoice', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ amount: prod.price, memo: `Purchase: ${prod.title}` })
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data?.error || 'Failed to create invoice');
      invoiceBolt11.textContent = data.payment_request;
      invoiceStatus.textContent = (window.t ? window.t('waiting_payment') : 'Waiting for payment...');
      if (typeof invoiceDialog.showModal === 'function') invoiceDialog.showModal(); else invoiceDialog.setAttribute('open','open');

      const hash = data.payment_hash;
      const start = Date.now();
      const poll = setInterval(async () => {
        if (Date.now() - start > 120000) { clearInterval(poll); invoiceStatus.textContent = (window.t ? window.t('expired') : 'Expired'); return; }
        const r = await fetch(`/api/lnbits/payment/${hash}`);
        const j = await r.json();
        if (j.paid === true || j.status === 'paid') {
          clearInterval(poll);
          invoiceStatus.textContent = (window.t ? window.t('payment_confirmed') : 'Payment confirmed ✅');
          // update user activity
          user.activity = user.activity || [];
          const text = window.t ? window.t('purchased_for_sats', { title: prod.title, price: prod.price }) : `Purchased ${prod.title} for ${prod.price} sats`;
          user.activity.push({ ts: Date.now(), text });
          localStorage.setItem('jb_users', JSON.stringify(users));
        }
      }, 2500);
    } catch (err) {
      alert(err.message || (window.t ? window.t('error_generic') : 'Error'));
    }
  });
})();
