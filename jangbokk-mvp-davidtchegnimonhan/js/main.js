(function(){
  const session = window.JBAuth?.getSession?.();
  const users = JSON.parse(localStorage.getItem('jb_users') || '[]');
  const user = users.find(u => u.id === session?.userId);

  // redirect if not logged in
  if (!user) {
    // allow landing? For MVP, redirect to login
    if (!location.pathname.endsWith('login.html') && !location.pathname.endsWith('register.html')) {
      window.location.href = '/login.html';
      return;
    }
  }

  if (user) {
    const welcome = document.getElementById('welcomeMessage');
    if (welcome) {
      const lang = localStorage.getItem('lang') || 'en';
      const greet = lang === 'wo' ? 'Nanga def' : (lang === 'fr' ? 'Bonjour' : 'Hello');
      welcome.textContent = `${greet}, ${user.name}?`;
    }
    const satsEl = document.getElementById('satsBalance');
    if (satsEl) satsEl.textContent = String(user.sats || 0);
    const lnbitsStatus = document.getElementById('lnbitsStatus');

    // Try to show real wallet balance from LNBits if configured
    if (satsEl) {
      fetch('/api/lnbits/wallet')
        .then(r => {
          if (lnbitsStatus) lnbitsStatus.textContent = r.ok ? (window.t?window.t('lnbits_connected'):'LNbits connected') : (window.t?window.t('lnbits_disconnected'):'LNbits not connected');
          return r.ok ? r.json() : null;
        })
        .then(j => { if (j && (typeof j.balance === 'number')) { satsEl.textContent = String(Math.floor(j.balance / 1000)); } })
        .catch(()=>{ if (lnbitsStatus) lnbitsStatus.textContent = (window.t?window.t('lnbits_disconnected'):'LNbits not connected'); });
    }

    // Notifications
    const notifications = document.getElementById('notifications');
    if (notifications) {
      const notes = JSON.parse(localStorage.getItem('jb_notifications') || '[]');
      notifications.innerHTML = '';
      if (!notes.length) {
        const li = document.createElement('li');
        li.className = 'text-white/60';
        li.textContent = 'No notifications yet.';
        notifications.appendChild(li);
      } else {
        notes.slice(-10).reverse().forEach(n => {
          const li = document.createElement('li');
          li.textContent = `${new Date(n.ts).toLocaleString()} — ${n.text}`;
          notifications.appendChild(li);
        });
      }
    }

    const activityList = document.getElementById('activityList');
    if (activityList) {
      activityList.innerHTML = '';
      (user.activity || []).slice(-10).reverse().forEach(item => {
        const li = document.createElement('li');
        li.className = 'glass rounded-xl p-3';
        li.textContent = `${new Date(item.ts).toLocaleString()} — ${item.text}`;
        activityList.appendChild(li);
      });
    }

    const clearActivity = document.getElementById('clearActivity');
    if (clearActivity) {
      clearActivity.addEventListener('click', () => {
        user.activity = [];
        localStorage.setItem('jb_users', JSON.stringify(users));
        if (activityList) activityList.innerHTML = '';
      });
    }
  }
})();
