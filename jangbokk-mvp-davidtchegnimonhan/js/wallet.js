(function(){
  const outboxKey = 'jb_outbox';

  function getUsers(){
    return JSON.parse(localStorage.getItem('jb_users') || '[]');
  }
  function setUsers(users){
    localStorage.setItem('jb_users', JSON.stringify(users));
  }
  function getCurrentUser(){
    const session = window.JBAuth?.getSession?.();
    const users = getUsers();
    return users.find(u => u.id === session?.userId) || null;
  }
  function getOutbox(){
    const raw = JSON.parse(localStorage.getItem(outboxKey) || '{}');
    return raw || {};
  }
  function setOutbox(map){
    localStorage.setItem(outboxKey, JSON.stringify(map));
  }
  function getUserOutbox(userId){
    const map = getOutbox();
    if (!map[userId]) map[userId] = [];
    return map[userId];
  }
  function saveUserOutbox(userId, list){
    const map = getOutbox();
    map[userId] = list;
    setOutbox(map);
  }

  // UI elements
  const sendType = document.getElementById('sendType');
  const sendAmount = document.getElementById('sendAmount');
  const sendMemo = document.getElementById('sendMemo');
  const sendRecipient = document.getElementById('sendRecipient');
  const sendBolt11 = document.getElementById('sendBolt11');
  const sendBtn = document.getElementById('sendBtn');
  const sendForm = document.getElementById('sendForm');
  const outboxList = document.getElementById('outboxList');
  const syncBtn = document.getElementById('syncBtn');

  // Top-up elements
  const topupForm = document.getElementById('topupForm');
  const topupBtn = document.getElementById('topupBtn');
  const topupAmount = document.getElementById('topupAmount');
  const topupPhone = document.getElementById('topupPhone');
  const topupStatus = document.getElementById('topupStatus');
  const providerButtons = Array.from(document.querySelectorAll('.topup-provider'));
  let currentProvider = 'mtn';

  const recvAmount = document.getElementById('recvAmount');
  const recvMemo = document.getElementById('recvMemo');
  const createInvoiceBtn = document.getElementById('createInvoiceBtn');
  const invoiceOutput = document.getElementById('invoiceOutput');
  const copyInvoiceBtn = document.getElementById('copyInvoiceBtn');

  function renderOutbox(){
    const user = getCurrentUser();
    if (!user || !outboxList) return;
    const items = getUserOutbox(user.id).slice().reverse();
    outboxList.innerHTML = '';
    if (!items.length) {
      const li = document.createElement('li');
      li.className = 'text-white/60';
      li.textContent = (window.t ? window.t('no_queued_transactions') : 'No queued transactions.');
      outboxList.appendChild(li);
      return;
    }
    items.forEach(tx => {
      const li = document.createElement('li');
      li.className = 'glass rounded-xl p-3 text-sm';
      const status = tx.status || 'pending';
      const base = tx.type === 'internal' ? `Internal to ${tx.toEmail||tx.toPhone}` : 'Lightning';
      li.textContent = `${new Date(tx.ts).toLocaleString()} — ${base} — ${tx.amount} sats — ${status}`;
      outboxList.appendChild(li);
    });
  }

  async function processInternal(tx){
    const users = getUsers();
    const session = window.JBAuth?.getSession?.();
    const from = users.find(u => u.id === session?.userId);
    let to = null;
    if (tx.toUserId) {
      to = users.find(u => u.id === tx.toUserId);
    } else if (tx.toEmail) {
      to = users.find(u => u.email === tx.toEmail);
    } else if (tx.toPhone) {
      to = users.find(u => u.phone === tx.toPhone);
    }
    if (!from || !to) {
      tx.status = 'failed';
      tx.error = (window.t ? window.t('recipient_not_found') : 'Recipient not found');
      return tx;
    }
    const amount = Number(tx.amount || 0);
    if (!Number.isFinite(amount) || amount < 1) {
      tx.status = 'failed';
      tx.error = (window.t ? window.t('invalid_amount') : 'Invalid amount');
      return tx;
    }
    if ((from.sats||0) < amount) {
      tx.status = 'failed';
      tx.error = (window.t ? window.t('insufficient_balance') : 'Insufficient balance');
      return tx;
    }
    from.sats = (from.sats||0) - amount;
    to.sats = (to.sats||0) + amount;
    from.activity = from.activity || [];
    to.activity = to.activity || [];
    const memo = tx.memo ? ` — ${tx.memo}` : '';
    from.activity.push({ ts: Date.now(), text: (window.t ? window.t('sent_sats_to', { amount, to: to.name }) : `Sent ${amount} sats to ${to.name}`) + (memo?memo:'') });
    to.activity.push({ ts: Date.now(), text: (window.t ? window.t('received_sats_from', { amount, from: from.name }) : `Received ${amount} sats from ${from.name}`) + (memo?memo:'') });
    setUsers(users);
    tx.status = 'sent';
    return tx;
  }

  async function processLightning(tx){
    const amount = Number(tx.amount || 0);
    if (!navigator.onLine) return tx; // wait for connectivity
    try {
      // Rely on LNBits to validate amounts; many invoices embed amount.
      const res = await fetch('/api/lnbits/pay', {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ bolt11: tx.bolt11 })
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data?.error || (window.t ? window.t('pay_failed') : 'Pay failed'));
      // Assume on success, deduct locally as well for offline balance coherence
      const users = getUsers();
      const session = window.JBAuth?.getSession?.();
      const from = users.find(u => u.id === session?.userId);
      if (from && Number.isFinite(amount) && amount > 0) {
        from.sats = Math.max(0, (from.sats||0) - amount);
        from.activity = from.activity || [];
        const memo = tx.memo ? ` — ${tx.memo}` : '';
        from.activity.push({ ts: Date.now(), text: (window.t ? window.t('sent_sats_lightning', { amount, memo }) : `Sent ${amount} sats over Lightning${memo}`) });
        setUsers(users);
      }
      tx.status = 'sent';
      return tx;
    } catch (err) {
      tx.status = navigator.onLine ? 'failed' : 'pending';
      tx.error = err?.message || (window.t ? window.t('error_generic') : 'Error');
      return tx;
    }
  }

  async function processOutbox(){
    const user = getCurrentUser();
    if (!user) return;
    const list = getUserOutbox(user.id);
    let changed = false;
    for (const tx of list) {
      if (tx.status && tx.status !== 'pending') continue;
      tx.status = 'processing';
      if (tx.type === 'internal') {
        await processInternal(tx);
        changed = true;
      } else if (tx.type === 'bolt11') {
        const before = tx.status;
        await processLightning(tx);
        if (tx.status !== before) changed = true;
      }
    }
    if (changed) {
      saveUserOutbox(user.id, list);
      renderOutbox();
      // update balance on dashboard if present
      const satsEl = document.getElementById('satsBalance');
      const me = getCurrentUser();
      if (satsEl && me) satsEl.textContent = String(me.sats||0);
    }
  }

  function handleSendSubmit(e){
    e?.preventDefault?.();
    const user = getCurrentUser();
    if (!user) { window.location.href = '/login.html'; return; }
    const type = sendType?.value || 'internal';
    const amount = Number((sendAmount?.value || '0').trim());
    const memo = (sendMemo?.value || '').trim();
    if (!Number.isFinite(amount) || amount < 1) { alert(window.t ? window.t('invalid_amount') : 'Invalid amount'); return; }

    if (type === 'internal') {
      const recipient = (sendRecipient?.value || '').trim();
      if (!recipient) { alert(window.t ? window.t('recipient_required') : 'Recipient required'); return; }
      let toUser = null;
      const users = getUsers();
      toUser = users.find(u => u.email === recipient || u.phone === recipient);
      if (!toUser) { alert(window.t ? window.t('recipient_not_found') : 'Recipient not found'); return; }
      const tx = { id: 'tx_'+Date.now(), ts: Date.now(), type: 'internal', amount, memo, toUserId: toUser.id, toEmail: toUser.email, toPhone: toUser.phone, status: 'pending' };
      const list = getUserOutbox(user.id);
      list.push(tx);
      saveUserOutbox(user.id, list);
      renderOutbox();
      // internal can be processed immediately even offline
      processOutbox();
      sendForm?.reset?.();
    } else {
      const bolt11 = (sendBolt11?.value || '').trim();
      if (!bolt11) { alert(window.t ? window.t('invoice_required') : 'Invoice (BOLT11) required'); return; }
      const tx = { id: 'tx_'+Date.now(), ts: Date.now(), type: 'bolt11', amount, memo, bolt11, status: 'pending' };
      const list = getUserOutbox(user.id);
      list.push(tx);
      saveUserOutbox(user.id, list);
      renderOutbox();
      // Try to process now; will queue if offline
      processOutbox();
      sendForm?.reset?.();
    }
  }

  async function handleCreateInvoice(){
    const amount = Number((recvAmount?.value || '0').trim());
    const memo = (recvMemo?.value || '').trim();
    if (!Number.isFinite(amount) || amount < 1) { alert(window.t ? window.t('invalid_amount') : 'Invalid amount'); return; }
    if (!navigator.onLine) { alert(window.t ? window.t('internet_required') : 'Internet required to create Lightning invoice'); return; }
    try {
      const res = await fetch('/api/lnbits/invoice', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-app-key': localStorage.getItem('jb_app_key') || 'changeme'
        },
        body: JSON.stringify({ amount, memo, user: getCurrentUser()?.email || null })
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data?.error || (window.t ? window.t('error_generic') : 'Error'));
      if (invoiceOutput) invoiceOutput.textContent = data.payment_request || '';
    } catch (err) {
      alert(err?.message || (window.t ? window.t('error_generic') : 'Error'));
    }
  }

  function attach(){
    if (sendBtn) sendBtn.addEventListener('click', handleSendSubmit);
    if (sendForm) sendForm.addEventListener('submit', handleSendSubmit);
    if (createInvoiceBtn) createInvoiceBtn.addEventListener('click', (e)=>{ e.preventDefault(); handleCreateInvoice(); });
    if (copyInvoiceBtn && invoiceOutput) {
      copyInvoiceBtn.addEventListener('click', async () => {
        try { await navigator.clipboard.writeText(invoiceOutput.textContent || ''); } catch {}
      });
    }
    if (syncBtn) syncBtn.addEventListener('click', processOutbox);
    window.addEventListener('online', processOutbox);

    // Provider toggle
    providerButtons.forEach(btn => {
      btn.addEventListener('click', () => {
        providerButtons.forEach(b=>b.setAttribute('aria-pressed','false'));
        btn.setAttribute('aria-pressed','true');
        currentProvider = btn.getAttribute('data-provider') || 'mtn';
      });
    });

    // Top-up flow
    if (topupForm && topupBtn) {
      topupForm.addEventListener('submit', e => { e.preventDefault(); doTopup(); });
      topupBtn.addEventListener('click', e => { e.preventDefault(); doTopup(); });
    }
  }

  // Init
  attach();
  renderOutbox();
  // Attempt processing on load
  processOutbox();

  async function doTopup(){
    const user = getCurrentUser();
    if (!user) { window.location.href = '/login.html'; return; }
    const amount = Number((topupAmount?.value || '0').trim());
    const phone = (topupPhone?.value || '').trim();
    if (!Number.isFinite(amount) || amount < 1) { alert(window.t?window.t('invalid_amount'):'Invalid amount'); return; }
    if (!phone) { alert(window.t?window.t('phone_required'):'Phone required'); return; }
    try {
      topupBtn.disabled = true; if (topupStatus) topupStatus.textContent = window.t?window.t('topup_initializing'):'Initializing top-up...';
      const r = await fetch('/api/topup/init', { method:'POST', headers:{'Content-Type':'application/json'}, body: JSON.stringify({ provider: currentProvider, phone, amount }) });
      const j = await r.json();
      if (!r.ok) throw new Error(j?.error || 'Top-up error');
      const ref = j.reference;
      if (topupStatus) topupStatus.textContent = (window.t?window.t('topup_prompt_sent'):'Payment prompt sent. Please confirm on your phone.');
      // poll status
      const started = Date.now();
      const poll = setInterval(async () => {
        try {
          const rs = await fetch(`/api/topup/status/${encodeURIComponent(ref)}`);
          const s = await rs.json();
          if (rs.ok && (s.status === 'confirmed' || s.status === 'failed' || s.status === 'expired')) {
            clearInterval(poll);
            if (s.status === 'confirmed') {
              // credit local user balance in sats
              const users = getUsers();
              const u = users.find(u=>u.id===user.id);
              if (u) {
                u.sats = (u.sats||0) + Number(s.sats||amount);
                u.activity = u.activity || [];
                u.activity.push({ ts: Date.now(), text: (window.t?window.t('you_earned_sats'):'You earned {amount} sats!').replace('{amount}', String(Number(s.sats||amount))) });
                setUsers(users);
                const satsEl = document.getElementById('satsBalance');
                if (satsEl) satsEl.textContent = String(u.sats||0);
              }
              if (topupStatus) topupStatus.textContent = window.t?window.t('topup_success'):'Top-up successful ✅';
              topupForm?.reset?.();
            } else {
              if (topupStatus) topupStatus.textContent = window.t?window.t('topup_failed'):'Top-up failed or expired';
            }
            topupBtn.disabled = false;
          } else if (Date.now() - started > 120000) {
            clearInterval(poll);
            if (topupStatus) topupStatus.textContent = window.t?window.t('topup_timeout'):'Top-up timeout';
            topupBtn.disabled = false;
          }
        } catch (_) {
          // ignore transient errors; continue polling
        }
      }, 2500);
    } catch (err) {
      alert(err?.message || (window.t?window.t('error_generic'):'Error'));
      topupBtn.disabled = false;
    }
  }
})();

