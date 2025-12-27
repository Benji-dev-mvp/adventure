import React, { useState } from 'react';
import { Modal } from '../ui/Modal';
import { Button } from '../ui/Button';
import { useToast } from '../Toast';
import { ThumbsUp, ThumbsDown, Heart, MessageSquare } from 'lucide-react';

export const NPSModal = ({ isOpen, onClose, context = 'general' }) => {
  const { showToast } = useToast();
  const [step, setStep] = useState(1);
  const [score, setScore] = useState(null);
  const [feedback, setFeedback] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const handleScoreSelect = (selectedScore) => {
    setScore(selectedScore);
    setStep(2);
  };

  const handleSubmit = async () => {
    if (score === null) return;

    setSubmitting(true);
    try {
      const response = await fetch('/api/growth/feedback/nps', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          score,
          feedback: feedback || null,
          survey_context: context
        })
      });

      if (response.ok) {
        showToast('Thank you for your feedback!', 'success');
        setStep(3);
        setTimeout(() => {
          onClose();
          resetModal();
        }, 2000);
      }
    } catch (error) {
      showToast('Failed to submit feedback', 'error');
    } finally {
      setSubmitting(false);
    }
  };

  const resetModal = () => {
    setStep(1);
    setScore(null);
    setFeedback('');
  };

  const getScoreCategory = () => {
    if (score === null) return null;
    if (score <= 6) return 'detractor';
    if (score <= 8) return 'passive';
    return 'promoter';
  };

  const category = getScoreCategory();

  if (!isOpen) return null;

  return (
    <Modal 
      onClose={() => {
        onClose();
        resetModal();
      }}
      title={step === 3 ? 'Thank You!' : 'How likely are you to recommend Artisan?'}
      size="medium"
    >
      {step === 1 && (
        <div className="space-y-6">
          <p className="text-sm text-gray-600 text-center">
            On a scale of 0-10, how likely are you to recommend Artisan to a friend or colleague?
          </p>
          
          <div className="grid grid-cols-11 gap-2">
            {[...Array(11)].map((_, index) => (
              <button
                key={index}
                onClick={() => handleScoreSelect(index)}
                className="aspect-square rounded-lg border-2 border-gray-300 hover:border-purple-500 hover:bg-purple-50 transition-all font-semibold text-gray-700 hover:text-purple-700 focus:outline-none focus:ring-2 focus:ring-purple-500"
              >
                {index}
              </button>
            ))}
          </div>

          <div className="flex justify-between text-xs text-gray-500">
            <span>Not at all likely</span>
            <span>Extremely likely</span>
          </div>
        </div>
      )}

      {step === 2 && (
        <div className="space-y-6">
          <div className="text-center">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full mb-4 bg-gradient-to-br from-purple-500 to-blue-600">
              {category === 'promoter' ? (
                <Heart className="text-white" size={32} />
              ) : category === 'passive' ? (
                <ThumbsUp className="text-white" size={32} />
              ) : (
                <ThumbsDown className="text-white" size={32} />
              )}
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              {category === 'promoter' && "We're thrilled to hear that!"}
              {category === 'passive' && "Thanks for your rating!"}
              {category === 'detractor' && "We're sorry to hear that"}
            </h3>
            <p className="text-sm text-gray-600 mb-4">
              {category === 'promoter' && "We'd love to know what you love most about Artisan"}
              {category === 'passive' && "What can we do to make Artisan a 9 or 10 for you?"}
              {category === 'detractor' && "Please let us know how we can improve"}
            </p>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              <MessageSquare size={16} className="inline mr-1" />
              Your feedback (optional)
            </label>
            <textarea
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent resize-none"
              rows={4}
              value={feedback}
              onChange={(e) => setFeedback(e.target.value)}
              placeholder="Tell us more about your experience..."
            />
          </div>

          <div className="flex gap-3">
            <Button
              variant="outline"
              className="flex-1"
              onClick={() => {
                onClose();
                resetModal();
              }}
            >
              Skip
            </Button>
            <Button
              className="flex-1"
              onClick={handleSubmit}
              disabled={submitting}
            >
              {submitting ? 'Submitting...' : 'Submit Feedback'}
            </Button>
          </div>
        </div>
      )}

      {step === 3 && (
        <div className="text-center py-8">
          <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-green-100 mb-4">
            <Heart className="text-green-600" size={40} />
          </div>
          <h3 className="text-xl font-semibold text-gray-900 mb-2">
            Thank you for your feedback!
          </h3>
          <p className="text-gray-600">
            Your input helps us improve Artisan for everyone.
          </p>
        </div>
      )}
    </Modal>
  );
};

export const FeedbackWidget = ({ context = 'general' }) => {
  const [showNPS, setShowNPS] = useState(false);

  return (
    <>
      <button
        onClick={() => setShowNPS(true)}
        className="fixed bottom-4 right-4 bg-gradient-to-br from-purple-500 to-blue-600 text-white px-4 py-2 rounded-full shadow-lg hover:shadow-xl transition-all flex items-center gap-2 z-50"
      >
        <MessageSquare size={16} />
        <span className="font-medium">Feedback</span>
      </button>

      <NPSModal
        isOpen={showNPS}
        onClose={() => setShowNPS(false)}
        context={context}
      />
    </>
  );
};

export default NPSModal;
