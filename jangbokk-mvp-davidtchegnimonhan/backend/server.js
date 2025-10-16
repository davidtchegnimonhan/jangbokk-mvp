// backend/server.js
require('dotenv').config();
const express = require('express');
const axios = require('axios');
const fs = require('fs');
const path = require('path');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(express.json());

const LNBITS_URL = process.env.LNBITS_URL || 'https://legend.lnbits.com';
const LNBITS_API_KEY = process.env.LNBITS_API_KEY || '';
const APP_API_KEY = process.env.APP_API_KEY || 'changeme'; // set to strong random string
const PORT = process.env.PORT || 3001;

const pendingPath = path.join(__dirname, 'pending_invoices.json');
function loadPending(){
  try{ return JSON.parse(fs.readFileSync(pendingPath)); }catch(e){ return {}; }
}
function savePending(obj){ fs.writeFileSync(pendingPath, JSON.stringify(obj||{})); }

// Basic helper to call LNbits create invoice
async function createLnbitsInvoice(amount, memo){
  const url = `${LNBITS_URL}/api/v1/payments`;
  const body = { out: false, amount: Number(amount), memo: memo || '' };
  const res = await axios.post(url, body, { headers: { 'X-Api-Key': LNBITS_API_KEY, 'Content-Type': 'application/json' }});
  return res.data;
}

// Check invoice by payment_hash
async function getInvoice(payment_hash){
  const url = `${LNBITS_URL}/api/v1/payments/${payment_hash}`;
  const res = await axios.get(url, { headers: { 'X-Api-Key': LNBITS_API_KEY }});
  return res.data;
}

// Protect endpoint with simple app key
function checkAppKey(req, res){
  const key = req.headers['x-app-key'];
  if(!key || key !== APP_API_KEY) { res.status(401).json({ error: 'Unauthorized' }); return false; }
  return true;
}

// Create invoice endpoint (called from frontend)
app.post('/api/lnbits/invoice', async (req, res) => {
  if(!checkAppKey(req,res)) return;
  try {
    const { amount, memo, user } = req.body;
    if(!amount || amount <= 0) return res.status(400).json({ error: 'amount required' });

    const data = await createLnbitsInvoice(amount, memo || `JangBokk: ${user||'guest'}`);
    // LNbits returns payment_request (bolt11) and payment_hash
    // store pending mapping
    const pending = loadPending();
    if(data.payment_hash) {
      pending[data.payment_hash] = { user: user || null, amount: Number(amount), memo: memo || '', createdAt: Date.now() };
      savePending(pending);
    }

    return res.json(data);
  } catch (err) {
    console.error('create invoice error', err.response?.data || err.message);
    return res.status(500).json({ error: 'LNbits create invoice error', detail: err.response?.data || err.message });
  }
});

// Check invoice status (frontend polling)
app.get('/api/lnbits/payment/:payment_hash', async (req, res) => {
  const { payment_hash } = req.params;
  if(!payment_hash) return res.status(400).json({ error: 'missing payment_hash' });
  try {
    const data = await getInvoice(payment_hash);
    // format: paid boolean or paid_at present depending on LNbits response
    const paid = !!(data.paid || data.paid_at);
    return res.json({ paid, data });
  } catch (err) {
    console.error('check invoice error', err.response?.data || err.message);
    return res.status(500).json({ error: 'LNbits check invoice error', detail: err.response?.data || err.message });
  }
});

// Webhook endpoint - configure in LNbits to call this URL when an invoice is paid
// LNbits will POST invoice data. We mark pending invoices as settled here.
app.post('/api/lnbits/webhook', async (req, res) => {
  try {
    const body = req.body || {};
    // Try common fields
    const payment_hash = body.payment_hash || body.payment_hash_hex || body.payment_hash_hex?.toString?.() || body.id;
    const paid = !!(body.paid || body.paid_at);
    if(!payment_hash){ console.log('webhook missing payment_hash', body); return res.json({ ok: true }); }
    const pending = loadPending();
    const rec = pending[payment_hash];
    if(!rec){
      console.log('webhook unknown invoice', payment_hash, body);
      return res.json({ ok: true });
    }
    if(paid){
      console.log('invoice paid ->', payment_hash, rec);
      // Here: we could trigger server-side actions (notify frontend via socket, push to DB).
      // For this MVP, just mark as paid by removing from pending and saving a record file
      const settledPath = path.join(__dirname, 'settled_invoices.json');
      let settled = {};
      try{ settled = JSON.parse(fs.readFileSync(settledPath)); }catch(e){ settled = {}; }
      settled[payment_hash] = Object.assign({}, rec, { paidAt: Date.now(), lnbitsPayload: body });
      fs.writeFileSync(settledPath, JSON.stringify(settled));
      delete pending[payment_hash];
      savePending(pending);
    }
    return res.json({ ok: true });
  } catch (err) {
    console.error('webhook handler error', err);
    return res.status(500).json({ error: 'server error' });
  }
});

// optional: list pending invoices
app.get('/api/lnbits/pending', (req,res) => {
  if(!checkAppKey(req,res)) return;
  const pending = loadPending();
  return res.json(pending);
});

app.listen(PORT, ()=> console.log(`LNbits proxy listening on ${PORT}`));
