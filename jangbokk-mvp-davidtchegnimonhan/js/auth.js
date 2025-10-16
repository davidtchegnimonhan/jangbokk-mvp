(function(){
  const sessionKey = 'jb_session';

  function getSession(){
    const raw = localStorage.getItem(sessionKey);
    if (!raw) return null;
    try { return JSON.parse(raw); } catch { return null; }
  }

  function setSession(data){
    localStorage.setItem(sessionKey, JSON.stringify(data));
  }

  function clearSession(){
    localStorage.removeItem(sessionKey);
  }

  // Expose globally for other scripts
  window.JBAuth = { getSession, setSession, clearSession };

  // Global auth gate: redirect unauthenticated users to login for all pages
  try {
    const path = (location && location.pathname) || '';
    const isAuthPage = path.endsWith('login.html') || path.endsWith('register.html');
    if (!getSession() && !isAuthPage) {
      window.location.href = '/login.html';
      return;
    }
  } catch {}

  // Register
  const regForm = document.getElementById('registerForm');
  if (regForm) {
    regForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const name = document.getElementById('regName').value.trim();
      const phone = document.getElementById('regPhone').value.trim();
      const email = document.getElementById('regEmail').value.trim();
      const password = document.getElementById('regPassword').value;
      const user = { id: 'u_'+Date.now(), name, phone, email, password, sats: 0, activity: [] };
      // naive local storage user store
      const users = JSON.parse(localStorage.getItem('jb_users') || '[]');
      if (users.find(u => u.email === email)) {
        alert(window.t ? window.t('email_exists') : 'Email already exists');
        return;
      }
      users.push(user);
      localStorage.setItem('jb_users', JSON.stringify(users));
      // Do NOT auto-login. Redirect to login page.
      window.location.href = '/login.html';
    });
  }

  // Login
  const loginForm = document.getElementById('loginForm');
  if (loginForm) {
    loginForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const email = document.getElementById('loginEmail').value.trim();
      const password = document.getElementById('loginPassword').value;
      const users = JSON.parse(localStorage.getItem('jb_users') || '[]');
      const user = users.find(u => u.email === email && u.password === password);
      if (!user) { alert(window.t ? window.t('invalid_credentials') : 'Invalid credentials'); return; }
      setSession({ userId: user.id });
      window.location.href = '/index.html';
    });
  }

  // Logout visibility and behavior
  const logoutBtn = document.getElementById('logoutBtn');
  if (logoutBtn) {
    const session = getSession();
    if (session) logoutBtn.classList.remove('hidden');
    logoutBtn.addEventListener('click', () => {
      clearSession();
      window.location.href = '/login.html';
    });
  }
})();
