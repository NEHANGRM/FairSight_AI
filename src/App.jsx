import React, { useState, useEffect } from 'react';
import Sidebar from './components/Sidebar';
import Topbar from './components/Topbar';
import CounterfactualSimulator from './screens/CounterfactualSimulator';
import DecisionFeed from './screens/DecisionFeed';
import BiasHeatmap from './screens/BiasHeatmap';
import FairnessCertificates from './screens/FairnessCertificates';
import PolicyEngine from './screens/PolicyEngine';
import RetrainingLoop from './screens/RetrainingLoop';
import ApiIntegrations from './screens/ApiIntegrations';
import AuditReports from './screens/AuditReports';
import FcmToast from './components/FcmToast';

function App() {
  const [activeScreen, setActiveScreen] = useState('Counterfactual Sim');
  const [toastMessage, setToastMessage] = useState(null);
  
  // Global stats for Topbar
  const [stats, setStats] = useState({
    total: 2847,
    passed: 2756,
    flagged: 91,
    avgLatency: 187
  });

  // Increment total stats occasionally to simulate live system
  useEffect(() => {
    const timer = setInterval(() => {
      setStats(prev => ({
        ...prev,
        total: prev.total + 1,
        passed: prev.passed + 1
      }));
    }, 5000);
    return () => clearInterval(timer);
  }, []);

  const triggerToast = (message) => {
    setToastMessage(message);
    setTimeout(() => setToastMessage(null), 6000);
  };

  const renderScreen = () => {
    switch (activeScreen) {
      case 'Counterfactual Sim': return <CounterfactualSimulator triggerToast={triggerToast} />;
      case 'Decision Feed': return <DecisionFeed triggerToast={triggerToast} setActiveScreen={setActiveScreen} />;
      case 'Bias Heatmap': return <BiasHeatmap />;
      case 'Fairness Certificates': return <FairnessCertificates />;
      case 'Policy Engine': return <PolicyEngine />;
      case 'Retraining Loop': return <RetrainingLoop />;
      case 'API Integrations': return <ApiIntegrations />;
      case 'Audit Reports': return <AuditReports />;
      default: return <CounterfactualSimulator triggerToast={triggerToast} />;
    }
  };

  return (
    <div className="flex h-screen overflow-hidden bg-eq-bg text-eq-text selection:bg-eq-blue-dim">
      <Sidebar activeScreen={activeScreen} setActiveScreen={setActiveScreen} />
      
      <div className="flex flex-col flex-1 min-w-0">
        <Topbar activeScreen={activeScreen} stats={stats} />
        
        <main className="flex-1 overflow-auto bg-eq-bg relative">
          <div className="w-full h-full">
            {renderScreen()}
          </div>
        </main>
      </div>
      
      {toastMessage && <FcmToast message={toastMessage} onClose={() => setToastMessage(null)} />}
    </div>
  );
}

export default App;
