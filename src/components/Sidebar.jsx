import React from 'react';
import { 
  Activity, ArrowRightLeft, Grid, ShieldCheck, Sliders, 
  RefreshCw, Plug, FileText, Settings, HelpCircle, BadgeCheck
} from 'lucide-react';

const navItems = [
  { name: 'Decision Feed', icon: Activity },
  { name: 'Counterfactual Sim', icon: ArrowRightLeft },
  { name: 'Bias Heatmap', icon: Grid },
  { name: 'Fairness Certificates', icon: ShieldCheck },
  { name: 'Policy Engine', icon: Sliders },
  { name: 'Retraining Loop', icon: RefreshCw },
  { name: 'API Integrations', icon: Plug },
  { name: 'Audit Reports', icon: FileText },
];

const secondaryNavItems = [
  { name: 'Settings', icon: Settings },
  { name: 'Help & Docs', icon: HelpCircle },
];

export default function Sidebar({ activeScreen, setActiveScreen }) {
  return (
    <div className="w-[240px] flex-shrink-0 flex flex-col h-full bg-eq-bg border-r border-eq-border">
      {/* Top Section */}
      <div className="p-5 flex flex-col gap-4">
        <div className="flex flex-col gap-1">
          <div className="flex items-baseline">
            <span className="font-plex font-bold text-[22px] text-eq-blue">EQ</span>
            <span className="font-plex font-bold text-[22px] text-eq-text">UA</span>
          </div>
          <span className="font-plex text-[10px] tracking-[0.15em] text-eq-muted">EQUITY INTELLIGENCE</span>
        </div>
        
        <div className="flex items-center gap-1">
          <span className="font-sans text-xs text-eq-muted">Acme Financial Corp</span>
          <BadgeCheck className="w-3 h-3 text-eq-blue" />
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 overflow-y-auto py-2">
        <ul className="flex flex-col">
          {navItems.map((item) => {
            const isActive = activeScreen === item.name;
            const Icon = item.icon;
            return (
              <li key={item.name}>
                <button
                  onClick={() => setActiveScreen(item.name)}
                  className={`w-full flex items-center gap-3 px-5 py-2.5 text-sm font-sans relative ease-out-strict transition-colors duration-150 group
                    ${isActive ? 'bg-eq-blue-dim/10 text-eq-text' : 'text-eq-muted hover:text-eq-text'}`}
                >
                  {isActive && <div className="absolute left-0 top-0 bottom-0 w-[3px] bg-eq-blue" />}
                  {/* Hover background pseudo-element equivalent */}
                  {!isActive && <div className="absolute inset-0 bg-eq-surface opacity-0 group-hover:opacity-100 transition-opacity duration-150 ease-out -z-10" />}
                  
                  <Icon className={`w-4 h-4 ${isActive ? 'text-eq-blue' : 'text-eq-muted group-hover:text-eq-text'}`} />
                  {item.name}
                </button>
              </li>
            );
          })}

          <li className="my-4 mx-5 border-t border-eq-border"></li>

          {secondaryNavItems.map((item) => {
            const isActive = activeScreen === item.name;
            const Icon = item.icon;
            return (
              <li key={item.name}>
                <button
                  onClick={() => setActiveScreen(item.name)}
                  className={`w-full flex items-center gap-3 px-5 py-2.5 text-sm font-sans relative ease-out-strict transition-colors duration-150 group
                    ${isActive ? 'bg-eq-blue-dim/10 text-eq-text' : 'text-eq-muted hover:text-eq-text'}`}
                >
                  {isActive && <div className="absolute left-0 top-0 bottom-0 w-[3px] bg-eq-blue" />}
                  {!isActive && <div className="absolute inset-0 bg-eq-surface opacity-0 group-hover:opacity-100 transition-opacity duration-150 ease-out -z-10" />}
                  <Icon className={`w-4 h-4 ${isActive ? 'text-eq-blue' : 'text-eq-muted group-hover:text-eq-text'}`} />
                  {item.name}
                </button>
              </li>
            );
          })}
        </ul>
      </nav>

      {/* Bottom User Section */}
      <div className="p-5 border-t border-eq-border mt-auto">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-8 h-8 rounded-full bg-eq-blue-dim flex items-center justify-center font-sans text-xs font-medium text-eq-text">
            RA
          </div>
          <div className="flex flex-col">
            <span className="font-sans text-sm text-eq-text">Rahul Anand</span>
            <span className="font-sans text-xs text-eq-muted">Compliance Officer</span>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 rounded-full bg-eq-pass shadow-[0_0_8px_rgba(16,185,129,0.5)]" />
          <span className="font-sans text-xs text-eq-pass">Firewall Active</span>
        </div>
      </div>
    </div>
  );
}
