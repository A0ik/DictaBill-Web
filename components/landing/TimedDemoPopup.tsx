'use client';
import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Mic } from 'lucide-react';
import DemoModal from '@/components/landing/DemoModal';

const DELAY_MS = 15_000;
const STORAGE_KEY = 'dictabill_demo_popup_seen';

export default function TimedDemoPopup() {
  const [showNudge, setShowNudge] = useState(false);
  const [demoOpen, setDemoOpen] = useState(false);

  useEffect(() => {
    // Don't show again this session
    if (sessionStorage.getItem(STORAGE_KEY)) return;

    const t = setTimeout(() => {
      setShowNudge(true);
    }, DELAY_MS);

    return () => clearTimeout(t);
  }, []);

  const handleDismiss = () => {
    setShowNudge(false);
    sessionStorage.setItem(STORAGE_KEY, '1');
  };

  const handleOpen = () => {
    setShowNudge(false);
    setDemoOpen(true);
    sessionStorage.setItem(STORAGE_KEY, '1');
  };

  return (
    <>
      <AnimatePresence>
        {showNudge && (
          <motion.div
            initial={{ opacity: 0, y: 32, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.96 }}
            transition={{ duration: 0.35, ease: 'easeOut' }}
            className="fixed bottom-6 right-6 z-[90] w-80 bg-white rounded-2xl shadow-2xl border border-gray-100 overflow-hidden"
          >
            {/* Green accent bar */}
            <div className="h-1 w-full bg-primary-500" />

            <div className="p-5">
              <div className="flex items-start justify-between gap-3 mb-3">
                <div className="w-10 h-10 bg-primary-50 rounded-xl flex items-center justify-center flex-shrink-0">
                  <Mic size={20} className="text-primary-500" />
                </div>
                <button
                  onClick={handleDismiss}
                  className="p-1 rounded-lg hover:bg-gray-100 text-gray-400 hover:text-gray-600 transition-colors mt-0.5 flex-shrink-0"
                  aria-label="Fermer"
                >
                  <X size={15} />
                </button>
              </div>

              <h3 className="font-black text-[#0D0D0D] text-base leading-tight mb-1.5">
                Curieux de voir comment ça marche ?
              </h3>
              <p className="text-gray-500 text-sm leading-relaxed mb-4">
                Essaie la démo vocale maintenant — aucune inscription requise.
              </p>

              <button
                onClick={handleOpen}
                className="w-full bg-[#0D0D0D] hover:bg-gray-800 text-white font-semibold py-2.5 rounded-xl text-sm transition-colors"
              >
                Essayer la démo →
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <DemoModal open={demoOpen} onClose={() => setDemoOpen(false)} />
    </>
  );
}
