import React from 'react';
import { Link } from 'react-router-dom';
import { Home, ArrowLeft, Sparkles } from 'lucide-react';
import { Button } from '../components/ui/Button';

const NotFound = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-accent-500 via-primary-500 to-purple-600 flex items-center justify-center p-6">
      <div className="max-w-2xl w-full text-center">
        <div className="flex items-center justify-center gap-2 mb-8">
          <div className="w-12 h-12 bg-white/20 backdrop-blur rounded-xl flex items-center justify-center">
            <Sparkles className="text-white" size={28} />
          </div>
          <span className="text-3xl font-bold text-white">Artisan</span>
        </div>

        <div className="bg-white rounded-2xl shadow-2xl p-12">
          <div className="text-8xl font-bold text-primary-500 mb-4">404</div>
          <h1 className="text-3xl font-bold text-gray-900 mb-4">Page Not Found</h1>
          <p className="text-lg text-gray-600 mb-8">
            Looks like this page took a vacation. Let's get you back on track!
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link to="/">
              <Button variant="primary" size="lg" className="gap-2">
                <Home size={20} />
                Go Home
              </Button>
            </Link>
            <Button
              variant="outline"
              size="lg"
              className="gap-2"
              onClick={() => window.history.back()}
            >
              <ArrowLeft size={20} />
              Go Back
            </Button>
          </div>

          <div className="mt-12 pt-8 border-t border-gray-200">
            <p className="text-sm text-gray-500 mb-4">Quick Links:</p>
            <div className="flex flex-wrap items-center justify-center gap-4 text-sm">
              <Link to="/dashboard" className="text-accent-600 hover:text-accent-700 font-medium">
                Dashboard
              </Link>
              <span className="text-gray-300">•</span>
              <Link to="/campaigns" className="text-accent-600 hover:text-accent-700 font-medium">
                Campaigns
              </Link>
              <span className="text-gray-300">•</span>
              <Link to="/leads" className="text-accent-600 hover:text-accent-700 font-medium">
                Leads
              </Link>
              <span className="text-gray-300">•</span>
              <Link
                to="/ai-assistant"
                className="text-accent-600 hover:text-accent-700 font-medium"
              >
                AI Assistant
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NotFound;
