import React from 'react';
import { 
  Building2, 
  Home, 
  Calculator, 
  CreditCard, 
  Bell, 
  BarChart3,
  Menu,
  X
} from 'lucide-react';

interface LayoutProps {
  children: React.ReactNode;
  currentView: string;
  onViewChange: (view: string) => void;
}

const Layout: React.FC<LayoutProps> = ({ children, currentView, onViewChange }) => {
  const [sidebarOpen, setSidebarOpen] = React.useState(false);

  const menuItems = [
    { id: 'dashboard', label: 'Dashboard', icon: BarChart3 },
    { id: 'consorcios', label: 'Consorcios', icon: Building2 },
    { id: 'unidades', label: 'Unidades', icon: Home },
    { id: 'expensas', label: 'Expensas', icon: Calculator },
    { id: 'pagos', label: 'Pagos', icon: CreditCard },
    { id: 'avisos', label: 'Avisos', icon: Bell },
  ];

  return (
    <div className="flex h-screen bg-primary-50">
      {/* Mobile sidebar backdrop */}
      {sidebarOpen && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <div className={`
        fixed inset-y-0 left-0 z-50 w-64 bg-primary-800 transform transition-transform duration-300 ease-in-out lg:translate-x-0 lg:static lg:inset-0
        ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}
      `}>
        <div className="flex items-center justify-between h-16 px-6 bg-primary-900">
          <h1 className="text-xl font-bold text-white">AdminConsorcio</h1>
          <button
            onClick={() => setSidebarOpen(false)}
            className="lg:hidden text-white hover:text-primary-200"
          >
            <X size={24} />
          </button>
        </div>
        
        <nav className="mt-8">
          {menuItems.map((item) => {
            const Icon = item.icon;
            return (
              <button
                key={item.id}
                onClick={() => {
                  onViewChange(item.id);
                  setSidebarOpen(false);
                }}
                className={`
                  w-full flex items-center px-6 py-3 text-left transition-colors duration-200
                  ${currentView === item.id 
                    ? 'bg-success-600 text-white border-r-4 border-success-400' 
                    : 'text-primary-300 hover:bg-primary-700 hover:text-white'
                  }
                `}
              >
                <Icon size={20} className="mr-3" />
                {item.label}
              </button>
            );
          })}
        </nav>
      </div>

      {/* Main content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Top bar */}
        <header className="bg-white shadow-sm border-b border-primary-200 h-16 flex items-center px-6">
          <button
            onClick={() => setSidebarOpen(true)}
            className="lg:hidden text-primary-600 hover:text-primary-800 mr-4"
          >
            <Menu size={24} />
          </button>
          
          <h2 className="text-xl font-semibold text-primary-800 capitalize">
            {menuItems.find(item => item.id === currentView)?.label || 'Dashboard'}
          </h2>
        </header>

        {/* Page content */}
        <main className="flex-1 overflow-auto p-6">
          {children}
        </main>
      </div>
    </div>
  );
};

export default Layout;