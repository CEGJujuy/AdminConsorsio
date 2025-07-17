import React, { useState } from 'react';
import { Calculator, Building2, FileText, Download } from 'lucide-react';
import { Expensa, Consorcio, Unidad } from '../types';
import { 
  getExpensas, 
  getConsorcios, 
  getUnidadesByConsorcio, 
  saveExpensa, 
  generateId,
  formatCurrency,
  formatDate
} from '../services/dataService';
import { generateReporteMensualPDF } from '../services/pdfService';

const ExpensasManager: React.FC = () => {
  const [expensas, setExpensas] = useState<Expensa[]>(getExpensas());
  const [consorcios] = useState<Consorcio[]>(getConsorcios());
  const [selectedConsorcio, setSelectedConsorcio] = useState<string>('');
  const [selectedPeriodo, setSelectedPeriodo] = useState<string>('');
  const [montoBase, setMontoBase] = useState<number>(0);
  const [showGenerateModal, setShowGenerateModal] = useState(false);

  const getCurrentPeriod = () => {
    const now = new Date();
    return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`;
  };

  const filteredExpensas = expensas
    .filter(expensa => !selectedConsorcio || expensa.consorcioId === selectedConsorcio)
    .filter(expensa => !selectedPeriodo || expensa.periodo === selectedPeriodo);

  const getConsorcioName = (consorcioId: string) => {
    const consorcio = consorcios.find(c => c.id === consorcioId);
    return consorcio?.nombre || 'Consorcio no encontrado';
  };

  const getUnidadInfo = (unidadId: string) => {
    const allUnidades = consorcios.flatMap(c => getUnidadesByConsorcio(c.id));
    const unidad = allUnidades.find(u => u.id === unidadId);
    return unidad ? `${unidad.numero} - ${unidad.propietario}` : 'Unidad no encontrada';
  };

  const generateExpensas = () => {
    if (!selectedConsorcio || !selectedPeriodo || montoBase <= 0) {
      alert('Debe completar todos los campos');
      return;
    }

    const unidades = getUnidadesByConsorcio(selectedConsorcio);
    
    if (unidades.length === 0) {
      alert('El consorcio seleccionado no tiene unidades');
      return;
    }

    // Verificar si ya existen expensas para este período
    const existingExpensas = expensas.filter(
      e => e.consorcioId === selectedConsorcio && e.periodo === selectedPeriodo
    );

    if (existingExpensas.length > 0) {
      if (!confirm('Ya existen expensas para este período. ¿Desea regenerarlas?')) {
        return;
      }
    }

    // Calcular fecha de vencimiento (último día del mes siguiente)
    const [year, month] = selectedPeriodo.split('-').map(Number);
    const vencimiento = new Date(year, month, 0); // Último día del mes siguiente
    
    const newExpensas: Expensa[] = unidades.map(unidad => ({
      id: generateId(),
      consorcioId: selectedConsorcio,
      unidadId: unidad.id,
      periodo: selectedPeriodo,
      monto: Math.round(montoBase * (unidad.porcentaje / 100)),
      vencimiento: vencimiento.toISOString().split('T')[0],
      pagada: false,
      createdAt: new Date().toISOString()
    }));

    // Eliminar expensas existentes del mismo período
    const filteredExpensas = expensas.filter(
      e => !(e.consorcioId === selectedConsorcio && e.periodo === selectedPeriodo)
    );

    newExpensas.forEach(expensa => saveExpensa(expensa));
    setExpensas(getExpensas());
    setShowGenerateModal(false);
    
    alert(`Se generaron ${newExpensas.length} expensas correctamente`);
  };

  const exportReport = () => {
    if (!selectedConsorcio || !selectedPeriodo) {
      alert('Debe seleccionar un consorcio y período');
      return;
    }

    const consorcio = consorcios.find(c => c.id === selectedConsorcio);
    const expensasPeriodo = expensas.filter(
      e => e.consorcioId === selectedConsorcio && e.periodo === selectedPeriodo
    );
    const unidades = getUnidadesByConsorcio(selectedConsorcio);
    const pagos: any[] = []; // En una implementación real, obtendríamos los pagos

    if (consorcio && expensasPeriodo.length > 0) {
      generateReporteMensualPDF(consorcio, selectedPeriodo, expensasPeriodo, unidades, pagos);
    } else {
      alert('No hay datos para exportar');
    }
  };

  const uniquePeriods = [...new Set(expensas.map(e => e.periodo))].sort().reverse();

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div className="flex items-center gap-3">
          <Calculator className="text-primary-600" size={28} />
          <h1 className="text-2xl font-bold text-primary-800">Gestión de Expensas</h1>
        </div>
        <div className="flex gap-2">
          <button
            onClick={() => setShowGenerateModal(true)}
            className="btn-primary flex items-center gap-2"
            disabled={consorcios.length === 0}
          >
            <FileText size={20} />
            Generar Expensas
          </button>
          <button
            onClick={exportReport}
            className="btn-secondary flex items-center gap-2"
            disabled={!selectedConsorcio || !selectedPeriodo}
          >
            <Download size={20} />
            Exportar PDF
          </button>
        </div>
      </div>

      {consorcios.length === 0 && (
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
          <p className="text-yellow-800">
            Debe crear al menos un consorcio y sus unidades antes de generar expensas.
          </p>
        </div>
      )}

      {/* Filters */}
      <div className="card">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-primary-700 mb-1">
              Filtrar por Consorcio
            </label>
            <select
              value={selectedConsorcio}
              onChange={(e) => setSelectedConsorcio(e.target.value)}
              className="input-field"
            >
              <option value="">Todos los consorcios</option>
              {consorcios.map((consorcio) => (
                <option key={consorcio.id} value={consorcio.id}>
                  {consorcio.nombre}
                </option>
              ))}
            </select>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-primary-700 mb-1">
              Filtrar por Período
            </label>
            <select
              value={selectedPeriodo}
              onChange={(e) => setSelectedPeriodo(e.target.value)}
              className="input-field"
            >
              <option value="">Todos los períodos</option>
              {uniquePeriods.map((periodo) => (
                <option key={periodo} value={periodo}>
                  {new Date(periodo + '-01').toLocaleDateString('es-AR', { 
                    year: 'numeric', 
                    month: 'long' 
                  })}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Summary */}
      {selectedConsorcio && selectedPeriodo && (
        <div className="card">
          <h3 className="text-lg font-semibold text-primary-800 mb-4">
            Resumen - {getConsorcioName(selectedConsorcio)} - {selectedPeriodo}
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            {(() => {
              const expensasPeriodo = filteredExpensas;
              const totalExpensas = expensasPeriodo.reduce((sum, e) => sum + e.monto, 0);
              const expensasPagadas = expensasPeriodo.filter(e => e.pagada).length;
              const expensasPendientes = expensasPeriodo.length - expensasPagadas;
              const morosidad = expensasPeriodo.length > 0 ? (expensasPendientes / expensasPeriodo.length) * 100 : 0;

              return (
                <>
                  <div className="bg-blue-50 p-4 rounded-lg">
                    <p className="text-sm text-blue-600">Total Expensas</p>
                    <p className="text-2xl font-bold text-blue-800">{formatCurrency(totalExpensas)}</p>
                  </div>
                  <div className="bg-success-50 p-4 rounded-lg">
                    <p className="text-sm text-success-600">Pagadas</p>
                    <p className="text-2xl font-bold text-success-800">{expensasPagadas}</p>
                  </div>
                  <div className="bg-yellow-50 p-4 rounded-lg">
                    <p className="text-sm text-yellow-600">Pendientes</p>
                    <p className="text-2xl font-bold text-yellow-800">{expensasPendientes}</p>
                  </div>
                  <div className="bg-red-50 p-4 rounded-lg">
                    <p className="text-sm text-red-600">Morosidad</p>
                    <p className="text-2xl font-bold text-red-800">{morosidad.toFixed(1)}%</p>
                  </div>
                </>
              );
            })()}
          </div>
        </div>
      )}

      {/* Expensas Table */}
      <div className="card">
        <div className="overflow-x-auto">
          <table className="min-w-full">
            <thead>
              <tr>
                <th className="table-header">Consorcio</th>
                <th className="table-header">Unidad</th>
                <th className="table-header">Período</th>
                <th className="table-header">Monto</th>
                <th className="table-header">Vencimiento</th>
                <th className="table-header">Estado</th>
              </tr>
            </thead>
            <tbody>
              {filteredExpensas.map((expensa) => (
                <tr key={expensa.id}>
                  <td className="table-cell">
                    <div className="flex items-center gap-2">
                      <Building2 size={16} className="text-primary-500" />
                      {getConsorcioName(expensa.consorcioId)}
                    </div>
                  </td>
                  <td className="table-cell font-medium">
                    {getUnidadInfo(expensa.unidadId)}
                  </td>
                  <td className="table-cell">
                    {new Date(expensa.periodo + '-01').toLocaleDateString('es-AR', { 
                      year: 'numeric', 
                      month: 'long' 
                    })}
                  </td>
                  <td className="table-cell font-medium">
                    {formatCurrency(expensa.monto)}
                  </td>
                  <td className="table-cell">
                    {formatDate(expensa.vencimiento)}
                  </td>
                  <td className="table-cell">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                      expensa.pagada 
                        ? 'bg-success-100 text-success-800' 
                        : new Date(expensa.vencimiento) < new Date()
                        ? 'bg-red-100 text-red-800'
                        : 'bg-yellow-100 text-yellow-800'
                    }`}>
                      {expensa.pagada 
                        ? 'PAGADA' 
                        : new Date(expensa.vencimiento) < new Date()
                        ? 'VENCIDA'
                        : 'PENDIENTE'
                      }
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Generate Modal */}
      {showGenerateModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-md w-full">
            <div className="p-6">
              <h2 className="text-xl font-bold text-primary-800 mb-4">
                Generar Expensas
              </h2>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-primary-700 mb-1">
                    Consorcio
                  </label>
                  <select
                    required
                    value={selectedConsorcio}
                    onChange={(e) => setSelectedConsorcio(e.target.value)}
                    className="input-field"
                  >
                    <option value="">Seleccionar consorcio</option>
                    {consorcios.map((consorcio) => (
                      <option key={consorcio.id} value={consorcio.id}>
                        {consorcio.nombre}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-primary-700 mb-1">
                    Período
                  </label>
                  <input
                    type="month"
                    required
                    value={selectedPeriodo}
                    onChange={(e) => setSelectedPeriodo(e.target.value)}
                    className="input-field"
                    defaultValue={getCurrentPeriod()}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-primary-700 mb-1">
                    Monto Base Total
                  </label>
                  <input
                    type="number"
                    required
                    min="0"
                    step="0.01"
                    value={montoBase}
                    onChange={(e) => setMontoBase(parseFloat(e.target.value) || 0)}
                    className="input-field"
                    placeholder="Ej: 50000"
                  />
                  <p className="text-sm text-primary-600 mt-1">
                    Este monto se distribuirá proporcionalmente según el porcentaje de cada unidad
                  </p>
                </div>

                <div className="flex gap-3 pt-4">
                  <button
                    onClick={generateExpensas}
                    className="btn-primary flex-1"
                  >
                    Generar
                  </button>
                  <button
                    onClick={() => setShowGenerateModal(false)}
                    className="btn-secondary flex-1"
                  >
                    Cancelar
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ExpensasManager;