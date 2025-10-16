(function(){
  const session = window.JBAuth?.getSession?.();
  const users = JSON.parse(localStorage.getItem('jb_users') || '[]');
  const user = users.find(u => u.id === session?.userId);
  if (!user) { window.location.href = '/login.html'; return; }

  const baseModules = [
    { id:'m1', title:'What is Bitcoin?', cover:'',
      course:`Bitcoin is a decentralized digital money with a fixed supply of 21 million.\n\nIt uses a public ledger (the blockchain) secured by miners. Anyone can hold and send bitcoin without permission.\n\nKey concepts: scarcity, censorship resistance, self-custody (your keys, your coins).`,
      questions:[
        { q:'Who created Bitcoin?', options:['Satoshi Nakamoto','Elon Musk','Vitalik Buterin'], a:0 },
        { q:'What is the max supply?', options:['21 million','100 million','Infinite'], a:0 }
      ]},
    { id:'m2', title:'Lightning Network Basics', cover:'',
      course:`Lightning Network is a layer-2 protocol built on Bitcoin to enable fast, cheap payments.\n\nUsers open payment channels and route payments across the network. Invoices (BOLT11) encode amount and routing details.`,
      questions:[
        { q:'Lightning is built on?', options:['Ethereum','Bitcoin','Litecoin'], a:1 },
        { q:'Payments on Lightning are', options:['Slow','Instant-ish','On-chain only'], a:1 }
      ]},
    { id:'m3', title:'Self-custody', cover:'',
      course:`Self-custody means you control your private keys.\n\nWallets generate a seed phrase (typically 12 or 24 words). Write it down and store securely. Never share it with anyone.`,
      questions:[
        { q:'A seed phrase has', options:['24 or 12 words','1 password','No words'], a:0 }
      ]},
  ];

  // Apply language-specific overrides if available
  const lang = localStorage.getItem('lang') || 'en';
  const modOverrides = (window.i18nModules && window.i18nModules[lang]) || null;
  const modules = baseModules.map(m => {
    const o = modOverrides?.[m.id];
    if (!o) return m;
    const out = { ...m };
    if (o.title) out.title = o.title;
    if (o.course) out.course = o.course;
    if (Array.isArray(o.questions)) {
      out.questions = o.questions.map((q, idx) => ({
        q: q.q || m.questions[idx]?.q,
        options: q.options || m.questions[idx]?.options,
        a: m.questions[idx]?.a ?? 0
      }));
    }
    return out;
  });

  const grid = document.getElementById('modulesGrid');
  const xpEl = document.getElementById('xp');
  const progressBar = document.getElementById('progressBar');

  const progress = JSON.parse(localStorage.getItem('jb_progress') || '{}');
  if (!progress[user.id]) progress[user.id] = { xp:0, done:{} };

  function render(){
    xpEl.textContent = String(progress[user.id].xp || 0);
    const total = modules.length;
    const completed = Object.values(progress[user.id].done).filter(Boolean).length;
    const pct = Math.round((completed/total)*100);
    progressBar.style.width = pct+'%';

    grid.innerHTML='';
    modules.forEach(m => {
      const card = document.createElement('div');
      card.className = 'card';
      card.innerHTML = `
        <div class="cover"></div>
        <div class="body">
          <h3 class="font-poppins font-semibold">${m.title}</h3>
          <p class="text-xs text-white/70">${window.t ? window.t('questions_count',{count:m.questions.length}) : (m.questions.length + ' questions')}</p>
          <div class="mt-2 flex gap-2">
            <button class="btn btn-outline" data-course="${m.id}">${window.t?window.t('read_course'):'Read course'}</button>
            <button class="btn btn-secondary" data-mid="${m.id}">${progress[user.id].done[m.id] ? (window.t?window.t('redo'):'Redo') : (window.t?window.t('start_quiz'):'Start Quiz')}</button>
          </div>
        </div>`;
      grid.appendChild(card);
    });
  }
  render();

  const quizDialog = document.getElementById('quizDialog');
  const quizTitle = document.getElementById('quizTitle');
  const quizContent = document.getElementById('quizContent');
  const quizResult = document.getElementById('quizResult');
  const submitQuiz = document.getElementById('submitQuiz');

  let currentModule = null;

  grid.addEventListener('click', (e) => {
    const courseBtn = e.target.closest('button[data-course]');
    if (courseBtn) {
      const mid = courseBtn.getAttribute('data-course');
      const mod = modules.find(m => m.id === mid);
      if (mod) openCourse(mod);
      return;
    }
    const btn = e.target.closest('button[data-mid]');
    if (!btn) return;
    const mid = btn.getAttribute('data-mid');
    currentModule = modules.find(m => m.id === mid);
    if (!currentModule) return;
    // Require reading course before quiz
    const readKey = `jb_course_read_${user.id}_${currentModule.id}`;
    const alreadyRead = localStorage.getItem(readKey) === '1';
    if (!alreadyRead) { openCourse(currentModule); return; }
    openQuiz(currentModule);
  });

  function openCourse(mod){
    quizTitle.textContent = mod.title + ' — ' + (window.t?window.t('course_label'):'Course');
    quizContent.innerHTML = '';
    const block = document.createElement('div');
    block.className = 'glass p-4 rounded-xl text-sm whitespace-pre-wrap';
    block.textContent = mod.course || '';
    quizContent.appendChild(block);
    quizResult.textContent = '';
    if (typeof quizDialog.showModal === 'function') quizDialog.showModal(); else quizDialog.setAttribute('open','open');
    // Replace submit button behavior to mark course as read, then open quiz
    submitQuiz.textContent = (window.t?window.t('start_quiz'):'Start Quiz');
    const handler = (e)=>{
      e.preventDefault();
      localStorage.setItem(`jb_course_read_${user.id}_${mod.id}`, '1');
      submitQuiz.removeEventListener('click', handler);
      openQuiz(mod);
    };
    submitQuiz.addEventListener('click', handler);
  }

  function openQuiz(mod){
    quizTitle.textContent = mod.title;
    quizContent.innerHTML = '';
    mod.questions.forEach((q,i) => {
      const block = document.createElement('div');
      block.className = 'glass p-3 rounded-xl';
      block.innerHTML = `<p class="mb-2">${q.q}</p>` + q.options.map((opt,idx) => `
        <label class="flex items-center gap-2 text-sm">
          <input type="radio" name="q${i}" value="${idx}" class="accent-orange-500" />
          <span>${opt}</span>
        </label>`).join('');
      quizContent.appendChild(block);
    });
    quizResult.textContent='';
    if (typeof quizDialog.showModal === 'function') quizDialog.showModal();
    else quizDialog.setAttribute('open','open');
  }

  submitQuiz?.addEventListener('click', async (e) => {
    e.preventDefault();
    if (!currentModule) return;
    const answers = [...quizContent.querySelectorAll('input:checked')].map(i=>Number(i.value));
    if (answers.length !== currentModule.questions.length) { quizResult.textContent=(window.t?window.t('error_generic'):'Please answer all questions'); return; }
    const correct = currentModule.questions.reduce((acc,q,idx) => acc + (q.a === answers[idx] ? 1 : 0), 0);
    const passed = correct === currentModule.questions.length;
    if (passed) {
      const reward = 200; // sats
      user.sats = (user.sats||0) + reward;
      user.activity = user.activity || [];
      user.activity.push({ ts: Date.now(), text: (window.t?window.t('you_earned_sats',{amount:reward}):`You earned ${reward} sats!`) });
      localStorage.setItem('jb_users', JSON.stringify(users));
      progress[user.id].done[currentModule.id] = true;
      progress[user.id].xp = (progress[user.id].xp||0) + 10;
      localStorage.setItem('jb_progress', JSON.stringify(progress));
      xpEl.textContent = String(progress[user.id].xp);
      triggerConfetti();
      pushNotification((window.t?window.t('you_earned_sats',{amount:reward}):`You earned ${reward} sats!`) + ' ⚡');
      try {
        await fetch('/api/learn/reward', { method:'POST', headers:{ 'Content-Type':'application/json' }, body: JSON.stringify({ reward }) });
      } catch {}
      quizResult.textContent = (window.t?window.t('you_earned_sats',{amount:reward}):`You earned ${reward} sats!`);
      quizResult.className = 'mt-3 text-bitcoin-500 font-semibold';
    } else {
      quizResult.textContent = (window.t ? window.t('correct_count', { correct, total: currentModule.questions.length }) : `Correct: ${correct}/${currentModule.questions.length}`);
      quizResult.className = 'mt-3 text-white/80';
    }
    render();
  });

  function triggerConfetti(){
    if (window.confetti) {
      window.confetti({ particleCount: 120, spread: 70, origin: { y: 0.6 }, colors:['#F5C542','#f97316','#ffffff'] });
    }
  }

  function pushNotification(text){
    const notes = JSON.parse(localStorage.getItem('jb_notifications') || '[]');
    notes.push({ ts: Date.now(), text });
    localStorage.setItem('jb_notifications', JSON.stringify(notes));
  }
})();
