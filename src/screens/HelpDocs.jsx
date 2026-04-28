import React, { useState } from 'react';
import {
  BookOpen, Code2, ChevronDown, ChevronRight,
  ExternalLink, Terminal, Zap, Shield, Database, GitBranch
} from 'lucide-react';

const docs = [
  {
    id: 'quickstart',
    icon: Zap,
    title: 'Quick Start',
    color: 'text-eq-blue',
    items: [
      { title: 'How EQUA works', body: 'EQUA sits as a middleware proxy between your client app and any AI model. Before a decision reaches the user, EQUA clones the profile, swaps protected attributes (Gender, Race, Age), and re-queries the model. If the score changes beyond your threshold, the decision is blocked.' },
      { title: 'Running locally', body: 'Start backend: cd backend && npm start (port 8080). Start frontend: npm run dev (port 5173). The frontend proxies /api/* requests to the backend automatically via vite.config.js.' },
      { title: 'Setting your thresholds', body: 'Navigate to Policy Engine → use the sliders to set your block threshold (e.g. >10% disparity). Changes take effect immediately without a restart.' },
    ]
  },
  {
    id: 'api',
    icon: Code2,
    title: 'API Reference',
    color: 'text-violet-400',
    items: [
      { title: 'POST /api/intercept', body: 'Body: { name, activeToggle, originalScore, counterfactualScore, delta }. Returns: { success, narrative }. This endpoint calls Gemini for an audit narrative and writes the blocked decision to Firebase RTDB.' },
      { title: 'GET /health', body: 'Returns HTTP 200 OK. Used by Cloud Run health checks to confirm the backend is running.' },
      { title: 'Rate limits', body: 'Gemini 1.5 Flash: 15 RPM on free tier. The backend retries up to 3 times with exponential backoff before falling back to gemini-1.5-pro.' },
    ]
  },
  {
    id: 'architecture',
    icon: GitBranch,
    title: 'Architecture',
    color: 'text-eq-pass',
    items: [
      { title: 'Backend proxy', body: 'Express.js on Cloud Run — handles all AI calls and Firebase writes server-side so no secrets are exposed to the browser. CORS is configured to allow the Vite dev server and Firebase Hosting origins.' },
      { title: 'Firebase RTDB schema', body: 'decisionLogs/{pushId}: { applicant, attribute, delta, status, timestamp, auditNarrative }. Readable in real-time by the Fairness Certificates screen.' },
      { title: 'Vertex AI integration', body: 'Production ready: swap the simulated score in CounterfactualSimulator.jsx with a real POST to your Vertex AI AutoML endpoint. The backend proxy is already architecturally prepared.' },
    ]
  },
  {
    id: 'security',
    icon: Shield,
    title: 'Security',
    color: 'text-eq-flag',
    items: [
      { title: 'Secret management', body: 'GEMINI_API_KEY and FIREBASE_SERVICE_ACCOUNT_KEY are stored in Cloud Run environment variables (never in the frontend bundle). Locally, they live in backend/.env which is gitignored.' },
      { title: 'Firebase Admin SDK', body: 'All database writes use the Firebase Admin SDK server-side with a service account, not client-side Firebase SDK. This prevents unauthorized writes from the browser.' },
      { title: 'Audit immutability', body: 'Firebase RTDB security rules can be configured to allow writes only from the Cloud Run service account, making the audit trail tamper-proof.' },
    ]
  },
];

function DocSection({ section }) {
  const [open, setOpen] = useState(null);
  const Icon = section.icon;

  return (
    <div className="bg-eq-surface border border-eq-border rounded-lg overflow-hidden">
      <div className={`flex items-center gap-2.5 px-5 py-3.5 border-b border-eq-border`}>
        <Icon className={`w-4 h-4 ${section.color}`} />
        <span className="font-plex font-medium text-sm text-eq-text">{section.title}</span>
      </div>
      <div className="flex flex-col divide-y divide-eq-border">
        {section.items.map((item, i) => (
          <div key={i}>
            <button
              onClick={() => setOpen(open === i ? null : i)}
              className="w-full flex items-center justify-between px-5 py-3 text-left hover:bg-eq-bg/50 transition-colors duration-150"
            >
              <span className="font-sans text-sm text-eq-text">{item.title}</span>
              {open === i
                ? <ChevronDown className="w-4 h-4 text-eq-muted flex-shrink-0" />
                : <ChevronRight className="w-4 h-4 text-eq-muted flex-shrink-0" />
              }
            </button>
            {open === i && (
              <div className="px-5 pb-4 pt-1">
                <p className="font-sans text-xs text-eq-muted leading-relaxed">{item.body}</p>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

export default function HelpDocs() {
  return (
    <div className="p-6 max-w-3xl mx-auto flex flex-col gap-6">

      {/* Header */}
      <div className="flex items-start justify-between">
        <div>
          <h2 className="font-plex font-semibold text-eq-text text-lg">Help & Documentation</h2>
          <p className="font-sans text-xs text-eq-muted mt-0.5">
            Everything you need to configure, extend, and audit EQUA.
          </p>
        </div>
        <a
          href="https://github.com/NEHANGRM/EQUA-Equity-Intelligence-for-Real-Time-Decision-Governance"
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-1.5 px-3 py-1.5 rounded border border-eq-border text-eq-muted hover:text-eq-text hover:border-eq-text/30 text-xs font-sans transition-all duration-150"
        >
          <ExternalLink className="w-3.5 h-3.5" />
          View on GitHub
        </a>
      </div>

      {/* Quick command reference */}
      <div className="bg-eq-bg border border-eq-border rounded-lg p-4 flex flex-col gap-2">
        <div className="flex items-center gap-2 mb-1">
          <Terminal className="w-4 h-4 text-eq-muted" />
          <span className="font-plex text-xs text-eq-muted font-medium tracking-widest uppercase">Quick Commands</span>
        </div>
        {[
          ['Start backend', 'cd backend && npm start'],
          ['Start frontend', 'npm run dev'],
          ['Build for production', 'npm run build'],
          ['Deploy to Cloud Run', 'gcloud run deploy equa-backend --source ./backend'],
          ['Deploy frontend', 'firebase deploy --only hosting'],
        ].map(([label, cmd]) => (
          <div key={label} className="flex items-center gap-3">
            <span className="font-sans text-xs text-eq-muted w-40 flex-shrink-0">{label}</span>
            <code className="font-jet text-xs text-eq-blue bg-eq-surface border border-eq-border px-2 py-0.5 rounded flex-1">{cmd}</code>
          </div>
        ))}
      </div>

      {/* Doc sections */}
      {docs.map(section => (
        <DocSection key={section.id} section={section} />
      ))}

      {/* Footer */}
      <div className="flex items-center justify-between py-2">
        <span className="font-jet text-xs text-eq-muted">Built for Google Solution Challenge 2026</span>
        <span className="font-jet text-xs text-eq-muted">SDGs 10 & 16</span>
      </div>
    </div>
  );
}
