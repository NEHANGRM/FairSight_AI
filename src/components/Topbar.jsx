import React, { useEffect, useState, useRef } from 'react';
import { Bell, Cloud, ShieldAlert, AlertTriangle, CheckCircle, X, Trash2, Info } from 'lucide-react';

const typeConfig = {
  blocked: { icon: ShieldAlert, badge: 'bg-eq-flag/15 border-eq-flag/25', iconColor: 'text-eq-flag' },
  warning: { icon: AlertTriangle, badge: 'bg-yellow-500/15 border-yellow-500/25', iconColor: 'text-yellow-400' },
  success: { icon: CheckCircle, badge: 'bg-eq-pass/15 border-eq-pass/25', iconColor: 'text-eq-pass' },
  info:    { icon: Info,         badge: 'bg-eq-blue/15 border-eq-blue/25', iconColor: 'text-eq-blue' },
};

function formatTimeAgo(date) {
  if (!date) return '';
  const now = new Date();
  const diff = Math.floor((now - new Date(date)) / 1000);
  if (diff < 5) return 'just now';
  if (diff < 60) return `${diff}s ago`;
  if (diff < 3600) return `${Math.floor(diff / 60)} min ago`;
  if (diff < 86400) return `${Math.floor(diff / 3600)} hr ago`;
  return `${Math.floor(diff / 86400)}d ago`;
}

