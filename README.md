#🧠⚡ JàngBokk — Learn & Earn Bitcoin in Senegal
🌍 Overview

JàngBokk (“Apprendre & Partager” en wolof) est une plateforme éducative et financière qui combine l’apprentissage du Bitcoin et les paiements Lightning Network pour les Sénégalais.
Elle permet aux utilisateurs d’apprendre les fondamentaux du Bitcoin, de gagner des sats (petites unités de bitcoin), d’envoyer, de recevoir et même de vendre via un mini-marché intégré.

Inspiré par les défis d’inclusion financière et d’accès à l’éducation numérique en Afrique de l’Ouest.

🚀 Features

✅ Register & Login — Crée un compte sécurisé avec email, téléphone et mot de passe.
✅ Learn Bitcoin — Accède à des modules éducatifs interactifs et à des quiz.
✅ Earn Sats — Gagne des récompenses Lightning (LNbits) en apprenant.
✅ Send / Receive Bitcoin — Génère des factures (invoices) Lightning et suis les paiements.
✅ Marketplace — Vends ou achète des biens/services en utilisant des sats.
✅ Dashboard utilisateur — Consulte ton solde, ton niveau d’apprentissage et tes transactions.
✅ Multi-langue (Français / Wolof) — Pour une expérience locale et inclusive.
✅ About Page — Explication détaillée du fonctionnement de la plateforme.

⚙️ Tech Stack

Frontend:

HTML5, CSS3, TailwindCSS

JavaScript (Vanilla JS)

Responsive UI/UX

Backend:

Node.js + Express

LNbits API Integration

JSON storage (pending & settled invoices)

Environment variables (.env)

Bitcoin / Lightning Integration:

LNbits (https://legend.lnbits.com)

Mempool.space API

(Optionnel) Bitcoin Core RPC via le fichier Dakar Bitcoin Days - Mempool.space.ipynb

🔑 Environment (.env)
LNBITS_URL=https://legend.lnbits.com
LNBITS_API_KEY=EXAMPLE_ADMIN_KEY_FOR_TEST
APP_API_KEY=EXAMPLE_APP_KEY
PORT=3001


(Déjà prêt à l’emploi pour les tests — aucun changement requis.)

🧩 Project Structure
jangbokk/
│
├── backend/
│   ├── server.js          # Express server with LNbits proxy
│   ├── pending_invoices.json
│   ├── settled_invoices.json
│   └── .env
│
├── frontend/
│   ├── index.html         # Homepage + dashboard
│   ├── login.html
│   ├── register.html
│   ├── about.html
│   ├── market.html
│   ├── learn.html
│   ├── css/
│   │   └── style.css
│   └── js/
│       ├── app.js
│       ├── auth.js
│       └── lnbits.js
│
├── README.md
└── package.json

🧠 How It Works

User registers or logs in

Data stored locally (demo mode)

Dashboard shows balance + learning level

User clicks “Earn Sats”

Backend creates Lightning invoice via LNbits

Invoice tracked until paid

Upon payment

Webhook confirms it and updates settled_invoices.json

Marketplace allows sales with sats

🧪 Run Locally
# 1️⃣ Clone repo
git clone https://github.com/yourusername/jangbokk.git
cd jangbokk/backend

# 2️⃣ Install dependencies
npm install express axios cors dotenv

# 3️⃣ Run server
node server.js

# 4️⃣ Open frontend
cd ../frontend
open index.html

🎯 Goals for Dakar Bitcoin Hack

🌐 Promouvoir l’éducation Bitcoin au Sénégal

⚡ Utiliser Lightning pour des micro-paiements rapides et locaux

💡 Fournir un outil open-source utile à la communauté

🧑‍💻 Team

David Tchegnimonhan & Kevin (HKU)
Building together for Dakar Bitcoin Hackathon 🧡
