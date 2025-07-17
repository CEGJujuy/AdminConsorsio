import { Consorcio, Unidad, Expensa, Pago, Aviso } from '../types';

const STORAGE_KEYS = {
  CONSORCIOS: 'adminConsorcio_consorcios',
  UNIDADES: 'adminConsorcio_unidades',
  EXPENSAS: 'adminConsorcio_expensas',
  PAGOS: 'adminConsorcio_pagos',
  AVISOS: 'adminConsorcio_avisos',
};

// Consorcios
export const getConsorcios = (): Consorcio[] => {
  const data = localStorage.getItem(STORAGE_KEYS.CONSORCIOS);
  return data ? JSON.parse(data) : [];
};

export const saveConsorcio = (consorcio: Consorcio): void => {
  const consorcios = getConsorcios();
  const existingIndex = consorcios.findIndex(c => c.id === consorcio.id);
  
  if (existingIndex >= 0) {
    consorcios[existingIndex] = consorcio;
  } else {
    consorcios.push(consorcio);
  }
  
  localStorage.setItem(STORAGE_KEYS.CONSORCIOS, JSON.stringify(consorcios));
};

export const deleteConsorcio = (id: string): void => {
  const consorcios = getConsorcios().filter(c => c.id !== id);
  localStorage.setItem(STORAGE_KEYS.CONSORCIOS, JSON.stringify(consorcios));
  
  // También eliminar unidades, expensas y pagos relacionados
  const unidades = getUnidades().filter(u => u.consorcioId !== id);
  localStorage.setItem(STORAGE_KEYS.UNIDADES, JSON.stringify(unidades));
  
  const expensas = getExpensas().filter(e => e.consorcioId !== id);
  localStorage.setItem(STORAGE_KEYS.EXPENSAS, JSON.stringify(expensas));
  
  const pagos = getPagos().filter(p => p.consorcioId !== id);
  localStorage.setItem(STORAGE_KEYS.PAGOS, JSON.stringify(pagos));
};

// Unidades
export const getUnidades = (): Unidad[] => {
  const data = localStorage.getItem(STORAGE_KEYS.UNIDADES);
  return data ? JSON.parse(data) : [];
};

export const getUnidadesByConsorcio = (consorcioId: string): Unidad[] => {
  return getUnidades().filter(u => u.consorcioId === consorcioId);
};

export const saveUnidad = (unidad: Unidad): void => {
  const unidades = getUnidades();
  const existingIndex = unidades.findIndex(u => u.id === unidad.id);
  
  if (existingIndex >= 0) {
    unidades[existingIndex] = unidad;
  } else {
    unidades.push(unidad);
  }
  
  localStorage.setItem(STORAGE_KEYS.UNIDADES, JSON.stringify(unidades));
};

export const deleteUnidad = (id: string): void => {
  const unidades = getUnidades().filter(u => u.id !== id);
  localStorage.setItem(STORAGE_KEYS.UNIDADES, JSON.stringify(unidades));
  
  // También eliminar expensas y pagos relacionados
  const expensas = getExpensas().filter(e => e.unidadId !== id);
  localStorage.setItem(STORAGE_KEYS.EXPENSAS, JSON.stringify(expensas));
  
  const pagos = getPagos().filter(p => p.unidadId !== id);
  localStorage.setItem(STORAGE_KEYS.PAGOS, JSON.stringify(pagos));
};

// Expensas
export const getExpensas = (): Expensa[] => {
  const data = localStorage.getItem(STORAGE_KEYS.EXPENSAS);
  return data ? JSON.parse(data) : [];
};

export const getExpensasByConsorcio = (consorcioId: string): Expensa[] => {
  return getExpensas().filter(e => e.consorcioId === consorcioId);
};

export const saveExpensa = (expensa: Expensa): void => {
  const expensas = getExpensas();
  const existingIndex = expensas.findIndex(e => e.id === expensa.id);
  
  if (existingIndex >= 0) {
    expensas[existingIndex] = expensa;
  } else {
    expensas.push(expensa);
  }
  
  localStorage.setItem(STORAGE_KEYS.EXPENSAS, JSON.stringify(expensas));
};

export const deleteExpensa = (id: string): void => {
  const expensas = getExpensas().filter(e => e.id !== id);
  localStorage.setItem(STORAGE_KEYS.EXPENSAS, JSON.stringify(expensas));
  
  // También eliminar pagos relacionados
  const pagos = getPagos().filter(p => p.expensaId !== id);
  localStorage.setItem(STORAGE_KEYS.PAGOS, JSON.stringify(pagos));
};

// Pagos
export const getPagos = (): Pago[] => {
  const data = localStorage.getItem(STORAGE_KEYS.PAGOS);
  return data ? JSON.parse(data) : [];
};

export const getPagosByExpensa = (expensaId: string): Pago[] => {
  return getPagos().filter(p => p.expensaId === expensaId);
};

export const savePago = (pago: Pago): void => {
  const pagos = getPagos();
  const existingIndex = pagos.findIndex(p => p.id === pago.id);
  
  if (existingIndex >= 0) {
    pagos[existingIndex] = pago;
  } else {
    pagos.push(pago);
  }
  
  localStorage.setItem(STORAGE_KEYS.PAGOS, JSON.stringify(pagos));
  
  // Marcar expensa como pagada
  const expensas = getExpensas();
  const expensaIndex = expensas.findIndex(e => e.id === pago.expensaId);
  if (expensaIndex >= 0) {
    expensas[expensaIndex].pagada = true;
    localStorage.setItem(STORAGE_KEYS.EXPENSAS, JSON.stringify(expensas));
  }
};

export const deletePago = (id: string): void => {
  const pagos = getPagos();
  const pago = pagos.find(p => p.id === id);
  
  if (pago) {
    const filteredPagos = pagos.filter(p => p.id !== id);
    localStorage.setItem(STORAGE_KEYS.PAGOS, JSON.stringify(filteredPagos));
    
    // Marcar expensa como no pagada si no hay otros pagos
    const remainingPagos = filteredPagos.filter(p => p.expensaId === pago.expensaId);
    if (remainingPagos.length === 0) {
      const expensas = getExpensas();
      const expensaIndex = expensas.findIndex(e => e.id === pago.expensaId);
      if (expensaIndex >= 0) {
        expensas[expensaIndex].pagada = false;
        localStorage.setItem(STORAGE_KEYS.EXPENSAS, JSON.stringify(expensas));
      }
    }
  }
};

// Avisos
export const getAvisos = (): Aviso[] => {
  const data = localStorage.getItem(STORAGE_KEYS.AVISOS);
  return data ? JSON.parse(data) : [];
};

export const saveAviso = (aviso: Aviso): void => {
  const avisos = getAvisos();
  const existingIndex = avisos.findIndex(a => a.id === aviso.id);
  
  if (existingIndex >= 0) {
    avisos[existingIndex] = aviso;
  } else {
    avisos.push(aviso);
  }
  
  localStorage.setItem(STORAGE_KEYS.AVISOS, JSON.stringify(avisos));
};

// Utilidades
export const generateId = (): string => {
  return Date.now().toString(36) + Math.random().toString(36).substr(2);
};

export const formatCurrency = (amount: number): string => {
  return new Intl.NumberFormat('es-AR', {
    style: 'currency',
    currency: 'ARS'
  }).format(amount);
};

export const formatDate = (date: string): string => {
  return new Date(date).toLocaleDateString('es-AR');
};