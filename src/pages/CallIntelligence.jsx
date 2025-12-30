import React, { useState } from 'react';
import DashboardLayout from '../components/layout/DashboardLayout';
import { TranscriptCard, KeyMomentsCard, AISuggestionsCard } from '../components/CallIntelligence';
import { MOCK_CALL_DATA } from '../lib/callIntelligenceData';

const CallIntelligence = () => {
  const [selectedCall, setSelectedCall] = useState(0);
  const call = MOCK_CALL_DATA[selectedCall];

  return (
    <DashboardLayout title="Call Intelligence" subtitle="AI-powered call analysis and insights">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-3">
        <TranscriptCard call={call} />
        <div className="space-y-3">
          <KeyMomentsCard moments={call.keyMoments} />
          <AISuggestionsCard suggestions={call.suggestions} />
        </div>
      </div>
    </DashboardLayout>
  );
};

export default CallIntelligence;
