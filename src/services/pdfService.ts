import jsPDF from 'jspdf';
import { Pago, Expensa, Unidad, Consorcio } from '../types';
import { formatCurrency, formatDate } from './dataService';

export const generateComprobantePDF = (
  pago: Pago,
  expensa: Expensa,
  unidad: Unidad,
  consorcio: Consorcio
): void => {
  const doc = new jsPDF();
  
  // Header
  doc.setFontSize(20);
  doc.setFont('helvetica', 'bold');
  doc.text('COMPROBANTE DE PAGO', 105, 30, { align: 'center' });
  
  // Consorcio info
  doc.setFontSize(12);
  doc.setFont('helvetica', 'normal');
  doc.text(`${consorcio.nombre}`, 20, 50);
  doc.text(`CUIT: ${consorcio.cuit}`, 20, 60);
  doc.text(`${consorcio.direccion}`, 20, 70);
  doc.text(`Tel: ${consorcio.telefono}`, 20, 80);
  
  // Comprobante info
  doc.text(`Comprobante N°: ${pago.id.slice(-8).toUpperCase()}`, 120, 50);
  doc.text(`Fecha: ${formatDate(pago.fecha)}`, 120, 60);
  
  // Line separator
  doc.line(20, 90, 190, 90);
  
  // Payment details
  doc.setFontSize(14);
  doc.setFont('helvetica', 'bold');
  doc.text('DETALLE DEL PAGO', 20, 105);
  
  doc.setFontSize(12);
  doc.setFont('helvetica', 'normal');
  doc.text(`Unidad: ${unidad.numero} - Piso: ${unidad.piso}`, 20, 120);
  doc.text(`Propietario: ${unidad.propietario}`, 20, 130);
  doc.text(`Período: ${expensa.periodo}`, 20, 140);
  doc.text(`Método de Pago: ${pago.metodoPago.replace('_', ' ').toUpperCase()}`, 20, 150);
  
  // Amount
  doc.setFontSize(16);
  doc.setFont('helvetica', 'bold');
  doc.text(`MONTO: ${formatCurrency(pago.monto)}`, 20, 170);
  
  // Footer
  doc.setFontSize(10);
  doc.setFont('helvetica', 'normal');
  doc.text('Este comprobante certifica el pago de la expensa correspondiente.', 105, 250, { align: 'center' });
  doc.text(`Administrador: ${consorcio.administrador}`, 105, 260, { align: 'center' });
  
  // Save PDF
  doc.save(`comprobante-${unidad.numero}-${expensa.periodo}.pdf`);
};

export const generateReporteMensualPDF = (
  consorcio: Consorcio,
  periodo: string,
  expensas: Expensa[],
  unidades: Unidad[],
  pagos: Pago[]
): void => {
  const doc = new jsPDF();
  
  // Header
  doc.setFontSize(18);
  doc.setFont('helvetica', 'bold');
  doc.text('REPORTE MENSUAL DE EXPENSAS', 105, 30, { align: 'center' });
  
  // Consorcio info
  doc.setFontSize(12);
  doc.setFont('helvetica', 'normal');
  doc.text(`${consorcio.nombre}`, 20, 50);
  doc.text(`Período: ${periodo}`, 20, 60);
  doc.text(`Fecha de emisión: ${formatDate(new Date().toISOString())}`, 20, 70);
  
  // Summary
  const totalExpensas = expensas.reduce((sum, exp) => sum + exp.monto, 0);
  const totalPagos = pagos.reduce((sum, pago) => sum + pago.monto, 0);
  const morosidad = ((totalExpensas - totalPagos) / totalExpensas) * 100;
  
  doc.setFontSize(14);
  doc.setFont('helvetica', 'bold');
  doc.text('RESUMEN', 20, 90);
  
  doc.setFontSize(12);
  doc.setFont('helvetica', 'normal');
  doc.text(`Total Expensas Emitidas: ${formatCurrency(totalExpensas)}`, 20, 105);
  doc.text(`Total Pagos Recibidos: ${formatCurrency(totalPagos)}`, 20, 115);
  doc.text(`Morosidad: ${morosidad.toFixed(1)}%`, 20, 125);
  
  // Details table header
  let yPosition = 145;
  doc.setFontSize(10);
  doc.setFont('helvetica', 'bold');
  doc.text('Unidad', 20, yPosition);
  doc.text('Propietario', 50, yPosition);
  doc.text('Monto', 120, yPosition);
  doc.text('Estado', 150, yPosition);
  
  // Line under header
  doc.line(20, yPosition + 2, 190, yPosition + 2);
  yPosition += 10;
  
  // Details
  doc.setFont('helvetica', 'normal');
  expensas.forEach((expensa) => {
    const unidad = unidades.find(u => u.id === expensa.unidadId);
    if (unidad && yPosition < 270) {
      doc.text(unidad.numero, 20, yPosition);
      doc.text(unidad.propietario.substring(0, 20), 50, yPosition);
      doc.text(formatCurrency(expensa.monto), 120, yPosition);
      doc.text(expensa.pagada ? 'PAGADO' : 'PENDIENTE', 150, yPosition);
      yPosition += 8;
    }
  });
  
  // Save PDF
  doc.save(`reporte-${consorcio.nombre.replace(/\s+/g, '-')}-${periodo}.pdf`);
};