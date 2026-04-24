import React, { useState, useEffect } from 'react';
import { ChevronDown, TrendingUp, TrendingDown } from 'lucide-react';

export default function BiasHeatmap() {
  const [pulse, setPulse] = useState(true);

  const departments = ['Retail Lending', 'Mortgage', 'Auto Loans', 'Hiring', 'Medical Triage'];
  const demographics = ['Race', 'Gender', 'Age', 'ZIP Code', 'Disability'];
  
  const data = {
    'Retail Lending': { 'Race': 6.2, 'Gender': 1.8, 'Age': 2.1, 'ZIP Code': 8.4, 'Disability': 0.9 },
    'Mortgage': { 'Race': 4.1, 'Gender': 2.3, 'Age': 3.7, 'ZIP Code': 5.9, 'Disability': 1.2 },
    'Auto Loans': { 'Race': 2.8, 'Gender': 1.1, 'Age': 1.9, 'ZIP Code': 3.2, 'Disability': 0.7 },
    'Hiring': { 'Race': 7.3, 'Gender': 5.8, 'Age': 9.1, 'ZIP Code': 1.2, 'Disability': 3.4 },
    'Medical Triage': { 'Race': 3.9, 'Gender': 2.7, 'Age': 4.2, 'ZIP Code': 2.1, 'Disability': 5.6 }
  };

  const getCellColor = (val) => {
    if (val <= 1) return 'bg-eq-pass/20 text-eq-pass border-eq-pass/20';
    if (val <= 3) return 'bg-eq-flag/40 text-eq-flag border-eq-flag/30';
    if (val <= 5) return 'bg-eq-flag/80 text-eq-bg border-eq-flag';
    if (val <= 10) return 'bg-eq-block/60 text-eq-text border-eq-block/60';
    return 'bg-eq-block text-white border-eq-block animate-pulse-heat shadow-[0_0_12px_rgba(239,68,68,0.5)]';
  };

  return (
    <div className="flex flex-col w-full h-full p-6 bg-eq-bg gap-6 overflow-y-auto">
      
      {/* Header */}
      <div className="flex justify-between items-start">
        <div>
          <h2 className="font-plex font-medium text-lg text-eq-text">Bias Heatmap — Acme Financial Corp</h2>
          <p className="font-sans text-sm text-eq-muted mt-1">Real-time from Firebase Realtime DB | Last updated: 2s ago</p>
        </div>
        <button className="flex items-center gap-2 px-3 py-1.5 font-plex text-[12px] text-eq-text bg-eq-panel border border-eq-border rounded hover:border-eq-muted">
          Last 7 days <ChevronDown className="w-3 h-3 text-eq-muted" />
        </button>
      </div>

      <div className="flex gap-6 items-stretch">
        {/* Heatmap Grid */}
        <div className="flex-1 bg-eq-panel border border-eq-border rounded p-4">
          <div className="grid grid-cols-[140px_repeat(5,1fr)] gap-2">
            {/* Headers */}
            <div className="p-2"></div>
            {demographics.map(d => (
              <div key={d} className="p-2 font-plex text-[11px] text-eq-muted text-center uppercase tracking-wider">{d}</div>
            ))}
            
            {/* Rows */}
            {departments.map(dept => (
              <React.Fragment key={dept}>
                <div className="p-2 flex items-center font-sans text-[13px] text-eq-text whitespace-nowrap">{dept}</div>
                {demographics.map(demo => {
                  const val = data[dept][demo];
                  return (
                    <div 
                      key={`${dept}-${demo}`} 
                      className={`relative group h-12 flex items-center justify-center rounded border transition-colors cursor-pointer ${getCellColor(val)}`}
                    >
                      <span className="font-jet text-[13px] font-medium z-10">{val.toFixed(1)}%</span>
                      {/* Tooltip */}
                      <div className="absolute opacity-0 group-hover:opacity-100 bottom-full mb-2 bg-eq-surface border border-eq-border p-2 rounded shadow-xl pointer-events-none transition-opacity w-max z-50">
                        <p className="font-sans text-[12px] text-eq-text font-medium mb-1">{dept} × {demo}</p>
                        <p className="font-sans text-[11px] text-eq-muted">{val}% flag rate | 312 decisions | 19 flagged</p>
                        <p className={`font-sans text-[11px] mt-1 flex items-center gap-1 ${val > 5 ? 'text-eq-block' : 'text-eq-pass'}`}>
                          Trend: {val > 5 ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />} {val > 5 ? '+1.2%' : '-0.5%'}
                        </p>
                      </div>
                    </div>
                  );
                })}
              </React.Fragment>
            ))}
          </div>
        </div>

        {/* Trend Chart Area */}
        <div className="w-[40%] bg-eq-panel border border-eq-border rounded p-4 flex flex-col">
          <h3 className="font-plex text-sm text-eq-text mb-4">Risk Dimensions Trend</h3>
          <div className="flex-1 relative border-b border-l border-eq-border/50 ml-6 mb-6">
            <svg viewBox="0 0 100 100" className="w-full h-full overflow-visible" preserveAspectRatio="none">
              {/* Y Axis Grid lines */}
              <line x1="0" y1="20" x2="100" y2="20" stroke="var(--color-eq-border)" strokeDasharray="2" />
              <line x1="0" y1="50" x2="100" y2="50" stroke="var(--color-eq-border)" strokeDasharray="2" />
              <line x1="0" y1="80" x2="100" y2="80" stroke="var(--color-eq-border)" strokeDasharray="2" />
              
              {/* Race Line (Red-ish) */}
              <polyline points="0,80 20,70 40,75 60,60 80,40 100,20" fill="none" stroke="var(--color-eq-block)" strokeWidth="2" />
              {/* Age Line (Amber) */}
              <polyline points="0,90 20,85 40,80 60,70 80,50 100,40" fill="none" stroke="var(--color-eq-flag)" strokeWidth="2" />
              {/* Gender Line (Blue) */}
              <polyline points="0,60 20,55 40,60 60,65 80,70 100,75" fill="none" stroke="var(--color-eq-blue)" strokeWidth="2" />
            </svg>
            <div className="absolute -left-6 bottom-[-6px] font-sans text-[10px] text-eq-muted">0%</div>
            <div className="absolute -left-6 top-[44px] font-sans text-[10px] text-eq-muted">5%</div>
            <div className="absolute -left-8 top-[-6px] font-sans text-[10px] text-eq-muted">10%</div>
            
            <div className="absolute bottom-[-20px] left-0 font-sans text-[10px] text-eq-muted">7 days ago</div>
            <div className="absolute bottom-[-20px] right-0 font-sans text-[10px] text-eq-muted">Today</div>
          </div>
          
          <div className="flex justify-center gap-4 mt-2">
            <div className="flex items-center gap-1.5"><div className="w-2 h-2 rounded-full bg-eq-block"/> <span className="font-sans text-[11px] text-eq-text">Race</span></div>
            <div className="flex items-center gap-1.5"><div className="w-2 h-2 rounded-full bg-eq-flag"/> <span className="font-sans text-[11px] text-eq-text">Age</span></div>
            <div className="flex items-center gap-1.5"><div className="w-2 h-2 rounded-full bg-eq-blue"/> <span className="font-sans text-[11px] text-eq-text">Gender</span></div>
          </div>
        </div>
      </div>

      {/* Summary Stats */}
      <div className="grid grid-cols-3 gap-6">
        <div className="bg-eq-block-dim border border-eq-block/30 rounded p-4">
          <p className="font-sans text-[11px] text-eq-muted mb-1 uppercase tracking-wider">Highest Risk</p>
          <p className="font-plex text-[14px] text-eq-block font-medium">Age Bias in Hiring (9.1%)</p>
        </div>
        <div className="bg-eq-pass-dim border border-eq-pass/30 rounded p-4">
          <p className="font-sans text-[11px] text-eq-muted mb-1 uppercase tracking-wider">Most Improved</p>
          <p className="font-plex text-[14px] text-eq-pass font-medium">Auto Loans Race (↓ 1.4% this week)</p>
        </div>
        <div className="bg-eq-blue-dim/20 border border-eq-blue/30 rounded p-4">
          <p className="font-sans text-[11px] text-eq-muted mb-1 uppercase tracking-wider">Retraining Queued</p>
          <p className="font-plex text-[14px] text-eq-blue font-medium">47 decisions</p>
        </div>
      </div>
    </div>
  );
}
