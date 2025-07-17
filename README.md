# AdminConsorcio - Sistema de Gestión de Expensas

Un sistema completo de gestión de expensas para edificios y consorcios, desarrollado con React, TypeScript y Tailwind CSS. Diseñado para administradores de consorcios que necesitan una herramienta profesional y eficiente para gestionar expensas, pagos y comunicaciones con propietarios.

## 🚀 Características Principales

### 🏢 Gestión de Consorcios
- **Registro completo**: CUIT, razón social, dirección, contacto
- **Edición y eliminación** de consorcios existentes
- **Validaciones** de datos fiscales y de contacto

### 🏠 Gestión de Unidades
- **Carga masiva** de unidades por consorcio
- **Asignación de porcentajes** de expensa personalizados
- **Datos completos** de propietarios (nombre, email, teléfono)
- **Validación automática** de porcentajes (debe sumar 100%)

### 💰 Cálculo Automático de Expensas
- **Generación automática** basada en porcentajes de cada unidad
- **Cálculo proporcional** según superficie y coeficiente
- **Gestión por períodos** mensuales
- **Montos base** configurables por consorcio

### 💳 Registro de Pagos
- **Registro detallado** con fecha, monto y método de pago
- **Múltiples métodos**: Efectivo, transferencia, cheque, débito automático
- **Generación automática** de comprobantes en PDF
- **Control de morosidad** automático

### 📄 Emisión de Comprobantes
- **PDFs profesionales** con datos fiscales completos
- **Comprobantes individuales** por cada pago
- **Reportes mensuales** exportables
- **Diseño corporativo** con logo y formato estándar

### 📧 Sistema de Avisos
- **Avisos automáticos** por vencimiento de expensas
- **Notificaciones de mora** para pagos atrasados
- **Envío masivo** de recordatorios
- **Plantillas personalizables** de mensajes

### 📊 Panel de Control (Dashboard)
- **Métricas clave** en tiempo real
- **Gráficos interactivos** de morosidad y pagos
- **Estadísticas mensuales** y anuales
- **Indicadores de rendimiento** del consorcio

## 🎨 Diseño y UX

