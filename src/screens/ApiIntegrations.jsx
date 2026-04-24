import React, { useState } from 'react';
import { Terminal, Copy, CheckCircle2, Plus, ArrowRight, Play } from 'lucide-react';

export default function ApiIntegrations() {
  const [showModal, setShowModal] = useState(false);
  const [copied, setCopied] = useState(false);

  const codeSnippet = `// Before EQUA (your existing integration):
const decision = await yourAIModel.predict(applicantData);
await notifyUser(decision);

// After EQUA (add ONE line — that's it):
const decision = await yourAIModel.predict(applicantData);
const fair = await fetch('https://api.equa.ai/intercept', {
  method: 'POST',
  body: JSON.stringify({ decision, applicant: applicantData }),
  headers: { 'Authorization': 'Bearer YOUR_EQUA_KEY' }
});
// EQUA handles interception, scoring, certificates, logging
await notifyUser(fair.result);  // Only reaches user if PASS`;

  const copyCode = () => {
    navigator.clipboard.writeText(codeSnippet);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="flex flex-col w-full h-full p-6 bg-eq-bg gap-6 overflow-y-auto">
      
      {/* Header */}
      <div>
        <h2 className="font-plex font-medium text-lg text-eq-text">API Integrations</h2>
        <p className="font-sans text-sm text-eq-muted mt-1">Connect any AI decision system via webhook — one line of code. Compatible with any model, any platform.</p>
      </div>

      <div className="grid grid-cols-[1fr_350px] gap-6 items-start">
        
        {/* Main Content */}
        <div className="flex flex-col gap-6">
          
          {/* Code Snippet Card */}
          <div className="bg-[#0D1117] border border-eq-border rounded-lg overflow-hidden relative">
            <div className="flex justify-between items-center px-4 py-2 bg-eq-panel border-b border-eq-border">
              <div className="flex items-center gap-2">
                <Terminal className="w-4 h-4 text-eq-muted" />
                <span className="font-plex text-[12px] text-eq-muted">Integration Snippet</span>
              </div>
              <button onClick={copyCode} className="flex items-center gap-1.5 text-[11px] font-sans text-eq-muted hover:text-eq-text">
                {copied ? <CheckCircle2 className="w-3.5 h-3.5 text-eq-pass" /> : <Copy className="w-3.5 h-3.5" />}
                {copied ? 'Copied' : 'Copy'}
              </button>
            </div>
            <div className="p-4 overflow-x-auto">
              <pre className="font-jet text-[13px] leading-[1.6] text-gray-300">
                <span className="text-gray-500">// Before EQUA (your existing integration):</span>{'\n'}
                <span className="text-purple-400">const</span> decision = <span className="text-blue-400">await</span> yourAIModel.<span className="text-yellow-200">predict</span>(applicantData);{'\n'}
                <span className="text-blue-400">await</span> <span className="text-yellow-200">notifyUser</span>(decision);{'\n\n'}
                <span className="text-gray-500">// After EQUA (add ONE line — that's it):</span>{'\n'}
                <span className="text-purple-400">const</span> decision = <span className="text-blue-400">await</span> yourAIModel.<span className="text-yellow-200">predict</span>(applicantData);{'\n'}
                <span className="text-purple-400">const</span> fair = <span className="text-blue-400">await</span> <span className="text-yellow-200">fetch</span>(<span className="text-green-300">'https://api.equa.ai/intercept'</span>, {'{\n'}
                {'  '}method: <span className="text-green-300">'POST'</span>,{'\n'}
                {'  '}body: <span className="text-[#3B82F6]">JSON</span>.<span className="text-yellow-200">stringify</span>({'{'} decision, applicant: applicantData {'}'}),{'\n'}
                {'  '}headers: {'{'} <span className="text-green-300">'Authorization'</span>: <span className="text-green-300">'Bearer YOUR_EQUA_KEY'</span> {'}'}{'\n'}
                {'}'});{'\n'}
                <span className="text-gray-500">// EQUA handles interception, scoring, certificates, logging</span>{'\n'}
                <span className="text-blue-400">await</span> <span className="text-yellow-200">notifyUser</span>(fair.result);  <span className="text-gray-500">// Only reaches user if PASS</span>
              </pre>
            </div>
          </div>

          {/* Connected Models Grid */}
          <div>
            <h3 className="font-plex text-[14px] text-eq-text mb-4">Connected Models</h3>
            <div className="grid grid-cols-2 gap-4">
              <ModelCard name="LendAI v2.3.1" active decisions="1,847" />
              <ModelCard name="HRModel v3.1" active decisions="743" />
              <ModelCard name="TriageBot v1.8" active decisions="257" />
              
              <button 
                onClick={() => setShowModal(true)}
                className="bg-eq-bg border border-dashed border-eq-blue/50 hover:border-eq-blue rounded-lg p-5 flex flex-col items-center justify-center gap-2 transition-colors group h-[104px]"
              >
                <Plus className="w-6 h-6 text-eq-blue group-hover:scale-110 transition-transform" />
                <span className="font-sans text-[13px] text-eq-blue font-medium">Connect New Model</span>
              </button>
            </div>
          </div>

          {/* Supported Systems */}
          <div className="pt-4 border-t border-eq-border">
            <span className="font-sans text-[12px] text-eq-muted mb-3 block">Compatible with:</span>
            <div className="flex gap-3">
              <Badge label="Salesforce" />
              <Badge label="Workday" />
              <Badge label="Epic (Healthcare)" />
              <Badge label="SAP" />
              <Badge label="Custom API" />
            </div>
          </div>
        </div>

        {/* Right Sidebar - Latency Monitor */}
        <div className="bg-eq-panel border border-eq-border rounded p-5 flex flex-col gap-4">
          <div className="flex justify-between items-center">
            <h3 className="font-plex text-[13px] text-eq-text">Response Time Monitor</h3>
            <span className="font-sans text-[10px] text-eq-pass flex items-center gap-1"><CheckCircle2 className="w-3 h-3" /> All within 300ms SLA</span>
          </div>
          <LatencySparkline name="LendAI v2.3.1" avg="187ms" />
          <LatencySparkline name="HRModel v3.1" avg="142ms" />
          <LatencySparkline name="TriageBot v1.8" avg="210ms" />
        </div>
      </div>

      {/* Onboarding Modal */}
      {showModal && <OnboardingModal onClose={() => setShowModal(false)} />}
    </div>
  );
}

