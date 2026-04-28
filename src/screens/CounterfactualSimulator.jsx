import React, { useState, useEffect, useRef } from 'react';
import { Sparkles, ShieldCheck, ArrowRight, Activity, ChevronRight, Loader2 } from 'lucide-react';

const TYPEWRITER_SPEED = 28; // ms per character

export default function CounterfactualSimulator({ triggerToast, addNotification, selectedDecision, setSelectedDecision, setActiveScreen }) {
  const [activeToggle, setActiveToggle] = useState('Race');
  const [typedText, setTypedText] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const textRef = useRef('');

  // Build original profile from selectedDecision or defaults
  const originalProfile = selectedDecision ? {
    name: selectedDecision.name,
    id: selectedDecision.id,
    type: selectedDecision.type,
    model: selectedDecision.model,
    score: selectedDecision.score,
    status: selectedDecision.status,
    time: selectedDecision.time,
    age: selectedDecision.age || 34,
    gender: selectedDecision.gender || 'Male',
    creditScore: selectedDecision.creditScore || 720,
    income: selectedDecision.income || 85000,
    zip: selectedDecision.zip || '10001',
    debtRatio: selectedDecision.debtRatio || 28,
    employment: selectedDecision.employment || 6,
  } : {
    name: 'James Smith',
    id: '#EQ-2026-04192',
    type: 'Loan',
    model: 'LendAI-v2.3.1',
    score: 91.4,
    status: 'PASS',
    time: 247,
    age: 34,
    gender: 'Male',
    creditScore: 720,
    income: 85000,
    zip: '10001',
    debtRatio: 28,
    employment: 6,
  };

  // Values based on active toggle — accepts explicit toggle to avoid stale closures
  const getDemoData = (toggle = activeToggle) => {
    switch (toggle) {
      case 'Race':
        return {
          name: 'Darnell Washington',
          featureChanges: { 'Zip Code': -0.38, 'Credit Score': 0.38, 'Income': 0.29, 'Employment': 0.11, 'Debt Ratio': -0.15 },
          fairnessScore: 61.8,
          delta: -32.4,
          geminiText: "This applicant was 34% less likely to be approved primarily because of zip code [10001], which correlates strongly with race in this dataset based on historical lending patterns. Credit score (720), income ($85,000), debt ratio (28%), and employment history (6 years) were statistically identical to the approved profile. The decision delta of −32.4 points exceeds the configured counterfactual fairness threshold of ±10 points. Zip code should be evaluated for removal as a feature, as it introduces a proxy variable for protected demographic characteristics.\n\nRemediation suggestion: Consider removing zip code as a predictive feature, or apply geographic disparity correction via Vertex AI fairness constraints."
        };
      case 'Gender':
        return {
          name: 'Sarah Smith',
          featureChanges: { 'Employment': -0.22, 'Income': 0.20, 'Credit Score': 0.40, 'Debt Ratio': -0.18, 'Zip Code': -0.05 },
          fairnessScore: 82.1,
          delta: -12.1,
          geminiText: "This applicant was 12% less likely to be approved. While credit and income are identical, the model heavily penalized the 'Employment History' feature despite it being identical (6 years) to the baseline profile. This suggests the model has learned a correlation between gender and employment stability that unfairly disadvantages female applicants.\n\nRemediation suggestion: Audit the employment history weights in LendAI-v2.3, and consider adding Equal Opportunity constraints during the next Vertex AI Retraining cycle."
        };
      case 'Age':
        return {
          name: 'James Smith (Senior)',
          featureChanges: { 'Debt Ratio': -0.31, 'Age (derived)': -0.25, 'Credit Score': 0.35, 'Income': 0.25, 'Employment': 0.15 },
          fairnessScore: 74.5,
          delta: -19.7,
          geminiText: "The applicant was penalized due to an age-proxy variable strongly linked to the 'Debt Ratio' and derived age features. Despite identical financial health indicators, older applicants in this bracket are facing a −19.7 point penalty, exceeding the ±10 point threshold.\n\nRemediation suggestion: Review age-based risk assessments for compliance with ECOA guidelines. Adjust threshold parameters in the Policy Engine."
        };
      default:
        return getDemoData('Race');
    }
  };


  const currentData = getDemoData();

  // Typewriter effect & API Call
  useEffect(() => {
    let intervalId;
    let isMounted = true;
    const abortController = new AbortController();

    // Snapshot current values at effect start to avoid stale closures
    const snapshot = getDemoData(activeToggle);
    const toggleSnapshot = activeToggle;

    const runGemini = async () => {
      setIsTyping(false);
      setIsLoading(true);
      setTypedText('');
      textRef.current = '';

      try {
        const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:8080';
        const response = await fetch(`${apiUrl}/api/intercept`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          signal: abortController.signal,
          body: JSON.stringify({
            name: snapshot.name,
            activeToggle: toggleSnapshot,
            originalScore: 91.4,
            counterfactualScore: snapshot.fairnessScore,
            delta: snapshot.delta
          })
        });

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const result = await response.json();
        if (!isMounted) return;

        // Push REAL notification — decision blocked via Gemini
        addNotification({
          type: 'blocked',
          title: `Decision Blocked — ${snapshot.name}`,
          body: `${toggleSnapshot} swap caused a ${snapshot.delta}% score delta. Gemini audit narrative logged to Firebase RTDB.`,
        });
        
        const fullText = result.narrative || snapshot.geminiText; // guard null
        setIsLoading(false);
        setIsTyping(true);
        textRef.current = '';
        
        let i = 0;
        intervalId = setInterval(() => {
          if (!isMounted) { clearInterval(intervalId); return; }
          textRef.current += fullText.charAt(i);
          setTypedText(textRef.current);
          i++;
          if (i >= fullText.length) {
            clearInterval(intervalId);
            setIsTyping(false);
          }
        }, TYPEWRITER_SPEED);

      } catch (error) {
        if (error.name === 'AbortError') return; // Ignore aborted requests
        console.warn("[EQUA] Gemini backend unavailable, using local fallback:", error.message);

        if (!isMounted) return;

        // Immediately use local fallback — no artificial delay
        const fallbackText = snapshot.geminiText;
        setIsLoading(false);
        setIsTyping(true);
        textRef.current = '';
        let i = 0;
        intervalId = setInterval(() => {
          if (!isMounted) { clearInterval(intervalId); return; }
          textRef.current += fallbackText.charAt(i);
          setTypedText(textRef.current);
          i++;
          if (i >= fallbackText.length) {
            clearInterval(intervalId);
            setIsTyping(false);
          }
        }, TYPEWRITER_SPEED);
      }
    };

    runGemini();

    return () => {
      isMounted = false;
      abortController.abort();
      if (intervalId) clearInterval(intervalId);
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeToggle]);

  const handleDemoRun = () => {
    setActiveToggle('Race');
    triggerToast('Loan #EQ-2026-04192 blocked — bias score 61.8. FCM push sent to Rahul Anand.');
    addNotification({
      type: 'blocked',
      title: 'Decision Blocked — Loan #EQ-2026-04192',
      body: `Compliance officer alert: Bias score 61.8 for ${currentData.name}. FCM push sent to Rahul Anand.`,
    });
  };

  return (
    <div className="flex w-full h-full">
      {/* Main Content Area */}
      <div className="flex-1 overflow-y-auto flex flex-col min-w-0">
        
        {/* Header */}
        <div className="px-6 py-5 flex justify-between items-start shrink-0">
          <div>
            <h2 className="font-plex font-medium text-lg text-eq-text">Counterfactual Identity Simulator</h2>
            <p className="font-sans text-sm text-eq-muted mt-1">Swap protected demographic attributes — watch the model's decision change in real-time. Powered by Gemini API (structured output mode) with JSON schema enforcement.</p>
          </div>
          <div className="flex gap-3">
            <select className="bg-eq-panel border border-eq-border text-eq-text font-sans text-sm rounded px-3 py-1.5 outline-none focus:border-eq-blue">
              <option>Loan Decision</option>
              <option>Hiring Decision</option>
              <option>Medical Triage</option>
            </select>
            <button onClick={handleDemoRun} className="bg-eq-blue hover:bg-blue-500 text-white font-sans text-sm font-medium px-4 py-1.5 rounded relative overflow-hidden group">
              <div className="absolute inset-0 border border-white/40 group-hover:animate-[pulse-border-red_1s_infinite]" />
              Run Live Demo
            </button>
          </div>
        </div>

        {/* Intercept Banner */}
        <div className="mx-6 mb-6 bg-eq-flag-dim border border-eq-flag/40 rounded px-4 py-2 flex items-center gap-2">
          <span className="font-plex text-eq-flag text-xs leading-relaxed">
            ⚡ Decision Intercepted — ID {originalProfile.id} — Applicant: {originalProfile.name} — Held pending fairness review — {originalProfile.time}ms intercept latency — Source: {originalProfile.model} — Endpoint: api.equa.ai/intercept
          </span>
        </div>

        {/* Comparison Grid */}
        <div className="px-6 grid grid-cols-[1fr_auto_1fr] gap-6 items-stretch relative">
          
          {/* LEFT PANEL */}
          <div className="bg-eq-panel border border-eq-border rounded flex flex-col relative overflow-hidden">
            <div className="h-1 w-full bg-eq-blue absolute top-0 left-0" />
            <div className="p-4 border-b border-eq-border">
              <h3 className="font-plex text-sm text-eq-text font-medium mb-3">Original Profile</h3>
              <div className="grid grid-cols-[1.3fr_1fr] gap-y-2 gap-x-4">
                <div className="flex flex-col min-w-0"><span className="font-sans text-[11px] text-eq-muted">Name</span><span className="font-jet text-sm text-eq-text truncate">{originalProfile.name}</span></div>
                <div className="flex flex-col"><span className="font-sans text-[11px] text-eq-muted">Age / Gender</span><span className="font-jet text-sm text-eq-text">{originalProfile.age} | {originalProfile.gender}</span></div>
                <div className="flex flex-col"><span className="font-sans text-[11px] text-eq-muted">Credit Score</span><span className="font-jet text-sm text-eq-text">{originalProfile.creditScore}</span></div>
                <div className="flex flex-col"><span className="font-sans text-[11px] text-eq-muted">Income</span><span className="font-jet text-sm text-eq-text">${originalProfile.income.toLocaleString()}/yr</span></div>
                <div className="flex flex-col"><span className="font-sans text-[11px] text-eq-muted">Zip Code</span><span className="font-jet text-sm text-eq-text">{originalProfile.zip}</span></div>
                <div className="flex flex-col"><span className="font-sans text-[11px] text-eq-muted">{originalProfile.type} Amount</span><span className="font-jet text-sm text-eq-text">$45,000</span></div>
                <div className="flex flex-col"><span className="font-sans text-[11px] text-eq-muted">Debt Ratio</span><span className="font-jet text-sm text-eq-text">{originalProfile.debtRatio}%</span></div>
                <div className="flex flex-col"><span className="font-sans text-[11px] text-eq-muted">Employment</span><span className="font-jet text-sm text-eq-text">{originalProfile.employment} yrs</span></div>
              </div>
            </div>

            <div className="p-4 flex flex-col gap-4 flex-1">
              <div className={`flex justify-between items-center px-4 py-3 rounded ${originalProfile.score > 80 ? 'bg-eq-pass-dim border border-eq-pass/40 shadow-[0_0_12px_rgba(16,185,129,0.25)]' : originalProfile.score >= 60 ? 'bg-eq-flag-dim border border-eq-flag/40' : 'bg-eq-block-dim border border-eq-block/40'}`}>
                <span className={`font-plex text-lg font-semibold ${originalProfile.score > 80 ? 'text-eq-pass' : originalProfile.score >= 60 ? 'text-eq-flag' : 'text-eq-block'}`}>{originalProfile.score > 80 ? 'APPROVED' : originalProfile.score >= 60 ? 'FLAGGED' : 'DENIED'}</span>
                <span className={`font-sans text-xs ${originalProfile.score > 80 ? 'text-eq-pass' : originalProfile.score >= 60 ? 'text-eq-flag' : 'text-eq-block'}`}>Confidence: {originalProfile.score}%</span>
              </div>

              <div>
                <p className="font-sans text-[11px] text-eq-muted mb-2">Feature Attribution (Vertex AI Explainable AI)</p>
                <div className="flex flex-col gap-1.5">
                  <ShapBar label="Credit Score" val={0.42} base />
                  <ShapBar label="Income" val={0.31} base />
                  <ShapBar label="Employment" val={0.14} base />
                  <ShapBar label="Debt Ratio" val={-0.12} base />
                  <ShapBar label="Zip Code" val={-0.08} base />
                </div>
              </div>

              <div className="mt-auto pt-4 flex items-center gap-3">
                <div className="w-8 h-8 rounded-full border-2 border-eq-pass flex items-center justify-center shrink-0">
                  <span className="font-jet text-[10px] text-eq-pass font-bold">94</span>
                </div>
                <span className="font-plex text-sm text-eq-text">Fairness Score: 94.2 / 100</span>
              </div>
            </div>
          </div>

          {/* DISPARITY BADGE */}
          <div className="flex flex-col items-center justify-center relative z-10 w-8">
            <div className="w-[1px] bg-eq-border absolute top-0 bottom-0 left-1/2 -translate-x-1/2 -z-10" />
            <div className="bg-eq-panel border border-eq-border rounded-lg p-2 flex flex-col items-center shadow-xl animate-bounce-stamp whitespace-nowrap">
              <span className="font-jet text-[28px] text-eq-block leading-none">{currentData.delta > 0 ? '+' : ''}{currentData.delta} pts</span>
              <span className="font-sans text-[12px] text-eq-muted mt-1">Decision Probability Δ</span>
              <span className="font-plex text-[11px] text-eq-flag mt-0.5">Exceeds threshold (±10%)</span>
            </div>
          </div>

          {/* RIGHT PANEL */}
          <div className="bg-eq-panel border border-eq-block/30 rounded flex flex-col relative overflow-hidden shadow-[0_0_20px_rgba(239,68,68,0.08)]">
            <div className="h-1 w-full bg-eq-block absolute top-0 left-0" />
            
            <div className="p-3 border-b border-eq-border bg-eq-bg/50">
              <div className="flex items-center gap-3 justify-between mb-2">
                <span className="font-plex text-[11px] text-eq-muted uppercase tracking-wider">Protected Attribute Swap</span>
              </div>
              <div className="flex gap-2">
                <ToggleButton active={activeToggle==='Gender'} onClick={() => setActiveToggle('Gender')}>Gender: {originalProfile.gender === 'Male' ? 'M ↔ F' : 'F ↔ M'}</ToggleButton>
                <ToggleButton active={activeToggle==='Race'} onClick={() => setActiveToggle('Race')}>Race: W ↔ B</ToggleButton>
                <ToggleButton active={activeToggle==='Age'} onClick={() => setActiveToggle('Age')}>Age: {originalProfile.age} ↔ {originalProfile.age + 24}</ToggleButton>
              </div>
            </div>

            <div className="p-4 border-b border-eq-border">
              <div className="grid grid-cols-[1.3fr_1fr] gap-y-2 gap-x-4">
                <div className="flex flex-col min-w-0"><span className="font-sans text-[11px] text-eq-muted">Name</span><span className="font-jet text-sm text-eq-text bg-eq-block-dim px-1 rounded inline-block w-fit truncate transition-all">{currentData.name}</span></div>
                <div className="flex flex-col"><span className="font-sans text-[11px] text-eq-muted">Age / Gender</span><span className="font-jet text-sm text-eq-text transition-all">{activeToggle==='Age' ? (originalProfile.age + 24) : originalProfile.age} | {activeToggle==='Gender' ? (originalProfile.gender === 'Male' ? 'Female' : 'Male') : originalProfile.gender}</span></div>
                <div className="flex flex-col"><span className="font-sans text-[11px] text-eq-muted">Credit Score</span><span className="font-jet text-sm text-eq-text">{originalProfile.creditScore}</span></div>
                <div className="flex flex-col"><span className="font-sans text-[11px] text-eq-muted">Income</span><span className="font-jet text-sm text-eq-text">${originalProfile.income.toLocaleString()}/yr</span></div>
                <div className="flex flex-col"><span className="font-sans text-[11px] text-eq-muted">Zip Code</span><span className="font-jet text-sm text-eq-text">{originalProfile.zip}</span></div>
                <div className="flex flex-col"><span className="font-sans text-[11px] text-eq-muted">{originalProfile.type} Amount</span><span className="font-jet text-sm text-eq-text">$45,000</span></div>
                <div className="flex flex-col"><span className="font-sans text-[11px] text-eq-muted">Debt Ratio</span><span className="font-jet text-sm text-eq-text">{originalProfile.debtRatio}%</span></div>
                <div className="flex flex-col"><span className="font-sans text-[11px] text-eq-muted">Employment</span><span className="font-jet text-sm text-eq-text">{originalProfile.employment} yrs</span></div>
              </div>
            </div>

            <div className="p-4 flex flex-col gap-4 flex-1">
              <div className="flex justify-between items-center bg-eq-block-dim border border-eq-block/40 px-4 py-3 rounded animate-pulse-border-red">
                <span className="font-plex text-lg font-semibold text-eq-block">DENIED</span>
                <span className="font-sans text-xs text-eq-block">Confidence: 78.2%</span>
              </div>

              <div>
                <p className="font-sans text-[11px] text-eq-muted mb-2">Feature Attribution (Counterfactual)</p>
                <div className="flex flex-col gap-1.5">
                  <ShapBar label="Credit Score" val={currentData.featureChanges['Credit Score'] || 0.38} />
                  <ShapBar label="Income" val={currentData.featureChanges['Income'] || 0.29} />
                  <ShapBar label="Zip Code" val={currentData.featureChanges['Zip Code'] || -0.38} highlight={activeToggle==='Race'} />
                  <ShapBar label="Debt Ratio" val={currentData.featureChanges['Debt Ratio'] || -0.15} highlight={activeToggle==='Age'} />
                  <ShapBar label="Employment" val={currentData.featureChanges['Employment'] || 0.11} highlight={activeToggle==='Gender'} />
                </div>
              </div>

              <div className="mt-auto pt-4 flex items-center gap-3">
                <div className="w-8 h-8 rounded-full border-2 border-eq-block flex items-center justify-center shrink-0">
                  <span className="font-jet text-[10px] text-eq-block font-bold transition-all duration-700">{Math.round(currentData.fairnessScore)}</span>
                </div>
                <span className="font-plex text-sm text-eq-text">Fairness Score: <AnimatedNumber val={currentData.fairnessScore} /> / 100</span>
              </div>
            </div>
          </div>
        </div>

        {/* Gemini Narration */}
        <div className="mx-6 mt-6 bg-eq-panel border-l-[3px] border-l-eq-gemini rounded-r overflow-hidden relative">
          <div className="p-4">
            <div className="flex justify-between items-center mb-3">
              <div className="flex flex-col">
                <h4 className="font-plex text-[13px] text-eq-muted">Gemini Audit Narration</h4>
                <span className="font-sans text-[10px] text-eq-hint mt-0.5">Generated 0.3s ago — Decision #EQ-2026-04192</span>
              </div>
              <div className="flex items-center gap-1.5 text-eq-gemini bg-eq-gemini-dim px-2 py-1 rounded">
                <Sparkles className="w-3.5 h-3.5" />
                <span className="font-plex text-[11px] font-medium">✦ Gemini 2.0 Flash</span>
              </div>
            </div>
            
            <div className="font-sans text-[15px] text-eq-text leading-[1.7] min-h-[140px] whitespace-pre-wrap relative">
              {isLoading ? (
                <div className="absolute inset-0 flex items-center justify-center text-eq-gemini gap-2">
                  <Loader2 className="w-5 h-5 animate-spin" />
                  <span className="font-plex text-sm animate-pulse">Gemini 2.0 Flash is analyzing disparity...</span>
                </div>
              ) : (
                <>
                  {formatGeminiText(typedText)}
                  {isTyping && <span className="animate-cursor-blink text-eq-text font-bold">|</span>}
                </>
              )}
            </div>

            <div className="flex justify-end gap-3 mt-4 pt-4 border-t border-eq-border">
              <button className="px-3 py-1.5 text-[12px] font-sans text-eq-muted hover:text-eq-text border border-transparent hover:border-eq-border rounded transition-colors">
                📋 Export Gemini Narration PDF
              </button>
              <button className="px-4 py-1.5 text-[12px] font-sans text-eq-text border border-eq-border hover:bg-eq-surface rounded transition-colors">
                ⚪ Override & Approve with Note
              </button>
              <button onClick={handleDemoRun} className="px-4 py-1.5 text-[12px] font-sans text-white bg-eq-block hover:bg-red-600 rounded shadow-lg transition-colors">
                🔴 Block & Alert Compliance Officer
              </button>
            </div>
          </div>
        </div>

        {/* Certificate Strip */}
        <div className="mx-6 mt-6 mb-8 bg-eq-surface border border-eq-border rounded p-3 flex justify-between items-center animate-cert-stamp">
          <div className="flex items-center gap-3">
            <ShieldCheck className="w-5 h-5 text-eq-muted" />
            <div className="flex flex-col font-plex text-[11px] text-eq-text gap-0.5">
              <span>Certificate ID: #CERT-{originalProfile.id.replace('#', '')}-FLAGGED &nbsp;|&nbsp; Applicant: {originalProfile.name} &nbsp;|&nbsp; Status: <span className="text-eq-flag">FLAGGED FOR REVIEW</span> &nbsp;|&nbsp; Hash: ...a3f9c2b1</span>
              <span className="text-eq-muted">Metrics checked: Demographic Parity | Equal Opportunity | Counterfactual Fairness &nbsp;|&nbsp; Threshold: ±10% &nbsp;|&nbsp; Result: FAIL</span>
              <span className="text-eq-muted">Timestamp: {new Date().toISOString()}</span>
            </div>
          </div>
          <button
            onClick={() => {
              // Set the current profile as selectedDecision so Fairness Certificates shows it
              setSelectedDecision({
                ...originalProfile,
                status: originalProfile.score > 80 ? 'PASS' : originalProfile.score >= 60 ? 'FLAG' : 'BLOCK',
              });
              setActiveScreen('Fairness Certificates');
            }}
            className="font-sans text-[12px] text-eq-blue hover:text-blue-400 flex items-center gap-1 transition-colors"
          >
            View Full Certificate <ArrowRight className="w-3 h-3" />
          </button>
        </div>

      </div>

      {/* Right Sidebar - Live Feed */}
      <LiveFeedSidebar />
    </div>
  );
}

