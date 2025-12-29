import { Suspense, lazy } from 'react';
import { motion } from 'framer-motion';
import { Loader2 } from 'lucide-react';

/**
 * Intelligence Graph Page
 * Account and contact relationship visualization
 */

const IntelligenceGraph = lazy(() =>
  import('@/ai/brain/IntelligenceGraph').then(m => ({ default: m.IntelligenceGraph }))
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

const IntelligenceGraphPage = () => {
  return (
    <Suspense fallback={<PageLoader />}>
      <div className="h-screen overflow-hidden">
        <IntelligenceGraph />
      </div>
    </Suspense>
  );
};

export default IntelligenceGraphPage;
