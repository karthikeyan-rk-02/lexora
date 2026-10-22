import React, { useState } from 'react';
import { usePWAInstall } from '../../hooks/usePWAInstall.ts';
import { Download, Smartphone, X } from 'lucide-react';

export const PWAInstallButton: React.FC<{ variant?: 'sidebar' | 'header' | 'card' }> = ({
  variant = 'sidebar',
}) => {
  const { isInstallable, isInstalled, isIOS, install } = usePWAInstall();
  const [showIOSGuide, setShowIOSGuide] = useState(false);

  // If already running as an installed standalone app, suppress the button completely
  if (isInstalled) {
    return null;
  }

  // Not installable yet and not iOS (e.g. desktop browser that doesn't support PWA prompt or already dismissed)
  if (!isInstallable && !isIOS) {
    return null;
  }

  const handleInstallClick = async () => {
    if (isInstallable) {
      await install();
    } else if (isIOS) {
      setShowIOSGuide(true);
    }
  };

  if (variant === 'header') {
    return (
      <>
        <button
          onClick={handleInstallClick}
          className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-indigo-50 border border-indigo-200/80 text-indigo-700 hover:bg-indigo-100 text-xs font-semibold shadow-2xs transition-all active:scale-[0.98]"
          title="Install Lexora Standalone App"
          aria-label="Install Lexora on your device"
        >
          <Download className="w-3.5 h-3.5" />
          <span>Install App</span>
        </button>

        {showIOSGuide && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-xs p-4">
            <div className="w-full max-w-sm rounded-2xl bg-white p-6 shadow-2xl border border-slate-200 text-slate-900 animate-in fade-in zoom-in-95">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <Smartphone className="w-5 h-5 text-indigo-600" />
                  <h3 className="text-base font-bold">Install on iPhone / iPad</h3>
                </div>
                <button
                  onClick={() => setShowIOSGuide(false)}
                  className="text-slate-400 hover:text-slate-600 p-1 rounded-lg"
                  aria-label="Close"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
              <p className="text-xs text-slate-600 leading-relaxed space-y-1.5">
                <span>1. Tap the <strong>Share</strong> icon in the Safari navigation bar.</span><br />
                <span>2. Scroll down and tap <strong>Add to Home Screen</strong>.</span><br />
                <span>3. Tap <strong>Add</strong> in the top right corner.</span>
              </p>
              <button
                onClick={() => setShowIOSGuide(false)}
                className="mt-4 w-full py-2 rounded-xl bg-indigo-600 text-white text-xs font-semibold hover:bg-indigo-700 transition"
              >
                Got it
              </button>
            </div>
          </div>
        )}
      </>
    );
  }

  return (
    <>
      <button
        onClick={handleInstallClick}
        className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl bg-indigo-50/80 hover:bg-indigo-100/80 border border-indigo-100 text-indigo-700 text-xs font-semibold transition-colors"
        title="Install Lexora Standalone App"
        aria-label="Install Lexora on your device"
      >
        <Download className="w-4 h-4 text-indigo-600 shrink-0" />
        <span className="truncate">Install App</span>
      </button>

      {showIOSGuide && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-xs p-4">
          <div className="w-full max-w-sm rounded-2xl bg-white p-6 shadow-2xl border border-slate-200 text-slate-900 animate-in fade-in zoom-in-95">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <Smartphone className="w-5 h-5 text-indigo-600" />
                <h3 className="text-base font-bold">Install on iPhone / iPad</h3>
              </div>
              <button
                onClick={() => setShowIOSGuide(false)}
                className="text-slate-400 hover:text-slate-600 p-1 rounded-lg"
                aria-label="Close"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
            <p className="text-xs text-slate-600 leading-relaxed space-y-1.5">
              <span>1. Tap the <strong>Share</strong> icon in the Safari navigation bar.</span><br />
              <span>2. Scroll down and tap <strong>Add to Home Screen</strong>.</span><br />
              <span>3. Tap <strong>Add</strong> in the top right corner.</span>
            </p>
            <button
              onClick={() => setShowIOSGuide(false)}
              className="mt-4 w-full py-2 rounded-xl bg-indigo-600 text-white text-xs font-semibold hover:bg-indigo-700 transition"
            >
              Got it
            </button>
          </div>
        </div>
      )}
    </>
  );
};
