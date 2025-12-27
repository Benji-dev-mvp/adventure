import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Button } from '../ui/Button';
import { Menu, X, ChevronDown } from 'lucide-react';

export function Navbar() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const location = useLocation();

  const isActive = (path: string) => location.pathname === path;

  const navigation = {
    product: [
      { name: 'Product', href: '/product' },
      { name: 'How it Works', href: '/how-it-works' },
    ],
    solutions: [
      { name: 'Solutions', href: '/solutions' },
      { name: 'Sales Leaders', href: '/solutions/sales-leaders' },
      { name: 'RevOps', href: '/solutions/rev-ops' },
      { name: 'Startups', href: '/solutions/startups' },
    ],
    resources: [
      { name: 'Resources', href: '/resources' },
      { name: 'Case Studies', href: '/resources/case-studies' },
      { name: 'Blog', href: '/resources/blog' },
    ],
    company: [
      { name: 'About', href: '/company/about' },
      { name: 'Customers', href: '/company/customers' },
      { name: 'Security', href: '/company/security' },
    ],
  };

  return (
    <nav className="sticky top-0 z-50 bg-slate-950/95 backdrop-blur-sm border-b border-slate-800">
      <div className="mx-auto max-w-7xl px-6">
        <div className="flex h-16 items-center justify-between">
          {/* Logo */}
          <div className="flex items-center">
            <Link to="/" className="flex items-center space-x-2">
              <div className="h-8 w-8 rounded-lg bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center">
                <span className="text-white font-bold text-lg">A</span>
              </div>
              <span className="text-xl font-bold text-slate-50">Artisan</span>
            </Link>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            <Link 
              to="/product" 
              className={`text-sm font-medium transition-colors ${
                isActive('/product') ? 'text-blue-400' : 'text-slate-300 hover:text-slate-50'
              }`}
            >
              Product
            </Link>
            <Link 
              to="/solutions" 
              className={`text-sm font-medium transition-colors ${
                isActive('/solutions') ? 'text-blue-400' : 'text-slate-300 hover:text-slate-50'
              }`}
            >
              Solutions
            </Link>
            <Link 
              to="/pricing" 
              className={`text-sm font-medium transition-colors ${
                isActive('/pricing') ? 'text-blue-400' : 'text-slate-300 hover:text-slate-50'
              }`}
            >
              Pricing
            </Link>
            <Link 
              to="/resources" 
              className={`text-sm font-medium transition-colors ${
                isActive('/resources') ? 'text-blue-400' : 'text-slate-300 hover:text-slate-50'
              }`}
            >
              Resources
            </Link>
            <Link 
              to="/company/about" 
              className={`text-sm font-medium transition-colors ${
                isActive('/company/about') ? 'text-blue-400' : 'text-slate-300 hover:text-slate-50'
              }`}
            >
              Company
            </Link>
          </div>

          {/* Desktop CTA */}
          <div className="hidden md:flex items-center space-x-4">
            <Link to="/login">
              <Button variant="ghost" size="sm" className="text-slate-300">
                Sign in
              </Button>
            </Link>
            <Link to="/pricing">
              <Button size="sm" className="bg-blue-600 hover:bg-blue-700">
                Get Started
              </Button>
            </Link>
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="text-slate-300"
            >
              {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </Button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-slate-800">
          <div className="space-y-1 px-6 pb-6 pt-4">
            <Link
              to="/product"
              className="block rounded-lg px-3 py-2 text-base font-medium text-slate-300 hover:bg-slate-800 hover:text-slate-50"
              onClick={() => setMobileMenuOpen(false)}
            >
              Product
            </Link>
            <Link
              to="/solutions"
              className="block rounded-lg px-3 py-2 text-base font-medium text-slate-300 hover:bg-slate-800 hover:text-slate-50"
              onClick={() => setMobileMenuOpen(false)}
            >
              Solutions
            </Link>
            <Link
              to="/pricing"
              className="block rounded-lg px-3 py-2 text-base font-medium text-slate-300 hover:bg-slate-800 hover:text-slate-50"
              onClick={() => setMobileMenuOpen(false)}
            >
              Pricing
            </Link>
            <Link
              to="/resources"
              className="block rounded-lg px-3 py-2 text-base font-medium text-slate-300 hover:bg-slate-800 hover:text-slate-50"
              onClick={() => setMobileMenuOpen(false)}
            >
              Resources
            </Link>
            <Link
              to="/company/about"
              className="block rounded-lg px-3 py-2 text-base font-medium text-slate-300 hover:bg-slate-800 hover:text-slate-50"
              onClick={() => setMobileMenuOpen(false)}
            >
              Company
            </Link>
            <div className="pt-4 space-y-2">
              <Link to="/login" onClick={() => setMobileMenuOpen(false)}>
                <Button variant="outline" className="w-full">
                  Sign in
                </Button>
              </Link>
              <Link to="/pricing" onClick={() => setMobileMenuOpen(false)}>
                <Button className="w-full bg-blue-600 hover:bg-blue-700">
                  Get Started
                </Button>
              </Link>
            </div>
          </div>
        </div>
      )}
    </nav>
  );
}
