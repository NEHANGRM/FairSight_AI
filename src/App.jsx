import React, { useState, useEffect, useCallback } from 'react';
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
import Settings from './screens/Settings';
import HelpDocs from './screens/HelpDocs';
import FcmToast from './components/FcmToast';

let notifIdCounter = 1;

function App() {
  const [activeScreen, setActiveScreen] = useState('Counterfactual Sim');
  const [toastMessage, setToastMessage] = useState(null);
  const [notifications, setNotifications] = useState([]);
  const [selectedDecision, setSelectedDecision] = useState(null);
  
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

  // Real notification system — components call this when events happen
  const addNotification = useCallback((notification) => {
    const newNotif = {
      id: notifIdCounter++,
      time: new Date(),
      read: false,
      ...notification,
    };
    setNotifications(prev => [newNotif, ...prev]);
  }, []);

  const renderScreen = () => {
    switch (activeScreen) {
      case 'Counterfactual Sim': return <CounterfactualSimulator triggerToast={triggerToast} addNotification={addNotification} selectedDecision={selectedDecision} setSelectedDecision={setSelectedDecision} setActiveScreen={setActiveScreen} />;
      case 'Decision Feed': return <DecisionFeed triggerToast={triggerToast} setActiveScreen={setActiveScreen} addNotification={addNotification} setSelectedDecision={setSelectedDecision} />;
      case 'Bias Heatmap': return <BiasHeatmap />;
      case 'Fairness Certificates': return <FairnessCertificates selectedDecision={selectedDecision} setSelectedDecision={setSelectedDecision} />;
      case 'Policy Engine': return <PolicyEngine addNotification={addNotification} />;
      case 'Retraining Loop': return <RetrainingLoop />;
      case 'API Integrations': return <ApiIntegrations />;
      case 'Audit Reports': return <AuditReports />;
      case 'Settings': return <Settings />;
      case 'Help & Docs': return <HelpDocs />;
      default: return <CounterfactualSimulator triggerToast={triggerToast} addNotification={addNotification} selectedDecision={selectedDecision} setSelectedDecision={setSelectedDecision} setActiveScreen={setActiveScreen} />;
    }
  };

  return (
    <div className="flex h-screen overflow-hidden bg-eq-bg text-eq-text selection:bg-eq-blue-dim">
      <Sidebar activeScreen={activeScreen} setActiveScreen={setActiveScreen} />
      
      <div className="flex flex-col flex-1 min-w-0">
        <Topbar
          activeScreen={activeScreen}
          stats={stats}
          notifications={notifications}
          setNotifications={setNotifications}
        />
        
        <main className="flex-1 overflow-auto bg-eq-bg relative">
          <div className="w-full h-full">
            {renderScreen()}
          </div>
        </main>
      </div>
      
      {toastMessage && <FcmToast message={toastMessage} onClose={() => setToastMessage(null)} setActiveScreen={setActiveScreen} />}
    </div>
  );
}

export default App;
