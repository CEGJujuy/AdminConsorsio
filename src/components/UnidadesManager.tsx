import React, { useState } from 'react';
import { Plus, Edit, Trash2, Search, Home, Building2 } from 'lucide-react';
import { Unidad, Consorcio } from '../types';
import { 
  getUnidades, 
  getUnidadesByConsorcio, 
  saveUnidad, 
  deleteUnidad, 
  getConsorcios, 
  generateId 
} from '../services/dataService';

const UnidadesManager: React.FC = () => {
  const [unidades, setUnidades] = useState<Unidad[]>(getUnidades());
  const [consorcios] = useState<Consorcio[]>(getConsorcios());
  const [selectedConsorcio, setSelectedConsorcio] = useState<string>('');
  const [showModal, setShowModal] = useState(false);
  const [editingUnidad, setEditingUnidad] = useState<Unidad | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [formData, setFormData] = useState({
    numero: '',
    piso: '',
    propietario: '',
    email: '',
    telefono: '',
    porcentaje: 0
  });

  const filteredUnidades = unidades
    .filter(unidad => !selectedConsorcio || unidad.consorcioId === selectedConsorcio)
    .filter(unidad =>
      unidad.numero.toLowerCase().includes(searchTerm.toLowerCase()) ||
      unidad.propietario.toLowerCase().includes(searchTerm.toLowerCase()) ||
      unidad.piso.toLowerCase().includes(searchTerm.toLowerCase())
    );

  const getConsorcioName = (consorcioId: string) => {
    const consorcio = consorcios.find(c => c.id === consorcioId);
    return consorcio?.nombre || 'Consorcio no encontrado';
  };

  const calculateTotalPercentage = (consorcioId: string, excludeId?: string) => {
    return getUnidadesByConsorcio(consorcioId)
      .filter(u => u.id !== excludeId)
      .reduce((sum, unidad) => sum + unidad.porcentaje, 0);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!selectedConsorcio) {
      alert('Debe seleccionar un consorcio');
      return;
    }

    const currentTotal = calculateTotalPercentage(selectedConsorcio, editingUnidad?.id);
    const newTotal = currentTotal + formData.porcentaje;

    if (newTotal > 100) {
      alert(`El porcentaje total no puede exceder 100%. Actual: ${currentTotal}%, Disponible: ${100 - currentTotal}%`);
      return;
    }

    const unidad: Unidad = {
      id: editingUnidad?.id || generateId(),
      consorcioId: selectedConsorcio,
      ...formData,
      createdAt: editingUnidad?.createdAt || new Date().toISOString()
    };

    saveUnidad(unidad);
    setUnidades(getUnidades());
    resetForm();
  };

  const handleEdit = (unidad: Unidad) => {
    setEditingUnidad(unidad);
    setSelectedConsorcio(unidad.consorcioId);
    setFormData({
      numero: unidad.numero,
      piso: unidad.piso,
      propietario: unidad.propietario,
      email: unidad.email,
      telefono: unidad.telefono,
      porcentaje: unidad.porcentaje
    });
    setShowModal(true);
  };

  const handleDelete = (id: string) => {
    if (confirm('¿Está seguro de eliminar esta unidad? Se eliminarán también todas las expensas asociadas.')) {
      deleteUnidad(id);
      setUnidades(getUnidades());
    }
  };

  const resetForm = () => {
    setFormData({
      numero: '',
      piso: '',
      propietario: '',
      email: '',
      telefono: '',
      porcentaje: 0
    });
    setEditingUnidad(null);
    setShowModal(false);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div className="flex items-center gap-3">
          <Home className="text-primary-600" size={28} />
          <h1 className="text-2xl font-bold text-primary-800">Gestión de Unidades</h1>
        </div>
        <button
          onClick={() => setShowModal(true)}
          className="btn-primary flex items-center gap-2"
          disabled={consorcios.length === 0}
        >
          <Plus size={20} />
          Nueva Unidad
        </button>
      </div>

      {consorcios.length === 0 && (
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
          <p className="text-yellow-800">
            Debe crear al menos un consorcio antes de agregar unidades.
          </p>
        </div>
      )}

      {/* Filters */}
      <div className="card space-y-4">
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
                placeholder="Buscar por número, propietario o piso..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="input-field pl-10"
              />
            </div>
          </div>
        </div>

        {/* Percentage Summary */}
        {selectedConsorcio && (
          <div className="bg-primary-50 p-4 rounded-lg">
            <h3 className="font-medium text-primary-800 mb-2">
              Resumen de Porcentajes - {getConsorcioName(selectedConsorcio)}
            </h3>
            <div className="flex items-center gap-4">
              <span className="text-sm text-primary-600">
                Total asignado: {calculateTotalPercentage(selectedConsorcio).toFixed(2)}%
              </span>
              <span className="text-sm text-primary-600">
                Disponible: {(100 - calculateTotalPercentage(selectedConsorcio)).toFixed(2)}%
              </span>
            </div>
          </div>
        )}
      </div>

      {/* Unidades Table */}
      <div className="card">
        <div className="overflow-x-auto">
          <table className="min-w-full">
            <thead>
              <tr>
                <th className="table-header">Consorcio</th>
                <th className="table-header">Unidad</th>
                <th className="table-header">Piso</th>
                <th className="table-header">Propietario</th>
                <th className="table-header">Contacto</th>
                <th className="table-header">Porcentaje</th>
                <th className="table-header">Acciones</th>
              </tr>
            </thead>
            <tbody>
              {filteredUnidades.map((unidad) => (
                <tr key={unidad.id}>
                  <td className="table-cell">
                    <div className="flex items-center gap-2">
                      <Building2 size={16} className="text-primary-500" />
                      {getConsorcioName(unidad.consorcioId)}
                    </div>
                  </td>
                  <td className="table-cell font-medium">{unidad.numero}</td>
                  <td className="table-cell">{unidad.piso}</td>
                  <td className="table-cell">{unidad.propietario}</td>
                  <td className="table-cell">
                    <div className="text-sm">
                      <div>{unidad.telefono}</div>
                      <div className="text-primary-600">{unidad.email}</div>
                    </div>
                  </td>
                  <td className="table-cell">
                    <span className="bg-success-100 text-success-800 px-2 py-1 rounded-full text-sm font-medium">
                      {unidad.porcentaje}%
                    </span>
                  </td>
                  <td className="table-cell">
                    <div className="flex gap-2">
                      <button
                        onClick={() => handleEdit(unidad)}
                        className="text-blue-600 hover:text-blue-800"
                      >
                        <Edit size={18} />
                      </button>
                      <button
                        onClick={() => handleDelete(unidad.id)}
                        className="text-red-600 hover:text-red-800"
                      >
                        <Trash2 size={18} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-md w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <h2 className="text-xl font-bold text-primary-800 mb-4">
                {editingUnidad ? 'Editar Unidad' : 'Nueva Unidad'}
              </h2>
              
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-primary-700 mb-1">
                    Consorcio
                  </label>
                  <select
                    required
                    value={selectedConsorcio}
                    onChange={(e) => setSelectedConsorcio(e.target.value)}
                    className="input-field"
                    disabled={!!editingUnidad}
                  >
                    <option value="">Seleccionar consorcio</option>
                    {consorcios.map((consorcio) => (
                      <option key={consorcio.id} value={consorcio.id}>
                        {consorcio.nombre}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-primary-700 mb-1">
                      Número de Unidad
                    </label>
                    <input
                      type="text"
                      required
                      value={formData.numero}
                      onChange={(e) => setFormData({...formData, numero: e.target.value})}
                      className="input-field"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-primary-700 mb-1">
                      Piso
                    </label>
                    <input
                      type="text"
                      required
                      value={formData.piso}
                      onChange={(e) => setFormData({...formData, piso: e.target.value})}
                      className="input-field"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-primary-700 mb-1">
                    Propietario
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.propietario}
                    onChange={(e) => setFormData({...formData, propietario: e.target.value})}
                    className="input-field"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-primary-700 mb-1">
                    Email
                  </label>
                  <input
                    type="email"
                    required
                    value={formData.email}
                    onChange={(e) => setFormData({...formData, email: e.target.value})}
                    className="input-field"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-primary-700 mb-1">
                    Teléfono
                  </label>
                  <input
                    type="tel"
                    required
                    value={formData.telefono}
                    onChange={(e) => setFormData({...formData, telefono: e.target.value})}
                    className="input-field"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-primary-700 mb-1">
                    Porcentaje de Expensa
                  </label>
                  <input
                    type="number"
                    required
                    min="0"
                    max="100"
                    step="0.01"
                    value={formData.porcentaje}
                    onChange={(e) => setFormData({...formData, porcentaje: parseFloat(e.target.value) || 0})}
                    className="input-field"
                  />
                  {selectedConsorcio && (
                    <p className="text-sm text-primary-600 mt-1">
                      Disponible: {(100 - calculateTotalPercentage(selectedConsorcio, editingUnidad?.id)).toFixed(2)}%
                    </p>
                  )}
                </div>

                <div className="flex gap-3 pt-4">
                  <button type="submit" className="btn-primary flex-1">
                    {editingUnidad ? 'Actualizar' : 'Crear'}
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

export default UnidadesManager;