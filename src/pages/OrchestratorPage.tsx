import { Suspense, lazy } from 'react';
import { motion } from 'framer-motion';
import { Loader2 } from 'lucide-react';

/**
 * Orchestrator Page
 * Node-based workflow builder
 */

const OrchestratorCanvas = lazy(() =>
  import('@/workflow/OrchestratorCanvas').then(m => ({ default: m.OrchestratorCanvas }))
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

const OrchestratorPage = () => {
  return (
    <Suspense fallback={<PageLoader />}>
      <div className="h-screen overflow-hidden">
        <OrchestratorCanvas />
      </div>
    </Suspense>
  );
};

export default OrchestratorPage;