export default function Topbar({ activeScreen, stats, notifications, setNotifications }) {
  const [pulse, setPulse] = useState(false);
  const [showPanel, setShowPanel] = useState(false);
  const [, forceUpdate] = useState(0);
  const panelRef = useRef(null);

  const unreadCount = notifications.filter(n => !n.read).length;

  // Pulse animation when stats.total changes
  useEffect(() => {
    setPulse(true);
    const timer = setTimeout(() => setPulse(false), 200);
    return () => clearTimeout(timer);
  }, [stats.total]);

  // Refresh "time ago" labels every 30s
  useEffect(() => {
    const timer = setInterval(() => forceUpdate(c => c + 1), 30000);
    return () => clearInterval(timer);
  }, []);

  // Close panel on outside click
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (panelRef.current && !panelRef.current.contains(e.target)) {
        setShowPanel(false);
      }
    };
    if (showPanel) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [showPanel]);

  const markAllRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, read: true })));
  };

  const dismissNotification = (id) => {
    setNotifications(prev => prev.filter(n => n.id !== id));
  };

  const clearAll = () => {
    setNotifications([]);
    setShowPanel(false);
  };

  // Subtitle based on active screen
  const getSubtitle = () => {
    switch (activeScreen) {
      case 'Counterfactual Sim': return 'Live bias interception — Gemini-powered';
      case 'Bias Heatmap': return 'Real-time from Firebase Realtime DB | Last updated: 2s ago';
      case 'Fairness Certificates': return 'Cryptographically signed via Cloud KMS | Queryable in BigQuery | Tamper-proof | EU AI Act compliant';
      case 'Policy Engine': return 'Configurable fairness thresholds | Multi-tenant org isolation via Firebase Auth + Firestore | Changes take effect in <1s';
      case 'Retraining Loop': return 'Flagged decisions automatically feed back to Vertex AI AutoML as negative training examples — EQUA gets smarter over time';
      case 'API Integrations': return 'Connect any AI decision system via webhook — one line of code. Compatible with any model, any platform.';
      case 'Audit Reports': return 'Auto-generated weekly PDF reports for EU AI Act, EEOC compliance, and internal governance. Powered by BigQuery analytics + Gemini 1.5 Pro narrative generation.';
      case 'Settings': return 'Configure API keys, notifications, appearance, and security policies';
      case 'Help & Docs': return 'Quick Start guides, API reference, architecture docs, and security best practices';
      default: return 'Real-time monitoring';
    }
  };

  return (
    <header className="h-[56px] w-full border-b border-eq-border bg-eq-bg flex items-center justify-between px-6 shrink-0 z-30">
      
      {/* Left */}
      <div className="flex flex-col">
        <h1 className="font-plex font-medium text-eq-text text-[15px] leading-tight">
          {activeScreen}
        </h1>
        <p className="font-sans text-[11px] text-eq-muted leading-tight truncate max-w-md">
          {getSubtitle()}
        </p>
      </div>

      {/* Center */}
      <div className="flex items-center gap-6">
        <div className="flex flex-col items-center">
          <span className={`font-plex text-eq-text text-sm transition-transform duration-200 ${pulse ? 'scale-105' : 'scale-100'}`}>
            {stats.total.toLocaleString()} decisions today
          </span>
        </div>
        <div className="flex items-center gap-4">
          <span className="font-jet text-eq-pass text-xs bg-eq-pass-dim px-2 py-0.5 rounded border border-eq-pass/20">
            avg {stats.avgLatency}ms
          </span>
          <span className="font-sans text-eq-flag text-xs">
            {((stats.flagged / stats.total) * 100).toFixed(1)}% flagged
          </span>
        </div>
      </div>

      {/* Right */}
      <div className="flex items-center gap-5">

        {/* Bell + Notification Panel */}
        <div className="relative" ref={panelRef}>
          <button
            id="bell-button"
            onClick={() => {
              setShowPanel(prev => !prev);
              if (!showPanel) markAllRead();
            }}
            className="relative p-1 rounded hover:bg-eq-surface transition-colors duration-150 focus:outline-none"
          >
            <Bell className={`w-4 h-4 transition-colors duration-150 ${showPanel ? 'text-eq-text' : 'text-eq-muted hover:text-eq-text'}`} />
            {unreadCount > 0 && (
              <div className="absolute -top-0.5 -right-0.5 bg-eq-flag text-eq-bg text-[9px] font-bold px-1 rounded-full border-2 border-eq-bg min-w-[16px] text-center animate-pulse">
                {unreadCount}
              </div>
            )}
          </button>

          {/* Dropdown panel */}
          {showPanel && (
            <div
              className="absolute right-0 top-full mt-2 w-[380px] bg-eq-surface border border-eq-border rounded-lg shadow-2xl shadow-black/40 overflow-hidden"
              style={{ animation: 'fadeSlideDown 0.2s ease-out' }}
            >
              {/* Panel Header */}
              <div className="flex items-center justify-between px-4 py-3 border-b border-eq-border">
                <div className="flex items-center gap-2">
                  <span className="font-plex font-medium text-sm text-eq-text">Notifications</span>
                  {notifications.length > 0 && (
                    <span className="font-jet text-[10px] text-eq-muted bg-eq-bg px-1.5 py-0.5 rounded border border-eq-border">
                      {notifications.length}
                    </span>
                  )}
                </div>
                <div className="flex items-center gap-2">
                  {notifications.length > 0 && (
                    <button
                      onClick={clearAll}
                      className="flex items-center gap-1 text-eq-muted hover:text-eq-flag text-[11px] font-sans transition-colors duration-150"
                    >
                      <Trash2 className="w-3 h-3" />
                      Clear all
                    </button>
                  )}
                  <button
                    onClick={() => setShowPanel(false)}
                    className="text-eq-muted hover:text-eq-text transition-colors duration-150"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* Notification list */}
              <div className="max-h-[360px] overflow-y-auto">
                {notifications.length === 0 ? (
                  <div className="flex flex-col items-center justify-center py-10 gap-2">
                    <Bell className="w-8 h-8 text-eq-border" />
                    <span className="font-sans text-sm text-eq-muted">No notifications yet</span>
                    <span className="font-sans text-xs text-eq-muted/60">
                      Run a counterfactual simulation or update policies to see real events here.
                    </span>
                  </div>
                ) : (
                  notifications.map((n) => {
                    const config = typeConfig[n.type] || typeConfig.info;
                    const Icon = config.icon;
                    return (
                      <div
                        key={n.id}
                        className={`group flex gap-3 px-4 py-3 border-b border-eq-border/60 hover:bg-eq-bg/50 transition-colors duration-100 ${
                          !n.read ? 'bg-eq-blue/[0.04]' : ''
                        }`}
                      >
                        {/* Icon */}
                        <div className={`flex-shrink-0 w-8 h-8 rounded-lg border flex items-center justify-center mt-0.5 ${config.badge}`}>
                          <Icon className={`w-4 h-4 ${config.iconColor}`} />
                        </div>

                        {/* Content */}
                        <div className="flex-1 min-w-0">
                          <div className="flex items-start justify-between gap-2">
                            <span className="font-sans text-[13px] text-eq-text font-medium leading-tight">
                              {n.title}
                            </span>
                            <button
                              onClick={(e) => { e.stopPropagation(); dismissNotification(n.id); }}
                              className="opacity-0 group-hover:opacity-100 text-eq-muted hover:text-eq-text transition-all duration-150 flex-shrink-0 mt-0.5"
                            >
                              <X className="w-3 h-3" />
                            </button>
                          </div>
                          <p className="font-sans text-[11px] text-eq-muted leading-relaxed mt-0.5 line-clamp-2">
                            {n.body}
                          </p>
                          <span className="font-jet text-[10px] text-eq-muted/60 mt-1 inline-block">
                            {formatTimeAgo(n.time)}
                          </span>
                        </div>

                        {/* Unread dot */}
                        {!n.read && (
                          <div className="flex-shrink-0 mt-2">
                            <div className="w-2 h-2 rounded-full bg-eq-blue shadow-[0_0_6px_rgba(59,130,246,0.5)]" />
                          </div>
                        )}
                      </div>
                    );
                  })
                )}
              </div>

              {/* Panel Footer */}
              {notifications.length > 0 && (
                <div className="px-4 py-2.5 border-t border-eq-border bg-eq-bg/30">
                  <span className="font-sans text-[11px] text-eq-muted">
                    {notifications.length} event{notifications.length !== 1 ? 's' : ''} · All notifications are from real app actions
                  </span>
                </div>
              )}
            </div>
          )}
        </div>
        
        <div className="flex items-center gap-2 bg-eq-surface px-2.5 py-1 rounded-full border border-eq-border">
          <div className="w-2 h-2 rounded-full bg-eq-pass" />
          <span className="font-sans text-[11px] text-eq-text font-medium">Firewall: ACTIVE</span>
        </div>
        
        <div className="flex items-center gap-1.5">
          <Cloud className="w-3.5 h-3.5 text-eq-muted" />
          <span className="font-sans text-[11px] text-eq-muted">Connected</span>
        </div>
      </div>

    </header>
  );
}
