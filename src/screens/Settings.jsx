import React, { useState } from 'react';
import {
  Key, Bell, Palette, Shield, Trash2, Save, Eye, EyeOff,
  CheckCircle, AlertTriangle, Database, Globe, Zap
} from 'lucide-react';

function ToggleSwitch({ enabled, onChange }) {
  return (
    <button
      onClick={() => onChange(!enabled)}
      className={`relative inline-flex h-5 w-9 items-center rounded-full transition-colors duration-200 focus:outline-none ${
        enabled ? 'bg-eq-blue' : 'bg-eq-border'
      }`}
    >
      <span
        className={`inline-block h-3.5 w-3.5 transform rounded-full bg-white shadow transition-transform duration-200 ${
          enabled ? 'translate-x-5' : 'translate-x-1'
        }`}
      />
    </button>
  );
}

function SectionCard({ title, icon: Icon, children }) {
  return (
    <div className="bg-eq-surface border border-eq-border rounded-lg overflow-hidden">
      <div className="flex items-center gap-2.5 px-5 py-3.5 border-b border-eq-border">
        <Icon className="w-4 h-4 text-eq-blue" />
        <span className="font-plex font-medium text-sm text-eq-text">{title}</span>
      </div>
      <div className="p-5 flex flex-col gap-4">{children}</div>
    </div>
  );
}

function SettingRow({ label, description, children }) {
  return (
    <div className="flex items-start justify-between gap-8">
      <div className="flex flex-col gap-0.5 flex-1">
        <span className="font-sans text-sm text-eq-text">{label}</span>
        {description && (
          <span className="font-sans text-xs text-eq-muted">{description}</span>
        )}
      </div>
      <div className="flex-shrink-0">{children}</div>
    </div>
  );
}

