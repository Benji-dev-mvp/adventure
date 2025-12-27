import React from 'react';
import { Link } from 'react-router-dom';
import { Github, Twitter, Linkedin } from 'lucide-react';

export function Footer() {
  const footerLinks = {
    product: [
      { name: 'Product', href: '/product' },
      { name: 'How it Works', href: '/how-it-works' },
      { name: 'Pricing', href: '/pricing' },
    ],
    solutions: [
      { name: 'Sales Leaders', href: '/solutions/sales-leaders' },
      { name: 'RevOps', href: '/solutions/rev-ops' },
      { name: 'Startups', href: '/solutions/startups' },
    ],
    resources: [
      { name: 'Case Studies', href: '/resources/case-studies' },
      { name: 'Blog', href: '/resources/blog' },
      { name: 'Resources Hub', href: '/resources' },
    ],
    company: [
      { name: 'About', href: '/company/about' },
      { name: 'Customers', href: '/company/customers' },
      { name: 'Security', href: '/company/security' },
    ],
  };

  return (
    <footer className="bg-slate-950 border-t border-slate-800">
      <div className="mx-auto max-w-7xl px-6 py-12">
        <div className="grid grid-cols-2 md:grid-cols-5 gap-8">
          {/* Brand */}
          <div className="col-span-2 md:col-span-1">
            <Link to="/" className="flex items-center space-x-2 mb-4">
              <div className="h-8 w-8 rounded-lg bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center">
                <span className="text-white font-bold text-lg">A</span>
              </div>
              <span className="text-xl font-bold text-slate-50">Artisan</span>
            </Link>
            <p className="text-sm text-slate-400 mb-4">
              AI-powered revenue automation for modern GTM teams.
            </p>
            <div className="flex space-x-4">
              <a href="https://twitter.com" className="text-slate-400 hover:text-slate-50 transition-colors">
                <Twitter className="h-5 w-5" />
              </a>
              <a href="https://linkedin.com" className="text-slate-400 hover:text-slate-50 transition-colors">
                <Linkedin className="h-5 w-5" />
              </a>
              <a href="https://github.com" className="text-slate-400 hover:text-slate-50 transition-colors">
                <Github className="h-5 w-5" />
              </a>
            </div>
          </div>

          {/* Product */}
          <div>
            <h3 className="text-sm font-semibold text-slate-50 mb-4">Product</h3>
            <ul className="space-y-3">
              {footerLinks.product.map((link) => (
                <li key={link.name}>
                  <Link
                    to={link.href}
                    className="text-sm text-slate-400 hover:text-slate-50 transition-colors"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Solutions */}
          <div>
            <h3 className="text-sm font-semibold text-slate-50 mb-4">Solutions</h3>
            <ul className="space-y-3">
              {footerLinks.solutions.map((link) => (
                <li key={link.name}>
                  <Link
                    to={link.href}
                    className="text-sm text-slate-400 hover:text-slate-50 transition-colors"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Resources */}
          <div>
            <h3 className="text-sm font-semibold text-slate-50 mb-4">Resources</h3>
            <ul className="space-y-3">
              {footerLinks.resources.map((link) => (
                <li key={link.name}>
                  <Link
                    to={link.href}
                    className="text-sm text-slate-400 hover:text-slate-50 transition-colors"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Company */}
          <div>
            <h3 className="text-sm font-semibold text-slate-50 mb-4">Company</h3>
            <ul className="space-y-3">
              {footerLinks.company.map((link) => (
                <li key={link.name}>
                  <Link
                    to={link.href}
                    className="text-sm text-slate-400 hover:text-slate-50 transition-colors"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Bottom */}
        <div className="mt-12 pt-8 border-t border-slate-800">
          <p className="text-sm text-slate-400 text-center">
            © {new Date().getFullYear()} Artisan. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
