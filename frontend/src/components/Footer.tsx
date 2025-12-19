import React from 'react';
import { Link } from 'react-router-dom';
import { Mail, Phone, MapPin, Facebook, Twitter, Instagram, Linkedin } from 'lucide-react';

const Footer: React.FC = () => {
  return (
    <footer className="bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 text-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10">
          {/* Brand */}
          <div>
            <div className="flex items-center space-x-3 mb-6">
              <div className="bg-gradient-to-br from-primary-600 to-purple-600 text-white font-bold text-2xl px-3 py-1.5 rounded-xl shadow-lg">K</div>
              <span className="text-2xl font-bold text-white">Karigar</span>
            </div>
            <p className="text-sm text-slate-300 mb-6 leading-relaxed">
              Connecting you with trusted local service providers for all your home needs.
            </p>
            <div className="flex space-x-4">
              <a href="#" className="p-2.5 bg-blue-600 hover:bg-blue-700 rounded-xl transition-all transform hover:scale-110 shadow-lg">
                <Facebook size={20} className="text-white" />
              </a>
              <a href="#" className="p-2.5 bg-purple-600 hover:bg-purple-700 rounded-xl transition-all transform hover:scale-110 shadow-lg">
                <Twitter size={20} className="text-white" />
              </a>
              <a href="#" className="p-2.5 bg-orange-600 hover:bg-orange-700 rounded-xl transition-all transform hover:scale-110 shadow-lg">
                <Instagram size={20} className="text-white" />
              </a>
              <a href="#" className="p-2.5 bg-accent-600 hover:bg-accent-700 rounded-xl transition-all transform hover:scale-110 shadow-lg">
                <Linkedin size={20} className="text-white" />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-white font-bold mb-6 text-lg">Quick Links</h3>
            <ul className="space-y-3">
              <li>
                <Link to="/browse" className="hover:text-orange-400 transition-all hover:translate-x-2 inline-block">
                  → Browse Services
                </Link>
              </li>
              <li>
                <Link to="/" className="hover:text-purple-400 transition-all hover:translate-x-2 inline-block">
                  → How It Works
                </Link>
              </li>
              <li>
                <a href="#" className="hover:text-blue-400 transition-all hover:translate-x-2 inline-block">
                  → Become a Provider
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-green-400 transition-all hover:translate-x-2 inline-block">
                  → About Us
                </a>
              </li>
            </ul>
          </div>

          {/* Services */}
          <div>
            <h3 className="text-white font-bold mb-6 text-lg">Popular Services</h3>
            <ul className="space-y-3">
              <li>
                <a href="#" className="hover:text-blue-400 transition-all hover:translate-x-2 inline-block">
                  🔧 Plumbing
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-orange-400 transition-all hover:translate-x-2 inline-block">
                  ⚡ Electrical Work
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-purple-400 transition-all hover:translate-x-2 inline-block">
                  🧹 Cleaning
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-green-400 transition-all hover:translate-x-2 inline-block">
                  📚 Tutoring
                </a>
              </li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="text-white font-bold mb-6 text-lg">Contact Us</h3>
            <ul className="space-y-4">
              <li className="flex items-start space-x-3 group">
                <div className="p-2 bg-orange-600 rounded-lg">
                  <MapPin size={18} className="text-white flex-shrink-0" />
                </div>
                <span className="text-sm group-hover:text-white transition-colors">123 Service Street, Bangalore, Karnataka 560001</span>
              </li>
              <li className="flex items-center space-x-3 group">
                <div className="p-2 bg-purple-600 rounded-lg">
                  <Phone size={18} className="text-white flex-shrink-0" />
                </div>
                <span className="text-sm group-hover:text-white transition-colors">+91 98765 00000</span>
              </li>
              <li className="flex items-center space-x-3 group">
                <div className="p-2 bg-blue-600 rounded-lg">
                  <Mail size={18} className="text-white flex-shrink-0" />
                </div>
                <span className="text-sm group-hover:text-white transition-colors">support@karigar.com</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t-2 border-purple-800 mt-12 pt-8 text-center">
          <p className="text-sm text-slate-400">
            &copy; 2025 <span className="text-white font-bold">Karigar</span>. All rights reserved. | <a href="#" className="hover:text-purple-400 transition-colors">Privacy Policy</a> | <a href="#" className="hover:text-orange-400 transition-colors">Terms of Service</a>
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
