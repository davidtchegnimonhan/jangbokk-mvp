(function(){
  const en = {
    nav_learn: 'Learn',
    nav_market: 'Marketplace',
    nav_about: 'About',
    logout: 'Logout',
    dashboard_subtitle: 'Learn Bitcoin, earn sats, and spend with Lightning.',
    cta_learn: 'Learn Bitcoin',
    cta_market: 'Marketplace',
    your_balance: 'Your Sats Balance',
    balance_hint: 'Earn sats by passing quizzes and by selling.',
    learn_more: 'Learn more about JàngBokk →',
    recent_activity: 'Recent activity',
    clear: 'Clear',
    notifications: 'Notifications',
    no_notifications: 'No notifications yet.',
    login_title: 'Welcome back',
    email: 'Email',
    password: 'Password',
    login: 'Login',
    no_account: 'No account?',
    create_account: 'Create account',
    register_title: 'Create an account',
    name: 'Name',
    phone: 'Phone',
    have_account: 'Already have an account?',
    learn_title: 'Learn Bitcoin',
    learn_intro: 'Short modules, quick quizzes. Earn sats for correct answers.',
    xp: 'XP',
    submit: 'Submit',
    close: 'Close',
    search_placeholder: 'Search products',
    all: 'All',
    food: 'Food',
    services: 'Services',
    digital: 'Digital',
    sell: 'Sell',
    sell_title: 'Add a product/service',
    save: 'Save',
    invoice_title: 'Lightning Invoice',
    invoice_hint: 'Pay this invoice with your Lightning wallet:',
    // wallet additions
    send_title: 'Send',
    receive_title: 'Receive',
    internal: 'Internal',
    lightning: 'Lightning',
    amount_placeholder: 'Amount (sats)',
    recipient_placeholder: 'Recipient email/phone',
    bolt11_placeholder: 'BOLT11 invoice',
    memo_placeholder: 'Memo (optional)',
    send_now: 'Send',
    offline_note_send: 'Offline? We will queue and send when back online.',
    offline_note_receive: 'Creating invoices requires internet connectivity.',
    outbox_title: 'Queued transactions',
    sync: 'Sync',
    copy: 'Copy',
    create_invoice: 'Create invoice',
    buy: 'Buy ⚡',
    nav_dashboard: 'Dashboard',
    // topup
    topup_title: 'Top up',
    mtn_momo: 'MTN MoMo',
    wave: 'Wave',
    other: 'Other',
    phone_placeholder: 'Phone (mobile money)',
    topup_amount_placeholder: 'Amount (sats)',
    topup_button: 'Top up',
    topup_initializing: 'Initializing top-up...',
    topup_prompt_sent: 'Payment prompt sent. Please confirm on your phone.',
    topup_success: 'Top-up successful ✅',
    topup_failed: 'Top-up failed or expired',
    topup_timeout: 'Top-up timeout',
    phone_required: 'Phone required',
    // about
    about_title: 'About JàngBokk',
    about_body1: 'JàngBokk empowers people in Senegal to learn Bitcoin, earn sats by succeeding quizzes, and spend them instantly in a Lightning marketplace.',
    about_learn: 'Learn',
    about_learn_desc: 'Engaging modules with short quizzes and instant feedback.',
    about_earn: 'Earn',
    about_earn_desc: 'Get small rewards in sats for successful learning.',
    about_spend: 'Spend',
    about_spend_desc: 'Use Lightning to buy products and services from local sellers.',
    // dynamic and errors
    invalid_amount: 'Invalid amount',
    insufficient_balance: 'Insufficient balance',
    recipient_required: 'Recipient required',
    recipient_not_found: 'Recipient not found',
    invoice_required: 'Invoice (BOLT11) required',
    internet_required: 'Internet required to create Lightning invoice',
    pay_failed: 'Pay failed',
    error_generic: 'Error',
    no_queued_transactions: 'No queued transactions.',
    waiting_payment: 'Waiting for payment...',
    expired: 'Expired',
    payment_confirmed: 'Payment confirmed ✅',
    purchased_for_sats: 'Purchased {title} for {price} sats',
    sent_sats_to: 'Sent {amount} sats to {to}',
    received_sats_from: 'Received {amount} sats from {from}',
    sent_sats_lightning: 'Sent {amount} sats over Lightning{memo}',
    you_earned_sats: 'You earned {amount} sats!',
    email_exists: 'Email already exists',
    invalid_credentials: 'Invalid credentials',
    missing_fields: 'Missing fields',
    read_course: 'Read course',
    start_quiz: 'Start Quiz',
    redo: 'Redo',
    questions_count: '{count} questions',
    course_label: 'Course',
    please_answer_all: 'Please answer all questions',
    correct_count: 'Correct: {correct}/{total}',
    // uploads
    sell_upload: 'Upload photo',
    sell_camera: 'Take photo',
    title_placeholder: 'Title',
    description_placeholder: 'Description',
    price_placeholder: 'Price (sats)',
    image_url_placeholder: 'Image URL',
    // LNbits status
    lnbits_connected: 'LNbits connected',
    lnbits_disconnected: 'LNbits not connected',
  };

  const wo = {
    nav_learn: 'Jàng',
    nav_market: 'Suuqa',
    nav_about: 'Lu ci',
    logout: 'Génn',
    dashboard_subtitle: 'Jàng Bitcoin, jël sats, te fay ak Lightning.',
    cta_learn: 'Jàng Bitcoin',
    cta_market: 'Suuqa',
    your_balance: 'Sats bi',
    balance_hint: 'Jël sats su baaxee kàddu yi, ak jaay.',
    learn_more: 'Xam lu ci JàngBokk →',
    recent_activity: 'Jëf jiiñ yi',
    clear: 'Mabb',
    notifications: 'Karme',
    no_notifications: 'Amul dara.',
    login_title: 'Dalal ak jàmm',
    email: 'Imeel',
    password: 'Baatu jàll',
    login: 'Duggal',
    no_account: 'Amuloo konto?',
    create_account: 'Sos konto',
    register_title: 'Sos sa konto',
    name: 'Tur',
    phone: 'Téléfon',
    have_account: 'Am nga ba pare?',
    learn_title: 'Jàng Bitcoin',
    learn_intro: 'Kàddu yu gaaw, test yu gaaw. Jël sats su baaxee.',
    xp: 'XP',
    submit: 'Yónnee',
    close: 'Tëj',
    search_placeholder: 'Wut mbir yi',
    all: 'Lépp',
    food: 'Lekke',
    services: 'Sarwiis',
    digital: 'Dijitaal',
    sell: 'Jaay',
    sell_title: 'Yokk mbir mu jaay',
    save: 'Aar',
    invoice_title: 'Fatura Lightning',
    invoice_hint: 'Fayal ak sa walle Lightning:',
    // wallet additions
    send_title: 'Yónnee',
    receive_title: 'Jël',
    internal: 'Bi ci biir',
    lightning: 'Lightning',
    amount_placeholder: 'Yomb (sats)',
    recipient_placeholder: 'Imeel/telefonu nangu',
    bolt11_placeholder: 'Fatura BOLT11',
    memo_placeholder: 'Tekk (sápp su bëgg)',
    send_now: 'Yónnee',
    offline_note_send: 'Bul xalaat dara: dinañu yónnee bu bindiku internet.',
    offline_note_receive: 'Sos fatura dafay soxla internet.',
    outbox_title: 'Jëf yi di xaar yónnee',
    sync: 'Jàppante',
    copy: 'Duppi',
    create_invoice: 'Sos fatura',
    buy: 'Jënd ⚡',
    nav_dashboard: 'Dashbord',
    // topup
    topup_title: 'Yokk xaalis',
    mtn_momo: 'MTN MoMo',
    wave: 'Wave',
    other: 'Beneen',
    phone_placeholder: 'Telefon (mobile money)',
    topup_amount_placeholder: 'Yomb (sats)',
    topup_button: 'Yokk',
    topup_initializing: 'Mi ngi tambali top-up...',
    topup_prompt_sent: 'Ndigu pay yiñu yónnee. Teggale ci sa telefon.',
    topup_success: 'Top-up jápp na ✅',
    topup_failed: 'Top-up dafaye neen walla jeex na jamono',
    topup_timeout: 'Top-up time-out',
    phone_required: 'Telefon war na',
    // about
    about_title: 'Ci mbirum JàngBokk',
    about_body1: 'JàngBokk day dimmali nit ñi ci Senegaal ngir jàng Bitcoin, jël sats buñ rey ci test yi te saafara leen ci suuqu Lightning.',
    about_learn: 'Jàng',
    about_learn_desc: 'Kàddu yu neex ak test yu gaaw ak tontu bépp yoon.',
    about_earn: 'Jël',
    about_earn_desc: 'Jël ay sats tuuti su baaxee jàng wi.',
    about_spend: 'Fay',
    about_spend_desc: 'Jëfandikoo Lightning ngir jënd ci jaaykat yu dëkk.',
    // dynamic and errors
    invalid_amount: 'Yomb baaxul',
    insufficient_balance: 'Deficite ci sars yi',
    recipient_required: 'Bëgg-bopp war na',
    recipient_not_found: 'Kenn gisuwu',
    invoice_required: 'Fatura (BOLT11) war na',
    internet_required: 'Internet war na ngir sos fatura Lightning',
    pay_failed: 'Yónnee baaxul',
    error_generic: 'Njuumte',
    no_queued_transactions: 'Amul jëf ji di xaar.',
    waiting_payment: 'Ci xaaru pay...',
    expired: 'Jeex na jamono',
    payment_confirmed: 'Pay bi ñu dëggal na ✅',
    purchased_for_sats: 'Jënd {title} {price} sats',
    sent_sats_to: 'Yónnee {amount} sats ci {to}',
    received_sats_from: 'Jël {amount} sats ci {from}',
    sent_sats_lightning: 'Yónnee {amount} sats ci Lightning{memo}',
    you_earned_sats: 'Jël nga {amount} sats!',
    email_exists: 'Imeel bi am na ba pare',
    invalid_credentials: 'Diiwaan yi baaxul',
    missing_fields: 'Fann yi dafay saw',
    read_course: 'Jàng kurs',
    start_quiz: 'Tàmbali test',
    redo: 'Dellu def',
    questions_count: '{count} laaj',
    course_label: 'Kurs',
    please_answer_all: 'Jàngalal tee tontu lépp',
    correct_count: 'Baax na: {correct}/{total}',
    // uploads
    sell_upload: 'Yebal foto',
    sell_camera: 'Jël foto',
    title_placeholder: 'Tur',
    description_placeholder: 'Nettali',
    price_placeholder: 'Yomb (sats)',
    image_url_placeholder: 'URL bu nataal',
    // LNbits status
    lnbits_connected: 'LNbits jox na bàyyi',
    lnbits_disconnected: 'LNbits jokkoo wutul',
  };

  const fr = {
    nav_learn: 'Apprendre',
    nav_market: 'Marché',
    nav_about: 'À propos',
    logout: 'Déconnexion',
    dashboard_subtitle: 'Apprenez Bitcoin, gagnez des sats et dépensez avec Lightning.',
    cta_learn: 'Apprendre Bitcoin',
    cta_market: 'Marché',
    your_balance: 'Votre solde en sats',
    balance_hint: 'Gagnez des sats en réussissant les quiz et en vendant.',
    learn_more: 'En savoir plus sur JàngBokk →',
    recent_activity: 'Activité récente',
    clear: 'Effacer',
    notifications: 'Notifications',
    no_notifications: 'Aucune notification pour le moment.',
    login_title: 'Bon retour',
    email: 'Email',
    password: 'Mot de passe',
    login: 'Connexion',
    no_account: "Pas de compte ?",
    create_account: 'Créer un compte',
    register_title: 'Créer un compte',
    name: 'Nom',
    phone: 'Téléphone',
    have_account: 'Vous avez déjà un compte ?',
    learn_title: 'Apprendre Bitcoin',
    learn_intro: 'Modules courts, quiz rapides. Gagnez des sats pour les bonnes réponses.',
    xp: 'XP',
    submit: 'Valider',
    close: 'Fermer',
    search_placeholder: 'Rechercher des produits',
    all: 'Tous',
    food: 'Nourriture',
    services: 'Services',
    digital: 'Numérique',
    sell: 'Vendre',
    sell_title: 'Ajouter un produit/service',
    save: 'Enregistrer',
    invoice_title: 'Facture Lightning',
    invoice_hint: 'Payez cette facture avec votre portefeuille Lightning :',
    // wallet additions
    send_title: 'Envoyer',
    receive_title: 'Recevoir',
    internal: 'Interne',
    lightning: 'Lightning',
    amount_placeholder: 'Montant (sats)',
    recipient_placeholder: 'Email/téléphone du destinataire',
    bolt11_placeholder: 'Facture BOLT11',
    memo_placeholder: 'Mémo (optionnel)',
    send_now: 'Envoyer',
    offline_note_send: 'Hors ligne ? Nous mettrons en file et enverrons au retour de la connexion.',
    offline_note_receive: 'Créer des factures nécessite une connexion Internet.',
    outbox_title: 'Transactions en attente',
    sync: 'Synchroniser',
    copy: 'Copier',
    create_invoice: 'Créer une facture',
    buy: 'Acheter ⚡',
    nav_dashboard: 'Tableau de bord',
    // topup
    topup_title: 'Recharger',
    mtn_momo: 'MTN MoMo',
    wave: 'Wave',
    other: 'Autre',
    phone_placeholder: 'Téléphone (mobile money)',
    topup_amount_placeholder: 'Montant (sats)',
    topup_button: 'Recharger',
    topup_initializing: 'Initialisation de la recharge...',
    topup_prompt_sent: 'Prompt de paiement envoyé. Confirmez sur votre téléphone.',
    topup_success: 'Recharge réussie ✅',
    topup_failed: 'Recharge échouée ou expirée',
    topup_timeout: 'Recharge expirée (timeout)',
    phone_required: 'Téléphone requis',
    // about
    about_title: 'À propos de JàngBokk',
    about_body1: "JàngBokk aide les personnes au Sénégal à apprendre Bitcoin, à gagner des sats en réussissant des quiz, et à les dépenser instantanément sur un marché Lightning.",
    about_learn: 'Apprendre',
    about_learn_desc: 'Modules engageants avec quiz courts et retour immédiat.',
    about_earn: 'Gagner',
    about_earn_desc: 'Recevez de petites récompenses en sats pour vos réussites.',
    about_spend: 'Dépenser',
    about_spend_desc: 'Utilisez Lightning pour acheter des biens et services locaux.',
    // dynamic and errors
    invalid_amount: 'Montant invalide',
    insufficient_balance: 'Solde insuffisant',
    recipient_required: 'Destinataire requis',
    recipient_not_found: 'Destinataire introuvable',
    invoice_required: 'Facture (BOLT11) requise',
    internet_required: 'Internet requis pour créer une facture Lightning',
    pay_failed: 'Échec du paiement',
    error_generic: 'Erreur',
    no_queued_transactions: "Aucune transaction en file d'attente.",
    waiting_payment: 'En attente du paiement...',
    expired: 'Expirée',
    payment_confirmed: 'Paiement confirmé ✅',
    purchased_for_sats: 'Acheté {title} pour {price} sats',
    sent_sats_to: 'Envoyé {amount} sats à {to}',
    received_sats_from: 'Reçu {amount} sats de {from}',
    sent_sats_lightning: 'Envoyé {amount} sats sur Lightning{memo}',
    you_earned_sats: 'Vous avez gagné {amount} sats !',
    email_exists: 'Email déjà utilisé',
    invalid_credentials: 'Identifiants invalides',
    missing_fields: 'Champs manquants',
    read_course: 'Lire le cours',
    start_quiz: 'Commencer le quiz',
    redo: 'Recommencer',
    questions_count: '{count} questions',
    course_label: 'Cours',
    please_answer_all: 'Veuillez répondre à toutes les questions',
    correct_count: 'Correct: {correct}/{total}',
    // uploads
    sell_upload: 'Téléverser une photo',
    sell_camera: 'Prendre une photo',
    title_placeholder: 'Titre',
    description_placeholder: 'Description',
    price_placeholder: 'Prix (sats)',
    image_url_placeholder: "URL de l'image",
    // LNbits status
    lnbits_connected: 'LNbits connecté',
    lnbits_disconnected: 'LNbits non connecté',
  };

  const langToggle = document.getElementById('langToggle');
  const defaultLang = localStorage.getItem('lang') || 'en';
  let current = defaultLang;
  applyTranslations(current);

  if (langToggle) {
    langToggle.textContent = current.toUpperCase();
    langToggle.addEventListener('click', () => {
      const order = ['en','fr','wo'];
      const idx = order.indexOf(current);
      current = order[(idx + 1) % order.length];
      localStorage.setItem('lang', current);
      langToggle.textContent = current.toUpperCase();
      applyTranslations(current);
      if (typeof window !== 'undefined' && window.dispatchEvent) {
        window.dispatchEvent(new CustomEvent('langchange', { detail: { lang: current } }));
      }
    });
  }

  function applyTranslations(code){
    const dict = code === 'wo' ? wo : (code === 'fr' ? fr : en);
    document.querySelectorAll('[data-i18n]').forEach(el => {
      const key = el.getAttribute('data-i18n');
      if (dict[key]) el.textContent = dict[key];
    });
    document.querySelectorAll('[data-i18n-placeholder]').forEach(el => {
      const key = el.getAttribute('data-i18n-placeholder');
      if (dict[key]) el.setAttribute('placeholder', dict[key]);
    });
  }

  function format(str, params){
    if (!params) return str;
    return Object.keys(params).reduce((s,k)=> s.replaceAll('{'+k+'}', String(params[k])), str);
  }

  // Expose translator for dynamic strings
  window.i18n = {
    get current(){ return current; },
    set current(code){ current = code; localStorage.setItem('lang', code); applyTranslations(code); },
    t(key, params){
      const dict = current === 'wo' ? wo : (current === 'fr' ? fr : en);
      const str = dict[key] || en[key] || key;
      return format(str, params);
    }
  };
  window.t = (...args) => window.i18n.t(...args);

  // Optional module content translations for Learning
  window.i18nModules = {
    fr: {
      m1: {
        title: "Qu'est-ce que Bitcoin ?",
        course: "Bitcoin est une monnaie numérique décentralisée avec une offre fixe de 21 millions.\n\nIl utilise un grand livre public (la blockchain) sécurisé par les mineurs. Chacun peut détenir et envoyer du bitcoin sans permission.\n\nConcepts clés : rareté, résistance à la censure, auto-garde (vos clés, vos bitcoins).",
        questions: [
          { q: 'Qui a créé Bitcoin ?', options: ['Satoshi Nakamoto', 'Elon Musk', 'Vitalik Buterin'] },
          { q: "Quelle est l'offre maximale ?", options: ['21 millions','100 millions','Illimitée'] }
        ]
      },
      m2: {
        title: 'Notions de base du Lightning Network',
        course: "Le Lightning Network est un protocole de couche 2 construit sur Bitcoin pour permettre des paiements rapides et peu coûteux.\n\nLes utilisateurs ouvrent des canaux de paiement et routent les paiements à travers le réseau. Les factures (BOLT11) codent le montant et les détails de routage.",
        questions: [
          { q: 'Lightning est construit sur ?', options: ['Ethereum','Bitcoin','Litecoin'] },
          { q: 'Les paiements sur Lightning sont', options: ['Lents','Quasi-instantanés','Uniquement on-chain'] }
        ]
      },
      m3: {
        title: 'Auto-garde',
        course: "L'auto-garde signifie que vous contrôlez vos clés privées.\n\nLes portefeuilles génèrent une phrase mnémonique (souvent 12 ou 24 mots). Notez-la et stockez-la en sécurité. Ne la partagez jamais.",
        questions: [
          { q: 'Une phrase mnémonique contient', options: ['24 ou 12 mots','1 mot de passe','Aucun mot'] }
        ]
      }
    }
  };
})();
