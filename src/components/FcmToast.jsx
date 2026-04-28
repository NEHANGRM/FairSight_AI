import React, { useEffect, useState } from 'react';
import { ShieldAlert, ArrowRight } from 'lucide-react';

export default function FcmToast({ message, onClose, setActiveScreen }) {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    // Slight delay to trigger CSS animation
    const raf = requestAnimationFrame(() => setVisible(true));
    return () => cancelAnimationFrame(raf);
  }, []);

  return (
    <div 
      className={`fixed top-[70px] right-6 z-50 transition-all duration-300 ease-out-strict
        ${visible ? 'translate-x-0 opacity-100' : 'translate-x-10 opacity-0'}`}
    >
      <div className="bg-eq-panel border-l-4 border-l-eq-block border-y border-r border-y-eq-border border-r-eq-border shadow-2xl rounded-r-md w-[380px] p-4 flex gap-3 relative overflow-hidden">
        {/* Glow effect */}
        <div className="absolute top-0 left-0 w-1 h-full bg-eq-block shadow-[0_0_15px_rgba(239,68,68,0.8)]" />
        
        <div className="mt-0.5 text-eq-block shrink-0">
          <ShieldAlert className="w-5 h-5" />
        </div>
        
        <div className="flex flex-col gap-1 w-full">
          <div className="flex justify-between items-start">
            <h4 className="font-plex text-eq-block text-[13px] font-medium tracking-tight">
              ⚡ Decision BLOCKED
            </h4>
            <button onClick={onClose} className="text-eq-muted hover:text-eq-text">
              &times;
            </button>
          </div>
          
          <p className="font-sans text-eq-text text-[13px] leading-relaxed">
            {message || 'Loan #EQ-2026-04194 blocked — bias score 41.2. FCM push sent to Rahul Anand.'}
          </p>
          
          <div className="flex justify-between items-end mt-2">
            <span className="font-sans text-eq-muted text-[11px]">
              via Firebase Cloud Messaging | 0.3s ago
            </span>
            <button onClick={() => { setActiveScreen('Decision Feed'); onClose(); }} className="flex items-center gap-1 text-eq-blue text-[11px] hover:text-blue-400 group">
              View Decision <ArrowRight className="w-3 h-3 group-hover:translate-x-0.5 transition-transform" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
