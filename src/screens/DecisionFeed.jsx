import React, { useState, useEffect } from 'react';
import { Search, ChevronDown, AlertCircle, Eye, AlertTriangle } from 'lucide-react';

export default function DecisionFeed({ triggerToast, setActiveScreen }) {
  const [decisions, setDecisions] = useState([
    { id: '#EQ-2026-04198', name: 'Sarah K.', type: 'Hiring', model: 'HRModel-v3.1', status: 'PASS', score: 96.2, time: 143, isNew: false },
    { id: '#EQ-2026-04197', name: 'Raj M.', type: 'Loan', model: 'LendAI-v2.3', status: 'PASS', score: 91.7, time: 201, isNew: false },
    { id: '#EQ-2026-04196', name: 'Fatima A.', type: 'Medical', model: 'TriageBot-v1.8', status: 'FLAG', score: 62.4, time: 187, isNew: false },
    { id: '#EQ-2026-04195', name: 'Chen W.', type: 'Hiring', model: 'HRModel-v3.1', status: 'PASS', score: 88.9, time: 156, isNew: false },
    { id: '#EQ-2026-04194', name: 'Darnell W.', type: 'Loan', model: 'LendAI-v2.3', status: 'BLOCK', score: 41.2, time: 264, isNew: false },
    { id: '#EQ-2026-04193', name: 'Priya S.', type: 'Medical', model: 'TriageBot-v1.8', status: 'PASS', score: 94.1, time: 168, isNew: false },
    { id: '#EQ-2026-04192', name: 'James S.', type: 'Loan', model: 'LendAI-v2.3', status: 'FLAG', score: 61.8, time: 247, isNew: false },
  ]);

  // Simulate new decisions
  useEffect(() => {
    let idCount = 4199;
    const timer = setInterval(() => {
      const types = ['Loan', 'Hiring', 'Medical'];
      const models = { 'Loan': 'LendAI-v2.3', 'Hiring': 'HRModel-v3.1', 'Medical': 'TriageBot-v1.8' };
      const selectedType = types[Math.floor(Math.random() * types.length)];
      const randScore = Math.random() * 100;
      let status = 'PASS';
      if (randScore < 45) status = 'BLOCK';
      else if (randScore < 65) status = 'FLAG';
      
      const newD = {
        id: `#EQ-2026-0${idCount++}`,
        name: `User ${idCount % 100}`,
        type: selectedType,
        model: models[selectedType],
        status,
        score: parseFloat((randScore).toFixed(1)),
        time: Math.floor(Math.random() * 100) + 120,
        isNew: true
      };
      
      if (status === 'BLOCK') {
        triggerToast(`Decision ${newD.id} BLOCKED — bias score ${newD.score}. FCM push sent to Rahul Anand.`);
      }
      
      setDecisions(prev => [newD, ...prev].slice(0, 20));
    }, Math.random() * 4000 + 3000);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="flex flex-col w-full h-full p-6 bg-eq-bg gap-6 overflow-y-auto">
      
      {/* Header Metrics Row */}
      <div className="flex gap-4 items-stretch relative">
        <StatCard val="2,847" label="Decisions Today" color="neutral" />
        <StatCard val="2,756" label="Passed (96.8%)" color="pass" />
        <StatCard val="91" label="Flagged (3.2%)" color="flag" />
        <StatCard val="187ms" label="Avg Intercept Time" color="blue" />
        
        {/* Sparkline */}
        <div className="ml-auto w-[200px] h-[60px] relative">
          <svg viewBox="0 0 200 60" className="w-full h-full overflow-visible">
            <path d="M0,50 L20,48 L40,45 L60,42 L80,20 L100,10 L120,25 L140,22 L160,35 L180,38 L200,40" 
                  fill="none" stroke="var(--color-eq-blue)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            <path d="M0,50 L20,48 L40,45 L60,42 L80,20 L100,10 L120,25 L140,22 L160,35 L180,38 L200,40 L200,60 L0,60 Z" 
                  fill="url(#sparkGradient)" stroke="none" />
            <defs>
              <linearGradient id="sparkGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="rgba(59,130,246,0.2)" />
                <stop offset="100%" stopColor="rgba(59,130,246,0)" />
              </linearGradient>
            </defs>
          </svg>
          <div className="flex justify-between absolute bottom-[-15px] left-0 right-0">
            <span className="font-sans text-[9px] text-eq-muted">00:00</span>
            <span className="font-sans text-[9px] text-eq-muted">14:00</span>
          </div>
        </div>
      </div>

      {/* Filter Bar */}
      <div className="flex items-center gap-3 bg-eq-panel p-2 rounded border border-eq-border mt-2">
        <FilterDropdown label="All Types" />
        <FilterDropdown label="All Status" />
        <FilterDropdown label="Date Range: Today" />
        <FilterDropdown label="Department: All" />
        <FilterDropdown label="Model: All" />
        
        <div className="ml-auto flex items-center gap-2 bg-eq-bg border border-eq-border px-3 py-1.5 rounded w-64 focus-within:border-eq-blue">
          <Search className="w-4 h-4 text-eq-muted" />
          <input type="text" placeholder="Search by ID" className="bg-transparent border-none outline-none text-sm font-plex text-eq-text placeholder-eq-hint w-full" />
        </div>
      </div>

      {/* Decision Table */}
      <div className="bg-eq-panel border border-eq-border rounded flex flex-col overflow-hidden shrink-0">
        <div className="grid grid-cols-[110px_1fr_100px_120px_80px_100px_120px_100px] gap-4 px-4 py-3 bg-eq-surface border-b border-eq-border font-sans text-xs text-eq-muted font-medium uppercase tracking-wider">
          <span>Decision ID</span>
          <span>Applicant</span>
          <span>Type</span>
          <span>Source Model</span>
          <span>Status</span>
          <span>Fairness Score</span>
          <span>Intercept Time</span>
          <span>Action</span>
        </div>
        
        <div className="flex flex-col">
          {decisions.map(d => (
            <div key={d.id} className={`grid grid-cols-[110px_1fr_100px_120px_80px_100px_120px_100px] gap-4 px-4 py-3 border-b border-eq-border/50 items-center hover:bg-eq-surface/50 transition-colors
              ${d.isNew ? 'animate-slide-down' : ''}
            `}>
              <span className="font-plex text-[12px] text-eq-text">{d.id}</span>
              <span className="font-sans text-[13px] text-eq-text">{d.name}</span>
              <span className="font-sans text-[13px] text-eq-muted">{d.type}</span>
              <span className="font-sans text-[13px] text-eq-muted">{d.model}</span>
              
              <span className={`font-plex text-[10px] px-2 py-0.5 rounded font-bold w-max
                ${d.status === 'PASS' ? 'bg-eq-pass-dim text-eq-pass border border-eq-pass/20' : 
                  d.status === 'FLAG' ? 'bg-eq-flag-dim text-eq-flag border border-eq-flag/20' : 
                  'bg-eq-block-dim text-eq-block border border-eq-block/20'}`}
              >
                {d.status}
              </span>
              
              <span className={`font-jet text-[13px] ${getScoreColor(d.score)}`}>{d.score.toFixed(1)}</span>
              
              <span className="font-jet text-[13px] text-eq-text">{d.time}ms</span>
              
              <div>
                {d.status === 'PASS' && <ActionButton icon={Eye} label="View" type="neutral" onClick={() => setActiveScreen('Counterfactual Sim')} />}
                {d.status === 'FLAG' && <ActionButton icon={AlertTriangle} label="Review ⚠" type="flag" onClick={() => setActiveScreen('Counterfactual Sim')} />}
                {d.status === 'BLOCK' && <ActionButton icon={AlertCircle} label="Alert 🔴" type="block" onClick={() => setActiveScreen('Counterfactual Sim')} />}
              </div>
            </div>
          ))}
        </div>
        
        <div className="p-3 flex justify-center items-center text-[12px] font-sans text-eq-muted">
          Showing {decisions.length} of 2,847 today <span className="mx-2">|</span> <button className="text-eq-blue hover:underline">Load More</button>
        </div>
      </div>
    </div>
  );
}

function StatCard({ val, label, color }) {
  const borderColors = {
    neutral: 'border-l-eq-border',
    pass: 'border-l-eq-pass shadow-[inset_4px_0_0_0_rgba(16,185,129,0.2)]',
    flag: 'border-l-eq-flag shadow-[inset_4px_0_0_0_rgba(245,158,11,0.2)]',
    blue: 'border-l-eq-blue shadow-[inset_4px_0_0_0_rgba(59,130,246,0.2)]'
  };
  return (
    <div className={`flex-1 bg-eq-panel border border-eq-border rounded p-4 flex flex-col gap-1 border-l-[3px] ${borderColors[color]}`}>
      <span className="font-jet text-[28px] text-eq-text leading-none">{val}</span>
      <span className="font-sans text-[12px] text-eq-muted">{label}</span>
    </div>
  );
}

function FilterDropdown({ label }) {
  return (
    <button className="flex items-center gap-2 px-3 py-1.5 font-plex text-[11px] text-eq-text bg-eq-bg border border-eq-border rounded hover:border-eq-muted">
      {label} <ChevronDown className="w-3 h-3 text-eq-muted" />
    </button>
  );
}

function ActionButton({ icon: Icon, label, type, onClick }) {
  const styles = {
    neutral: 'text-eq-blue hover:bg-eq-blue/10',
    flag: 'text-eq-flag hover:bg-eq-flag/10 border-eq-flag/20',
    block: 'text-eq-block hover:bg-eq-block/10 border-eq-block/20'
  };
  return (
    <button onClick={onClick} className={`flex items-center justify-center gap-1.5 px-3 py-1 text-[11px] font-sans rounded transition-colors border border-transparent ${styles[type]}`}>
      <Icon className="w-3 h-3" /> {label}
    </button>
  );
}

function getScoreColor(score) {
  if (score > 85) return 'text-eq-pass';
  if (score >= 60) return 'text-eq-flag';
  return 'text-eq-block';
}
