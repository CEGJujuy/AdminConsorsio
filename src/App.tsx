import React, { useState } from 'react';
import Layout from './components/Layout';
import Dashboard from './components/Dashboard';
import ConsorciosManager from './components/ConsorciosManager';
import UnidadesManager from './components/UnidadesManager';
import ExpensasManager from './components/ExpensasManager';
import PagosManager from './components/PagosManager';
import AvisosManager from './components/AvisosManager';

function App() {
  const [currentView, setCurrentView] = useState('dashboard');

  const renderCurrentView = () => {
    switch (currentView) {
      case 'dashboard':
        return <Dashboard />;
      case 'consorcios':
        return <ConsorciosManager />;
      case 'unidades':
        return <UnidadesManager />;
      case 'expensas':
        return <ExpensasManager />;
      case 'pagos':
        return <PagosManager />;
      case 'avisos':
        return <AvisosManager />;
      default:
        return <Dashboard />;
    }
  };

  return (
    <Layout currentView={currentView} onViewChange={setCurrentView}>
      {renderCurrentView()}
    </Layout>
  );
}

export default App;