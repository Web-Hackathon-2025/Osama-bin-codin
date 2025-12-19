import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useUser } from '../context/UserContext';
import type { UserRole } from '../types';
import { Menu, X, User, LogOut } from 'lucide-react';

const Navbar: React.FC = () => {
  const { user, logout } = useAuth();
  const { role, setRole } = useUser();
  const [isMenuOpen, setIsMenuOpen] = React.useState(false);
  const [isRoleMenuOpen, setIsRoleMenuOpen] = React.useState(false);

  const handleRoleChange = (newRole: UserRole) => {
    setRole(newRole);
    setIsRoleMenuOpen(false);
    setIsMenuOpen(false);
  };

  const handleLogout = () => {
    logout();
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
    <nav className="bg-white shadow-lg sticky top-0 z-50 border-b-2 border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-20">
          <div className="flex items-center">
            <Link to="/" className="flex items-center space-x-3 group">
              <div className="bg-primary-600 text-white font-bold text-2xl px-3 py-1.5 rounded-xl shadow-lg group-hover:scale-110 transition-transform">K</div>
              <span className="text-3xl font-bold text-primary-600">Karigar</span>
            </Link>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            {getNavLinks().map((link, index) => {
              const hoverColors = ['hover:text-primary-700', 'hover:text-purple-700', 'hover:text-secondary-700', 'hover:text-success-700'];
              const hoverClass = hoverColors[index % hoverColors.length];
              
              return (
                <Link
                  key={link.to}
                  to={link.to}
                  className={`text-slate-700 ${hoverClass} font-semibold transition-all hover:scale-110 relative group`}
                >
                  {link.label}
                  <span className={`absolute bottom-0 left-0 w-0 h-0.5 bg-primary-500 group-hover:w-full transition-all duration-300`}></span>
                </Link>
              );
            })}
            
            {/* Role Switcher */}
            <div className="relative">
              <button
                onClick={() => setIsRoleMenuOpen(!isRoleMenuOpen)}
                className="flex items-center space-x-2 px-5 py-2.5 bg-gradient-to-r from-purple-100 to-pink-100 hover:from-purple-200 hover:to-pink-200 rounded-xl transition-all shadow-md hover:shadow-lg border-2 border-purple-200"
              >
                <User size={20} className="text-purple-600" />
                <span className="capitalize font-bold text-purple-700">{role}</span>
              </button>
              
              {isRoleMenuOpen && (
                <div className="absolute right-0 mt-2 w-56 bg-white rounded-2xl shadow-2xl py-3 border-2 border-purple-200">
                  <button
                    onClick={() => handleRoleChange('customer')}
                    className="w-full text-left px-5 py-3 hover:bg-blue-50 transition-all font-semibold text-slate-700 hover:text-primary-600 rounded-xl mx-2 mb-1"
                  >
                    👤 Customer
                  </button>
                  <button
                    onClick={() => handleRoleChange('provider')}
                    className="w-full text-left px-5 py-3 hover:bg-purple-50 transition-all font-semibold text-slate-700 hover:text-purple-600 rounded-xl mx-2 mb-1"
                  >
                    🔧 Service Provider
                  </button>
                  <button
                    onClick={() => handleRoleChange('admin')}
                    className="w-full text-left px-5 py-3 hover:bg-orange-50 transition-all font-semibold text-slate-700 hover:text-secondary-600 rounded-xl mx-2"
                  >
                    ⚡ Admin
                  </button>
                </div>
              )}
            </div>

            {/* Auth Buttons */}
            {user ? (
              <div className="flex items-center space-x-4">
                <span className="text-sm text-slate-600">Hi, {user.name}</span>
                <button
                  onClick={handleLogout}
                  className="flex items-center space-x-2 px-4 py-2 bg-danger-100 hover:bg-danger-200 text-danger-700 rounded-xl transition-all font-semibold"
                >
                  <LogOut size={18} />
                  <span>Logout</span>
                </button>
              </div>
            ) : (
              <div className="flex items-center space-x-3">
                <Link
                  to="/login"
                  className="px-4 py-2 text-primary-600 hover:text-primary-700 font-semibold transition-colors"
                >
                  Login
                </Link>
                <Link
                  to="/register"
                  className="px-5 py-2.5 bg-gradient-to-r from-primary-600 to-purple-600 hover:from-primary-700 hover:to-purple-700 text-white rounded-xl font-semibold transition-colors shadow-md"
                >
                  Sign Up
                </Link>
              </div>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden flex items-center">
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="p-2.5 rounded-xl bg-purple-100 hover:bg-purple-200 transition-all shadow-md"
            >
              {isMenuOpen ? <X size={24} className="text-purple-700" /> : <Menu size={24} className="text-purple-700" />}
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="md:hidden py-4 space-y-2 bg-white rounded-b-2xl border-t-2 border-slate-200">
            {getNavLinks().map((link, index) => {
              const bgColors = ['bg-blue-100', 'bg-purple-100', 'bg-orange-100', 'bg-green-100'];
              const textColors = ['text-blue-700', 'text-purple-700', 'text-orange-700', 'text-green-700'];
              const bgClass = bgColors[index % bgColors.length];
              const textClass = textColors[index % textColors.length];
              
              return (
                <Link
                  key={link.to}
                  to={link.to}
                  onClick={() => setIsMenuOpen(false)}
                  className={`block px-4 py-3 ${textClass} ${bgClass} hover:opacity-80 rounded-xl transition-all font-semibold shadow-sm`}
                >
                  {link.label}
                </Link>
              );
            })}
            
            {/* Auth Section */}
            <div className="border-t-2 border-purple-200 pt-3 mt-3">
              {user ? (
                <div className="px-4">
                  <p className="py-2 text-sm font-semibold text-slate-600">
                    Hi, <span className="text-primary-600">{user.name}</span>
                  </p>
                  <button
                    onClick={handleLogout}
                    className="w-full px-4 py-2.5 bg-danger-600 hover:bg-danger-700 text-white rounded-xl font-semibold transition-colors shadow-md mt-2"
                  >
                    Logout
                  </button>
                </div>
              ) : (
                <div className="px-4 space-y-2">
                  <Link
                    to="/login"
                    onClick={() => setIsMenuOpen(false)}
                    className="block text-center px-4 py-2.5 bg-white border-2 border-primary-600 text-primary-600 hover:bg-primary-50 rounded-xl font-semibold transition-colors"
                  >
                    Login
                  </Link>
                  <Link
                    to="/register"
                    onClick={() => setIsMenuOpen(false)}
                    className="block text-center px-4 py-2.5 bg-primary-600 hover:bg-primary-700 text-white rounded-xl font-semibold transition-colors shadow-md"
                  >
                    Sign Up
                  </Link>
                </div>
              )}
            </div>

            <div className="border-t-2 border-purple-200 pt-3 mt-3">
              <p className="px-4 py-2 text-sm font-bold text-purple-600">Switch Role</p>
              <button
                onClick={() => handleRoleChange('customer')}
                className="w-full text-left px-4 py-3 hover:bg-blue-50 transition-all font-semibold rounded-xl text-slate-700"
              >
                👤 Customer
              </button>
              <button
                onClick={() => handleRoleChange('provider')}
                className="w-full text-left px-4 py-3 hover:bg-purple-50 transition-all font-semibold rounded-xl text-slate-700"
              >
                🔧 Service Provider
              </button>
              <button
                onClick={() => handleRoleChange('admin')}
                className="w-full text-left px-4 py-3 hover:bg-orange-50 transition-all font-semibold rounded-xl text-slate-700"
              >
                ⚡ Admin
              </button>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