### Paleta de Colores Profesional
- **Primario**: Gris oscuro (#1f2937) para navegación
- **Secundario**: Gris claro (#f9fafb) para fondos
- **Acentos**: Verde (#10b981) para acciones positivas
- **Estados**: Rojo para alertas, amarillo para advertencias

### Interfaz Moderna
- **Sidebar responsive** con navegación intuitiva
- **Cards y modales** para organización de contenido
- **Tablas interactivas** con filtros y búsqueda
- **Formularios validados** con feedback visual
- **Iconografía consistente** con Lucide React

## 🛠️ Tecnologías Utilizadas

### Frontend
- **React 18** - Biblioteca principal
- **TypeScript** - Tipado estático
- **Tailwind CSS** - Framework de estilos
- **Lucide React** - Iconografía
- **Recharts** - Gráficos y visualizaciones

### Herramientas de Desarrollo
- **Vite** - Build tool y dev server
- **ESLint** - Linting de código
- **PostCSS** - Procesamiento de CSS

### Librerías Especializadas
- **jsPDF** - Generación de documentos PDF
- **Date-fns** - Manipulación de fechas
- **React Hook Form** - Gestión de formularios

## 📁 Estructura del Proyecto

```
src/
├── components/           # Componentes React
│   ├── Layout.tsx       # Layout principal con sidebar
│   ├── Dashboard.tsx    # Panel de control
│   ├── ConsorciosManager.tsx    # Gestión de consorcios
│   ├── UnidadesManager.tsx      # Gestión de unidades
│   ├── ExpensasManager.tsx      # Gestión de expensas
│   ├── PagosManager.tsx         # Gestión de pagos
│   └── AvisosManager.tsx        # Sistema de avisos
├── services/            # Servicios y lógica de negocio
│   ├── dataService.ts   # Gestión de datos locales
│   └── pdfService.ts    # Generación de PDFs
├── hooks/               # Custom hooks
│   └── useLocalStorage.ts       # Hook para localStorage
├── types/               # Definiciones de TypeScript
│   └── index.ts         # Tipos principales
└── App.tsx              # Componente principal
```

## 🗄️ Modelo de Datos

### Consorcio
```typescript
interface Consorcio {
  id: string;
  nombre: string;
  cuit: string;
  direccion: string;
  telefono: string;
  email: string;
  administrador: string;
}
```

### Unidad
```typescript
interface Unidad {
  id: string;
  consorcioId: string;
  numero: string;
  piso: string;
  propietario: string;
  email: string;
  telefono: string;
  porcentaje: number;
}
```

### Expensa
```typescript
interface Expensa {
  id: string;
  consorcioId: string;
  unidadId: string;
  periodo: string;
  monto: number;
  vencimiento: string;
  pagada: boolean;
}
```

### Pago
```typescript
interface Pago {
  id: string;
  expensaId: string;
  fecha: string;
  monto: number;
  metodoPago: string;
  comprobante?: string;
}
```

## 🚀 Instalación y Uso

### Prerrequisitos
- Node.js 16+ 
- npm o yarn

### Instalación
```bash
# Clonar el repositorio
git clone [repository-url]

# Instalar dependencias
npm install

# Iniciar servidor de desarrollo
npm run dev
```

### Scripts Disponibles
```bash
npm run dev          # Servidor de desarrollo
npm run build        # Build de producción
npm run preview      # Preview del build
npm run lint         # Linting del código
```

## 📱 Funcionalidades Detalladas

### Dashboard
- **Resumen financiero** con totales de expensas y pagos
- **Gráfico de morosidad** por consorcio
- **Estadísticas de pagos** mensuales
- **Alertas** de vencimientos próximos

### Gestión de Consorcios
- **CRUD completo** de consorcios
- **Validación de CUIT** automática
- **Búsqueda y filtros** avanzados

### Gestión de Unidades
- **Asignación por consorcio** seleccionado
- **Cálculo automático** de porcentajes
- **Validación** de suma total (100%)
- **Importación masiva** (futuro)

### Cálculo de Expensas
- **Generación automática** por período
- **Cálculo proporcional** según porcentajes
- **Configuración** de montos base
- **Fechas de vencimiento** automáticas

### Registro de Pagos
- **Múltiples métodos** de pago
- **Generación de comprobantes** automática
- **Control de morosidad** en tiempo real
- **Historial completo** por unidad

### Sistema de Avisos
- **Plantillas predefinidas** de mensajes
- **Envío masivo** por consorcio
- **Seguimiento** de avisos enviados
- **Personalización** de contenido

## 💾 Almacenamiento de Datos

El sistema utiliza **localStorage** del navegador para persistir datos localmente:

- **No requiere servidor** ni base de datos externa
- **Datos seguros** en el dispositivo del usuario
- **Backup manual** mediante exportación
- **Importación/exportación** de datos (futuro)

## 🔒 Seguridad y Privacidad

- **Datos locales**: Toda la información se almacena localmente
- **Sin transmisión**: No se envían datos a servidores externos
- **Validaciones**: Controles de integridad en formularios
- **Backup recomendado**: Exportación periódica de datos

## 🎯 Casos de Uso

### Administrador de Consorcio
1. **Configuración inicial**: Crear consorcio y cargar unidades
2. **Gestión mensual**: Generar expensas y registrar pagos
3. **Control de morosidad**: Enviar avisos y generar reportes
4. **Reportes**: Exportar comprobantes y estadísticas

### Flujo de Trabajo Típico
1. **Crear consorcio** con datos fiscales
2. **Cargar unidades** con porcentajes de expensa
3. **Generar expensas** para el período actual
4. **Registrar pagos** conforme se reciben
5. **Enviar avisos** a morosos
6. **Generar reportes** mensuales

## 🔄 Roadmap Futuro

### Próximas Funcionalidades
- [ ] **Importación CSV** de unidades
- [ ] **Backup automático** en la nube
- [ ] **Notificaciones push** del navegador
- [ ] **Modo offline** completo
- [ ] **Plantillas personalizables** de comprobantes
- [ ] **Integración con email** para envío automático
- [ ] **App móvil** complementaria

### Mejoras Técnicas
- [ ] **Tests unitarios** con Jest
- [ ] **PWA** (Progressive Web App)
- [ ] **Optimización** de rendimiento
- [ ] **Accesibilidad** mejorada (WCAG)

## 🤝 Contribución

Este proyecto está abierto a contribuciones. Para colaborar:

1. Fork del repositorio
2. Crear rama feature (`git checkout -b feature/nueva-funcionalidad`)
3. Commit de cambios (`git commit -am 'Agregar nueva funcionalidad'`)
4. Push a la rama (`git push origin feature/nueva-funcionalidad`)
5. Crear Pull Request

## 📄 Licencia

Este proyecto está bajo la Licencia MIT. Ver el archivo `LICENSE` para más detalles.

## 📞 Soporte

Para soporte técnico o consultas:
- **Issues**: Crear issue en GitHub
- **Email**: [tu-email@ejemplo.com]
- **Documentación**: Wiki del proyecto

---

**AdminConsorcio** - Gestión profesional de expensas para el siglo XXI 🏢✨