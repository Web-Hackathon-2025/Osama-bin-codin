# 🎣 STRIPE WEBHOOK SETUP GUIDE

## 🔥 WEBHOOK ENDPOINT IS NOW LIVE!

Your backend now includes a complete Stripe webhook handler that listens for payment events and automatically updates booking statuses.

---

## 📍 WEBHOOK URL

```
http://localhost:5000/api/webhooks/stripe
```

**Important:** This endpoint is configured to receive RAW JSON bodies (required by Stripe for signature verification).

---

## 🛠️ STRIPE CLI SETUP (For Testing)

### 1. Install Stripe CLI

**Windows (PowerShell):**

```powershell
# Using Scoop
scoop install stripe

# Or download from: https://github.com/stripe/stripe-cli/releases
```

**Mac:**

```bash
brew install stripe/stripe-cli/stripe
```

**Linux:**

```bash
wget https://github.com/stripe/stripe-cli/releases/latest/download/stripe_1.19.4_linux_x86_64.tar.gz
tar -xvf stripe_1.19.4_linux_x86_64.tar.gz
sudo mv stripe /usr/local/bin/
```

### 2. Login to Stripe CLI

```bash
stripe login
```

This will open a browser window to authorize the CLI with your Stripe account.

### 3. Listen for Webhooks (Local Development)

Run this command in a **separate terminal** while your server is running:

```bash
stripe listen --forward-to localhost:5000/api/webhooks/stripe
```

**You will get output like this:**

```
> Ready! Your webhook signing secret is whsec_xxxxxxxxxxxxx (^C to quit)
```

### 4. Copy the Webhook Secret

Copy the `whsec_xxxxxxxxxxxxx` value from the output.

### 5. Add to .env File

Add this to your `backend/.env` file:

```env
STRIPE_WEBHOOK_SECRET=whsec_xxxxxxxxxxxxx
```

### 6. Restart Your Server

Stop and restart your backend server to load the new environment variable:

```bash
cd backend
npm run dev
```

---

## 🎯 WHAT THE WEBHOOK HANDLES

Your webhook now automatically handles these Stripe events:

### Payment Events (Customer Bookings)

- ✅ `payment_intent.succeeded` - Payment successful, updates booking status to "paid"
- ✅ `payment_intent.payment_failed` - Payment failed, updates booking status to "failed"
- ✅ `payment_intent.canceled` - Payment cancelled

### Charge Events (Connect Payments)

- ✅ `charge.succeeded` - Charge to worker's Connect account succeeded
- ✅ `charge.failed` - Charge failed, logged for debugging

### Account Events (Worker Onboarding)

- ✅ `account.updated` - Worker's Stripe account status updated
  - Automatically marks worker's `stripeOnboardingComplete` as true when ready
  - Updates `chargesEnabled` and `payoutsEnabled` status

### Transfer Events (Platform → Worker)

- ✅ `transfer.created` - Transfer to worker initiated
- ✅ `transfer.paid` - Worker received payment
- ✅ `transfer.failed` - Transfer failed

### Payout Events (Stripe → Worker Bank)

- ✅ `payout.paid` - Money deposited to worker's bank account
- ✅ `payout.failed` - Payout failed

---

## 🧪 TESTING WEBHOOKS

### Test Payment Flow:

1. **Start your server:**

   ```bash
   cd backend
   npm run dev
   ```

2. **Start Stripe CLI (in another terminal):**

   ```bash
   stripe listen --forward-to localhost:5000/api/webhooks/stripe
   ```

3. **Create a test booking with payment** (via your frontend or Postman)

4. **Trigger test events manually:**

   ```bash
   # Test successful payment
   stripe trigger payment_intent.succeeded

   # Test failed payment
   stripe trigger payment_intent.payment_failed

   # Test account update (worker onboarding)
   stripe trigger account.updated
   ```

5. **Check your server logs** - You'll see:
   ```
   ✅ Stripe webhook event received: payment_intent.succeeded
   💰 Payment succeeded: pi_xxxxxxxxxxxxx
   ✅ Booking 12345 payment confirmed
   ```

