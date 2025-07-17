export interface Consorcio {
  id: string;
  nombre: string;
  cuit: string;
  direccion: string;
  telefono: string;
  email: string;
  administrador: string;
  createdAt: string;
}

export interface Unidad {
  id: string;
  consorcioId: string;
  numero: string;
  piso: string;
  propietario: string;
  email: string;
  telefono: string;
  porcentaje: number;
  createdAt: string;
}

export interface Expensa {
  id: string;
  consorcioId: string;
  unidadId: string;
  periodo: string;
  monto: number;
  vencimiento: string;
  pagada: boolean;
  createdAt: string;
}

export interface Pago {
  id: string;
  expensaId: string;
  unidadId: string;
  consorcioId: string;
  fecha: string;
  monto: number;
  metodoPago: 'efectivo' | 'transferencia' | 'cheque' | 'debito_automatico';
  comprobante?: string;
  createdAt: string;
}

export interface Aviso {
  id: string;
  consorcioId: string;
  unidadId: string;
  tipo: 'vencimiento' | 'mora' | 'recordatorio';
  mensaje: string;
  fechaEnvio: string;
  enviado: boolean;
  createdAt: string;
}

export interface DashboardStats {
  totalConsorcios: number;
  totalUnidades: number;
  totalExpensas: number;
  totalPagos: number;
  morosidad: number;
  ingresosMes: number;
}