function ModelCard({ name, active, decisions }) {
  return (
    <div className="bg-eq-panel border border-eq-border rounded-lg p-4 flex flex-col gap-3 h-[104px] justify-between">
      <div className="flex justify-between items-start">
        <span className="font-plex text-[14px] text-eq-text font-medium">{name}</span>
        <div className="flex items-center gap-1.5 bg-eq-pass-dim border border-eq-pass/20 px-2 py-0.5 rounded">
          <div className="w-1.5 h-1.5 rounded-full bg-eq-pass" />
          <span className="font-sans text-[10px] text-eq-pass">Active</span>
        </div>
      </div>
      <div className="flex flex-col">
        <span className="font-jet text-[16px] text-eq-text">{decisions}</span>
        <span className="font-sans text-[11px] text-eq-muted">decisions today</span>
      </div>
    </div>
  );
}

function Badge({ label }) {
  return (
    <div className="px-3 py-1.5 bg-eq-surface border border-eq-border rounded font-sans text-[12px] text-eq-muted">
      {label}
    </div>
  );
}

function LatencySparkline({ name, avg }) {
  return (
    <div className="flex flex-col gap-1 border-b border-eq-border/50 pb-3 last:border-0 last:pb-0">
      <div className="flex justify-between items-center">
        <span className="font-sans text-[12px] text-eq-muted">{name}</span>
        <span className="font-jet text-[12px] text-eq-pass">{avg}</span>
      </div>
      <div className="h-6 w-full mt-1 opacity-70">
        <svg viewBox="0 0 100 20" className="w-full h-full" preserveAspectRatio="none">
          <path d="M0,10 L10,8 L20,12 L30,5 L40,15 L50,8 L60,10 L70,4 L80,12 L90,6 L100,10" fill="none" stroke="var(--color-eq-pass)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </div>
    </div>
  );
}

