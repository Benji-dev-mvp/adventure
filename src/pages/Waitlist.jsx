import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { 
  Sparkles, 
  Mail, 
  Share2, 
  Copy, 
  CheckCircle2, 
  Users, 
  TrendingUp,
  Gift,
  Trophy,
  Zap
} from 'lucide-react';
import { Button } from '../components/ui/Button';
import { Card, CardContent } from '../components/ui/Card';
import { Badge } from '../components/ui/Badge';
import { Input } from '../components/ui/Input';
import { useToast } from '../components/Toast';
import { validateEmail } from '../lib/validation';

/**
 * Waitlist Module with Referral Tracking
 * Implements foundation layer requirement: "Add waitlist module with referral tracking"
 */
const Waitlist = () => {
  const toast = useToast();
  const [email, setEmail] = useState('');
  const [name, setName] = useState('');
  const [company, setCompany] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSignedUp, setIsSignedUp] = useState(false);
  const [referralCode, setReferralCode] = useState('');
  const [referralCount, setReferralCount] = useState(0);
  const [queuePosition, setQueuePosition] = useState(null);
  const [referralLink, setReferralLink] = useState('');

  // Check for referral code in URL
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const refCode = urlParams.get('ref');
    if (refCode) {
      // Store referral code
      localStorage.setItem('waitlist_referral', refCode);
    }

    // Check if user is already signed up
    const existingSignup = localStorage.getItem('waitlist_signup');
    if (existingSignup) {
      const signupData = JSON.parse(existingSignup);
      setIsSignedUp(true);
      setReferralCode(signupData.referralCode);
      setReferralCount(signupData.referralCount || 0);
      setQueuePosition(signupData.queuePosition);
      setReferralLink(`${window.location.origin}/waitlist?ref=${signupData.referralCode}`);
    }
  }, []);

  const generateReferralCode = (email) => {
    // Simple referral code generator
    const hash = btoa(email).slice(0, 8).replace(/[^a-zA-Z0-9]/g, '').toUpperCase();
    return hash;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validation
    if (!name.trim()) {
      toast.error('Please enter your name');
      return;
    }

    if (!validateEmail(email)) {
      toast.error('Please enter a valid email address');
      return;
    }

    setIsSubmitting(true);

    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));

      // Generate referral code
      const newReferralCode = generateReferralCode(email);
      
      // Simulate queue position (in real app, this would come from backend)
      const newQueuePosition = Math.floor(Math.random() * 5000) + 1;

      // Check if they came from a referral
      const referredBy = localStorage.getItem('waitlist_referral');

      // Save signup data
      const signupData = {
        name,
        email,
        company,
        referralCode: newReferralCode,
        referralCount: 0,
        queuePosition: newQueuePosition,
        referredBy,
        signedUpAt: new Date().toISOString(),
      };

      localStorage.setItem('waitlist_signup', JSON.stringify(signupData));

      setIsSignedUp(true);
      setReferralCode(newReferralCode);
      setQueuePosition(newQueuePosition);
      setReferralLink(`${window.location.origin}/waitlist?ref=${newReferralCode}`);

      toast.success('Successfully joined the waitlist!');
    } catch (error) {
      toast.error('Failed to join waitlist. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const copyReferralLink = () => {
    navigator.clipboard.writeText(referralLink);
    toast.success('Referral link copied to clipboard!');
  };

  const shareOnTwitter = () => {
    const text = encodeURIComponent('I just joined the Artisan AI BDR waitlist! Join me and move up the queue 🚀');
    const url = encodeURIComponent(referralLink);
    window.open(`https://twitter.com/intent/tweet?text=${text}&url=${url}`, '_blank');
  };

  const shareOnLinkedIn = () => {
    const url = encodeURIComponent(referralLink);
    window.open(`https://www.linkedin.com/sharing/share-offsite/?url=${url}`, '_blank');
  };

  const rewards = [
    { referrals: 1, reward: 'Move up 10 spots', icon: TrendingUp, unlocked: referralCount >= 1 },
    { referrals: 3, reward: 'Move up 50 spots + Beta access', icon: Zap, unlocked: referralCount >= 3 },
    { referrals: 5, reward: 'Move up 100 spots + 1 month free', icon: Gift, unlocked: referralCount >= 5 },
    { referrals: 10, reward: 'Skip the line + 3 months free', icon: Trophy, unlocked: referralCount >= 10 },
  ];

  if (isSignedUp) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-blue-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
        {/* Header */}
        <div className="border-b border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
            <div className="flex items-center justify-between">
              <Link to="/" className="flex items-center space-x-2">
                <Sparkles className="w-8 h-8 text-purple-600" />
                <span className="text-xl font-bold text-gray-900 dark:text-white">Artisan</span>
              </Link>
              <Link to="/">
                <Button variant="ghost">Back to Home</Button>
              </Link>
            </div>
          </div>
        </div>

        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          {/* Success Message */}
          <div className="text-center mb-12">
            <div className="inline-flex items-center justify-center w-20 h-20 bg-green-100 dark:bg-green-900 rounded-full mb-6">
              <CheckCircle2 className="w-12 h-12 text-green-600 dark:text-green-400" />
            </div>
            <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
              You're on the list! 🎉
            </h1>
            <p className="text-xl text-gray-600 dark:text-gray-300">
              Thanks for joining the Artisan waitlist. We'll notify you when it's your turn.
            </p>
          </div>

          {/* Queue Position */}
          <Card className="mb-8 bg-gradient-to-br from-purple-600 to-blue-600 text-white border-0">
            <CardContent className="p-8 text-center">
              <p className="text-purple-100 mb-2">Your position in queue</p>
              <p className="text-6xl font-bold mb-2">#{queuePosition?.toLocaleString()}</p>
              <p className="text-purple-100">
                {queuePosition < 1000 ? 'You\'ll get access soon!' : 'Move up faster by referring friends!'}
              </p>
            </CardContent>
          </Card>

          {/* Referral Section */}
          <Card className="mb-8">
            <CardContent className="p-8">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
                    Skip the line 🚀
                  </h2>
                  <p className="text-gray-600 dark:text-gray-400">
                    Share your unique referral link to move up the waitlist
                  </p>
                </div>
                <div className="text-center">
                  <div className="text-4xl font-bold text-purple-600 mb-1">
                    {referralCount}
                  </div>
                  <div className="text-sm text-gray-500">referrals</div>
                </div>
              </div>

              {/* Referral Link */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Your referral link
                </label>
                <div className="flex gap-2">
                  <Input
                    type="text"
                    value={referralLink}
                    readOnly
                    className="flex-1 font-mono text-sm"
                  />
                  <Button variant="outline" onClick={copyReferralLink}>
                    <Copy className="w-4 h-4 mr-2" />
                    Copy
                  </Button>
                </div>
              </div>

              {/* Share Buttons */}
              <div className="flex gap-3">
                <Button variant="primary" className="flex-1" onClick={shareOnTwitter}>
                  <Share2 className="w-4 h-4 mr-2" />
                  Share on Twitter
                </Button>
                <Button variant="outline" className="flex-1" onClick={shareOnLinkedIn}>
                  <Share2 className="w-4 h-4 mr-2" />
                  Share on LinkedIn
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Rewards Progress */}
          <Card>
            <CardContent className="p-8">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
                Referral Rewards
              </h2>
              <div className="space-y-4">
                {rewards.map((reward, index) => {
                  const Icon = reward.icon;
                  const progress = (referralCount / reward.referrals) * 100;
                  
                  return (
                    <div
                      key={index}
                      className={`p-4 rounded-lg border-2 transition-all ${
                        reward.unlocked
                          ? 'border-green-500 bg-green-50 dark:bg-green-900/20'
                          : 'border-gray-200 dark:border-gray-700'
                      }`}
                    >
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center space-x-3">
                          <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                            reward.unlocked
                              ? 'bg-green-500 text-white'
                              : 'bg-gray-200 dark:bg-gray-700 text-gray-500'
                          }`}>
                            <Icon className="w-5 h-5" />
                          </div>
                          <div>
                            <div className="font-semibold text-gray-900 dark:text-white">
                              {reward.reward}
                            </div>
                            <div className="text-sm text-gray-500">
                              {reward.referrals} referral{reward.referrals > 1 ? 's' : ''}
                            </div>
                          </div>
                        </div>
                        {reward.unlocked && (
                          <Badge variant="success">Unlocked!</Badge>
                        )}
                      </div>
                      {!reward.unlocked && (
                        <div className="mt-3">
                          <div className="flex items-center justify-between text-sm text-gray-600 dark:text-gray-400 mb-1">
                            <span>{referralCount} / {reward.referrals} referrals</span>
                            <span>{Math.min(100, Math.round(progress))}%</span>
                          </div>
                          <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2 overflow-hidden">
                            <div
                              className="bg-purple-600 h-full transition-all duration-500"
                              style={{ width: `${Math.min(100, progress)}%` }}
                            />
                          </div>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>

          {/* Stats */}
          <div className="grid md:grid-cols-3 gap-6 mt-8">
            <Card>
              <CardContent className="p-6 text-center">
                <Users className="w-8 h-8 text-purple-600 mx-auto mb-3" />
                <div className="text-3xl font-bold text-gray-900 dark:text-white mb-1">
                  12,547
                </div>
                <div className="text-sm text-gray-600 dark:text-gray-400">
                  Total on waitlist
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-6 text-center">
                <TrendingUp className="w-8 h-8 text-green-600 mx-auto mb-3" />
                <div className="text-3xl font-bold text-gray-900 dark:text-white mb-1">
                  47%
                </div>
                <div className="text-sm text-gray-600 dark:text-gray-400">
                  Average referral rate
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-6 text-center">
                <Zap className="w-8 h-8 text-blue-600 mx-auto mb-3" />
                <div className="text-3xl font-bold text-gray-900 dark:text-white mb-1">
                  500
                </div>
                <div className="text-sm text-gray-600 dark:text-gray-400">
                  Getting access this week
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-blue-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
      {/* Header */}
      <div className="border-b border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <Link to="/" className="flex items-center space-x-2">
              <Sparkles className="w-8 h-8 text-purple-600" />
              <span className="text-xl font-bold text-gray-900 dark:text-white">Artisan</span>
            </Link>
            <div className="flex items-center space-x-4">
              <Link to="/pricing">
                <Button variant="ghost">Pricing</Button>
              </Link>
              <Link to="/">
                <Button variant="ghost">Back to Home</Button>
              </Link>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          {/* Left Column - Info */}
          <div>
            <Badge variant="purple" className="mb-4">Early Access</Badge>
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-6">
              Join the Artisan waitlist
            </h1>
            <p className="text-xl text-gray-600 dark:text-gray-300 mb-8">
              Be among the first to experience AI-powered BDR automation. Get early access and exclusive perks.
            </p>

            <div className="space-y-6 mb-8">
              <div className="flex items-start space-x-4">
                <div className="flex-shrink-0 w-8 h-8 bg-purple-100 dark:bg-purple-900 rounded-full flex items-center justify-center">
                  <CheckCircle2 className="w-5 h-5 text-purple-600" />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900 dark:text-white mb-1">
                    Early Access
                  </h3>
                  <p className="text-gray-600 dark:text-gray-400">
                    Get access before the public launch
                  </p>
                </div>
              </div>
              <div className="flex items-start space-x-4">
                <div className="flex-shrink-0 w-8 h-8 bg-purple-100 dark:bg-purple-900 rounded-full flex items-center justify-center">
                  <CheckCircle2 className="w-5 h-5 text-purple-600" />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900 dark:text-white mb-1">
                    Exclusive Perks
                  </h3>
                  <p className="text-gray-600 dark:text-gray-400">
                    Special pricing and features for early adopters
                  </p>
                </div>
              </div>
              <div className="flex items-start space-x-4">
                <div className="flex-shrink-0 w-8 h-8 bg-purple-100 dark:bg-purple-900 rounded-full flex items-center justify-center">
                  <CheckCircle2 className="w-5 h-5 text-purple-600" />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900 dark:text-white mb-1">
                    Skip the Queue
                  </h3>
                  <p className="text-gray-600 dark:text-gray-400">
                    Refer friends to move up the waitlist faster
                  </p>
                </div>
              </div>
            </div>

            <div className="flex items-center space-x-8 text-sm text-gray-600 dark:text-gray-400">
              <div>
                <div className="text-2xl font-bold text-gray-900 dark:text-white">12,547</div>
                <div>People waiting</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-gray-900 dark:text-white">500</div>
                <div>Spots this week</div>
              </div>
            </div>
          </div>

          {/* Right Column - Form */}
          <Card>
            <CardContent className="p-8">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
                Reserve your spot
              </h2>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Full Name *
                  </label>
                  <Input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="John Doe"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Email Address *
                  </label>
                  <Input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="john@company.com"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Company (Optional)
                  </label>
                  <Input
                    type="text"
                    value={company}
                    onChange={(e) => setCompany(e.target.value)}
                    placeholder="Acme Inc."
                  />
                </div>

                <Button
                  type="submit"
                  variant="primary"
                  className="w-full"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? (
                    <>
                      <span className="animate-spin mr-2">⏳</span>
                      Joining...
                    </>
                  ) : (
                    <>
                      <Mail className="w-4 h-4 mr-2" />
                      Join the Waitlist
                    </>
                  )}
                </Button>

                <p className="text-xs text-center text-gray-500 dark:text-gray-400">
                  By joining, you agree to receive updates about Artisan.
                  <br />
                  Unsubscribe anytime.
                </p>
              </form>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Waitlist;