// Helpers

function ToggleButton({ active, onClick, children }) {
  return (
    <button 
      onClick={onClick}
      className={`font-plex text-[11px] px-3 py-1 rounded-full border transition-all duration-200
        ${active ? 'bg-eq-text text-eq-bg border-eq-text' : 'bg-transparent text-eq-muted border-eq-border hover:text-eq-text hover:border-eq-text'}`}
    >
      {children}
    </button>
  );
}

function ShapBar({ label, val, highlight = false, base = false }) {
  const isPos = val >= 0;
  const absVal = Math.abs(val);
  const widthPct = Math.min(absVal * 150, 100); // arbitrary scaling for demo
  
  return (
    <div className={`grid grid-cols-[100px_1fr_40px] items-center gap-2 group p-1 rounded transition-colors ${highlight ? 'bg-eq-block-dim border border-eq-block/30' : ''}`}>
      <span className={`font-sans text-[11px] ${highlight ? 'text-eq-block font-medium' : 'text-eq-muted'}`}>{label}</span>
      <div className="h-2.5 bg-eq-surface border border-eq-border rounded overflow-hidden flex relative">
        {/* Left fill for negative */}
        <div className="flex-1 flex justify-end">
          {!isPos && (
            <div 
              className={`h-full transition-all duration-600 ease-in-out-strict ${highlight ? 'bg-eq-block shadow-[0_0_8px_rgba(239,68,68,0.8)]' : 'bg-eq-block/80'}`} 
              style={{ width: `${widthPct}%` }} 
            />
          )}
        </div>
        {/* Center line */}
        <div className="w-[1px] h-full bg-eq-border shrink-0" />
        {/* Right fill for positive */}
        <div className="flex-1 flex justify-start">
          {isPos && (
            <div 
              className="h-full bg-eq-pass/80 transition-all duration-600 ease-in-out-strict" 
              style={{ width: `${widthPct}%` }} 
            />
          )}
        </div>
      </div>
      <span className={`font-jet text-[11px] text-right ${isPos ? 'text-eq-pass' : 'text-eq-block'} ${highlight ? 'font-bold' : ''}`}>
        {isPos ? '+' : ''}{val.toFixed(2)}
      </span>
    </div>
  );
}

