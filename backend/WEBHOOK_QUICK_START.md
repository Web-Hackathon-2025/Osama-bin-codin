# 🎣 STRIPE WEBHOOK - QUICK REFERENCE

## 📍 YOUR WEBHOOK URL

```
http://localhost:5000/api/webhooks/stripe
```

---

## ⚡ QUICK START (3 Steps)

### Step 1: Start Stripe CLI

Open a **NEW terminal** and run:

```bash
stripe listen --forward-to localhost:5000/api/webhooks/stripe
```

### Step 2: Copy the Secret

You'll see output like:

```
> Ready! Your webhook signing secret is whsec_abc123xyz456...
```

**Copy the entire `whsec_...` value!**

### Step 3: Add to .env

Open `backend/.env` and add:

```env
STRIPE_WEBHOOK_SECRET=whsec_abc123xyz456...
```

**Restart your server** (Ctrl+C then `npm run dev`)

---

## ✅ DONE!

Your webhook is now active and will automatically:

- ✅ Update booking payment status
- ✅ Notify workers when paid
- ✅ Track Stripe onboarding status
- ✅ Handle payment failures
- ✅ Process refunds

---

## 🧪 Test It

```bash
# In a third terminal, trigger a test event:
stripe trigger payment_intent.succeeded
```

Check your backend logs - you should see:

```
✅ Stripe webhook event received: payment_intent.succeeded
💰 Payment succeeded: pi_...
```

---

## 🌐 For Production

When deploying (e.g., Heroku):

1. Get your production URL: `https://your-app.herokuapp.com`
2. Go to: https://dashboard.stripe.com/test/webhooks
3. Click "Add endpoint"
4. Enter: `https://your-app.herokuapp.com/api/webhooks/stripe`
5. Select events or choose "Select all events"
6. Copy the signing secret
7. Add to production env vars: `STRIPE_WEBHOOK_SECRET=whsec_...`

---

## 🎯 What Events Are Handled?

✅ `payment_intent.succeeded` - Payment complete  
✅ `payment_intent.payment_failed` - Payment failed  
✅ `payment_intent.canceled` - Payment cancelled  
✅ `account.updated` - Worker onboarding status  
✅ `charge.succeeded` / `charge.failed` - Charge events  
✅ `transfer.created` / `transfer.paid` / `transfer.failed` - Transfers  
✅ `payout.paid` / `payout.failed` - Bank payouts

All handled automatically! 🚀
