

## CLEANED PACKAGE NOTE
This cleaned package has node_modules removed and backend/.env moved to backend/.env.example. Add your real secrets to backend/.env (do NOT commit it).

### Quick start
```bash
cd backend
cp .env.example .env
# edit .env to add LNBITS_API_KEY and LNBITS_URL
npm install
npm start
```


## LNbits integration and frontend API key

- Set your `LNBITS_API_KEY` and `LNBITS_URL` in `backend/.env` (copy from `.env.example`).
- Set `APP_API_KEY` to a random string in `backend/.env`.
- For demo convenience, set the same value in browser localStorage so frontend can call invoice endpoint:
  1. Open browser console after loading the app.
  2. Run:
     ```js
     localStorage.setItem('jb_app_key', 'YOUR_APP_API_KEY');
     ```
  (In production, implement proper auth/session instead of storing a key in localStorage.)

## Webhook
- Configure LNbits webhook to POST to `https://your-domain/api/lnbits/webhook` so the server can confirm payments and credit users.