function AnimatedNumber({ val }) {
  const [disp, setDisp] = useState(val);
  useEffect(() => {
    // Simple lerp animation
    const duration = 600;
    const steps = 20;
    const stepTime = duration / steps;
    const diff = val - disp;
    if (diff === 0) return;
    
    let currentStep = 0;
    const timer = setInterval(() => {
      currentStep++;
      setDisp(prev => {
        const next = prev + (diff / steps);
        if (currentStep >= steps) {
          clearInterval(timer);
          return val;
        }
        return next;
      });
    }, stepTime);
    return () => clearInterval(timer);
  }, [val]);

  return <span>{disp.toFixed(1)}</span>;
}

// Regex format Gemini Text to add colors to specific phrases
function formatGeminiText(text) {
  if (!text) return null;
  
  // Highlight rules
  const rules = [
    { regex: /(34% less likely|12% less likely)/g, class: "text-eq-flag font-medium" },
    { regex: /(zip code \[10001\])/g, class: "text-eq-block font-medium" },
    { regex: /(correlates strongly with race)/g, class: "text-eq-block font-medium" },
    { regex: /(−32.4 points|−19.7 point penalty)/g, class: "text-eq-block font-semibold" },
    { regex: /(Remediation suggestion:)/g, class: "text-eq-gemini font-plex font-medium" },
  ];

  let parts = [text];

  rules.forEach(rule => {
    let newParts = [];
    parts.forEach(part => {
      if (typeof part !== 'string') {
        newParts.push(part);
        return;
      }
      const split = part.split(rule.regex);
      for (let i = 0; i < split.length; i++) {
        if (split[i].match(rule.regex)) {
          newParts.push(<span key={i+Math.random()} className={rule.class}>{split[i]}</span>);
        } else if (split[i]) {
          newParts.push(split[i]);
        }
      }
    });
    parts = newParts;
  });

  return parts;
}

