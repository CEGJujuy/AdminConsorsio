import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { Building2, Home, Calculator, CreditCard, TrendingUp, AlertTriangle } from 'lucide-react';
import { getConsorcios, getUnidades, getExpensas, getPagos, formatCurrency } from '../services/dataService';

const Dashboard: React.FC = () => {
  const consorcios = getConsorcios();
  const unidades = getUnidades();
  const expensas = getExpensas();
  const pagos = getPagos();

  // Calcular estadísticas
  const totalExpensas = expensas.reduce((sum, exp) => sum + exp.monto, 0);
  const totalPagos = pagos.reduce((sum, pago) => sum + pago.monto, 0);
  const morosidad = totalExpensas > 0 ? ((totalExpensas - totalPagos) / totalExpensas) * 100 : 0;
  const expensasPendientes = expensas.filter(exp => !exp.pagada).length;

  // Datos para gráficos
  const consorcioStats = consorcios.map(consorcio => {
    const unidadesConsorcio = unidades.filter(u => u.consorcioId === consorcio.id);
    const expensasConsorcio = expensas.filter(e => e.consorcioId === consorcio.id);
    const pagosConsorcio = pagos.filter(p => p.consorcioId === consorcio.id);
    
    const totalExp = expensasConsorcio.reduce((sum, exp) => sum + exp.monto, 0);
    const totalPag = pagosConsorcio.reduce((sum, pago) => sum + pago.monto, 0);
    
    return {
      nombre: consorcio.nombre.substring(0, 15),
      expensas: totalExp,
      pagos: totalPag,
      morosidad: totalExp > 0 ? ((totalExp - totalPag) / totalExp) * 100 : 0
    };
  });

  const estadoPagos = [
    { name: 'Pagadas', value: expensas.filter(e => e.pagada).length, color: '#10b981' },
    { name: 'Pendientes', value: expensasPendientes, color: '#f59e0b' },
  ];

  const stats = [
    {
      title: 'Total Consorcios',
      value: consorcios.length,
      icon: Building2,
      color: 'bg-blue-500',
      change: '+12%'
    },
    {
      title: 'Total Unidades',
      value: unidades.length,
      icon: Home,
      color: 'bg-success-500',
      change: '+8%'
    },
    {
      title: 'Expensas Generadas',
      value: formatCurrency(totalExpensas),
      icon: Calculator,
      color: 'bg-purple-500',
      change: '+15%'
    },
    {
      title: 'Pagos Recibidos',
      value: formatCurrency(totalPagos),
      icon: CreditCard,
      color: 'bg-indigo-500',
      change: '+22%'
    }
  ];

  return (
    <div className="space-y-6">
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <div key={index} className="card">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-primary-600">{stat.title}</p>
                  <p className="text-2xl font-bold text-primary-900">{stat.value}</p>
                  <p className="text-sm text-success-600 flex items-center mt-1">
                    <TrendingUp size={16} className="mr-1" />
                    {stat.change}
                  </p>
                </div>
                <div className={`p-3 rounded-full ${stat.color}`}>
                  <Icon size={24} className="text-white" />
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Alertas */}
      {morosidad > 20 && (
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
          <div className="flex items-center">
            <AlertTriangle className="text-yellow-600 mr-3" size={20} />
            <div>
              <h3 className="text-yellow-800 font-medium">Alta Morosidad Detectada</h3>
              <p className="text-yellow-700 text-sm">
                La morosidad actual es del {morosidad.toFixed(1)}%. Se recomienda enviar avisos de pago.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Gráficos */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Gráfico de barras - Expensas vs Pagos por Consorcio */}
        <div className="card">
          <h3 className="text-lg font-semibold text-primary-800 mb-4">Expensas vs Pagos por Consorcio</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={consorcioStats}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="nombre" />
              <YAxis />
              <Tooltip formatter={(value) => formatCurrency(Number(value))} />
              <Bar dataKey="expensas" fill="#6b7280" name="Expensas" />
              <Bar dataKey="pagos" fill="#10b981" name="Pagos" />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Gráfico circular - Estado de Pagos */}
        <div className="card">
          <h3 className="text-lg font-semibold text-primary-800 mb-4">Estado de Expensas</h3>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={estadoPagos}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                outerRadius={80}
                fill="#8884d8"
                dataKey="value"
              >
                {estadoPagos.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Tabla de Morosidad */}
      <div className="card">
        <h3 className="text-lg font-semibold text-primary-800 mb-4">Morosidad por Consorcio</h3>
        <div className="overflow-x-auto">
          <table className="min-w-full">
            <thead>
              <tr>
                <th className="table-header">Consorcio</th>
                <th className="table-header">Unidades</th>
                <th className="table-header">Total Expensas</th>
                <th className="table-header">Total Pagos</th>
                <th className="table-header">Morosidad</th>
              </tr>
            </thead>
            <tbody>
              {consorcioStats.map((consorcio, index) => (
                <tr key={index}>
                  <td className="table-cell font-medium">{consorcio.nombre}</td>
                  <td className="table-cell">
                    {unidades.filter(u => u.consorcioId === consorcios[index]?.id).length}
                  </td>
                  <td className="table-cell">{formatCurrency(consorcio.expensas)}</td>
                  <td className="table-cell">{formatCurrency(consorcio.pagos)}</td>
                  <td className="table-cell">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                      consorcio.morosidad > 30 
                        ? 'bg-red-100 text-red-800' 
                        : consorcio.morosidad > 15 
                        ? 'bg-yellow-100 text-yellow-800' 
                        : 'bg-success-100 text-success-800'
                    }`}>
                      {consorcio.morosidad.toFixed(1)}%
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;