---

## 🌐 PRODUCTION WEBHOOK SETUP

When you deploy to production (e.g., Heroku, Railway, Render):

### 1. Get Your Production URL

Example: `https://karigar-api.herokuapp.com`

### 2. Add Webhook in Stripe Dashboard

1. Go to: https://dashboard.stripe.com/test/webhooks
2. Click **"Add endpoint"**
3. Enter your webhook URL:
   ```
   https://karigar-api.herokuapp.com/api/webhooks/stripe
   ```
4. Select these events to listen for:

   - `payment_intent.succeeded`
   - `payment_intent.payment_failed`
   - `payment_intent.canceled`
   - `charge.succeeded`
   - `charge.failed`
   - `account.updated`
   - `transfer.created`
   - `transfer.paid`
   - `transfer.failed`
   - `payout.paid`
   - `payout.failed`

5. Click **"Add endpoint"**

### 3. Copy the Signing Secret

After creating the endpoint, Stripe will show you a **Signing secret** like:

```
whsec_xxxxxxxxxxxxxxxxxxxxx
```

### 4. Add to Production Environment Variables

Add this to your production environment:

```env
STRIPE_WEBHOOK_SECRET=whsec_xxxxxxxxxxxxxxxxxxxxx
```

---

## 🔍 MONITORING WEBHOOKS

### Check Webhook Logs in Stripe Dashboard

1. Go to: https://dashboard.stripe.com/test/webhooks
2. Click on your endpoint
3. View all webhook events and responses
4. See if any failed and retry them

### Check Your Server Logs

The webhook handler logs every event:

```
✅ Stripe webhook event received: payment_intent.succeeded
💰 Payment succeeded: pi_1234567890
✅ Booking 507f1f77bcf86cd799439011 payment confirmed
```

---

## 🚨 TROUBLESHOOTING

### Error: "Webhook signature verification failed"

**Cause:** Wrong webhook secret or body not raw JSON

**Solutions:**

1. Make sure `STRIPE_WEBHOOK_SECRET` is set in `.env`
2. Restart your server after adding the secret
3. Verify webhook route is BEFORE `express.json()` middleware (✅ Already done!)

### Error: "No signatures found matching the expected signature for payload"

**Cause:** Stripe CLI not forwarding to correct URL

**Solution:**

```bash
# Make sure your server is running on port 5000
stripe listen --forward-to localhost:5000/api/webhooks/stripe
```

### Webhook Events Not Showing Up

**Solutions:**

1. Check if Stripe CLI is running: `stripe listen --forward-to localhost:5000/api/webhooks/stripe`
2. Verify your server is running: `http://localhost:5000`
3. Check server logs for webhook events
4. Try triggering test event: `stripe trigger payment_intent.succeeded`

---

## ✅ VERIFICATION CHECKLIST

Before testing, ensure:

- [ ] Stripe CLI installed: `stripe --version`
- [ ] Logged into Stripe: `stripe login`
- [ ] Backend server running: `http://localhost:5000`
- [ ] Stripe CLI forwarding: `stripe listen --forward-to localhost:5000/api/webhooks/stripe`
- [ ] Webhook secret in `.env`: `STRIPE_WEBHOOK_SECRET=whsec_...`
- [ ] Server restarted after adding secret

---

## 🎉 YOUR WEBHOOK IS READY!

The webhook automatically:

- ✅ Updates booking payment status when customer pays
- ✅ Sends notifications to workers when payment received
- ✅ Tracks worker Stripe onboarding completion
- ✅ Monitors transfers and payouts
- ✅ Handles payment failures gracefully

**No manual intervention needed!** 🚀

---

## 📝 QUICK START COMMANDS

**Terminal 1 (Backend Server):**

```bash
cd backend
npm run dev
```

**Terminal 2 (Stripe CLI):**

```bash
stripe listen --forward-to localhost:5000/api/webhooks/stripe
```

**Terminal 3 (Optional - Test Events):**

```bash
stripe trigger payment_intent.succeeded
```

Done! Your payment system is now fully automated. 💰