// js/lnbits-client.js
// Frontend calls server proxy to create invoice and polls for payment status.
// Requires localStorage('jb_app_key') to equal APP_API_KEY on server (only for demo).
const LIGHTNING_API = window.LIGHTNING_API || (location.origin); // if server serves frontend
// helper to get current user email stored in localStorage
function getCurrentUserEmail(){
  return localStorage.getItem('currentUser') || null;
}

// create invoice (call server)
async function createInvoiceFromServer(amount, memo){
  const appKey = localStorage.getItem('jb_app_key') || '';
  const resp = await fetch(`${LIGHTNING_API}/api/lnbits/invoice`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'x-app-key': appKey
    },
    body: JSON.stringify({ amount, memo, user: getCurrentUserEmail() })
  });
  const data = await resp.json();
  if(!resp.ok) throw new Error(data?.error || 'Invoice creation failed');
  return data; // contains payment_request and payment_hash
}

// poll payment
async function checkInvoiceStatus(payment_hash){
  const resp = await fetch(`${LIGHTNING_API}/api/lnbits/payment/${payment_hash}`);
  const data = await resp.json();
  return data; // { paid: boolean, data: {...} }
}

// UI flow: create invoice, show bolt11/QR, poll every 3s until paid
async function requestReceiveSats(amount){
  try {
    const invoice = await createInvoiceFromServer(amount, `JangBokk reward ${amount} sats`);
    // show bolt11
    openQrModal(invoice.payment_request || invoice.payreq || invoice.bolt11 || invoice.payment_request); // adapt key
    // start polling
    const hash = invoice.payment_hash || invoice.payment_hash_hex || invoice.payment_hash_hex?.toString?.() || invoice.id;
    if(!hash) {
      console.warn('No payment_hash returned - cannot poll');
      return;
    }
    let paid = false;
    for(let i=0;i<60;i++){
      await new Promise(r=>setTimeout(r, 3000));
      const status = await checkInvoiceStatus(hash);
      if(status.paid){
        paid = true;
        break;
      }
    }
    if(paid){
      // credit user locally (frontend)
      creditLocalUser(amount, `LNbits invoice ${hash}`);
      alert(`Invoice paid — +${amount} sats credited!`);
      closeQr();
      loadDashboard(); // update UI
    } else {
      alert('Invoice not paid (timeout).');
    }
  } catch (err) {
    console.error(err);
    alert('Error creating invoice: ' + (err.message || err));
  }
}

// Export or attach to window to avoid unused warning
window.requestReceiveSats = requestReceiveSats;

// credit local user (localStorage)
function creditLocalUser(amount, note){
  const email = localStorage.getItem('currentUser');
  if(!email) return;
  const users = JSON.parse(localStorage.getItem('users')||'{}');
  if(!users[email]) { console.error('user not found'); return; }
  users[email].balance = (users[email].balance||0) + Number(amount);
  users[email].transactions = users[email].transactions||[];
  users[email].transactions.push({ amount:Number(amount), recipient: 'lnbits', date: new Date().toLocaleString(), type: 'ln_receive', note });
  localStorage.setItem('users', JSON.stringify(users));
}
