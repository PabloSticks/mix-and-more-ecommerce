const { PrismaClient } = require('@prisma/client')
const prisma = new PrismaClient()

async function main() {
  console.log('🌱 Comenzando la siembra de productos...')

  // Limpiamos la tabla para evitar duplicados
  try {
    await prisma.product.deleteMany({})
    console.log('🗑️  Tabla de productos limpiada.')
  } catch (e) {
    console.log('⚠️  Tabla nueva, continuando...')
  }

  const products = [
    // --- FRUTOS SECOS ---
    {
      name: 'Almendras Naturales',
      description: '250g - Selección Premium, ricas en calcio.',
      price: 1500,
      image: '/imagenes/almendras.jpg',
      category: 'Frutos Secos',
      tags: 'natural,keto,snack,energia',
      stock: 50
    },
    {
      name: 'Nueces Mariposa',
      description: '250g - Ricas en Omega 3 y antioxidantes.',
      price: 1490,
      image: '/imagenes/nueces.jpg',
      category: 'Frutos Secos',
      tags: 'cerebro,omega3,natural,baking',
      stock: 40
    },
    {
      name: 'Maní Tostado sin Sal',
      description: '250g - El snack clásico, alto en proteína.',
      price: 990,
      image: '/imagenes/mani_tostado.jpg',
      category: 'Frutos Secos',
      tags: 'economico,proteina,snack,salado',
      stock: 100
    },
    {
      name: 'Pistachos Tostados',
      description: '200g - Con cáscara y sal de mar.',
      price: 2500,
      image: '/imagenes/pistacho.jfif', // OJO: Extensión .jfif
      category: 'Gourmet',
      tags: 'premium,salado,fibra,gourmet',
      stock: 20
    },
    {
      name: 'Castañas de Cajú',
      description: '250g - Sabor suave y textura cremosa.',
      price: 2690,
      image: '/imagenes/castanas_caju.png', // OJO: Extensión .png
      category: 'Frutos Secos',
      tags: 'cremoso,energia,premium,keto',
      stock: 30
    },

    // --- SEMILLAS ---
    {
      name: 'Semillas de Chía',
      description: '200g - Superalimento rico en fibra.',
      price: 1200,
      image: '/imagenes/chia_semillas.jpg',
      category: 'Semillas',
      tags: 'superalimento,omega3,vegan,digestivo',
      stock: 45
    },
    {
      name: 'Semillas de Calabaza',
      description: '200g - Pepitas verdes, fuente de magnesio.',
      price: 1600,
      image: '/imagenes/calabaza.png', // OJO: Extensión .png
      category: 'Semillas',
      tags: 'magnesio,keto,snack,vegan',
      stock: 35
    },
    {
      name: 'Semillas de Lino (Linaza)',
      description: '250g - Ideales para yogurt y batidos.',
      price: 1100,
      image: '/imagenes/lino_semillas.jpg',
      category: 'Semillas',
      tags: 'fibra,digestivo,baking,vegan',
      stock: 40
    },

    // --- CEREALES Y DESAYUNO ---
    {
      name: 'Avena Integral',
      description: '500g - Hojuela entera tradicional.',
      price: 1390,
      image: '/imagenes/avena.jpg',
      category: 'Cereales',
      tags: 'desayuno,fibra,energia,basico',
      stock: 60
    },
    {
      name: 'Granola Artesanal',
      description: '400g - Horneada con miel y nueces.',
      price: 2500,
      image: '/imagenes/granola.jpg',
      category: 'Cereales',
      tags: 'desayuno,dulce,crunchy,mix',
      stock: 25
    },

    // --- DULCES Y FRUTAS ---
    {
      name: 'Arándanos Deshidratados',
      description: '200g - Dulces y llenos de antioxidantes.',
      price: 1600,
      image: '/imagenes/arandanos.jpg',
      category: 'Frutas Secas',
      tags: 'dulce,antioxidante,snack,baking',
      stock: 30
    },
    {
      name: 'Dátiles Medjool',
      description: '250g - Sustituto natural del azúcar.',
      price: 2990,
      image: '/imagenes/datiles.jpg',
      category: 'Frutas Secas',
      tags: 'dulce,energia,pre-entreno,gourmet',
      stock: 20
    },
    {
      name: 'Cerezas Deshidratadas',
      description: '200g - Sabor intenso y natural.',
      price: 1800,
      image: '/imagenes/cerezas.jpg',
      category: 'Frutas Secas',
      tags: 'dulce,gourmet,snack,antioxidante',
      stock: 15
    },
    {
      name: 'Miel Pura de Abeja',
      description: '500g - 100% Natural de la zona.',
      price: 4990,
      image: '/imagenes/miel.jpg',
      category: 'Endulzantes',
      tags: 'natural,dulce,antibiotico,cocina',
      stock: 10
    },

    // --- MEZCLAS (MIXES) ---
    {
      name: 'Mix Energía',
      description: '300g - Pasas, maní y almendras.',
      price: 1690,
      image: '/imagenes/mix.jpg',
      category: 'Mezclas',
      tags: 'energia,mix,deporte,economico',
      stock: 50
    },
    {
      name: 'Mix Premium',
      description: '300g - Solo frutos nobles, sin pasas.',
      price: 2890,
      image: '/imagenes/mix2.jpg',
      category: 'Mezclas',
      tags: 'premium,keto,mix,snack',
      stock: 30
    },
  ]

  for (const product of products) {
    await prisma.product.create({
      data: product,
    })
  }

  console.log('✅ Base de datos llenada con éxito!')
}

main()
  .then(async () => {
    await prisma.$disconnect()
  })
  .catch(async (e) => {
    console.error(e)
    await prisma.$disconnect()
    process.exit(1)
  })