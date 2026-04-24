import React from 'react';
import { ArrowRight, Database, BrainCircuit, RotateCcw, CheckCircle2, ShieldAlert } from 'lucide-react';

export default function RetrainingLoop() {
  const history = [
    { date: '2026-04-20', examples: 47, baselineDelta: '+2.3%', accuracy: '94.1%', status: 'Complete' },
    { date: '2026-04-13', examples: 61, baselineDelta: '+1.8%', accuracy: '91.8%', status: 'Complete' },
    { date: '2026-04-06', examples: 38, baselineDelta: '+3.1%', accuracy: '90.0%', status: 'Complete' },
    { date: '2026-03-30', examples: 52, baselineDelta: '+0.9%', accuracy: '86.9%', status: 'Complete' },
  ];

  return (
    <div className="flex flex-col w-full h-full p-6 bg-eq-bg gap-6 overflow-y-auto">
      
      {/* Header */}
      <div>
        <h2 className="font-plex font-medium text-lg text-eq-text">Retraining Signal Loop</h2>
        <p className="font-sans text-sm text-eq-muted mt-1">Flagged decisions automatically feed back to Vertex AI AutoML as negative training examples — EQUA gets smarter over time</p>
      </div>

      {/* Architecture Diagram */}
      <div className="bg-eq-panel border border-eq-border rounded p-6">
        <h3 className="font-plex text-sm text-eq-text mb-6">Continuous Improvement Architecture</h3>
        
        <div className="flex items-center justify-between w-full max-w-4xl mx-auto px-4 relative">
          {/* Connecting Lines */}
          <div className="absolute top-1/2 left-[10%] right-[10%] h-[2px] bg-eq-border -translate-y-1/2 z-0" />
          <div className="absolute top-full left-[80%] w-[2px] h-[40px] bg-eq-border z-0" />
          <div className="absolute top-full left-[20%] w-[2px] h-[40px] bg-eq-border z-0" />
          
          {/* Top Row Nodes */}
          <Node icon={ShieldAlert} label="Flagged Decision" color="flag" />
          <Edge label="BigQuery SQL export" />
          <Node icon={Database} label="BigQuery Export" color="blue" />
          <Edge label="47 examples/week" />
          <Node icon={BrainCircuit} label="Vertex AI AutoML" color="gemini" />
        </div>

        <div className="flex items-center justify-between w-full max-w-4xl mx-auto px-4 mt-[40px] relative">
          <div className="absolute top-1/2 left-[20%] right-[20%] h-[2px] bg-eq-border -translate-y-1/2 z-0" />
          
          {/* Bottom Row Nodes (reverse flow visually) */}
          <Node icon={CheckCircle2} label="Updated Baseline" color="pass" />
          <Edge label="Model deployment" reverse />
          <Node icon={BrainCircuit} label="Retrained Model" color="blue" />
          <Edge label="AutoML fit" reverse />
          <Node icon={RotateCcw} label="Weekly Batch Job" color="neutral" />
        </div>
      </div>

      <div className="grid grid-cols-[1fr_400px] gap-6 items-stretch">
        
        {/* Retraining History Table */}
        <div className="bg-eq-panel border border-eq-border rounded flex flex-col overflow-hidden">
          <div className="p-4 border-b border-eq-border">
            <h3 className="font-plex text-sm text-eq-text">Retraining History</h3>
          </div>
          <div className="grid grid-cols-[100px_120px_100px_100px_1fr] gap-4 px-4 py-3 bg-eq-surface border-b border-eq-border font-sans text-[11px] text-eq-muted font-medium uppercase tracking-wider">
            <span>Date</span>
            <span>Examples Added</span>
            <span>Baseline Δ</span>
            <span>Accuracy</span>
            <span>Status</span>
          </div>
          <div className="flex flex-col">
            {history.map((h, i) => (
              <div key={i} className="grid grid-cols-[100px_120px_100px_100px_1fr] gap-4 px-4 py-3 border-b border-eq-border/50 items-center">
                <span className="font-plex text-[12px] text-eq-text">{h.date}</span>
                <span className="font-jet text-[12px] text-eq-text">{h.examples}</span>
                <span className="font-jet text-[12px] text-eq-pass">{h.baselineDelta}</span>
                <span className="font-jet text-[12px] text-eq-text">{h.accuracy}</span>
                <span className="font-sans text-[12px] text-eq-pass flex items-center gap-1.5"><CheckCircle2 className="w-3.5 h-3.5" /> {h.status}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Improvement Chart */}
        <div className="bg-eq-panel border border-eq-border rounded p-4 flex flex-col">
          <h3 className="font-plex text-sm text-eq-text mb-4">Model Accuracy (%)</h3>
          
          <div className="flex-1 relative border-b border-l border-eq-border ml-6 mb-6">
            <svg viewBox="0 0 100 100" className="w-full h-full overflow-visible" preserveAspectRatio="none">
              <line x1="0" y1="20" x2="100" y2="20" stroke="var(--color-eq-border)" strokeDasharray="2" />
              <line x1="0" y1="50" x2="100" y2="50" stroke="var(--color-eq-border)" strokeDasharray="2" />
              <line x1="0" y1="80" x2="100" y2="80" stroke="var(--color-eq-border)" strokeDasharray="2" />
              
              {/* Accuracy Trend Line */}
              <polyline points="0,80 25,60 50,45 75,25 100,10" fill="none" stroke="var(--color-eq-pass)" strokeWidth="3" />
              <circle cx="0" cy="80" r="3" fill="var(--color-eq-pass)" />
              <circle cx="25" cy="60" r="3" fill="var(--color-eq-pass)" />
              <circle cx="50" cy="45" r="3" fill="var(--color-eq-pass)" />
              <circle cx="75" cy="25" r="3" fill="var(--color-eq-pass)" />
              <circle cx="100" cy="10" r="3" fill="var(--color-eq-pass)" />
            </svg>
            <div className="absolute -left-6 bottom-[-6px] font-sans text-[10px] text-eq-muted">79%</div>
            <div className="absolute -left-6 top-[44px] font-sans text-[10px] text-eq-muted">87%</div>
            <div className="absolute -left-6 top-[-6px] font-sans text-[10px] text-eq-muted">94%</div>
            
            <div className="absolute bottom-[-24px] left-0 right-0 flex justify-between font-sans text-[10px] text-eq-muted px-2">
              <span>Wk 1</span><span>Wk 2</span><span>Wk 3</span><span>Wk 4</span><span>Now</span>
            </div>
          </div>
          
          <p className="font-sans text-[11px] text-eq-muted mt-2 leading-relaxed">
            Each retraining cycle makes EQUA more accurate for your organization's specific decision patterns.
          </p>
        </div>
      </div>
    </div>
  );
}

function Node({ icon: Icon, label, color }) {
  const colors = {
    flag: 'bg-eq-flag-dim border-eq-flag text-eq-flag',
    blue: 'bg-eq-blue-dim/20 border-eq-blue text-eq-blue',
    gemini: 'bg-eq-gemini-dim border-eq-gemini text-eq-gemini',
    pass: 'bg-eq-pass-dim border-eq-pass text-eq-pass',
    neutral: 'bg-eq-surface border-eq-border text-eq-muted',
  };

  return (
    <div className={`relative z-10 flex flex-col items-center justify-center w-32 h-20 rounded-lg border-2 ${colors[color]} bg-opacity-90 shadow-lg backdrop-blur`}>
      <Icon className="w-5 h-5 mb-1.5" />
      <span className="font-plex text-[10px] text-center px-2 font-medium leading-tight">{label}</span>
    </div>
  );
}

function Edge({ label, reverse }) {
  return (
    <div className="flex flex-col items-center relative z-10 w-24">
      <span className="font-plex text-[9px] text-eq-muted whitespace-nowrap bg-eq-panel px-1">{label}</span>
      <ArrowRight className={`w-3 h-3 text-eq-muted mt-0.5 ${reverse ? 'rotate-180' : ''}`} />
    </div>
  );
}
