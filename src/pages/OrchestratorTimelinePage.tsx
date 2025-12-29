import { Suspense, lazy } from 'react';
import { motion } from 'framer-motion';
import { Loader2 } from 'lucide-react';

/**
 * Orchestrator Timeline Page
 * Real-time workflow execution monitoring
 */

const ExecutionTimeline = lazy(() =>
  import('@/workflow/ExecutionTimeline').then(m => ({ default: m.ExecutionTimeline }))
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

const OrchestratorTimelinePage = () => {
  return (
    <Suspense fallback={<PageLoader />}>
      <div className="h-screen overflow-hidden">
        <ExecutionTimeline />
      </div>
    </Suspense>
  );
};

export default OrchestratorTimelinePage;
