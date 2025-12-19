import React from 'react';
import { Link } from 'react-router-dom';
import { useUser } from '../context/UserContext';
import type { UserRole } from '../types';
import { Menu, X, User } from 'lucide-react';

const Navbar: React.FC = () => {
  const { role, setRole } = useUser();
  const [isMenuOpen, setIsMenuOpen] = React.useState(false);
  const [isRoleMenuOpen, setIsRoleMenuOpen] = React.useState(false);

  const handleRoleChange = (newRole: UserRole) => {
    setRole(newRole);
    setIsRoleMenuOpen(false);
    setIsMenuOpen(false);
  };

  const getNavLinks = () => {
    if (role === 'customer') {
      return [
        { to: '/browse', label: 'Browse Services' },
        { to: '/customer/bookings', label: 'My Bookings' },
      ];
    } else if (role === 'provider') {
      return [
        { to: '/provider/dashboard', label: 'Dashboard' },
        { to: '/provider/requests', label: 'Service Requests' },
        { to: '/provider/profile', label: 'My Profile' },
        { to: '/provider/history', label: 'History' },
      ];
    } else {
      return [
        { to: '/admin/dashboard', label: 'Dashboard' },
      ];
    }
  };

  return (
    <nav className="bg-white shadow-md sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <Link to="/" className="flex items-center space-x-2">
              <div className="bg-blue-600 text-white font-bold text-2xl px-3 py-1 rounded">K</div>
              <span className="text-2xl font-bold text-slate-900">Karigar</span>
            </Link>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-6">
            {getNavLinks().map((link) => (
              <Link
                key={link.to}
                to={link.to}
                className="text-slate-700 hover:text-blue-600 transition-colors font-medium"
              >
                {link.label}
              </Link>
            ))}
            
            {/* Role Switcher */}
            <div className="relative">
              <button
                onClick={() => setIsRoleMenuOpen(!isRoleMenuOpen)}
                className="flex items-center space-x-2 px-4 py-2 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors"
              >
                <User size={18} />
                <span className="capitalize font-medium">{role}</span>
              </button>
              
              {isRoleMenuOpen && (
                <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg py-2 border border-slate-200">
                  <button
                    onClick={() => handleRoleChange('customer')}
                    className="w-full text-left px-4 py-2 hover:bg-slate-50 transition-colors"
                  >
                    Customer
                  </button>
                  <button
                    onClick={() => handleRoleChange('provider')}
                    className="w-full text-left px-4 py-2 hover:bg-slate-50 transition-colors"
                  >
                    Service Provider
                  </button>
                  <button
                    onClick={() => handleRoleChange('admin')}
                    className="w-full text-left px-4 py-2 hover:bg-slate-50 transition-colors"
                  >
                    Admin
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden flex items-center">
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="text-slate-700 hover:text-blue-600"
            >
              {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="md:hidden py-4 space-y-2">
            {getNavLinks().map((link) => (
              <Link
                key={link.to}
                to={link.to}
                onClick={() => setIsMenuOpen(false)}
                className="block px-4 py-2 text-slate-700 hover:bg-slate-50 rounded transition-colors"
              >
                {link.label}
              </Link>
            ))}
            
            <div className="border-t border-slate-200 pt-2 mt-2">
              <p className="px-4 py-2 text-sm text-slate-500 font-medium">Switch Role</p>
              <button
                onClick={() => handleRoleChange('customer')}
                className="w-full text-left px-4 py-2 hover:bg-slate-50 transition-colors"
              >
                Customer
              </button>
              <button
                onClick={() => handleRoleChange('provider')}
                className="w-full text-left px-4 py-2 hover:bg-slate-50 transition-colors"
              >
                Service Provider
              </button>
              <button
                onClick={() => handleRoleChange('admin')}
                className="w-full text-left px-4 py-2 hover:bg-slate-50 transition-colors"
              >
                Admin
              </button>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
