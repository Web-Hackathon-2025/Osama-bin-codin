import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { CheckCircle } from 'lucide-react';
import bookingsData from '../data/bookings.json';
import RatingStars from '../components/RatingStars';
import type { Booking } from '../types';

const Review: React.FC = () => {
  const { bookingId } = useParams<{ bookingId: string }>();
  const navigate = useNavigate();
  
  const booking = bookingsData.find((b) => b.id === bookingId) as Booking | undefined;
  
  const [rating, setRating] = React.useState(0);
  const [comment, setComment] = React.useState('');
  const [showSuccess, setShowSuccess] = React.useState(false);

  if (!booking) {
    return (
      <div className="min-h-screen bg-slate-50 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-2xl font-bold text-slate-900 mb-4">Booking not found</h1>
          <button
            onClick={() => navigate('/customer/bookings')}
            className="text-blue-600 hover:text-blue-700 font-medium"
          >
            Go back to bookings
          </button>
        </div>
      </div>
    );
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (rating === 0) {
      alert('Please select a rating');
      return;
    }
    
    // Show success message (UI only)
    setShowSuccess(true);
    
    // Redirect after 2 seconds
    setTimeout(() => {
      navigate('/customer/bookings');
    }, 2000);
  };

  if (showSuccess) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center py-8">
        <div className="max-w-md w-full mx-4">
          <div className="bg-white rounded-xl shadow-lg p-8 text-center">
            <div className="bg-green-100 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6">
              <CheckCircle className="text-green-600" size={48} />
            </div>
            <h1 className="text-2xl font-bold text-slate-900 mb-2">Review Submitted!</h1>
            <p className="text-slate-600 mb-6">
              Thank you for your feedback. Your review helps others make informed decisions.
            </p>
            <p className="text-sm text-slate-500">Redirecting to your bookings...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 py-8">
      <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-slate-900 mb-2">Write a Review</h1>
          <p className="text-lg text-slate-600">
            Share your experience with {booking.providerName}
          </p>
        </div>

        {/* Booking Info */}
        <div className="bg-white rounded-xl shadow-md p-6 mb-8">
          <h2 className="text-lg font-semibold text-slate-900 mb-3">Service Details</h2>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-slate-600">Service:</span>
              <span className="font-medium text-slate-900">{booking.service}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-600">Provider:</span>
              <span className="font-medium text-slate-900">{booking.providerName}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-600">Date:</span>
              <span className="font-medium text-slate-900">
                {new Date(booking.date).toLocaleDateString('en-US', {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric',
                })}
              </span>
            </div>
            {booking.price && (
              <div className="flex justify-between">
                <span className="text-slate-600">Price:</span>
                <span className="font-medium text-slate-900">{booking.price}</span>
              </div>
            )}
          </div>
        </div>

        {/* Review Form */}
        <form onSubmit={handleSubmit} className="bg-white rounded-xl shadow-md p-6 md:p-8">
          {/* Rating */}
          <div className="mb-8">
            <label className="block text-sm font-medium text-slate-700 mb-4">
              Overall Rating <span className="text-red-500">*</span>
            </label>
            <div className="flex justify-center">
              <RatingStars
                rating={rating}
                size={40}
                showNumber={false}
                interactive={true}
                onRatingChange={setRating}
              />
            </div>
            {rating > 0 && (
              <p className="text-center mt-2 text-slate-600">
                You rated: <span className="font-semibold">{rating} out of 5</span>
              </p>
            )}
          </div>

          {/* Comment */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-slate-700 mb-2">
              Your Review <span className="text-red-500">*</span>
            </label>
            <textarea
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              required
              rows={6}
              placeholder="Share details of your experience with this service provider..."
              className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
            />
            <p className="mt-2 text-sm text-slate-500">
              Please be honest and constructive. Your review will help others make informed decisions.
            </p>
          </div>

          {/* Buttons */}
          <div className="flex flex-col sm:flex-row gap-4">
            <button
              type="button"
              onClick={() => navigate('/customer/bookings')}
              className="flex-1 px-6 py-3 border border-slate-300 text-slate-700 font-medium rounded-lg hover:bg-slate-50 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={rating === 0}
              className="flex-1 px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg transition-colors disabled:bg-slate-300 disabled:cursor-not-allowed"
            >
              Submit Review
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Review;
