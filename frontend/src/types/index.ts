// User Roles
export type UserRole = 'customer' | 'provider' | 'admin';

// Service Provider
export interface ServiceProvider {
  id: string;
  name: string;
  email: string;
  phone: string;
  profileImage: string;
  category: string;
  services: string[];
  priceRange: string;
  rating: number;
  reviewCount: number;
  location: string;
  availability: string;
  bio: string;
  experience: string;
}

// Service Category
export interface ServiceCategory {
  id: string;
  name: string;
  icon: string;
  description: string;
}

// Booking Status
export type BookingStatus = 'requested' | 'confirmed' | 'completed' | 'cancelled';

// Booking
export interface Booking {
  id: string;
  customerId: string;
  customerName: string;
  providerId: string;
  providerName: string;
  service: string;
  category: string;
  date: string;
  time: string;
  description: string;
  status: BookingStatus;
  price?: string;
  createdAt: string;
}

// Review
export interface Review {
  id: string;
  bookingId: string;
  customerId: string;
  customerName: string;
  providerId: string;
  rating: number;
  comment: string;
  createdAt: string;
}

// User (for Admin view)
export interface User {
  id: string;
  name: string;
  email: string;
  phone: string;
  role: UserRole;
  joinedDate: string;
  status: 'active' | 'inactive';
}

// Report/Issue
export interface Report {
  id: string;
  reportedBy: string;
  reportedUser: string;
  reason: string;
  status: 'pending' | 'resolved';
  createdAt: string;
}
