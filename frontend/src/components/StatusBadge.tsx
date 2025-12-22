import React from 'react';
import type { BookingStatus } from '../types';
import { Clock, CheckCircle, XCircle, AlertCircle } from 'lucide-react';

interface StatusBadgeProps {
  status: BookingStatus;
  size?: 'sm' | 'md' | 'lg';
}

const StatusBadge: React.FC<StatusBadgeProps> = ({ status, size = 'md' }) => {
  const getStatusConfig = () => {
    switch (status) {
      case 'pending':
        return {
          label: 'Pending',
          icon: Clock,
          bgColor: 'bg-gradient-to-r from-warning-100 to-yellow-100',
          textColor: 'text-warning-800',
          borderColor: 'border-warning-300',
        };
      case 'accepted':
        return {
          label: 'Accepted',
          icon: CheckCircle,
          bgColor: 'bg-gradient-to-r from-success-100 to-green-100',
          textColor: 'text-success-800',
          borderColor: 'border-success-300',
        };
      case 'rejected':
        return {
          label: 'Rejected',
          icon: XCircle,
          bgColor: 'bg-gradient-to-r from-orange-100 to-orange-200',
          textColor: 'text-orange-800',
          borderColor: 'border-orange-300',
        };
      case 'in-progress':
        return {
          label: 'In Progress',
          icon: Clock,
          bgColor: 'bg-gradient-to-r from-blue-100 to-blue-200',
          textColor: 'text-blue-800',
          borderColor: 'border-blue-300',
        };
      case 'completed':
        return {
          label: 'Completed',
          icon: CheckCircle,
          bgColor: 'bg-gradient-to-r from-primary-100 to-blue-100',
          textColor: 'text-primary-800',
          borderColor: 'border-primary-300',
        };
      case 'cancelled':
        return {
          label: 'Cancelled',
          icon: XCircle,
          bgColor: 'bg-gradient-to-r from-danger-100 to-red-100',
          textColor: 'text-danger-800',
          borderColor: 'border-danger-300',
        };
      default:
        return {
          label: 'Unknown',
          icon: AlertCircle,
          bgColor: 'bg-slate-100',
          textColor: 'text-slate-800',
          borderColor: 'border-slate-300',
        };
    }
  };

  const config = getStatusConfig();
  const Icon = config.icon;

  const sizeClasses = {
    sm: 'px-2 py-0.5 text-xs',
    md: 'px-3 py-1 text-sm',
    lg: 'px-4 py-2 text-base',
  };

  const iconSizes = {
    sm: 12,
    md: 14,
    lg: 16,
  };

  return (
    <span
      className={`inline-flex items-center space-x-1 ${config.bgColor} ${config.textColor} ${sizeClasses[size]} rounded-full font-medium border ${config.borderColor}`}
    >
      <Icon size={iconSizes[size]} />
      <span>{config.label}</span>
    </span>
  );
};

export default StatusBadge;