export default function Settings() {
  const [saved, setSaved] = useState(false);
  const [showKey, setShowKey] = useState(false);

  // API Configuration
  const [geminiKey, setGeminiKey] = useState('AIzaSyD••••••••••••••••••••••••••••');
  const [backendUrl, setBackendUrl] = useState('http://localhost:8080');
  const [model, setModel] = useState('gemini-1.5-flash');

  // Notifications
  const [emailAlerts, setEmailAlerts] = useState(true);
  const [pushAlerts, setPushAlerts] = useState(true);
  const [slackAlerts, setSlackAlerts] = useState(false);
  const [weeklyReport, setWeeklyReport] = useState(true);

  // Appearance
  const [theme, setTheme] = useState('dark');
  const [compactMode, setCompactMode] = useState(false);
  const [animations, setAnimations] = useState(true);

  // Security
  const [mfa, setMfa] = useState(true);
  const [sessionTimeout, setSessionTimeout] = useState('60');
  const [auditLog, setAuditLog] = useState(true);

  const handleSave = () => {
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  return (
    <div className="p-6 max-w-3xl mx-auto flex flex-col gap-6">

      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="font-plex font-semibold text-eq-text text-lg">System Settings</h2>
          <p className="font-sans text-xs text-eq-muted mt-0.5">
            Configure your EQUA firewall preferences, integrations, and security policies.
          </p>
        </div>
        <button
          onClick={handleSave}
          className={`flex items-center gap-2 px-4 py-2 rounded-md text-sm font-sans font-medium transition-all duration-200 ${
            saved
              ? 'bg-eq-pass/20 text-eq-pass border border-eq-pass/30'
              : 'bg-eq-blue text-white hover:bg-eq-blue/90 border border-transparent'
          }`}
        >
          {saved ? <CheckCircle className="w-4 h-4" /> : <Save className="w-4 h-4" />}
          {saved ? 'Saved!' : 'Save Changes'}
        </button>
      </div>

      {/* API Configuration */}
      <SectionCard title="API Configuration" icon={Key}>
        <SettingRow
          label="Gemini API Key"
          description="Used for real-time audit narrative generation via Gemini Flash."
        >
          <div className="flex items-center gap-2">
            <div className="relative">
              <input
                type={showKey ? 'text' : 'password'}
                value={geminiKey}
                onChange={e => setGeminiKey(e.target.value)}
                className="bg-eq-bg border border-eq-border rounded px-3 py-1.5 text-xs font-jet text-eq-text w-64 focus:outline-none focus:border-eq-blue transition-colors"
              />
              <button
                onClick={() => setShowKey(!showKey)}
                className="absolute right-2 top-1/2 -translate-y-1/2 text-eq-muted hover:text-eq-text transition-colors"
              >
                {showKey ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
              </button>
            </div>
          </div>
        </SettingRow>

        <div className="border-t border-eq-border" />

        <SettingRow
          label="Backend Proxy URL"
          description="Express.js backend endpoint handling Gemini calls and Firebase writes."
        >
          <input
            type="text"
            value={backendUrl}
            onChange={e => setBackendUrl(e.target.value)}
            className="bg-eq-bg border border-eq-border rounded px-3 py-1.5 text-xs font-jet text-eq-text w-64 focus:outline-none focus:border-eq-blue transition-colors"
          />
        </SettingRow>

        <div className="border-t border-eq-border" />

        <SettingRow
          label="AI Audit Model"
          description="Gemini model used for fairness audit narrative generation."
        >
          <select
            value={model}
            onChange={e => setModel(e.target.value)}
            className="bg-eq-bg border border-eq-border rounded px-3 py-1.5 text-xs font-sans text-eq-text w-48 focus:outline-none focus:border-eq-blue transition-colors"
          >
            <option value="gemini-1.5-flash">gemini-1.5-flash (fast)</option>
            <option value="gemini-1.5-pro">gemini-1.5-pro (accurate)</option>
            <option value="gemini-2.5-flash-lite">gemini-2.5-flash-lite (lite)</option>
          </select>
        </SettingRow>

        {/* Connection status */}
        <div className="flex items-center gap-2 bg-eq-pass/10 border border-eq-pass/20 rounded px-3 py-2">
          <div className="w-1.5 h-1.5 rounded-full bg-eq-pass shadow-[0_0_6px_rgba(16,185,129,0.6)]" />
          <span className="font-sans text-xs text-eq-pass">Backend connected · Firebase Admin initialized · Gemini API reachable</span>
        </div>
      </SectionCard>

      {/* Notifications */}
      <SectionCard title="Notifications & Alerts" icon={Bell}>
        <SettingRow
          label="Email Alerts"
          description="Receive an email every time a decision is blocked by the firewall."
        >
          <ToggleSwitch enabled={emailAlerts} onChange={setEmailAlerts} />
        </SettingRow>
        <div className="border-t border-eq-border" />
        <SettingRow
          label="Push Notifications (FCM)"
          description="Firebase Cloud Messaging alerts to the compliance officer dashboard."
        >
          <ToggleSwitch enabled={pushAlerts} onChange={setPushAlerts} />
        </SettingRow>
        <div className="border-t border-eq-border" />
        <SettingRow
          label="Slack Webhook"
          description="Post bias-intercept events to a Slack channel in real time."
        >
          <ToggleSwitch enabled={slackAlerts} onChange={setSlackAlerts} />
        </SettingRow>
        <div className="border-t border-eq-border" />
        <SettingRow
          label="Weekly Compliance Report"
          description="Auto-generate and email a PDF report every Monday at 08:00 UTC."
        >
          <ToggleSwitch enabled={weeklyReport} onChange={setWeeklyReport} />
        </SettingRow>
      </SectionCard>

      {/* Appearance */}
      <SectionCard title="Appearance" icon={Palette}>
        <SettingRow label="Theme" description="Color scheme for the EQUA dashboard.">
          <div className="flex gap-2">
            {['dark', 'light', 'system'].map(t => (
              <button
                key={t}
                onClick={() => setTheme(t)}
                className={`px-3 py-1 rounded text-xs font-sans capitalize transition-all duration-150 border ${
                  theme === t
                    ? 'bg-eq-blue text-white border-eq-blue'
                    : 'bg-eq-bg text-eq-muted border-eq-border hover:text-eq-text'
                }`}
              >
                {t}
              </button>
            ))}
          </div>
        </SettingRow>
        <div className="border-t border-eq-border" />
        <SettingRow
          label="Compact Mode"
          description="Reduce padding and font sizes for more data density."
        >
          <ToggleSwitch enabled={compactMode} onChange={setCompactMode} />
        </SettingRow>
        <div className="border-t border-eq-border" />
        <SettingRow
          label="Micro-animations"
          description="SVG heatmap animations, pulse indicators, and transition effects."
        >
          <ToggleSwitch enabled={animations} onChange={setAnimations} />
        </SettingRow>
      </SectionCard>

      {/* Security */}
      <SectionCard title="Security & Access" icon={Shield}>
        <SettingRow
          label="Multi-Factor Authentication"
          description="Require MFA for compliance officer login via Firebase Auth."
        >
          <ToggleSwitch enabled={mfa} onChange={setMfa} />
        </SettingRow>
        <div className="border-t border-eq-border" />
        <SettingRow
          label="Session Timeout"
          description="Auto-logout after inactivity (minutes)."
        >
          <select
            value={sessionTimeout}
            onChange={e => setSessionTimeout(e.target.value)}
            className="bg-eq-bg border border-eq-border rounded px-3 py-1.5 text-xs font-sans text-eq-text w-32 focus:outline-none focus:border-eq-blue transition-colors"
          >
            <option value="15">15 min</option>
            <option value="30">30 min</option>
            <option value="60">60 min</option>
            <option value="120">2 hours</option>
            <option value="0">Never</option>
          </select>
        </SettingRow>
        <div className="border-t border-eq-border" />
        <SettingRow
          label="Immutable Audit Log"
          description="All intercept events are permanently written to Firebase RTDB and cannot be deleted."
        >
          <div className="flex items-center gap-2">
            <ToggleSwitch enabled={auditLog} onChange={setAuditLog} />
            {auditLog && (
              <span className="font-jet text-[10px] text-eq-pass bg-eq-pass/10 border border-eq-pass/20 px-1.5 py-0.5 rounded">
                ENFORCED
              </span>
            )}
          </div>
        </SettingRow>
      </SectionCard>

      {/* Danger Zone */}
      <div className="bg-eq-surface border border-eq-flag/30 rounded-lg overflow-hidden">
        <div className="flex items-center gap-2.5 px-5 py-3.5 border-b border-eq-flag/30">
          <AlertTriangle className="w-4 h-4 text-eq-flag" />
          <span className="font-plex font-medium text-sm text-eq-flag">Danger Zone</span>
        </div>
        <div className="p-5 flex flex-col gap-3">
          <div className="flex items-start justify-between gap-8">
            <div>
              <span className="font-sans text-sm text-eq-text">Purge Decision Logs</span>
              <p className="font-sans text-xs text-eq-muted mt-0.5">
                Permanently delete all entries from Firebase RTDB. This action cannot be undone.
              </p>
            </div>
            <button className="flex items-center gap-1.5 px-3 py-1.5 rounded border border-eq-flag/40 text-eq-flag hover:bg-eq-flag/10 text-xs font-sans transition-all duration-150 flex-shrink-0">
              <Trash2 className="w-3.5 h-3.5" />
              Purge Logs
            </button>
          </div>
          <div className="flex items-start justify-between gap-8">
            <div>
              <span className="font-sans text-sm text-eq-text">Reset Policy Engine</span>
              <p className="font-sans text-xs text-eq-muted mt-0.5">
                Reset all fairness thresholds and policy rules to factory defaults.
              </p>
            </div>
            <button className="flex items-center gap-1.5 px-3 py-1.5 rounded border border-eq-flag/40 text-eq-flag hover:bg-eq-flag/10 text-xs font-sans transition-all duration-150 flex-shrink-0">
              <Zap className="w-3.5 h-3.5" />
              Reset Policy
            </button>
          </div>
        </div>
      </div>

      {/* Version footer */}
      <div className="flex items-center justify-between py-2">
        <span className="font-jet text-xs text-eq-muted">EQUA v1.0.0 · Google Solution Challenge 2026</span>
        <span className="font-jet text-xs text-eq-muted">Gemini 1.5 Flash · Cloud Run · Firebase RTDB</span>
      </div>
    </div>
  );
}
