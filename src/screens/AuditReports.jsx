import React from 'react';
import { FileText, Download, ExternalLink, CheckCircle2, AlertTriangle } from 'lucide-react';

export default function AuditReports() {
  return (
    <div className="flex flex-col w-full h-full p-6 bg-eq-bg gap-6 overflow-y-auto">
      
      {/* Header */}
      <div>
        <h2 className="font-plex font-medium text-lg text-eq-text">Compliance Audit Reports</h2>
        <p className="font-sans text-sm text-eq-muted mt-1 max-w-3xl">Auto-generated weekly PDF reports for EU AI Act, EEOC compliance, and internal governance. Powered by BigQuery analytics + Gemini 1.5 Pro narrative generation.</p>
      </div>

      <div className="grid grid-cols-[1fr_350px] gap-6 items-start">
        
        {/* Report Cards List */}
        <div className="flex flex-col gap-4">
          
          <ReportCard 
            title="Weekly Bias Audit — Week of Apr 14, 2026"
            desc="Overall compliance score: 94.2% | 3 flagged areas"
          />
          <ReportCard 
            title="Monthly EU AI Act Report — March 2026"
            desc="Full transparency log: 61,847 decisions | EU compliant"
          />
          <ReportCard 
            title="Quarterly Executive Summary — Q1 2026"
            desc="Bias trend analysis | Retraining impact | Roadmap"
          />
          
        </div>

        {/* EU AI Act Status */}
        <div className="bg-eq-panel border border-eq-border rounded p-5 flex flex-col gap-4">
          <h3 className="font-plex text-[14px] text-eq-text mb-2">EU AI Act Compliance Status</h3>
          
          <div className="flex flex-col gap-3">
            <ComplianceRow 
              article="Article 13" 
              title="Transparency" 
              status="COMPLIANT" 
            />
            <ComplianceRow 
              article="Article 14" 
              title="Human Oversight" 
              status="COMPLIANT" 
            />
            <ComplianceRow 
              article="Article 29" 
              title="Record-Keeping" 
              status="COMPLIANT" 
            />
            <ComplianceRow 
              article="Article 10" 
              title="Data Governance" 
              status="REVIEW NEEDED" 
            />
          </div>
        </div>

      </div>
    </div>
  );
}

function ReportCard({ title, desc }) {
  return (
    <div className="bg-eq-panel border border-eq-border hover:border-eq-blue/50 rounded-lg p-5 flex items-center justify-between transition-colors group cursor-pointer">
      <div className="flex items-center gap-4">
        <div className="w-10 h-10 bg-eq-surface rounded border border-eq-border flex items-center justify-center group-hover:bg-eq-blue/10 group-hover:border-eq-blue/30 transition-colors">
          <FileText className="w-5 h-5 text-eq-blue" />
        </div>
        <div className="flex flex-col">
          <span className="font-plex text-[14px] text-eq-text font-medium">{title}</span>
          <span className="font-sans text-[12px] text-eq-muted">{desc}</span>
        </div>
      </div>
      <div className="flex gap-3">
        <button className="flex items-center gap-1.5 px-3 py-1.5 font-sans text-[12px] font-medium text-eq-text bg-eq-surface border border-eq-border rounded hover:bg-eq-bg transition-colors">
          <Download className="w-3.5 h-3.5" /> Download PDF
        </button>
        <button className="flex items-center gap-1.5 px-3 py-1.5 font-sans text-[12px] font-medium text-eq-bg bg-eq-text rounded hover:bg-gray-200 transition-colors">
          View in Browser <ExternalLink className="w-3.5 h-3.5" />
        </button>
      </div>
    </div>
  );
}

function ComplianceRow({ article, title, status }) {
  const isPass = status === 'COMPLIANT';
  return (
    <div className="flex justify-between items-center border-b border-eq-border/50 pb-2 last:border-0 last:pb-0">
      <div className="flex items-center gap-2">
        {isPass ? <CheckCircle2 className="w-4 h-4 text-eq-pass" /> : <AlertTriangle className="w-4 h-4 text-eq-flag" />}
        <span className="font-sans text-[12px] text-eq-text"><span className="font-medium">{article}</span> — {title}</span>
      </div>
      <span className={`font-plex text-[10px] font-bold ${isPass ? 'text-eq-pass' : 'text-eq-flag'}`}>
        {status}
      </span>
    </div>
  );
}
