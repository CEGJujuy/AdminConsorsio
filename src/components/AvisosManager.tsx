import React, { useState } from 'react';
import { Bell, Send, Building2, AlertTriangle, Clock, CheckCircle } from 'lucide-react';
import { Aviso, Consorcio, Unidad, Expensa } from '../types';
import { 
  getAvisos, 
  getConsorcios, 
  getUnidades,
  getExpensas,
  saveAviso, 
  generateId,
  formatDate
} from '../services/dataService';

const AvisosManager: React.FC = () => {
  const [avisos, setAvisos] = useState<Aviso[]>(getAvisos());
  const [consorcios] = useState<Consorcio[]>(getConsorcios());
  const [unidades] = useState<Unidad[]>(getUnidades());
  const [expensas] = useState<Expensa[]>(getExpensas());
  const [selectedConsorcio, setSelectedConsorcio] = useState<string>('');
  const [selectedTipo, setSelectedTipo] = useState<Aviso['tipo']>('vencimiento');
  const [showModal, setShowModal] = useState(false);
  const [mensaje, setMensaje] = useState('');

  const filteredAvisos = avisos.filter(aviso => 
    !selectedConsorcio || aviso.consorcioId === selectedConsorcio
  );

  const getConsorcioName = (consorcioId: string) => {
    const consorcio = consorcios.find(c => c.id === consorcioId);
    return consorcio?.nombre || 'Consorcio no encontrado';
  };

  const getUnidadInfo = (unidadId: string) => {
    const unidad = unidades.find(u => u.id === unidadId);
    return unidad ? `${unidad.numero} - ${unidad.propietario}` : 'Unidad no encontrada';
  };

  const getUnidadesParaAvisos = () => {
    if (!selectedConsorcio) return [];
    
    const unidadesConsorcio = unidades.filter(u => u.consorcioId === selectedConsorcio);
    
    switch (selectedTipo) {
      case 'vencimiento':
        // Unidades con expensas próximas a vencer (próximos 7 días)
        const proximoVencimiento = new Date();
        proximoVencimiento.setDate(proximoVencimiento.getDate() + 7);
        
        return unidadesConsorcio.filter(unidad => {
          const expensasPendientes = expensas.filter(e => 
            e.unidadId === unidad.id && 
            !e.pagada && 
            new Date(e.vencimiento) <= proximoVencimiento
          );
          return expensasPendientes.length > 0;
        });
        
      case 'mora':
        // Unidades con expensas vencidas
        return unidadesConsorcio.filter(unidad => {
          const expensasVencidas = expensas.filter(e => 
            e.unidadId === unidad.id && 
            !e.pagada && 
            new Date(e.vencimiento) < new Date()
          );
          return expensasVencidas.length > 0;
        });
        
      case 'recordatorio':
        // Todas las unidades con expensas pendientes
        return unidadesConsorcio.filter(unidad => {
          const expensasPendientes = expensas.filter(e => 
            e.unidadId === unidad.id && !e.pagada
          );
          return expensasPendientes.length > 0;
        });
        
      default:
        return unidadesConsorcio;
    }
  };

  const getMensajePredeterminado = (tipo: Aviso['tipo']) => {
    const consorcio = consorcios.find(c => c.id === selectedConsorcio);
    const nombreConsorcio = consorcio?.nombre || 'Consorcio';
    
    switch (tipo) {
      case 'vencimiento':
        return `Estimado propietario,\n\nLe recordamos que su expensa del ${nombreConsorcio} vence próximamente. Por favor, proceda con el pago para evitar recargos.\n\nGracias por su atención.\n\nAdministración`;
        
      case 'mora':
        return `Estimado propietario,\n\nSu expensa del ${nombreConsorcio} se encuentra vencida. Le solicitamos regularice su situación a la brevedad para evitar mayores inconvenientes.\n\nPara consultas, contáctese con la administración.\n\nAdministración`;
        
      case 'recordatorio':
        return `Estimado propietario,\n\nLe recordamos que tiene expensas pendientes de pago en ${nombreConsorcio}. Por favor, verifique su estado de cuenta.\n\nGracias por su atención.\n\nAdministración`;
        
      default:
        return '';
    }
  };

  const enviarAvisos = () => {
    if (!selectedConsorcio || !mensaje.trim()) {
      alert('Debe completar todos los campos');
      return;
    }

    const unidadesDestino = getUnidadesParaAvisos();
    
    if (unidadesDestino.length === 0) {
      alert('No hay unidades que cumplan los criterios para este tipo de aviso');
      return;
    }

    const nuevosAvisos: Aviso[] = unidadesDestino.map(unidad => ({
      id: generateId(),
      consorcioId: selectedConsorcio,
      unidadId: unidad.id,
      tipo: selectedTipo,
      mensaje: mensaje,
      fechaEnvio: new Date().toISOString(),
      enviado: true, // En una implementación real, esto dependería del resultado del envío
      createdAt: new Date().toISOString()
    }));

    nuevosAvisos.forEach(aviso => saveAviso(aviso));
    setAvisos([...avisos, ...nuevosAvisos]);
    
    alert(`Se enviaron ${nuevosAvisos.length} avisos correctamente`);
    setShowModal(false);
    setMensaje('');
  };

  const tipoLabels = {
    vencimiento: 'Próximo Vencimiento',
    mora: 'Mora',
    recordatorio: 'Recordatorio'
  };

  const tipoIcons = {
    vencimiento: Clock,
    mora: AlertTriangle,
    recordatorio: Bell
  };

  const tipoColors = {
    vencimiento: 'bg-yellow-100 text-yellow-800',
    mora: 'bg-red-100 text-red-800',
    recordatorio: 'bg-blue-100 text-blue-800'
  };

  React.useEffect(() => {
    if (selectedConsorcio && selectedTipo) {
      setMensaje(getMensajePredeterminado(selectedTipo));
    }
  }, [selectedConsorcio, selectedTipo]);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div className="flex items-center gap-3">
          <Bell className="text-primary-600" size={28} />
          <h1 className="text-2xl font-bold text-primary-800">Sistema de Avisos</h1>
        </div>
        <button
          onClick={() => setShowModal(true)}
          className="btn-primary flex items-center gap-2"
          disabled={consorcios.length === 0}
        >
          <Send size={20} />
          Enviar Avisos
        </button>
      </div>

      {consorcios.length === 0 && (
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
          <p className="text-yellow-800">
            Debe crear al menos un consorcio con unidades y expensas antes de enviar avisos.
          </p>
        </div>
      )}

      {/* Filters */}
      <div className="card">
        <div>
          <label className="block text-sm font-medium text-primary-700 mb-1">
            Filtrar por Consorcio
          </label>
          <select
            value={selectedConsorcio}
            onChange={(e) => setSelectedConsorcio(e.target.value)}
            className="input-field max-w-md"
          >
            <option value="">Todos los consorcios</option>
            {consorcios.map((consorcio) => (
              <option key={consorcio.id} value={consorcio.id}>
                {consorcio.nombre}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Statistics */}
      <div className="card">
        <h3 className="text-lg font-semibold text-primary-800 mb-4">Estadísticas de Avisos</h3>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {(() => {
            const totalAvisos = filteredAvisos.length;
            const avisosHoy = filteredAvisos.filter(a => {
              const avisoDate = new Date(a.fechaEnvio);
              const today = new Date();
              return avisoDate.toDateString() === today.toDateString();
            }).length;
            const avisosMora = filteredAvisos.filter(a => a.tipo === 'mora').length;
            const avisosVencimiento = filteredAvisos.filter(a => a.tipo === 'vencimiento').length;

            return (
              <>
                <div className="bg-blue-50 p-4 rounded-lg">
                  <p className="text-sm text-blue-600">Total Avisos</p>
                  <p className="text-2xl font-bold text-blue-800">{totalAvisos}</p>
                </div>
                <div className="bg-success-50 p-4 rounded-lg">
                  <p className="text-sm text-success-600">Enviados Hoy</p>
                  <p className="text-2xl font-bold text-success-800">{avisosHoy}</p>
                </div>
                <div className="bg-red-50 p-4 rounded-lg">
                  <p className="text-sm text-red-600">Avisos de Mora</p>
                  <p className="text-2xl font-bold text-red-800">{avisosMora}</p>
                </div>
                <div className="bg-yellow-50 p-4 rounded-lg">
                  <p className="text-sm text-yellow-600">Próx. Vencimiento</p>
                  <p className="text-2xl font-bold text-yellow-800">{avisosVencimiento}</p>
                </div>
              </>
            );
          })()}
        </div>
      </div>

      {/* Avisos Table */}
      <div className="card">
        <div className="overflow-x-auto">
          <table className="min-w-full">
            <thead>
              <tr>
                <th className="table-header">Fecha</th>
                <th className="table-header">Consorcio</th>
                <th className="table-header">Unidad</th>
                <th className="table-header">Tipo</th>
                <th className="table-header">Estado</th>
                <th className="table-header">Mensaje</th>
              </tr>
            </thead>
            <tbody>
              {filteredAvisos.map((aviso) => {
                const TipoIcon = tipoIcons[aviso.tipo];
                return (
                  <tr key={aviso.id}>
                    <td className="table-cell">{formatDate(aviso.fechaEnvio)}</td>
                    <td className="table-cell">
                      <div className="flex items-center gap-2">
                        <Building2 size={16} className="text-primary-500" />
                        {getConsorcioName(aviso.consorcioId)}
                      </div>
                    </td>
                    <td className="table-cell font-medium">
                      {getUnidadInfo(aviso.unidadId)}
                    </td>
                    <td className="table-cell">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium flex items-center gap-1 w-fit ${tipoColors[aviso.tipo]}`}>
                        <TipoIcon size={14} />
                        {tipoLabels[aviso.tipo]}
                      </span>
                    </td>
                    <td className="table-cell">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium flex items-center gap-1 w-fit ${
                        aviso.enviado ? 'bg-success-100 text-success-800' : 'bg-primary-100 text-primary-800'
                      }`}>
                        <CheckCircle size={14} />
                        {aviso.enviado ? 'Enviado' : 'Pendiente'}
                      </span>
                    </td>
                    <td className="table-cell">
                      <div className="max-w-xs truncate" title={aviso.mensaje}>
                        {aviso.mensaje}
                      </div>
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
          <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <h2 className="text-xl font-bold text-primary-800 mb-4">
                Enviar Avisos Masivos
              </h2>
              
              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
                      Tipo de Aviso
                    </label>
                    <select
                      required
                      value={selectedTipo}
                      onChange={(e) => setSelectedTipo(e.target.value as Aviso['tipo'])}
                      className="input-field"
                    >
                      <option value="vencimiento">Próximo Vencimiento</option>
                      <option value="mora">Mora</option>
                      <option value="recordatorio">Recordatorio</option>
                    </select>
                  </div>
                </div>

                {selectedConsorcio && (
                  <div className="bg-primary-50 p-4 rounded-lg">
                    <p className="text-sm text-primary-700">
                      <strong>Destinatarios:</strong> {getUnidadesParaAvisos().length} unidades
                    </p>
                    <p className="text-xs text-primary-600 mt-1">
                      {selectedTipo === 'vencimiento' && 'Unidades con expensas que vencen en los próximos 7 días'}
                      {selectedTipo === 'mora' && 'Unidades con expensas vencidas'}
                      {selectedTipo === 'recordatorio' && 'Unidades con expensas pendientes'}
                    </p>
                  </div>
                )}

                <div>
                  <label className="block text-sm font-medium text-primary-700 mb-1">
                    Mensaje
                  </label>
                  <textarea
                    required
                    value={mensaje}
                    onChange={(e) => setMensaje(e.target.value)}
                    className="input-field h-32 resize-none"
                    placeholder="Escriba el mensaje del aviso..."
                  />
                </div>

                <div className="flex gap-3 pt-4">
                  <button
                    onClick={enviarAvisos}
                    className="btn-primary flex-1"
                    disabled={!selectedConsorcio || !mensaje.trim()}
                  >
                    Enviar Avisos
                  </button>
                  <button
                    onClick={() => setShowModal(false)}
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

export default AvisosManager;