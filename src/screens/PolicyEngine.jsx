import React, { useState } from 'react';
import { ChevronDown, Save, RotateCcw } from 'lucide-react';

export default function PolicyEngine() {
  const [demoParity, setDemoParity] = useState(10);
  const [eqOp, setEqOp] = useState(12);
  const [cfFair, setCfFair] = useState(10);
  const [flagSens, setFlagSens] = useState(65);
  const [autoBlock, setAutoBlock] = useState(40);

  return (
    <div className="flex flex-col w-full h-full p-6 bg-eq-bg gap-6 overflow-y-auto">
      
      {/* Header */}
      <div>
        <h2 className="font-plex font-medium text-lg text-eq-text">Policy Engine — Acme Financial Corp</h2>
      </div>

      <div className="grid grid-cols-[300px_1fr] gap-6 items-start">
        
        {/* Left Column - Org Profile & Actions */}
        <div className="flex flex-col gap-6">
          <div className="bg-eq-panel border border-eq-border rounded p-5 flex flex-col gap-3">
            <h3 className="font-plex text-[13px] text-eq-text font-medium mb-1">Org Profile</h3>
            <ProfileRow label="Org" val="Acme Financial Corp" />
            <ProfileRow label="Plan" val="Enterprise" />
            <ProfileRow label="Onboarding" val="2025-11-12" />
            <ProfileRow label="Data Upload" val="6 months (14,832 dec)" />
            <ProfileRow label="Vertex AI Base" val="✓ Complete (3 days ago)" />
            <ProfileRow label="Integration" val="api.equa.ai/intercept" />
            <div className="mt-2 flex flex-col gap-1">
              <span className="font-sans text-[11px] text-eq-muted">Models connected:</span>
              <span className="font-plex text-[11px] text-eq-blue">LendAI-v2.3.1</span>
              <span className="font-plex text-[11px] text-eq-blue">HRModel-v3.1</span>
              <span className="font-plex text-[11px] text-eq-blue">TriageBot-v1.8</span>
            </div>
          </div>

          <div className="bg-eq-panel border border-eq-border rounded p-5 flex flex-col gap-3">
            <h3 className="font-plex text-[13px] text-eq-text font-medium mb-1">Retraining Schedule</h3>
            <p className="font-sans text-[11px] text-eq-muted leading-relaxed">
              Flagged decisions feed back to Vertex AI AutoML weekly as negative examples.
            </p>
            <div className="flex flex-col gap-1 mt-2">
              <span className="font-sans text-[11px] text-eq-text">Next: 2026-04-27 02:00 UTC</span>
              <span className="font-sans text-[11px] text-eq-text">Last: 2026-04-20 (47 examples)</span>
            </div>
            <button className="mt-3 px-3 py-1.5 border border-eq-blue text-eq-blue font-sans text-[12px] rounded hover:bg-eq-blue-dim/20 transition-colors w-full">
              Trigger Manual Retraining Now
            </button>
          </div>
        </div>

        {/* Right Column - Sliders & Config */}
        <div className="flex flex-col gap-6">
          
          <div className="bg-eq-panel border border-eq-border rounded p-5">
            <h3 className="font-plex text-[14px] text-eq-text font-medium mb-5">Fairness Metric Thresholds</h3>
            
            <div className="flex flex-col gap-6">
              <SliderRow 
                title="① Demographic Parity Threshold"
                desc="Max allowed difference in positive decision rates between groups"
                val={demoParity} setVal={setDemoParity} min={0} max={30} unit="%"
              />
              <SliderRow 
                title="② Equal Opportunity Threshold"
                desc="Max allowed difference in true positive rates between groups"
                val={eqOp} setVal={setEqOp} min={0} max={30} unit="%"
              />
              <SliderRow 
                title="③ Counterfactual Fairness Threshold"
                desc="Max allowed decision change when swapping protected attributes"
                val={cfFair} setVal={setCfFair} min={0} max={30} unit="pts"
              />
              <SliderRow 
                title="④ Bias Flag Sensitivity"
                desc="Score below which a decision is held for human review"
                val={flagSens} setVal={setFlagSens} min={0} max={100} unit=""
              />
              <SliderRow 
                title="⑤ Auto-Block Threshold"
                desc="Score below which a decision is automatically blocked"
                val={autoBlock} setVal={setAutoBlock} min={0} max={100} unit=""
              />
            </div>
          </div>

          <div className="bg-eq-panel border border-eq-border rounded p-5">
            <h3 className="font-plex text-[14px] text-eq-text font-medium mb-4">Policy Actions & Protected Attributes</h3>
            
            <div className="grid grid-cols-2 gap-8">
              <div className="flex flex-col gap-3">
                <ActionDropdown label={`If score ${autoBlock}-${flagSens} (FLAG zone):`} val="Hold for human review" />
                <ActionDropdown label={`If score <${autoBlock} (BLOCK zone):`} val="Block + FCM alert + log" />
                <ActionDropdown label={`If counterfactual delta >${cfFair}:`} val="Run full Gemini audit" />
              </div>
              
              <div className="flex flex-col gap-2">
                <span className="font-sans text-[12px] text-eq-muted mb-1">Protected Attributes to Monitor:</span>
                <div className="grid grid-cols-2 gap-2">
                  <Checkbox label="Race/Ethnicity" checked />
                  <Checkbox label="Gender" checked />
                  <Checkbox label="Age" checked />
                  <Checkbox label="Zip Code" checked />
                  <Checkbox label="Disability" checked />
                  <Checkbox label="Religion" checked />
                  <Checkbox label="National Origin" checked={false} />
                </div>
              </div>
            </div>
          </div>

          <div className="flex gap-3 justify-end mt-2">
            <button className="flex items-center gap-2 px-4 py-2 font-sans text-[13px] text-eq-block border border-transparent hover:border-eq-border hover:bg-eq-surface rounded transition-colors">
              <RotateCcw className="w-4 h-4" /> Reset to Defaults
            </button>
            <button className="flex items-center gap-2 px-5 py-2 font-sans text-[13px] font-medium text-white bg-eq-blue hover:bg-blue-500 rounded shadow-lg transition-colors">
              <Save className="w-4 h-4" /> Save Policy Changes
            </button>
          </div>

        </div>
      </div>
    </div>
  );
}

