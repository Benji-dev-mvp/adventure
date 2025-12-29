import { Suspense, lazy } from 'react';
import { motion } from 'framer-motion';
import { Loader2 } from 'lucide-react';

/**
 * Forecasting Page
 * Pipeline commitments and forecast tracking
 */

const PipelineCommitments = lazy(() =>
  import('@/modules/autonomy/PipelineCommitments').then(m => ({ default: m.PipelineCommitments }))
);

const PageLoader = () => (
  <div className="h-screen w-full flex items-center justify-center bg-gray-950">
    <motion.div
      animate={{ rotate: 360 }}
      transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
    >
      <Loader2 className="w-8 h-8 text-violet-500" />
    </motion.div>
  </div>
);

const ForecastingPage = () => {
  return (
    <Suspense fallback={<PageLoader />}>
      <div className="h-screen overflow-hidden">
        <PipelineCommitments />
      </div>
    </Suspense>
  );
};

export default ForecastingPage;
