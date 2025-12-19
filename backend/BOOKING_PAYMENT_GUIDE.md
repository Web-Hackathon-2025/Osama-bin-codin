# Booking & Payment System API Documentation

## Overview

The Karigar platform now supports complete booking management with optional Stripe payment integration. Users can book service providers, track booking status, make payments, and manage their booking history.

---

## Booking Model

### Booking Statuses

- **pending**: Waiting for worker response
- **accepted**: Worker accepted the request
- **rejected**: Worker rejected the request
- **in-progress**: Service is ongoing
- **completed**: Service completed
- **cancelled**: Cancelled by customer or worker
- **disputed**: Issue reported

### Payment Statuses

- **pending**: Payment not yet made
- **paid**: Payment successful
- **refunded**: Payment refunded
- **failed**: Payment failed

### Payment Methods

- **stripe**: Pay online via Stripe
- **cash**: Pay cash on completion
- **none**: No payment required

---

## API Endpoints

### Booking Routes (`/api/bookings`)

#### Get Stripe Configuration

**GET** `/api/bookings/stripe/config`

- **Access**: Public
- **Description**: Get Stripe publishable key for frontend

**Response**:

```json
{
  "publishableKey": "pk_test_..."
}
```

---

#### Create Booking

**POST** `/api/bookings`

- **Access**: Private (Customer/User only)
- **Description**: Create a new booking with optional Stripe payment

**Request Body**:

```json
{
  "workerId": "worker_id",
  "serviceCategory": "plumber",
  "description": "Fix kitchen sink leak",
  "serviceAddress": {
    "street": "123 Main St",
    "city": "New York",
    "state": "NY",
    "zipCode": "10001",
    "coordinates": {
      "latitude": 40.7128,
      "longitude": -74.006
    }
  },
  "scheduledDate": "2025-12-25T00:00:00.000Z",
  "scheduledTime": "10:00 AM",
  "estimatedHours": 2,
  "paymentMethod": "stripe", // or "cash" or "none"
  "notes": "Please bring necessary tools"
}
```

**Response** (with Stripe):

```json
{
  "message": "Booking created successfully",
  "booking": {
    /* booking object */
  },
  "clientSecret": "pi_xxx_secret_xxx",
  "requiresPayment": true
}
```

**Response** (without Stripe):

```json
{
  "message": "Booking created successfully",
  "booking": {
    /* booking object */
  },
  "requiresPayment": false
}
```

---

#### Get My Bookings

**GET** `/api/bookings/my-bookings`

- **Access**: Private
- **Description**: Get all bookings for logged-in user (as customer or worker)

**Query Parameters**:

- `status`: Filter by status (pending, accepted, completed, etc.)
- `page`: Page number (default: 1)
- `limit`: Results per page (default: 10)

**Response**:

```json
{
  "bookings": [
    /* array of bookings */
  ],
  "totalPages": 5,
  "currentPage": 1,
  "totalBookings": 48
}
```

---

#### Get Booking by ID

**GET** `/api/bookings/:id`

- **Access**: Private (Customer, Worker, or Admin involved in booking)
- **Description**: Get detailed booking information

**Response**:

```json
{
  "_id": "booking_id",
  "customer": {
    /* customer details */
  },
  "worker": {
    /* worker details */
  },
  "serviceCategory": "plumber",
  "description": "Fix kitchen sink leak",
  "serviceAddress": {
    /* address object */
  },
  "scheduledDate": "2025-12-25T00:00:00.000Z",
  "scheduledTime": "10:00 AM",
  "estimatedHours": 2,
  "hourlyRate": 50,
  "totalAmount": 100,
  "status": "accepted",
  "paymentStatus": "paid",
  "paymentMethod": "stripe",
  "isPaid": true,
  "paidAt": "2025-12-20T10:30:00.000Z",
  "workerResponse": {
    "status": "accepted",
    "message": "I'll be there on time",
    "respondedAt": "2025-12-20T09:00:00.000Z"
  },
  "createdAt": "2025-12-19T15:30:00.000Z",
  "updatedAt": "2025-12-20T10:30:00.000Z"
}
```

---

#### Confirm Payment

**POST** `/api/bookings/:id/confirm-payment`

- **Access**: Private (Customer only)
- **Description**: Verify payment status after Stripe payment

**Response**:

```json
{
  "message": "Payment confirmed successfully",
  "booking": {
    /* updated booking */
  }
}
```

---

#### Worker Responds to Booking

**PUT** `/api/bookings/:id/respond`

- **Access**: Private (Worker only)
- **Description**: Accept or reject a booking request

**Request Body**:

```json
{
  "status": "accepted", // or "rejected"
  "message": "I'll be there on time!"
}
```

**Response**:

```json
{
  "message": "Booking accepted successfully",
  "booking": {
    /* updated booking */
  }
}
```

---

#### Update Booking Status

**PUT** `/api/bookings/:id/status`

- **Access**: Private (Worker only)
- **Description**: Update booking to in-progress or completed

**Request Body**:

```json
{
  "status": "completed", // or "in-progress"
  "notes": "Service completed successfully",
  "actualHours": 2.5
}
```

**Response**:

```json
{
  "message": "Booking status updated successfully",
  "booking": {
    /* updated booking */
  }
}
```

---

#### Cancel Booking

**PUT** `/api/bookings/:id/cancel`

- **Access**: Private (Customer or Worker)
- **Description**: Cancel a booking (auto-refund if paid via Stripe)

**Request Body**:

```json
{
  "reason": "Emergency came up, need to reschedule"
}
```

**Response**:

```json
{
  "message": "Booking cancelled successfully",
  "booking": {
    /* updated booking with refund info */
  }
}
```

---

#### Rate and Review Booking

**POST** `/api/bookings/:id/review`

- **Access**: Private (Customer only)
- **Description**: Rate and review completed booking

**Request Body**:

```json
{
  "score": 5, // 1-5
  "review": "Excellent service! Very professional and quick."
}
```

**Response**:

```json
{
  "message": "Review submitted successfully",
  "booking": {
    /* updated booking with rating */
  }
}
```

---

#### Get Booking Statistics

**GET** `/api/bookings/stats/overview`

- **Access**: Private
- **Description**: Get booking statistics for logged-in user

**Response**:

```json
{
  "totalBookings": 25,
  "pendingBookings": 3,
  "acceptedBookings": 5,
  "completedBookings": 15,
  "cancelledBookings": 2,
  "totalSpent": 1250.5
}
```

---

## Frontend Integration Guide

### 1. Install Stripe.js

```bash
npm install @stripe/stripe-js
```

### 2. Initialize Stripe

```javascript
import { loadStripe } from "@stripe/stripe-js";

// Get publishable key from backend
const { publishableKey } = await fetch("/api/bookings/stripe/config").then(
  (r) => r.json()
);
const stripe = await loadStripe(publishableKey);
```

### 3. Create Booking with Payment

```javascript
// Create booking
const response = await fetch("/api/bookings", {
  method: "POST",
  headers: {
    "Content-Type": "application/json",
    Authorization: `Bearer ${token}`,
  },
  body: JSON.stringify({
    workerId: "worker_id",
    serviceCategory: "plumber",
    description: "Fix sink",
    scheduledDate: "2025-12-25",
    scheduledTime: "10:00 AM",
    estimatedHours: 2,
    paymentMethod: "stripe", // or 'cash' or 'none'
    serviceAddress: {
      /* address */
    },
  }),
});

const { booking, clientSecret, requiresPayment } = await response.json();

// If payment required, show Stripe payment form
if (requiresPayment) {
  const elements = stripe.elements({ clientSecret });
  const paymentElement = elements.create("payment");
  paymentElement.mount("#payment-element");

  // Handle payment submission
  const { error } = await stripe.confirmPayment({
    elements,
    confirmParams: {
      return_url: "http://localhost:5173/booking-success",
    },
  });
}
```

### 4. Display Booking Status

```javascript
// Customer view
<div>
  <h3>Booking Status: {booking.status}</h3>
  <p>Worker Response: {booking.workerResponse?.message}</p>
  <p>
    Scheduled: {booking.scheduledDate} at {booking.scheduledTime}
  </p>
  <p>Service Provider: {booking.worker.name}</p>
  <p>Payment: {booking.isPaid ? "Paid" : "Pending"}</p>
</div>
```

---

## Complete Booking Flow

### Customer Flow:

1. Browse workers → Select worker
2. Fill booking form with date/time/description
3. Choose payment method (Stripe/Cash/None)
4. If Stripe: Complete payment → Booking created
5. Wait for worker response
6. Track booking status
7. After completion: Rate and review

### Worker Flow:

1. View incoming booking requests
2. Accept or reject with message
3. Update status to "in-progress" when starting
4. Mark as "completed" when finished
5. View booking history and earnings

### Admin Flow:

1. Monitor all bookings
2. Handle disputes
3. View platform statistics

---

## Environment Variables Required

```env
# Stripe Keys (Get from https://dashboard.stripe.com/apikeys)
STRIPE_SECRET_KEY=sk_test_your_secret_key
STRIPE_PUBLISHABLE_KEY=pk_test_your_publishable_key
```

---

## Testing with Stripe

Use Stripe test cards:

- **Success**: `4242 4242 4242 4242`
- **Requires Auth**: `4000 0025 0000 3155`
- **Decline**: `4000 0000 0000 9995`

Any future date for expiry, any 3-digit CVC.

---

## Features Implemented

✅ Create booking with worker selection  
✅ Optional Stripe payment integration  
✅ Cash payment option  
✅ Worker accept/reject requests  
✅ Real-time booking status tracking  
✅ Booking history for customers & workers  
✅ Auto-refund on cancellation  
✅ Rating and review system  
✅ Worker statistics update  
✅ Payment confirmation  
✅ Booking cancellation by both parties  
✅ Service address with coordinates  
✅ Estimated vs actual hours tracking

---

Your booking system is ready! 🎉