function ProfileRow({ label, val }) {
  return (
    <div className="flex justify-between items-center border-b border-eq-border/50 pb-1">
      <span className="font-sans text-[11px] text-eq-muted">{label}</span>
      <span className="font-sans text-[12px] text-eq-text">{val}</span>
    </div>
  );
}

function SliderRow({ title, desc, val, setVal, min, max, unit }) {
  return (
    <div className="flex flex-col gap-2">
      <div className="flex justify-between items-start">
        <div className="flex flex-col">
          <span className="font-plex text-[13px] text-eq-text">{title}</span>
          <span className="font-sans text-[11px] text-eq-muted">{desc}</span>
        </div>
        <div className="bg-eq-surface border border-eq-border rounded px-2 py-1 font-jet text-[12px] text-eq-blue w-16 text-center">
          {val}{unit}
        </div>
      </div>
      <input 
        type="range" 
        min={min} 
        max={max} 
        value={val} 
        onChange={(e) => setVal(e.target.value)}
        className="w-full h-1.5 bg-eq-border rounded-lg appearance-none cursor-pointer accent-eq-blue"
      />
      <div className="flex justify-between font-jet text-[10px] text-eq-hint">
        <span>{min}{unit}</span>
        <span>{max}{unit}</span>
      </div>
    </div>
  );
}

function ActionDropdown({ label, val }) {
  return (
    <div className="flex flex-col gap-1">
      <span className="font-sans text-[11px] text-eq-muted">{label}</span>
      <button className="flex items-center justify-between px-3 py-1.5 font-sans text-[12px] text-eq-text bg-eq-surface border border-eq-border rounded hover:border-eq-muted transition-colors w-full text-left">
        {val} <ChevronDown className="w-3 h-3 text-eq-muted" />
      </button>
    </div>
  );
}

function Checkbox({ label, checked: initChecked }) {
  const [checked, setChecked] = useState(initChecked);
  return (
    <label className="flex items-center gap-2 cursor-pointer group">
      <div className={`w-3.5 h-3.5 rounded-sm border flex items-center justify-center transition-colors
        ${checked ? 'bg-eq-blue border-eq-blue' : 'border-eq-muted group-hover:border-eq-text bg-transparent'}`}
      >
        {checked && <svg className="w-2.5 h-2.5 text-white" viewBox="0 0 14 14" fill="none"><path d="M3 7.5L5.5 10L11 4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>}
      </div>
      <span className="font-sans text-[12px] text-eq-text">{label}</span>
    </label>
  );
}
