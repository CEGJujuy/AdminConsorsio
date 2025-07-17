import React, { useState } from 'react';
import { CreditCard, Building2, Download, Plus, Search } from 'lucide-react';
import { Pago, Expensa, Consorcio, Unidad } from '../types';
import { 
  getPagos, 
  getExpensas, 
  getConsorcios, 
  getUnidades,
  savePago, 
  generateId,
  formatCurrency,
  formatDate
} from '../services/dataService';
import { generateComprobantePDF } from '../services/pdfService';

const PagosManager: React.FC = () => {
  const [pagos, setPagos] = useState<Pago[]>(getPagos());
  const [expensas] = useState<Expensa[]>(getExpensas());
  const [consorcios] = useState<Consorcio[]>(getConsorcios());
  const [unidades] = useState<Unidad[]>(getUnidades());
  const [selectedConsorcio, setSelectedConsorcio] = useState<string>('');
  const [searchTerm, setSearchTerm] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState({
    expensaId: '',
    fecha: new Date().toISOString().split('T')[0],
    monto: 0,
    metodoPago: 'efectivo' as Pago['metodoPago']
  });

  const expensasPendientes = expensas.filter(e => !e.pagada);

  const filteredPagos = pagos
    .filter(pago => !selectedConsorcio || pago.consorcioId === selectedConsorcio)
    .filter(pago => {
      if (!searchTerm) return true;
      const expensa = expensas.find(e => e.id === pago.expensaId);
      const unidad = unidades.find(u => u.id === expensa?.unidadId);
      return unidad?.numero.toLowerCase().includes(searchTerm.toLowerCase()) ||
             unidad?.propietario.toLowerCase().includes(searchTerm.toLowerCase());
    });

  const getExpensaInfo = (expensaId: string) => {
    const expensa = expensas.find(e => e.id === expensaId);
    if (!expensa) return 'Expensa no encontrada';
    
    const unidad = unidades.find(u => u.id === expensa.unidadId);
    const consorcio = consorcios.find(c => c.id === expensa.consorcioId);
    
    return {
      expensa,
      unidad,
      consorcio,
      display: `${consorcio?.nombre} - Unidad ${unidad?.numero} - ${expensa.periodo}`
    };
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const expensa = expensas.find(e => e.id === formData.expensaId);
    if (!expensa) {
      alert('Expensa no encontrada');
      return;
    }

    const pago: Pago = {
      id: generateId(),
      expensaId: formData.expensaId,
      unidadId: expensa.unidadId,
      consorcioId: expensa.consorcioId,
      fecha: formData.fecha,
      monto: formData.monto,
      metodoPago: formData.metodoPago,
      createdAt: new Date().toISOString()
    };

    savePago(pago);
    setPagos(getPagos());
    resetForm();
    
    // Generar comprobante automáticamente
    const info = getExpensaInfo(pago.expensaId);
    if (info.expensa && info.unidad && info.consorcio) {
      generateComprobantePDF(pago, info.expensa, info.unidad, info.consorcio);
    }
  };

  const generateComprobante = (pago: Pago) => {
    const info = getExpensaInfo(pago.expensaId);
    if (info.expensa && info.unidad && info.consorcio) {
      generateComprobantePDF(pago, info.expensa, info.unidad, info.consorcio);
    }
  };

  const resetForm = () => {
    setFormData({
      expensaId: '',
      fecha: new Date().toISOString().split('T')[0],
      monto: 0,
      metodoPago: 'efectivo'
    });
    setShowModal(false);
  };

  const metodoPagoLabels = {
    efectivo: 'Efectivo',
    transferencia: 'Transferencia',
    cheque: 'Cheque',
    debito_automatico: 'Débito Automático'
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div className="flex items-center gap-3">
          <CreditCard className="text-primary-600" size={28} />
          <h1 className="text-2xl font-bold text-primary-800">Gestión de Pagos</h1>
        </div>
        <button
          onClick={() => setShowModal(true)}
          className="btn-primary flex items-center gap-2"
          disabled={expensasPendientes.length === 0}
        >
          <Plus size={20} />
          Registrar Pago
        </button>
      </div>

      {expensasPendientes.length === 0 && (
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
          <p className="text-yellow-800">
            No hay expensas pendientes de pago. Genere expensas primero.
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
              Buscar
            </label>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-primary-400" size={20} />
              <input
                type="text"
                placeholder="Buscar por unidad o propietario..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="input-field pl-10"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Summary */}
      <div className="card">
        <h3 className="text-lg font-semibold text-primary-800 mb-4">Resumen de Pagos</h3>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {(() => {
            const totalPagos = filteredPagos.reduce((sum, p) => sum + p.monto, 0);
            const pagosMes = filteredPagos.filter(p => {
              const pagoDate = new Date(p.fecha);
              const now = new Date();
              return pagoDate.getMonth() === now.getMonth() && pagoDate.getFullYear() === now.getFullYear();
            });
            const totalPagosMes = pagosMes.reduce((sum, p) => sum + p.monto, 0);

            return (
              <>
                <div className="bg-success-50 p-4 rounded-lg">
                  <p className="text-sm text-success-600">Total Pagos</p>
                  <p className="text-2xl font-bold text-success-800">{formatCurrency(totalPagos)}</p>
                </div>
                <div className="bg-blue-50 p-4 rounded-lg">
                  <p className="text-sm text-blue-600">Pagos del Mes</p>
                  <p className="text-2xl font-bold text-blue-800">{formatCurrency(totalPagosMes)}</p>
                </div>
                <div className="bg-purple-50 p-4 rounded-lg">
                  <p className="text-sm text-purple-600">Cantidad Pagos</p>
                  <p className="text-2xl font-bold text-purple-800">{filteredPagos.length}</p>
                </div>
                <div className="bg-yellow-50 p-4 rounded-lg">
                  <p className="text-sm text-yellow-600">Pendientes</p>
                  <p className="text-2xl font-bold text-yellow-800">{expensasPendientes.length}</p>
                </div>
              </>
            );
          })()}
        </div>
      </div>

      {/* Pagos Table */}
      <div className="card">
        <div className="overflow-x-auto">
          <table className="min-w-full">
            <thead>
              <tr>
                <th className="table-header">Fecha</th>
                <th className="table-header">Consorcio</th>
                <th className="table-header">Unidad</th>
                <th className="table-header">Período</th>
                <th className="table-header">Monto</th>
                <th className="table-header">Método</th>
                <th className="table-header">Acciones</th>
              </tr>
            </thead>
            <tbody>
              {filteredPagos.map((pago) => {
                const info = getExpensaInfo(pago.expensaId);
                return (
                  <tr key={pago.id}>
                    <td className="table-cell">{formatDate(pago.fecha)}</td>
                    <td className="table-cell">
                      <div className="flex items-center gap-2">
                        <Building2 size={16} className="text-primary-500" />
                        {info.consorcio?.nombre}
                      </div>
                    </td>
                    <td className="table-cell">
                      <div>
                        <div className="font-medium">{info.unidad?.numero}</div>
                        <div className="text-sm text-primary-600">{info.unidad?.propietario}</div>
                      </div>
                    </td>
                    <td className="table-cell">
                      {info.expensa && new Date(info.expensa.periodo + '-01').toLocaleDateString('es-AR', { 
                        year: 'numeric', 
                        month: 'long' 
                      })}
                    </td>
                    <td className="table-cell font-medium text-success-600">
                      {formatCurrency(pago.monto)}
                    </td>
                    <td className="table-cell">
                      <span className="bg-primary-100 text-primary-800 px-2 py-1 rounded-full text-sm">
                        {metodoPagoLabels[pago.metodoPago]}
                      </span>
                    </td>
                    <td className="table-cell">
                      <button
                        onClick={() => generateComprobante(pago)}
                        className="text-blue-600 hover:text-blue-800 flex items-center gap-1"
                      >
                        <Download size={16} />
                        Comprobante
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-md w-full">
            <div className="p-6">
              <h2 className="text-xl font-bold text-primary-800 mb-4">
                Registrar Pago
              </h2>
              
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-primary-700 mb-1">
                    Expensa a Pagar
                  </label>
                  <select
                    required
                    value={formData.expensaId}
                    onChange={(e) => {
                      const expensa = expensas.find(exp => exp.id === e.target.value);
                      setFormData({
                        ...formData, 
                        expensaId: e.target.value,
                        monto: expensa?.monto || 0
                      });
                    }}
                    className="input-field"
                  >
                    <option value="">Seleccionar expensa</option>
                    {expensasPendientes.map((expensa) => {
                      const info = getExpensaInfo(expensa.id);
                      return (
                        <option key={expensa.id} value={expensa.id}>
                          {info.display} - {formatCurrency(expensa.monto)}
                        </option>
                      );
                    })}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-primary-700 mb-1">
                    Fecha de Pago
                  </label>
                  <input
                    type="date"
                    required
                    value={formData.fecha}
                    onChange={(e) => setFormData({...formData, fecha: e.target.value})}
                    className="input-field"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-primary-700 mb-1">
                    Monto
                  </label>
                  <input
                    type="number"
                    required
                    min="0"
                    step="0.01"
                    value={formData.monto}
                    onChange={(e) => setFormData({...formData, monto: parseFloat(e.target.value) || 0})}
                    className="input-field"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-primary-700 mb-1">
                    Método de Pago
                  </label>
                  <select
                    required
                    value={formData.metodoPago}
                    onChange={(e) => setFormData({...formData, metodoPago: e.target.value as Pago['metodoPago']})}
                    className="input-field"
                  >
                    <option value="efectivo">Efectivo</option>
                    <option value="transferencia">Transferencia</option>
                    <option value="cheque">Cheque</option>
                    <option value="debito_automatico">Débito Automático</option>
                  </select>
                </div>

                <div className="flex gap-3 pt-4">
                  <button type="submit" className="btn-primary flex-1">
                    Registrar Pago
                  </button>
                  <button
                    type="button"
                    onClick={resetForm}
                    className="btn-secondary flex-1"
                  >
                    Cancelar
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default PagosManager;