function OnboardingModal({ onClose }) {
  const [step, setStep] = useState(1);
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm">
      <div className="bg-eq-panel border border-eq-border rounded-xl shadow-2xl w-[560px] flex flex-col relative animate-slide-down">
        
        <div className="p-6 border-b border-eq-border">
          <h2 className="font-plex text-xl text-eq-text">Connect Your Organization</h2>
          <p className="font-sans text-[13px] text-eq-muted mt-1">3 steps. Under 10 minutes. No ML team required.</p>
        </div>

        <div className="p-6">
          {step === 1 && (
            <div className="flex flex-col gap-4">
              <h3 className="font-plex text-[14px] text-eq-text">Step 1: Upload Historical Decisions</h3>
              <p className="font-sans text-[13px] text-eq-muted">Upload 6 months of historical decisions (CSV/JSON). Vertex AI AutoML will train a fairness baseline specific to your organization's decision patterns.</p>
              
              <div className="border-2 border-dashed border-eq-border rounded-lg p-8 flex flex-col items-center justify-center gap-3 bg-eq-surface cursor-pointer hover:border-eq-blue transition-colors group">
                <div className="w-12 h-12 bg-eq-panel rounded-full flex items-center justify-center group-hover:scale-110 transition-transform">
                  <ArrowRight className="w-5 h-5 text-eq-muted group-hover:text-eq-blue -rotate-90" />
                </div>
                <span className="font-sans text-[13px] text-eq-text font-medium">Drop CSV here or click to browse</span>
              </div>
            </div>
          )}

          {step === 2 && (
            <div className="flex flex-col gap-4">
              <h3 className="font-plex text-[14px] text-eq-text">Step 2: Configure Protected Attributes</h3>
              <p className="font-sans text-[13px] text-eq-muted mb-2">Which attributes should EQUA monitor for bias?</p>
              
              <div className="grid grid-cols-2 gap-4">
                {['Race', 'Gender', 'Age', 'Zip Code', 'Disability'].map(a => (
                  <label key={a} className="flex items-center gap-2 cursor-pointer">
                    <input type="checkbox" defaultChecked className="accent-eq-blue w-4 h-4" />
                    <span className="font-sans text-[13px] text-eq-text">{a}</span>
                  </label>
                ))}
              </div>
            </div>
          )}

          {step === 3 && (
            <div className="flex flex-col gap-4">
              <h3 className="font-plex text-[14px] text-eq-text">Step 3: Add the Webhook (One Line)</h3>
              <p className="font-sans text-[13px] text-eq-muted mb-2">Paste this endpoint into your existing AI decision webhook. That's it. EQUA is now live.</p>
              
              <div className="bg-[#0D1117] border border-eq-border rounded-lg p-4 font-jet text-[13px]">
                <span className="text-green-300">POST</span> https://api.equa.ai/intercept<br/>
                <span className="text-blue-300">Authorization:</span> Bearer [YOUR_KEY_HERE]
              </div>
            </div>
          )}
        </div>

        <div className="p-4 border-t border-eq-border flex justify-between items-center bg-eq-surface rounded-b-xl">
          <span className="font-plex text-[11px] text-eq-muted">Step {step} of 3</span>
          <div className="flex gap-3">
            <button onClick={onClose} className="px-4 py-2 font-sans text-[13px] text-eq-muted hover:text-eq-text border border-transparent rounded">
              Cancel
            </button>
            {step < 3 ? (
              <button onClick={() => setStep(step+1)} className="flex items-center gap-1.5 px-5 py-2 font-sans text-[13px] font-medium text-white bg-eq-blue hover:bg-blue-500 rounded transition-colors">
                Continue <ArrowRight className="w-3.5 h-3.5" />
              </button>
            ) : (
              <button onClick={onClose} className="flex items-center gap-1.5 px-5 py-2 font-sans text-[13px] font-medium text-white bg-eq-pass hover:bg-green-500 rounded transition-colors">
                Finish Setup <CheckCircle2 className="w-3.5 h-3.5" />
              </button>
            )}
          </div>
        </div>

      </div>
    </div>
  );
}
