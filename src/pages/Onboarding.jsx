import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '../components/ui/Button';
import { Input, Select, Textarea } from '../components/ui/Input';
import { Card, CardContent } from '../components/ui/Card';
import { useToast } from '../components/Toast';
import { InlineLoader } from '../components/Loading';
import { useFormValidation, validateEmail, validateRequired, validateUrl } from '../lib/validation';
import { saveUserPreferences } from '../lib/storage';
import {
  Sparkles,
  CheckCircle2,
  ArrowRight,
  Mail,
  Building2,
  Target,
  Users,
  Settings,
} from 'lucide-react';

const Onboarding = () => {
  const navigate = useNavigate();
  const { showToast } = useToast();
  const { errors, validate, clearError } = useFormValidation();
  const [step, setStep] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [isConnecting, setIsConnecting] = useState(false);
  const [emailProvider, setEmailProvider] = useState('');
  const totalSteps = 5;

  // Form data
  const [formData, setFormData] = useState({
    role: '',
    email: '',
    companyName: '',
    companyWebsite: '',
    teamSize: '',
    industry: '',
    icpTitle: '',
    icpIndustry: '',
    icpCompanySize: '',
    goals: '',
  });

  const updateFormData = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    clearError(field);
  };

  const validateStep = currentStep => {
    const validationErrors = {};

    switch (currentStep) {
      case 1:
        if (!validateRequired(formData.role)) {
          validationErrors.role = 'Please select your role';
        }
        break;
      case 2:
        if (!validateEmail(formData.email)) {
          validationErrors.email = 'Please enter a valid email address';
        }
        if (!validateRequired(formData.email)) {
          validationErrors.email = 'Email is required';
        }
        if (!validateRequired(formData.companyName)) {
          validationErrors.companyName = 'Company name is required';
        }
        if (formData.companyWebsite && !validateUrl(formData.companyWebsite)) {
          validationErrors.companyWebsite = 'Please enter a valid URL';
        }
        break;
      case 3:
        if (!validateRequired(formData.icpTitle)) {
          validationErrors.icpTitle = 'Target title is required';
        }
        break;
      default:
        break;
    }

    if (Object.keys(validationErrors).length > 0) {
      Object.entries(validationErrors).forEach(([field, message]) => {
        showToast(message, 'error');
      });
      return false;
    }
    return true;
  };

  const nextStep = () => {
    if (!validateStep(step)) {
      return;
    }

    if (step < totalSteps) {
      setStep(step + 1);
    } else {
      handleComplete();
    }
  };

  const handleComplete = async () => {
    setIsLoading(true);
    try {
      // Save user preferences
      await new Promise(resolve => setTimeout(resolve, 1500));
      saveUserPreferences(formData);
      showToast('Setup complete! Welcome to Artisan!', 'success');
      navigate('/dashboard');
    } catch (error) {
      showToast('Failed to complete setup', 'error');
    } finally {
      setIsLoading(false);
    }
  };

  const prevStep = () => {
    if (step > 1) setStep(step - 1);
  };

  const handleProviderConnect = async provider => {
    setIsConnecting(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 700));
      setEmailProvider(provider);
      showToast(`${provider} connected`, 'success');
      setStep(3);
    } catch (error) {
      showToast(`Failed to connect ${provider}`, 'error');
    } finally {
      setIsConnecting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-accent-500 via-primary-500 to-purple-600 flex items-center justify-center p-6">
      <div className="w-full max-w-3xl">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-2 mb-4">
            <div className="w-12 h-12 bg-white/20 backdrop-blur rounded-xl flex items-center justify-center">
              <Sparkles className="text-white" size={28} />
            </div>
            <span className="text-3xl font-bold text-white">Artisan</span>
          </div>
          <h1 className="text-2xl font-bold text-white mb-2">Welcome! Let's set up your AI BDR</h1>
          <p className="text-white/90">Just a few quick steps to get Ava working for you</p>
        </div>

        {/* Progress */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-2">
            {[...Array(totalSteps)].map((_, index) => (
              <div key={index} className="flex-1 flex items-center">
                <div
                  className={`w-10 h-10 rounded-full flex items-center justify-center font-semibold transition-all ${
                    step > index + 1
                      ? 'bg-white text-accent-600'
                      : step === index + 1
                        ? 'bg-white text-accent-600 ring-4 ring-white/30'
                        : 'bg-white/20 text-white'
                  }`}
                >
                  {step > index + 1 ? <CheckCircle2 size={20} /> : index + 1}
                </div>
                {index < totalSteps - 1 && (
                  <div
                    className={`flex-1 h-1 mx-2 ${step > index + 1 ? 'bg-white' : 'bg-white/20'}`}
                  />
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Content Card */}
        <Card>
          <CardContent className="p-8">
            {/* Step 1: Role */}
            {step === 1 && (
              <div>
                <div className="flex items-center gap-3 mb-6">
                  <div className="p-3 bg-accent-100 rounded-xl">
                    <Users className="text-accent-600" size={24} />
                  </div>
                  <div>
                    <h2 className="text-2xl font-bold text-gray-900">What's your role?</h2>
                    <p className="text-gray-600">Help us personalize your experience</p>
                  </div>
                </div>

                <div className="grid md:grid-cols-2 gap-4">
                  {[
                    { label: 'Founder/CEO', icon: '👔' },
                    { label: 'Sales Leader', icon: '📊' },
                    { label: 'SDR/BDR', icon: '💼' },
                    { label: 'Marketing', icon: '📢' },
                  ].map(role => {
                    const isSelected = formData.role === role.label;
                    return (
                      <button
                        key={role.label}
                        type="button"
                        onClick={() => updateFormData('role', role.label)}
                        className={`p-6 border-2 rounded-xl text-left group transition-all ${
                          isSelected
                            ? 'border-accent-500 bg-accent-50 shadow-sm'
                            : 'border-gray-200 hover:border-accent-500 hover:bg-accent-50'
                        }`}
                      >
                        <div className="text-3xl mb-2">{role.icon}</div>
                        <p className="font-semibold text-gray-900">{role.label}</p>
                        {isSelected && <p className="text-xs text-accent-600 mt-2">Selected</p>}
                      </button>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Step 2: Connect Email */}
            {step === 2 && (
              <div>
                <div className="flex items-center gap-3 mb-6">
                  <div className="p-3 bg-accent-100 rounded-xl">
                    <Mail className="text-accent-600" size={24} />
                  </div>
                  <div>
                    <h2 className="text-2xl font-bold text-gray-900">Connect your email</h2>
                    <p className="text-gray-600">This allows Ava to send emails on your behalf</p>
                  </div>
                </div>

                <div className="space-y-4 mb-6">
                  <Input
                    label="Work Email"
                    type="email"
                    placeholder="you@company.com"
                    value={formData.email}
                    onChange={e => updateFormData('email', e.target.value)}
                    error={errors.email}
                  />
                  <Input
                    label="Company Name"
                    placeholder="Acme Inc."
                    value={formData.companyName}
                    onChange={e => updateFormData('companyName', e.target.value)}
                    error={errors.companyName}
                  />
                  <Input
                    label="Company Website (optional)"
                    placeholder="https://acme.com"
                    value={formData.companyWebsite}
                    onChange={e => updateFormData('companyWebsite', e.target.value)}
                    error={errors.companyWebsite}
                  />
                </div>

                <div className="space-y-4">
                  {/* Email Provider Buttons */}
                  <Button
                    className="w-full justify-start gap-3 h-16 text-lg"
                    variant="outline"
                    onClick={() => handleProviderConnect('Gmail')}
                    disabled={isConnecting}
                  >
                    <img
                      src="data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 48 48'%3E%3Cpath fill='%23EA4335' d='M24 9.5c3.9 0 6.7 1.7 8.2 3.1l6.1-5.9C34.9 3.5 29.9 1 24 1 14.8 1 7.1 6.7 4.2 14.7l7.1 5.5C13 14.6 18 9.5 24 9.5z'/%3E%3Cpath fill='%2334A853' d='M46.5 24.5c0-1.6-.1-3.1-.4-4.5H24v9h12.7c-.6 3-2.3 5.5-4.8 7.2l7.4 5.7c4.3-4 6.7-9.9 6.7-17.4z'/%3E%3Cpath fill='%234A90E2' d='M11.3 28.2c-.6-1.7-.9-3.5-.9-5.2s.3-3.5.9-5.2l-7.1-5.5C2.7 15.7 1.5 19.7 1.5 24s1.2 8.3 3.7 11.7l7.1-5.5z'/%3E%3Cpath fill='%23FBBC05' d='M24 47c5.9 0 10.9-1.9 14.5-5.2l-7.4-5.7c-2 1.3-4.5 2.1-7.1 2.1-6 0-11-4.1-12.7-9.6l-7.1 5.5C7.1 41.3 14.8 47 24 47z'/%3E%3C/svg%3E"
                      alt="Gmail"
                      className="w-6 h-6"
                    />
                    {isConnecting && emailProvider !== 'Gmail'
                      ? 'Connecting...'
                      : emailProvider === 'Gmail'
                        ? 'Gmail Connected'
                        : 'Connect Gmail'}
                  </Button>

                  <Button
                    className="w-full justify-start gap-3 h-16 text-lg"
                    variant="outline"
                    onClick={() => handleProviderConnect('Outlook')}
                    disabled={isConnecting}
                  >
                    <img
                      src="data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 48 48'%3E%3Cpath fill='%230078D4' d='M44 24c0 11-9 20-20 20S4 35 4 24 13 4 24 4s20 9 20 20z'/%3E%3Cpath fill='%23FFF' d='M21 15h14v4H21v-4zm0 6h14v4H21v-4zm0 6h10v4H21v-4z'/%3E%3C/svg%3E"
                      alt="Outlook"
                      className="w-6 h-6"
                    />
                    {isConnecting && emailProvider !== 'Outlook'
                      ? 'Connecting...'
                      : emailProvider === 'Outlook'
                        ? 'Outlook Connected'
                        : 'Connect Outlook'}
                  </Button>

                  <div className="text-center py-4">
                    <span className="text-sm text-gray-500">or use custom SMTP</span>
                  </div>

                  <Input label="SMTP Server" placeholder="smtp.gmail.com" />
                  <div className="grid grid-cols-2 gap-4">
                    <Input label="Port" placeholder="587" />
                    <Input label="Encryption" placeholder="TLS" />
                  </div>
                  <Input label="Email" type="email" placeholder="your@email.com" />
                  <Input label="Password" type="password" placeholder="••••••••" />
                  <Button
                    variant="secondary"
                    className="w-full mt-2"
                    onClick={() => showToast('Custom SMTP saved', 'success')}
                    disabled={isConnecting}
                  >
                    Save SMTP and Continue
                  </Button>
                </div>
              </div>
            )}

            {/* Step 3: Define ICP */}
            {step === 3 && (
              <div>
                <div className="flex items-center gap-3 mb-6">
                  <div className="p-3 bg-accent-100 rounded-xl">
                    <Target className="text-accent-600" size={24} />
                  </div>
                  <div>
                    <h2 className="text-2xl font-bold text-gray-900">Define your ICP</h2>
                    <p className="text-gray-600">Who are your ideal customers?</p>
                  </div>
                </div>

                <div className="space-y-4">
                  <Select
                    label="Industry"
                    value={formData.icpIndustry}
                    onChange={e => updateFormData('icpIndustry', e.target.value)}
                  >
                    <option value="">Select industry...</option>
                    <option value="saas">SaaS & Technology</option>
                    <option value="finance">Financial Services</option>
                    <option value="healthcare">Healthcare</option>
                    <option value="ecommerce">E-commerce</option>
                    <option value="manufacturing">Manufacturing</option>
                  </Select>

                  <Select
                    label="Company Size"
                    value={formData.icpCompanySize}
                    onChange={e => updateFormData('icpCompanySize', e.target.value)}
                  >
                    <option value="">Select size...</option>
                    <option value="1-50">1-50 employees</option>
                    <option value="51-200">51-200 employees</option>
                    <option value="201-500">201-500 employees</option>
                    <option value="501-1000">501-1000 employees</option>
                    <option value="1000+">1000+ employees</option>
                  </Select>

                  <Input
                    label="Job Titles (comma-separated)"
                    placeholder="VP of Sales, CTO, Head of Growth"
                    value={formData.icpTitle}
                    onChange={e => updateFormData('icpTitle', e.target.value)}
                    error={errors.icpTitle}
                  />

                  <Select label="Geography">
                    <option>Select location...</option>
                    <option>United States</option>
                    <option>Europe</option>
                    <option>Asia Pacific</option>
                    <option>Global</option>
                  </Select>

                  <Textarea
                    label="Additional Criteria (optional)"
                    placeholder="e.g., Recently raised funding, uses Salesforce, hiring..."
                    rows={3}
                  />
                </div>
              </div>
            )}

            {/* Step 4: CRM Integration */}
            {step === 4 && (
              <div>
                <div className="flex items-center gap-3 mb-6">
                  <div className="p-3 bg-accent-100 rounded-xl">
                    <Building2 className="text-accent-600" size={24} />
                  </div>
                  <div>
                    <h2 className="text-2xl font-bold text-gray-900">Connect your CRM</h2>
                    <p className="text-gray-600">Sync leads and track activity</p>
                  </div>
                </div>

                <div className="space-y-4">
                  {[
                    { name: 'Salesforce', logo: '☁️', color: 'bg-blue-500' },
                    { name: 'HubSpot', logo: '🟠', color: 'bg-orange-500' },
                    { name: 'Pipedrive', logo: '🟢', color: 'bg-green-500' },
                    { name: 'Close', logo: '🔵', color: 'bg-blue-600' },
                  ].map(crm => (
                    <button
                      key={crm.name}
                      className="w-full p-6 border-2 border-gray-200 rounded-xl hover:border-accent-500 hover:bg-accent-50 transition-all flex items-center justify-between group"
                    >
                      <div className="flex items-center gap-4">
                        <div
                          className={`w-12 h-12 ${crm.color} rounded-xl flex items-center justify-center text-2xl`}
                        >
                          {crm.logo}
                        </div>
                        <span className="font-semibold text-gray-900 text-lg">{crm.name}</span>
                      </div>
                      <ArrowRight className="text-gray-400 group-hover:text-accent-600 transition-colors" />
                    </button>
                  ))}

                  <button className="w-full p-4 border-2 border-dashed border-gray-300 rounded-xl hover:border-accent-500 transition-all text-gray-600 hover:text-accent-600">
                    Skip for now
                  </button>
                </div>
              </div>
            )}

            {/* Step 5: First Campaign */}
            {step === 5 && (
              <div>
                <div className="flex items-center gap-3 mb-6">
                  <div className="p-3 bg-accent-100 rounded-xl">
                    <Settings className="text-accent-600" size={24} />
                  </div>
                  <div>
                    <h2 className="text-2xl font-bold text-gray-900">Set up your first campaign</h2>
                    <p className="text-gray-600">Let Ava help you get started</p>
                  </div>
                </div>

                <div className="space-y-4">
                  <Input label="Campaign Name" placeholder="Q1 Outreach" />

                  <Textarea
                    label="What's your value proposition?"
                    placeholder="We help companies like {{company}} automate their sales process and book 3x more meetings..."
                    rows={4}
                  />

                  <Select label="Campaign Type">
                    <option>Select type...</option>
                    <option>Cold Outreach</option>
                    <option>Product Launch</option>
                    <option>Partnership Outreach</option>
                    <option>Re-engagement</option>
                  </Select>

                  <Input
                    label="Daily Send Limit"
                    type="number"
                    defaultValue="50"
                    placeholder="50"
                  />

                  <div className="p-4 bg-gradient-to-br from-accent-50 to-primary-50 rounded-xl">
                    <div className="flex items-start gap-3">
                      <Sparkles className="text-accent-600 flex-shrink-0 mt-1" size={20} />
                      <div>
                        <p className="font-semibold text-gray-900 mb-1">
                          Ava will personalize this for you!
                        </p>
                        <p className="text-sm text-gray-600">
                          Based on your ICP, Ava will research leads, write personalized emails, and
                          optimize send times automatically.
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Navigation */}
            <div className="flex items-center justify-between mt-8 pt-6 border-t border-gray-200">
              <Button variant="ghost" onClick={prevStep} disabled={step === 1 || isLoading}>
                Back
              </Button>
              <div className="text-sm text-gray-500">
                Step {step} of {totalSteps}
              </div>
              <Button onClick={nextStep} className="gap-2" disabled={isLoading || isConnecting}>
                {isLoading ? (
                  <>
                    <InlineLoader size="sm" />
                    Setting up...
                  </>
                ) : (
                  <>
                    {step === totalSteps ? 'Complete Setup' : 'Continue'}
                    <ArrowRight size={18} />
                  </>
                )}
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Footer */}
        <p className="text-center text-white/75 text-sm mt-6">
          Need help?{' '}
          <a href="#" className="underline hover:text-white">
            Contact Support
          </a>
        </p>
      </div>
    </div>
  );
};

export default Onboarding;
