import React from 'react';
import { Search, ShieldCheck, Download, ExternalLink, ShieldAlert, ShieldX } from 'lucide-react';

export default function FairnessCertificates() {
  return (
    <div className="flex flex-col w-full h-full p-6 bg-eq-bg gap-6 overflow-y-auto">
      {/* Header */}
      <div className="flex justify-between items-start shrink-0">
        <div className="flex flex-col gap-1 w-2/3">
          <h2 className="font-plex font-medium text-lg text-eq-text">Fairness Certificate Registry</h2>
        </div>
        <div className="flex gap-3">
          <button className="flex items-center gap-2 px-3 py-1.5 font-sans text-[12px] font-medium text-eq-bg bg-eq-text rounded hover:bg-gray-200">
            Export to BigQuery <ExternalLink className="w-3 h-3" />
          </button>
          <button className="flex items-center gap-2 px-3 py-1.5 font-sans text-[12px] text-eq-text bg-eq-surface border border-eq-border rounded hover:bg-eq-panel">
            Download CSV
          </button>
        </div>
      </div>

      {/* Search */}
      <div className="bg-eq-panel border border-eq-border rounded px-4 py-2 flex items-center gap-3 shrink-0">
        <Search className="w-4 h-4 text-eq-muted" />
        <input 
          type="text" 
          placeholder="Search certificates by ID, hash, applicant, model, or date..." 
          className="bg-transparent border-none outline-none font-plex text-[13px] text-eq-text w-full placeholder-eq-hint"
        />
      </div>

      {/* Certificates List */}
      <div className="flex flex-col gap-6">
        
        {/* Certificate 1 - PASS */}
        <CertificateCard 
          status="VERIFIED" 
          id="#CERT-EQ-2026-04197-PASS"
          decisionId="Loan Application #LN-2026-04197"
          applicant="Raj M."
          model="LendAI-v2.3.1"
          timestamp="2026-04-20T14:31:52.219Z"
          metrics={[
            { name: "Demographic Parity", status: "PASS", val: "+0.8%", thresh: "≤10%" },
            { name: "Equal Opportunity", status: "PASS", val: "+1.2%", thresh: "≤10%" },
            { name: "Counterfactual Fairness", status: "PASS", val: "+4.3pts", thresh: "≤10pts" }
          ]}
          score="91.7/100"
          latency="201ms"
          hash="3d7a9f...c2b1a3f9"
        />

        {/* Certificate 2 - FLAGGED */}
        <CertificateCard 
          status="FLAGGED — PENDING REVIEW" 
          id="#CERT-EQ-2026-04192-FLAGGED"
          decisionId="Loan Application #LN-2026-04192"
          applicant="James S."
          model="LendAI-v2.3.1"
          timestamp="2026-04-20T14:32:07.483Z"
          metrics={[
            { name: "Demographic Parity", status: "PASS", val: "-2.8%", thresh: "≤10%" },
            { name: "Equal Opportunity", status: "PASS", val: "-4.2%", thresh: "≤10%" },
            { name: "Counterfactual Fairness", status: "FAIL", val: "−32.4pts", thresh: "±10pts" }
          ]}
          score="61.8/100"
          latency="247ms"
          hash="9f8b7c...e4d3b2a1"
        />

        {/* Certificate 3 - BLOCKED */}
        <CertificateCard 
          status="BLOCKED — DECISION HELD" 
          id="#CERT-EQ-2026-04194-BLOCK"
          decisionId="Loan Application #LN-2026-04194"
          applicant="Darnell W."
          model="LendAI-v2.3.1"
          timestamp="2026-04-20T14:35:12.105Z"
          metrics={[
            { name: "Demographic Parity", status: "FAIL", val: "-14.8%", thresh: "≤10%" },
            { name: "Equal Opportunity", status: "FAIL", val: "-18.2%", thresh: "≤10%" },
            { name: "Counterfactual Fairness", status: "FAIL", val: "−58.4pts", thresh: "±10pts" }
          ]}
          score="41.2/100"
          latency="264ms"
          hash="1a2b3c...4d5e6f7g"
          extraMsg="Compliance officer notified via FCM push at 14:35:12"
        />

      </div>

      {/* Bottom Stat Strip */}
      <div className="mt-auto pt-6 pb-2 shrink-0">
        <p className="font-plex text-[11px] text-eq-muted text-center">
          2,756 certificates issued today | 0 tampered | 100% verifiable | BigQuery: 1.2M total records | Last export: 2 hours ago
        </p>
      </div>
    </div>
  );
}

