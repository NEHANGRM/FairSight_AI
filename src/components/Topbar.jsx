import React, { useEffect, useState } from 'react';
import { Bell, Cloud } from 'lucide-react';

export default function Topbar({ activeScreen, stats }) {
  const [pulse, setPulse] = useState(false);
  
  // Pulse animation when stats.total changes
  useEffect(() => {
    setPulse(true);
    const timer = setTimeout(() => setPulse(false), 200);
    return () => clearTimeout(timer);
  }, [stats.total]);

  // Subtitle based on active screen
  const getSubtitle = () => {
    switch (activeScreen) {
      case 'Counterfactual Sim': return 'Live bias interception — Gemini-powered';
      case 'Bias Heatmap': return 'Real-time from Firebase Realtime DB | Last updated: 2s ago';
      case 'Fairness Certificates': return 'Cryptographically signed via Cloud KMS | Queryable in BigQuery | Tamper-proof | EU AI Act compliant';
      case 'Policy Engine': return 'Configurable fairness thresholds | Multi-tenant org isolation via Firebase Auth + Firestore | Changes take effect in <1s';
      case 'Retraining Loop': return 'Flagged decisions automatically feed back to Vertex AI AutoML as negative training examples — EQUA gets smarter over time';
      case 'API Integrations': return 'Connect any AI decision system via webhook — one line of code. Compatible with any model, any platform.';
      case 'Audit Reports': return 'Auto-generated weekly PDF reports for EU AI Act, EEOC compliance, and internal governance. Powered by BigQuery analytics + Gemini 1.5 Pro narrative generation.';
      default: return 'Real-time monitoring';
    }
  };

  return (
    <header className="h-[56px] w-full border-b border-eq-border bg-eq-bg flex items-center justify-between px-6 shrink-0 z-10">
      
      {/* Left */}
      <div className="flex flex-col">
        <h1 className="font-plex font-medium text-eq-text text-[15px] leading-tight">
          {activeScreen}
        </h1>
        <p className="font-sans text-[11px] text-eq-muted leading-tight truncate max-w-md">
          {getSubtitle()}
        </p>
      </div>

      {/* Center */}
      <div className="flex items-center gap-6">
        <div className="flex flex-col items-center">
          <span className={`font-plex text-eq-text text-sm transition-transform duration-200 ${pulse ? 'scale-105' : 'scale-100'}`}>
            {stats.total.toLocaleString()} decisions today
          </span>
        </div>
        <div className="flex items-center gap-4">
          <span className="font-jet text-eq-pass text-xs bg-eq-pass-dim px-2 py-0.5 rounded border border-eq-pass/20">
            avg {stats.avgLatency}ms
          </span>
          <span className="font-sans text-eq-flag text-xs">
            {((stats.flagged / stats.total) * 100).toFixed(1)}% flagged
          </span>
        </div>
      </div>

      {/* Right */}
      <div className="flex items-center gap-5">
        <div className="relative">
          <Bell className="w-4 h-4 text-eq-muted hover:text-eq-text cursor-pointer transition-colors" />
          <div className="absolute -top-1.5 -right-1.5 bg-eq-flag text-eq-bg text-[9px] font-bold px-1 rounded-full border border-eq-bg min-w-[14px] text-center">
            2
          </div>
        </div>
        
        <div className="flex items-center gap-2 bg-eq-surface px-2.5 py-1 rounded-full border border-eq-border">
          <div className="w-2 h-2 rounded-full bg-eq-pass" />
          <span className="font-sans text-[11px] text-eq-text font-medium">Firewall: ACTIVE</span>
        </div>
        
        <div className="flex items-center gap-1.5">
          <Cloud className="w-3.5 h-3.5 text-eq-muted" />
          <span className="font-sans text-[11px] text-eq-muted">Connected</span>
        </div>
      </div>

    </header>
  );
}
