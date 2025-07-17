import React, { useState } from 'react';
import { Plus, Edit, Trash2, Search, Building2 } from 'lucide-react';
import { Consorcio } from '../types';
import { getConsorcios, saveConsorcio, deleteConsorcio, generateId } from '../services/dataService';

const ConsorciosManager: React.FC = () => {
  const [consorcios, setConsorcios] = useState<Consorcio[]>(getConsorcios());
  const [showModal, setShowModal] = useState(false);
  const [editingConsorcio, setEditingConsorcio] = useState<Consorcio | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [formData, setFormData] = useState({
    nombre: '',
    cuit: '',
    direccion: '',
    telefono: '',
    email: '',
    administrador: ''
  });

  const filteredConsorcios = consorcios.filter(consorcio =>
    consorcio.nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
    consorcio.cuit.includes(searchTerm) ||
    consorcio.direccion.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const consorcio: Consorcio = {
      id: editingConsorcio?.id || generateId(),
      ...formData,
      createdAt: editingConsorcio?.createdAt || new Date().toISOString()
    };

    saveConsorcio(consorcio);
    setConsorcios(getConsorcios());
    resetForm();
  };

  const handleEdit = (consorcio: Consorcio) => {
    setEditingConsorcio(consorcio);
    setFormData({
      nombre: consorcio.nombre,
      cuit: consorcio.cuit,
      direccion: consorcio.direccion,
      telefono: consorcio.telefono,
      email: consorcio.email,
      administrador: consorcio.administrador
    });
    setShowModal(true);
  };

  const handleDelete = (id: string) => {
    if (confirm('¿Está seguro de eliminar este consorcio? Se eliminarán también todas las unidades y expensas asociadas.')) {
      deleteConsorcio(id);
      setConsorcios(getConsorcios());
    }
  };

  const resetForm = () => {
    setFormData({
      nombre: '',
      cuit: '',
      direccion: '',
      telefono: '',
      email: '',
      administrador: ''
    });
    setEditingConsorcio(null);
    setShowModal(false);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div className="flex items-center gap-3">
          <Building2 className="text-primary-600" size={28} />
          <h1 className="text-2xl font-bold text-primary-800">Gestión de Consorcios</h1>
        </div>
        <button
          onClick={() => setShowModal(true)}
          className="btn-primary flex items-center gap-2"
        >
          <Plus size={20} />
          Nuevo Consorcio
        </button>
      </div>

      {/* Search */}
      <div className="card">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-primary-400" size={20} />
          <input
            type="text"
            placeholder="Buscar por nombre, CUIT o dirección..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="input-field pl-10"
          />
        </div>
      </div>

      {/* Consorcios Table */}
      <div className="card">
        <div className="overflow-x-auto">
          <table className="min-w-full">
            <thead>
              <tr>
                <th className="table-header">Nombre</th>
                <th className="table-header">CUIT</th>
                <th className="table-header">Dirección</th>
                <th className="table-header">Administrador</th>
                <th className="table-header">Contacto</th>
                <th className="table-header">Acciones</th>
              </tr>
            </thead>
            <tbody>
              {filteredConsorcios.map((consorcio) => (
                <tr key={consorcio.id}>
                  <td className="table-cell font-medium">{consorcio.nombre}</td>
                  <td className="table-cell">{consorcio.cuit}</td>
                  <td className="table-cell">{consorcio.direccion}</td>
                  <td className="table-cell">{consorcio.administrador}</td>
                  <td className="table-cell">
                    <div className="text-sm">
                      <div>{consorcio.telefono}</div>
                      <div className="text-primary-600">{consorcio.email}</div>
                    </div>
                  </td>
                  <td className="table-cell">
                    <div className="flex gap-2">
                      <button
                        onClick={() => handleEdit(consorcio)}
                        className="text-blue-600 hover:text-blue-800"
                      >
                        <Edit size={18} />
                      </button>
                      <button
                        onClick={() => handleDelete(consorcio.id)}
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
                {editingConsorcio ? 'Editar Consorcio' : 'Nuevo Consorcio'}
              </h2>
              
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-primary-700 mb-1">
                    Nombre del Consorcio
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.nombre}
                    onChange={(e) => setFormData({...formData, nombre: e.target.value})}
                    className="input-field"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-primary-700 mb-1">
                    CUIT
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.cuit}
                    onChange={(e) => setFormData({...formData, cuit: e.target.value})}
                    className="input-field"
                    placeholder="XX-XXXXXXXX-X"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-primary-700 mb-1">
                    Dirección
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.direccion}
                    onChange={(e) => setFormData({...formData, direccion: e.target.value})}
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
                    Administrador
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.administrador}
                    onChange={(e) => setFormData({...formData, administrador: e.target.value})}
                    className="input-field"
                  />
                </div>

                <div className="flex gap-3 pt-4">
                  <button type="submit" className="btn-primary flex-1">
                    {editingConsorcio ? 'Actualizar' : 'Crear'}
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

export default ConsorciosManager;