function CertificateCard({ status, id, decisionId, applicant, model, timestamp, metrics, score, latency, hash, extraMsg }) {
  const isPass = status === "VERIFIED";
  const isBlock = status.includes("BLOCKED");
  const isFlag = status.includes("FLAGGED");

  const borderColor = isPass ? 'border-eq-border' : isBlock ? 'border-eq-block/50 shadow-[0_0_15px_rgba(239,68,68,0.05)]' : 'border-eq-flag/50 shadow-[0_0_15px_rgba(245,158,11,0.05)]';
  const Icon = isPass ? ShieldCheck : isBlock ? ShieldX : ShieldAlert;
  const iconColor = isPass ? 'text-eq-pass' : isBlock ? 'text-eq-block' : 'text-eq-flag';
  const badgeClass = isPass ? 'bg-eq-pass-dim text-eq-pass border border-eq-pass/20' : 
                     isBlock ? 'bg-eq-block-dim text-eq-block border border-eq-block/20' : 
                     'bg-eq-flag-dim text-eq-flag border border-eq-flag/20';

  return (
    <div className={`bg-eq-panel border ${borderColor} rounded-lg p-5 flex flex-col gap-4 animate-cert-stamp`}>
      {/* Cert Header */}
      <div className="flex justify-between items-start border-b border-eq-border pb-3">
        <div className="flex items-center gap-3">
          <Icon className={`w-6 h-6 ${iconColor}`} />
          <div className="flex flex-col">
            <span className="font-plex text-[14px] font-medium text-eq-text">FAIRNESS CERTIFICATE</span>
            <span className="font-plex text-[12px] text-eq-muted">{id}</span>
          </div>
        </div>
        <div className={`font-plex text-[11px] px-2 py-1 rounded font-bold uppercase ${badgeClass}`}>
          {isPass ? '● ' : ''}{status}
        </div>
      </div>

      {/* Main Info */}
      <div className="grid grid-cols-2 gap-4">
        <div className="flex flex-col gap-1 font-plex text-[12px]">
          <span className="text-eq-text">Decision: <span className="text-eq-muted">{decisionId}</span></span>
          <span className="text-eq-text">Applicant: <span className="text-eq-muted">{applicant}</span> | Model: <span className="text-eq-muted">{model}</span></span>
          <span className="text-eq-text">Timestamp: <span className="text-eq-muted">{timestamp}</span></span>
        </div>
        
        <div className="bg-eq-surface border border-eq-border rounded p-3 flex flex-col gap-2">
          <span className="font-plex text-[11px] text-eq-muted uppercase">Fairness Metrics:</span>
          {metrics.map((m, i) => (
            <div key={i} className="flex justify-between items-center font-plex text-[11px]">
              <span className="text-eq-text">{m.name}</span>
              <div className="flex gap-3 text-right">
                <span className={m.status === 'PASS' ? 'text-eq-pass' : 'text-eq-block'}>{m.status === 'PASS' ? '✓ PASS' : '✗ FAIL'}</span>
                <span className="text-eq-muted w-16">Δ = {m.val}</span>
                <span className="text-eq-hint w-20">({m.thresh})</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {extraMsg && (
        <div className="bg-eq-block-dim border border-eq-block/30 rounded px-3 py-2 font-plex text-[11px] text-eq-block">
          🔴 {extraMsg}
        </div>
      )}

      {/* Footer Info */}
      <div className="flex flex-col gap-2 pt-3 border-t border-eq-border font-plex text-[11px]">
        <div className="flex justify-between text-eq-text">
          <span>Score: {score} <span className="text-eq-muted ml-4">Intercept: {latency}</span></span>
          <span>Hash (SHA-256): {hash}</span>
        </div>
        <div className="flex justify-between text-eq-muted">
          <span>KMS Signature: a8f3b2c1d4e5f6a7...</span>
          <span>BigQuery Row ID: bq://equa-prod/decisions/2026-{id.split('-')[2]}</span>
        </div>
      </div>

      {/* Actions */}
      <div className="flex gap-3 pt-2">
        <button className="font-sans text-[11px] text-eq-blue hover:underline">View Raw JSON</button>
        <button className="font-sans text-[11px] text-eq-blue hover:underline">Verify Signature</button>
        <button className="font-sans text-[11px] text-eq-blue hover:underline">Download PDF</button>
      </div>
    </div>
  );
}
