'use strict';

/** @type {import('sequelize-cli').Seeder} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.bulkInsert('BlogArticles', [
      {
        title: 'Comunidad Canaria Identifica Barreras: Reportes que Generan Cambio',
        description: 'Conoce cómo ciudadanos de toda Canarias están utilizando la plataforma para reportar barreras de accesibilidad y promover mejoras en sus comunidades.',
        content: 'Canarias Accesible está transformando la forma en que identificamos y abordamos las barreras de accesibilidad en nuestras islas. Desde ramales de escaleras sin pasamanos hasta ausencia de acceso en transporte público, cada reporte contribuye a un mapa colaborativo que refleja la realidad de nuestras ciudades. Los ciudadanos no solo denuncian problemas, sino que también destacan espacios accesibles como referentes, creando una base de datos viva de buenas prácticas. Estas aportaciones son esenciales para que administraciones públicas y empresas privadas puedan priorizar sus inversiones en accesibilidad. La participación ciudadana es el corazón de esta iniciativa.',
        dateCreation: new Date('2025-11-01'),
        nameFile: 'https://images-cruds.fra1.digitaloceanspaces.com/blog-image/photo-1552664730-d307ca884978.jpeg',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        title: 'Pautas WCAG 2.2: Garantizando una Web Accesible para Todos',
        description: 'Descubre cómo las directrices WCAG 2.2 aseguran que plataformas como Canarias Accesible sean inclusivas y usables para personas con discapacidades.',
        content: 'Las Pautas de Accesibilidad para el Contenido Web (WCAG) 2.2 son el estándar internacional para crear experiencias digitales inclusivas. Canarias Accesible ha sido diseñada siguiendo estos principios fundamentales: perceivable (contenido visible para todos), operable (navegable sin ratón), comprensible (información clara) y robusto (compatible con tecnologías de asistencia). Desde lectores de pantalla hasta navegación por teclado, cada funcionalidad ha sido pensada para personas con discapacidades visuales, auditivas, motoras o cognitivas. Implementar WCAG 2.2 no es solo cumplir normas, es reconocer que la accesibilidad digital es un derecho fundamental que amplia el alcance de la información a toda la comunidad.',
        dateCreation: new Date('2025-11-02'),
        nameFile: 'https://images-cruds.fra1.digitaloceanspaces.com/blog-image/photo-1519389950473-47ba0277781c.jpeg',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        title: 'Mapas Interactivos: Visualizando la Accesibilidad en Canarias',
        description: 'Explora cómo los mapas dinámicos de Canarias Accesible permiten filtrar y descubrir espacios accesibles o barreas en tiempo real.',
        content: 'La visualización espacial es una herramienta poderosa para entender la accesibilidad en nuestras islas. El mapa interactivo de Canarias Accesible permite a los usuarios ver de un vistazo dónde existen barreras, dónde hay buenos ejemplos de accesibilidad y cuáles son los patrones geográficos. Con filtros por tipo de barrera (movilidad, sensorial, cognitiva), nivel de accesibilidad (excelente, bueno, deficiente) e isla, los usuarios pueden encontrar exactamente lo que buscan. Esta información es invaluable para personas con discapacidades que planifican sus desplazamientos, para investigadores que estudian patrones de accesibilidad, y para tomadores de decisiones que necesitan priorizar inversiones. El mapa no es solo una herramienta, es un espejo de nuestra comunidad.',
        dateCreation: new Date('2025-11-03'),
        nameFile: 'https://images-cruds.fra1.digitaloceanspaces.com/blog-image/700px-Canarias-rotulado.webp',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        title: 'Contenido Multimedia Accesible: Imágenes, Videos y Descripciones Alternativas',
        description: 'Aprende por qué las descripciones alternativas y la accesibilidad multimedia son fundamentales en Canarias Accesible.',
        content: 'El contenido visual es crucial para documentar barreras y buenas prácticas de accesibilidad. Sin embargo, las imágenes y videos no son accesibles para personas ciegas o con baja visión a menos que incluyan descripciones alternativas detalladas. Canarias Accesible permite a los usuarios compartir fotografías de espacios accesibles con descripciones en texto, videos con subtítulos y transcripciones. Estas descripciones no solo cumplen con estándares de accesibilidad (WCAG 2.2), sino que también enriquecen la experiencia de todos los usuarios. Una rampa bien documentada con foto y descripción clara es más útil que solo una ubicación en el mapa. Invertir en contenido multimedia accesible es invertir en una comunidad que se comunica mejor y se comprende profundamente.',
        dateCreation: new Date('2025-11-04'),
        nameFile: 'https://images-cruds.fra1.digitaloceanspaces.com/blog-image/photo-1504384308090-c894fdcc538d.jpeg',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        title: 'Responsivo y Multiplataforma: Canarias Accesible en tu Dispositivo',
        description: 'Descubre cómo Canarias Accesible es accesible desde cualquier dispositivo: móvil, tablet o computadora.',
        content: 'La accesibilidad no solo trata sobre personas con discapacidades: también trata sobre acceso equitativo. En Canarias, no todos los ciudadanos tienen acceso a computadoras de escritorio, pero la mayoría tiene un teléfono móvil. Canarias Accesible ha sido diseñada con un enfoque mobile-first, asegurando que la experiencia sea perfecta en pantallas pequeñas sin sacrificar funcionalidad. El mapa interactivo, los formularios de reporte, la visualización de fichas descriptivas: todo funciona fluidamente en cualquier dispositivo. Además, la aplicación es responsiva, adaptándose automáticamente a diferentes tamaños de pantalla. Los usuarios pueden reportar una barrera en tiempo real mientras caminan por la ciudad, compartir su experiencia instantáneamente, y ver recomendaciones de rutas accesibles. Esta conectividad universal es esencial para una verdadera transformación de la accesibilidad en Canarias.',
        dateCreation: new Date('2025-11-05'),
        nameFile: 'https://images-cruds.fra1.digitaloceanspaces.com/blog-image/walls-io-VkhP-zriXZQ-unsplash.jpg',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ], {});
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.bulkDelete('BlogArticles', null, {});
  }
};