function LiveFeedSidebar() {
  const [collapsed, setCollapsed] = useState(false);
  const [feed, setFeed] = useState([
    { id: '#EQ-2026-04192', status: 'FLAG', latency: 247, type: 'Loan' },
    { id: '#EQ-2026-04191', status: 'PASS', latency: 183, type: 'Hiring' },
    { id: '#EQ-2026-04190', status: 'PASS', latency: 191, type: 'Medical' },
    { id: '#EQ-2026-04189', status: 'BLOCK', latency: 264, type: 'Loan' },
    { id: '#EQ-2026-04188', status: 'PASS', latency: 142, type: 'Loan' }
  ]);

  useEffect(() => {
    let idCounter = 4193;
    const timer = setInterval(() => {
      const types = ['Loan', 'Hiring', 'Medical'];
      const statuses = ['PASS', 'PASS', 'PASS', 'FLAG', 'BLOCK'];
      const newDecision = {
        id: `#EQ-2026-0${idCounter++}`,
        status: statuses[Math.floor(Math.random() * statuses.length)],
        latency: Math.floor(Math.random() * 120) + 140,
        type: types[Math.floor(Math.random() * types.length)],
        isNew: true
      };
      setFeed(prev => [newDecision, ...prev].slice(0, 8));
    }, Math.random() * 5000 + 3000); // 3-8s random
    return () => clearInterval(timer);
  }, []);

  if (collapsed) {
    return (
      <div className="w-10 border-l border-eq-border bg-eq-bg flex flex-col items-center py-4 shrink-0 transition-all">
        <button onClick={() => setCollapsed(false)} className="p-1 hover:bg-eq-surface rounded text-eq-muted">
          <ChevronRight className="w-4 h-4" />
        </button>
      </div>
    );
  }

  return (
    <div className="w-[300px] border-l border-eq-border bg-eq-bg flex flex-col shrink-0 transition-all overflow-hidden relative">
      <div className="p-4 border-b border-eq-border flex justify-between items-center bg-eq-surface">
        <div className="flex items-center gap-2">
          <Activity className="w-4 h-4 text-eq-muted" />
          <h3 className="font-plex text-sm text-eq-text">Live Intercept Feed</h3>
        </div>
        <button onClick={() => setCollapsed(true)} className="p-1 hover:bg-eq-panel rounded text-eq-muted">
          <ChevronRight className="w-4 h-4 rotate-180" />
        </button>
      </div>
      <div className="flex-1 overflow-y-auto p-3 flex flex-col gap-2">
        {feed.map((item, i) => (
          <div key={item.id} className={`bg-eq-panel border border-eq-border rounded p-2 flex items-center justify-between
            ${item.isNew ? 'animate-row-arrive' : ''}
          `}
          style={{ '--status-color': item.status === 'PASS' ? 'rgba(16,185,129,0.1)' : item.status === 'FLAG' ? 'rgba(245,158,11,0.1)' : 'rgba(239,68,68,0.1)' }}
          >
            <div className="flex flex-col gap-1">
              <span className="font-plex text-[11px] text-eq-text">{item.id}</span>
              <span className="font-sans text-[10px] text-eq-muted">{item.type}</span>
            </div>
            <div className="flex flex-col items-end gap-1">
              <span className={`font-plex text-[9px] px-1.5 py-0.5 rounded font-bold
                ${item.status === 'PASS' ? 'bg-eq-pass-dim text-eq-pass border border-eq-pass/20' : 
                  item.status === 'FLAG' ? 'bg-eq-flag-dim text-eq-flag border border-eq-flag/20' : 
                  'bg-eq-block-dim text-eq-block border border-eq-block/20'}`}
              >
                {item.status}
              </span>
              <span className="font-jet text-[10px] text-eq-text">{item.latency}ms</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
