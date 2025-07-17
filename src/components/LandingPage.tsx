import React from 'react';
import { 
  Building2, 
  Calculator, 
  CreditCard, 
  FileText, 
  Bell, 
  BarChart3,
  CheckCircle,
  Star,
  Users,
  Shield,
  Zap,
  Download,
  Play,
  ArrowRight,
  Phone,
  Mail,
  MapPin
} from 'lucide-react';

interface LandingPageProps {
  onEnterApp: () => void;
}

const LandingPage: React.FC<LandingPageProps> = ({ onEnterApp }) => {
  const features = [
    {
      icon: Building2,
      title: 'Gestión de Consorcios',
      description: 'Administra múltiples edificios con datos fiscales completos y organizados.'
    },
    {
      icon: Calculator,
      title: 'Cálculo Automático',
      description: 'Genera expensas automáticamente basadas en porcentajes por unidad.'
    },
    {
      icon: CreditCard,
      title: 'Control de Pagos',
      description: 'Registra pagos con múltiples métodos y genera comprobantes al instante.'
    },
    {
      icon: FileText,
      title: 'Comprobantes PDF',
      description: 'Emite comprobantes profesionales y reportes mensuales automáticamente.'
    },
    {
      icon: Bell,
      title: 'Sistema de Avisos',
      description: 'Envía notificaciones automáticas por vencimientos y morosidad.'
    },
    {
      icon: BarChart3,
      title: 'Dashboard Completo',
      description: 'Visualiza métricas, gráficos y estadísticas en tiempo real.'
    }
  ];

  const benefits = [
    {
      icon: Zap,
      title: 'Ahorra Tiempo',
      description: 'Automatiza cálculos y reduce el trabajo manual en un 80%'
    },
    {
      icon: Shield,
      title: 'Datos Seguros',
      description: 'Información almacenada localmente, sin riesgos de filtración'
    },
    {
      icon: Users,
      title: 'Fácil de Usar',
      description: 'Interfaz intuitiva que no requiere capacitación técnica'
    }
  ];

  const testimonials = [
    {
      name: 'María González',
      role: 'Administradora de Consorcio',
      content: 'AdminConsorcio transformó completamente mi trabajo. Lo que antes me tomaba días, ahora lo hago en horas.',
      rating: 5
    },
    {
      name: 'Carlos Rodríguez',
      role: 'Contador Especializado',
      content: 'La generación automática de comprobantes y reportes es increíble. Mis clientes están muy satisfechos.',
      rating: 5
    },
    {
      name: 'Ana Martínez',
      role: 'Administradora Senior',
      content: 'El sistema de avisos automáticos redujo la morosidad en mis edificios significativamente.',
      rating: 5
    }
  ];

  const plans = [
    {
      name: 'Básico',
      price: '$29.99',
      period: '/mes',
      description: 'Perfecto para administradores independientes',
      features: [
        'Hasta 3 consorcios',
        'Gestión de unidades ilimitadas',
        'Cálculo automático de expensas',
        'Comprobantes PDF',
        'Soporte por email'
      ],
      popular: false
    },
    {
      name: 'Profesional',
      price: '$59.99',
      period: '/mes',
      description: 'Ideal para empresas administradoras',
      features: [
        'Consorcios ilimitados',
        'Sistema de avisos automático',
        'Dashboard avanzado con gráficos',
        'Reportes mensuales',
        'Soporte prioritario',
        'Capacitación incluida'
      ],
      popular: true
    },
    {
      name: 'Enterprise',
      price: '$99.99',
      period: '/mes',
      description: 'Para grandes administradoras',
      features: [
        'Todo lo del plan Profesional',
        'API personalizada',
        'Integración con sistemas contables',
        'Soporte 24/7',
        'Consultoría especializada',
        'Personalización avanzada'
      ],
      popular: false
    }
  ];

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <header className="bg-white shadow-sm sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center gap-3">
              <Building2 className="text-success-600" size={32} />
              <span className="text-2xl font-bold text-primary-800">AdminConsorcio</span>
            </div>
            <nav className="hidden md:flex items-center gap-8">
              <a href="#features" className="text-primary-600 hover:text-success-600 transition-colors">Características</a>
              <a href="#benefits" className="text-primary-600 hover:text-success-600 transition-colors">Beneficios</a>
              <a href="#testimonials" className="text-primary-600 hover:text-success-600 transition-colors">Testimonios</a>
              <a href="#pricing" className="text-primary-600 hover:text-success-600 transition-colors">Precios</a>
              <button
                onClick={onEnterApp}
                className="btn-primary flex items-center gap-2"
              >
                <Play size={18} />
                Probar Gratis
              </button>
            </nav>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="bg-gradient-to-br from-primary-50 to-success-50 py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-5xl md:text-6xl font-bold text-primary-900 mb-6">
              Gestión de Expensas
              <span className="text-success-600 block">Profesional</span>
            </h1>
            <p className="text-xl text-primary-700 mb-8 max-w-3xl mx-auto">
              El sistema más completo para administradores de consorcios. 
              Automatiza cálculos, genera comprobantes y controla pagos con una interfaz moderna y profesional.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button
                onClick={onEnterApp}
                className="bg-success-600 hover:bg-success-700 text-white font-semibold py-4 px-8 rounded-lg text-lg transition-colors flex items-center justify-center gap-2"
              >
                <Play size={20} />
                Probar Demo Gratuita
              </button>
              <button className="bg-white hover:bg-primary-50 text-primary-800 font-semibold py-4 px-8 rounded-lg text-lg border border-primary-200 transition-colors flex items-center justify-center gap-2">
                <Download size={20} />
                Descargar Brochure
              </button>
            </div>
            <p className="text-sm text-primary-600 mt-4">
              ✓ Sin instalación ✓ Sin configuración ✓ Listo para usar
            </p>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-primary-900 mb-4">
              Características Principales
            </h2>
            <p className="text-xl text-primary-600 max-w-2xl mx-auto">
              Todo lo que necesitas para gestionar expensas de manera profesional y eficiente
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => {
              const Icon = feature.icon;
              return (
                <div key={index} className="bg-primary-50 p-8 rounded-xl hover:shadow-lg transition-shadow">
                  <div className="bg-success-100 w-16 h-16 rounded-lg flex items-center justify-center mb-6">
                    <Icon className="text-success-600" size={32} />
                  </div>
                  <h3 className="text-xl font-semibold text-primary-900 mb-4">{feature.title}</h3>
                  <p className="text-primary-600">{feature.description}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section id="benefits" className="py-20 bg-primary-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-primary-900 mb-4">
              ¿Por qué elegir AdminConsorcio?
            </h2>
            <p className="text-xl text-primary-600 max-w-2xl mx-auto">
              Beneficios comprobados que transformarán tu gestión administrativa
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {benefits.map((benefit, index) => {
              const Icon = benefit.icon;
              return (
                <div key={index} className="text-center">
                  <div className="bg-success-600 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6">
                    <Icon className="text-white" size={36} />
                  </div>
                  <h3 className="text-2xl font-semibold text-primary-900 mb-4">{benefit.title}</h3>
                  <p className="text-primary-600 text-lg">{benefit.description}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section id="testimonials" className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-primary-900 mb-4">
              Lo que dicen nuestros clientes
            </h2>
            <p className="text-xl text-primary-600 max-w-2xl mx-auto">
              Más de 500 administradores confían en AdminConsorcio
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <div key={index} className="bg-primary-50 p-8 rounded-xl">
                <div className="flex mb-4">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <Star key={i} className="text-yellow-400 fill-current" size={20} />
                  ))}
                </div>
                <p className="text-primary-700 mb-6 italic">"{testimonial.content}"</p>
                <div>
                  <p className="font-semibold text-primary-900">{testimonial.name}</p>
                  <p className="text-primary-600 text-sm">{testimonial.role}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section id="pricing" className="py-20 bg-primary-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-primary-900 mb-4">
              Planes que se adaptan a ti
            </h2>
            <p className="text-xl text-primary-600 max-w-2xl mx-auto">
              Elige el plan perfecto para tu negocio. Todos incluyen soporte técnico
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {plans.map((plan, index) => (
              <div key={index} className={`bg-white rounded-xl p-8 ${plan.popular ? 'ring-2 ring-success-500 relative' : ''}`}>
                {plan.popular && (
                  <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                    <span className="bg-success-500 text-white px-4 py-2 rounded-full text-sm font-medium">
                      Más Popular
                    </span>
                  </div>
                )}
                
                <div className="text-center mb-8">
                  <h3 className="text-2xl font-bold text-primary-900 mb-2">{plan.name}</h3>
                  <p className="text-primary-600 mb-4">{plan.description}</p>
                  <div className="flex items-baseline justify-center">
                    <span className="text-4xl font-bold text-primary-900">{plan.price}</span>
                    <span className="text-primary-600 ml-1">{plan.period}</span>
                  </div>
                </div>
                
                <ul className="space-y-4 mb-8">
                  {plan.features.map((feature, featureIndex) => (
                    <li key={featureIndex} className="flex items-center gap-3">
                      <CheckCircle className="text-success-500 flex-shrink-0" size={20} />
                      <span className="text-primary-700">{feature}</span>
                    </li>
                  ))}
                </ul>
                
                <button className={`w-full py-3 px-6 rounded-lg font-semibold transition-colors ${
                  plan.popular 
                    ? 'bg-success-600 hover:bg-success-700 text-white' 
                    : 'bg-primary-100 hover:bg-primary-200 text-primary-800'
                }`}>
                  Comenzar Ahora
                </button>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-success-600">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-4xl font-bold text-white mb-4">
            ¿Listo para transformar tu gestión?
          </h2>
          <p className="text-xl text-success-100 mb-8 max-w-2xl mx-auto">
            Únete a cientos de administradores que ya optimizaron su trabajo con AdminConsorcio
          </p>
          <button
            onClick={onEnterApp}
            className="bg-white hover:bg-primary-50 text-success-600 font-semibold py-4 px-8 rounded-lg text-lg transition-colors flex items-center justify-center gap-2 mx-auto"
          >
            Comenzar Demo Gratuita
            <ArrowRight size={20} />
          </button>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-primary-900 text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center gap-3 mb-4">
                <Building2 className="text-success-400" size={28} />
                <span className="text-xl font-bold">AdminConsorcio</span>
              </div>
              <p className="text-primary-300 mb-4">
                La solución más completa para la gestión profesional de expensas de edificios.
              </p>
              <div className="flex gap-4">
                <div className="w-10 h-10 bg-primary-800 rounded-full flex items-center justify-center hover:bg-success-600 transition-colors cursor-pointer">
                  <span className="text-sm font-bold">f</span>
                </div>
                <div className="w-10 h-10 bg-primary-800 rounded-full flex items-center justify-center hover:bg-success-600 transition-colors cursor-pointer">
                  <span className="text-sm font-bold">in</span>
                </div>
                <div className="w-10 h-10 bg-primary-800 rounded-full flex items-center justify-center hover:bg-success-600 transition-colors cursor-pointer">
                  <span className="text-sm font-bold">@</span>
                </div>
              </div>
            </div>
            
            <div>
              <h4 className="font-semibold mb-4">Producto</h4>
              <ul className="space-y-2 text-primary-300">
                <li><a href="#" className="hover:text-white transition-colors">Características</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Precios</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Demo</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Actualizaciones</a></li>
              </ul>
            </div>
            
            <div>
              <h4 className="font-semibold mb-4">Soporte</h4>
              <ul className="space-y-2 text-primary-300">
                <li><a href="#" className="hover:text-white transition-colors">Centro de Ayuda</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Documentación</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Capacitación</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Contacto</a></li>
              </ul>
            </div>
            
            <div>
              <h4 className="font-semibold mb-4">Contacto</h4>
              <div className="space-y-3 text-primary-300">
                <div className="flex items-center gap-3">
                  <Phone size={16} />
                  <span>+54 11 4567-8900</span>
                </div>
                <div className="flex items-center gap-3">
                  <Mail size={16} />
                  <span>info@adminconsorcio.com</span>
                </div>
                <div className="flex items-center gap-3">
                  <MapPin size={16} />
                  <span>Buenos Aires, Argentina</span>
                </div>
              </div>
            </div>
          </div>
          
          <div className="border-t border-primary-800 mt-12 pt-8 text-center text-primary-400">
            <p>&copy; 2024 AdminConsorcio. Todos los derechos reservados.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;