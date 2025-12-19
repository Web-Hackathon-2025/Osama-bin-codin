import Notification from "../models/Notification.js";

/**
 * Create a notification for a user
 * @param {String} userId - User ID to notify
 * @param {String} type - Notification type
 * @param {String} title - Notification title
 * @param {String} message - Notification message
 * @param {Object} options - Additional options (relatedBooking, relatedUser)
 */
export const createNotification = async (
  userId,
  type,
  title,
  message,
  options = {}
) => {
  try {
    const notificationData = {
      user: userId,
      type,
      title,
      message,
    };

    if (options.relatedBooking) {
      notificationData.relatedBooking = options.relatedBooking;
    }

    if (options.relatedUser) {
      notificationData.relatedUser = options.relatedUser;
    }

    await Notification.create(notificationData);
    return true;
  } catch (error) {
    console.error("Create notification error:", error);
    return false;
  }
};

/**
 * Notify about new booking
 */
export const notifyBookingCreated = async (workerId, customerId, bookingId) => {
  await createNotification(
    workerId,
    "booking_created",
    "New Booking Request",
    "You have a new booking request. Please review and respond.",
    { relatedBooking: bookingId, relatedUser: customerId }
  );
};

/**
 * Notify when booking is accepted
 */
export const notifyBookingAccepted = async (
  customerId,
  workerId,
  bookingId
) => {
  await createNotification(
    customerId,
    "booking_accepted",
    "Booking Accepted",
    "Your booking request has been accepted by the service provider!",
    { relatedBooking: bookingId, relatedUser: workerId }
  );
};

/**
 * Notify when booking is rejected
 */
export const notifyBookingRejected = async (
  customerId,
  workerId,
  bookingId
) => {
  await createNotification(
    customerId,
    "booking_rejected",
    "Booking Declined",
    "Your booking request was declined. Please try another service provider.",
    { relatedBooking: bookingId, relatedUser: workerId }
  );
};

/**
 * Notify when booking is cancelled
 */
export const notifyBookingCancelled = async (
  userId,
  cancelledBy,
  bookingId
) => {
  await createNotification(
    userId,
    "booking_cancelled",
    "Booking Cancelled",
    "A booking has been cancelled.",
    { relatedBooking: bookingId, relatedUser: cancelledBy }
  );
};

/**
 * Notify when booking is completed
 */
export const notifyBookingCompleted = async (
  customerId,
  workerId,
  bookingId
) => {
  await createNotification(
    customerId,
    "booking_completed",
    "Service Completed",
    "Your service has been marked as completed. Please rate and review!",
    { relatedBooking: bookingId, relatedUser: workerId }
  );
};

/**
 * Notify worker when payment is received
 */
export const notifyPaymentReceived = async (workerId, amount, bookingId) => {
  await createNotification(
    workerId,
    "payment_received",
    "Payment Received",
    `You received a payment of $${amount}`,
    { relatedBooking: bookingId }
  );
};

/**
 * Notify when worker gets a review
 */
export const notifyReviewReceived = async (
  workerId,
  customerId,
  bookingId,
  rating
) => {
  await createNotification(
    workerId,
    "review_received",
    "New Review",
    `You received a ${rating}-star review!`,
    { relatedBooking: bookingId, relatedUser: customerId }
  );
};

/**
 * Notify worker when approved by admin
 */
export const notifyWorkerApproved = async (workerId) => {
  await createNotification(
    workerId,
    "worker_approved",
    "Account Approved!",
    "Congratulations! Your worker account has been approved. You can now start receiving bookings."
  );
};

/**
 * Notify worker when rejected by admin
 */
export const notifyWorkerRejected = async (workerId) => {
  await createNotification(
    workerId,
    "worker_rejected",
    "Account Not Approved",
    "Your worker account application was not approved. Please contact support for more information."
  );
};
