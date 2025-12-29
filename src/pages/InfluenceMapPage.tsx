import { Suspense, lazy } from 'react';
import { motion } from 'framer-motion';
import { Loader2 } from 'lucide-react';

/**
 * Influence Map Page
 * Stakeholder relationship mapping within accounts
 */

const InfluenceMap = lazy(() => import('@/ai/brain/InfluenceMap').then(m => ({ default: m.InfluenceMap })));

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

const InfluenceMapPage = () => {
  return (
    <Suspense fallback={<PageLoader />}>
      <div className="h-screen overflow-hidden">
        <InfluenceMap />
      </div>
    </Suspense>
  );
};

export default InfluenceMapPage;
