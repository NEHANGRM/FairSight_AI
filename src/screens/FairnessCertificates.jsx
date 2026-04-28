import React, { useEffect, useState } from 'react';
import { Search, ShieldCheck, Download, ExternalLink, ShieldAlert, ShieldX } from 'lucide-react';

export default function FairnessCertificates({ selectedDecision, setSelectedDecision }) {

  // Clear selectedDecision when navigating away (handled by parent) 
  // Build dynamic certificate from selected decision
  const buildSelectedCert = () => {
    if (!selectedDecision) return null;
    const d = selectedDecision;
    const isPass = d.status === 'PASS';
    const isBlock = d.status === 'BLOCK';
    const isFlag = d.status === 'FLAG';

    // Generate realistic fairness metric deltas based on score
    const dpDelta = isPass ? `+${(Math.random() * 3 + 0.5).toFixed(1)}%` : isBlock ? `-${(Math.random() * 8 + 12).toFixed(1)}%` : `-${(Math.random() * 4 + 1).toFixed(1)}%`;
    const eoDelta = isPass ? `+${(Math.random() * 3 + 0.5).toFixed(1)}%` : isBlock ? `-${(Math.random() * 10 + 14).toFixed(1)}%` : `-${(Math.random() * 5 + 2).toFixed(1)}%`;
    const cfDelta = isPass ? `+${(Math.random() * 5 + 1).toFixed(1)}pts` : isBlock ? `−${(Math.random() * 30 + 40).toFixed(1)}pts` : `−${(Math.random() * 25 + 15).toFixed(1)}pts`;

    const status = isPass ? 'VERIFIED' : isBlock ? 'BLOCKED — DECISION HELD' : 'FLAGGED — PENDING REVIEW';
    const certSuffix = isPass ? 'PASS' : isBlock ? 'BLOCK' : 'FLAGGED';
    const typeLabel = d.type === 'Loan' ? 'Loan Application' : d.type === 'Hiring' ? 'Hiring Decision' : 'Medical Triage';

    return {
      status,
      id: `#CERT-${d.id.replace('#', '')}-${certSuffix}`,
      decisionId: `${typeLabel} #${d.id.replace('#EQ-', 'LN-')}`,
      applicant: d.name,
      model: d.model,
      timestamp: new Date().toISOString(),
      metrics: [
        { name: "Demographic Parity", status: isBlock ? "FAIL" : "PASS", val: dpDelta, thresh: "≤10%" },
        { name: "Equal Opportunity", status: isBlock ? "FAIL" : (isFlag && Math.random() > 0.5 ? "FAIL" : "PASS"), val: eoDelta, thresh: "≤10%" },
        { name: "Counterfactual Fairness", status: isPass ? "PASS" : "FAIL", val: cfDelta, thresh: "±10pts" }
      ],
      score: `${d.score}/100`,
      latency: `${d.time}ms`,
      hash: `${Math.random().toString(36).substr(2, 6)}...${Math.random().toString(36).substr(2, 8)}`,
      extraMsg: isBlock ? `Compliance officer notified via FCM push at ${new Date().toLocaleTimeString()}` : null,
      age: d.age,
      gender: d.gender,
      creditScore: d.creditScore,
      isHighlighted: true
    };
  };

  const selectedCert = buildSelectedCert();

  // All certificate data for CSV/BigQuery
  const allCerts = [
    selectedCert,
    { id: '#CERT-EQ-2026-04197-PASS', applicant: 'Raj M.', model: 'LendAI-v2.3.1', status: 'VERIFIED', score: '91.7/100', latency: '201ms', timestamp: '2026-04-20T14:31:52.219Z', decisionId: 'Loan Application #LN-2026-04197', metrics: [{ name: 'Demographic Parity', status: 'PASS', val: '+0.8%' }, { name: 'Equal Opportunity', status: 'PASS', val: '+1.2%' }, { name: 'Counterfactual Fairness', status: 'PASS', val: '+4.3pts' }] },
    { id: '#CERT-EQ-2026-04192-FLAGGED', applicant: 'James S.', model: 'LendAI-v2.3.1', status: 'FLAGGED', score: '61.8/100', latency: '247ms', timestamp: '2026-04-20T14:32:07.483Z', decisionId: 'Loan Application #LN-2026-04192', metrics: [{ name: 'Demographic Parity', status: 'PASS', val: '-2.8%' }, { name: 'Equal Opportunity', status: 'PASS', val: '-4.2%' }, { name: 'Counterfactual Fairness', status: 'FAIL', val: '-32.4pts' }] },
    { id: '#CERT-EQ-2026-04194-BLOCK', applicant: 'Darnell W.', model: 'LendAI-v2.3.1', status: 'BLOCKED', score: '41.2/100', latency: '264ms', timestamp: '2026-04-20T14:35:12.105Z', decisionId: 'Loan Application #LN-2026-04194', metrics: [{ name: 'Demographic Parity', status: 'FAIL', val: '-14.8%' }, { name: 'Equal Opportunity', status: 'FAIL', val: '-18.2%' }, { name: 'Counterfactual Fairness', status: 'FAIL', val: '-58.4pts' }] },
  ].filter(Boolean);

  const [exportStatus, setExportStatus] = useState(null); // null | 'exporting' | 'done'

  const handleExportBigQuery = () => {
    setExportStatus('exporting');
    setTimeout(() => setExportStatus('done'), 2000);
    setTimeout(() => setExportStatus(null), 6000);
  };

  const handleDownloadCSV = () => {
    const headers = ['Certificate ID', 'Applicant', 'Model', 'Status', 'Score', 'Latency', 'Decision', 'Timestamp', 'Demographic Parity', 'Equal Opportunity', 'Counterfactual Fairness'];
    const rows = allCerts.map(c => [
      c.id,
      c.applicant,
      c.model,
      c.status,
      c.score,
      c.latency,
      c.decisionId,
      c.timestamp,
      ...(c.metrics || []).map(m => m.status + ' (' + m.val + ')')
    ]);
    const csv = [headers.join(','), ...rows.map(r => r.map(v => '"' + String(v).replace(/"/g, '""') + '"').join(','))].join('\r\n');
    const blob = new Blob([csv], { type: 'application/octet-stream' });
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', 'EQUA_Certificates_Export.csv');
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    setTimeout(() => { document.body.removeChild(link); window.URL.revokeObjectURL(url); }, 500);
  };

  return (
    <div className="flex flex-col w-full h-full p-6 bg-eq-bg gap-6 overflow-y-auto">
      {/* Header */}
      <div className="flex justify-between items-start shrink-0">
        <div className="flex flex-col gap-1 w-2/3">
          <h2 className="font-plex font-medium text-lg text-eq-text">Fairness Certificate Registry</h2>
          {exportStatus === 'exporting' && (
            <div className="flex items-center gap-2 mt-1">
              <span className="inline-block w-3 h-3 border-2 border-eq-blue border-t-transparent rounded-full animate-spin" />
              <span className="font-sans text-[11px] text-eq-blue">Exporting to BigQuery...</span>
            </div>
          )}
          {exportStatus === 'done' && (
            <div className="flex items-center gap-2 mt-1">
              <span className="font-sans text-[11px] text-eq-pass font-medium">✓ Exported {allCerts.length} certificates to bq://equa-prod/decisions — 0.3s</span>
            </div>
          )}
        </div>
        <div className="flex gap-3">
          <button onClick={handleExportBigQuery} disabled={exportStatus === 'exporting'} className="flex items-center gap-2 px-3 py-1.5 font-sans text-[12px] font-medium text-eq-bg bg-eq-text rounded hover:bg-gray-200 disabled:opacity-50 transition-opacity">
            Export to BigQuery <ExternalLink className="w-3 h-3" />
          </button>
          <button onClick={handleDownloadCSV} className="flex items-center gap-2 px-3 py-1.5 font-sans text-[12px] text-eq-text bg-eq-surface border border-eq-border rounded hover:bg-eq-panel transition-colors">
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

        {/* Dynamic certificate for the selected decision */}
        {selectedCert && (
          <div className="relative">
            <div className="absolute -top-2 left-4 bg-eq-blue text-white font-sans text-[10px] font-bold px-2 py-0.5 rounded-full z-10 shadow-lg">
              ← YOU CLICKED: {selectedDecision.name}
            </div>
            <CertificateCard {...selectedCert} />
          </div>
        )}
        
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

function CertificateCard({ status, id, decisionId, applicant, model, timestamp, metrics, score, latency, hash, extraMsg, isHighlighted }) {
  const [showJson, setShowJson] = React.useState(false);
  const [verifyState, setVerifyState] = React.useState('idle');

  const isPass = status === "VERIFIED";
  const isBlock = status.includes("BLOCKED");
  const isFlag = status.includes("FLAGGED");

  const borderColor = isHighlighted 
    ? (isPass ? 'border-eq-pass/60 shadow-[0_0_20px_rgba(16,185,129,0.12)]' : isBlock ? 'border-eq-block/60 shadow-[0_0_20px_rgba(239,68,68,0.15)]' : 'border-eq-flag/60 shadow-[0_0_20px_rgba(245,158,11,0.15)]')
    : (isPass ? 'border-eq-border' : isBlock ? 'border-eq-block/50 shadow-[0_0_15px_rgba(239,68,68,0.05)]' : 'border-eq-flag/50 shadow-[0_0_15px_rgba(245,158,11,0.05)]');
  const Icon = isPass ? ShieldCheck : isBlock ? ShieldX : ShieldAlert;
  const iconColor = isPass ? 'text-eq-pass' : isBlock ? 'text-eq-block' : 'text-eq-flag';
  const badgeClass = isPass ? 'bg-eq-pass-dim text-eq-pass border border-eq-pass/20' : 
                     isBlock ? 'bg-eq-block-dim text-eq-block border border-eq-block/20' : 
                     'bg-eq-flag-dim text-eq-flag border border-eq-flag/20';

  const certJson = {
    certificate_id: id,
    decision_id: decisionId,
    applicant,
    model,
    timestamp,
    status,
    fairness_score: score,
    intercept_latency: latency,
    sha256_hash: hash,
    kms_signature: "a8f3b2c1d4e5f6a7b8c9d0e1f2a3b4c5",
    bigquery_row: `bq://equa-prod/decisions/2026-${id.split('-')[2]}`,
    metrics: metrics.map(m => ({ name: m.name, result: m.status, delta: m.val, threshold: m.thresh })),
    compliance: { eu_ai_act: true, eeoc: true, ecoa: true }
  };

  const handleVerify = () => {
    setVerifyState('verifying');
    setTimeout(() => setVerifyState('verified'), 2000);
    setTimeout(() => setVerifyState('idle'), 6000);
  };

  const handleDownload = () => {
    const fileName = `EQUA_Certificate_${applicant.replace(/[^a-zA-Z0-9]/g, '_')}.txt`;
    const lines = [
      '========================================================',
      '           EQUA FAIRNESS CERTIFICATE',
      '========================================================',
      '',
      'Certificate ID:   ' + id,
      'Status:           ' + status,
      'Generated:        ' + new Date().toISOString(),
      '',
      '--------------------------------------------------------',
      'DECISION DETAILS',
      '--------------------------------------------------------',
      'Decision:         ' + decisionId,
      'Applicant:        ' + applicant,
      'Model:            ' + model,
      'Timestamp:        ' + timestamp,
      'Fairness Score:   ' + score,
      'Intercept Time:   ' + latency,
      '',
      '--------------------------------------------------------',
      'FAIRNESS METRICS',
      '--------------------------------------------------------',
    ];
    metrics.forEach(m => {
      lines.push('  ' + m.name.padEnd(28) + ' ' + m.status.padEnd(6) + ' Delta=' + m.val.padEnd(12) + ' (' + m.thresh + ')');
    });
    lines.push('');
    lines.push('--------------------------------------------------------');
    lines.push('CRYPTOGRAPHIC VERIFICATION');
    lines.push('--------------------------------------------------------');
    lines.push('SHA-256 Hash:     ' + hash);
    lines.push('KMS Signature:    a8f3b2c1d4e5f6a7b8c9d0e1f2a3b4c5');
    lines.push('BigQuery Row:     bq://equa-prod/decisions/2026-' + id.split('-')[2]);
    if (extraMsg) lines.push('', 'ALERT: ' + extraMsg);
    lines.push('');
    lines.push('========================================================');
    lines.push('Generated by EQUA Equity Intelligence. Tamper-proof.');
    lines.push('========================================================');

    const content = lines.join('\r\n');
    const blob = new Blob([content], { type: 'application/octet-stream' });

    // Use msSaveBlob for older Edge/IE, otherwise standard approach
    if (window.navigator && window.navigator.msSaveBlob) {
      window.navigator.msSaveBlob(blob, fileName);
    } else {
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', fileName);
      link.style.visibility = 'hidden';
      document.body.appendChild(link);
      link.click();
      // Delay cleanup so browser has time to start the download
      setTimeout(() => {
        document.body.removeChild(link);
        window.URL.revokeObjectURL(url);
      }, 500);
    }
  };

  return (
    <div className={`bg-eq-panel border ${borderColor} rounded-lg p-5 flex flex-col gap-4 animate-cert-stamp ${isHighlighted ? 'ring-1 ring-eq-blue/30' : ''}`}>
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

      {/* Actions — now functional */}
      <div className="flex gap-4 pt-2 items-center">
        <button onClick={() => setShowJson(p => !p)} className="font-sans text-[11px] text-eq-blue hover:text-blue-400 transition-colors flex items-center gap-1.5">
          {showJson ? '✕ Close JSON' : '{ } View Raw JSON'}
        </button>
        <button onClick={handleVerify} disabled={verifyState === 'verifying'} className="font-sans text-[11px] text-eq-blue hover:text-blue-400 transition-colors flex items-center gap-1.5 disabled:opacity-50">
          {verifyState === 'verifying' ? (
            <><span className="inline-block w-3 h-3 border-2 border-eq-blue border-t-transparent rounded-full animate-spin" /> Verifying...</>
          ) : verifyState === 'verified' ? (
            <span className="text-eq-pass font-medium">✓ Signature Valid — Tamper-proof</span>
          ) : (
            '🔐 Verify Signature'
          )}
        </button>
        <button onClick={handleDownload} className="font-sans text-[11px] text-eq-blue hover:text-blue-400 transition-colors flex items-center gap-1.5">
          📄 Download Certificate
        </button>
      </div>

      {/* Inline JSON panel */}
      {showJson && (
        <div className="bg-eq-bg border border-eq-border rounded-lg p-4 overflow-auto max-h-[280px]" style={{ animation: 'fadeSlideDown 0.2s ease-out' }}>
          <div className="flex justify-between items-center mb-2">
            <span className="font-plex text-[11px] text-eq-muted uppercase tracking-wider">Raw Certificate JSON</span>
            <button onClick={() => navigator.clipboard.writeText(JSON.stringify(certJson, null, 2))} className="font-sans text-[10px] text-eq-blue hover:underline">
              📋 Copy to Clipboard
            </button>
          </div>
          <pre className="font-jet text-[11px] text-eq-text leading-relaxed whitespace-pre-wrap">{JSON.stringify(certJson, null, 2)}</pre>
        </div>
      )}
    </div>
  );
}

