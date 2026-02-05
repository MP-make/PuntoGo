import Navbar from './components/Navbar';
import HeroCarousel from './components/HeroCarousel';
import CategoryRail from './components/CategoryRail';
import ProductCard from './components/ProductCard';
import CartDrawer from './components/CartDrawer';
import { getVentifyProducts } from './services/ventifyService';

// 1. Forzamos renderizado dinámico para que no se quede pegado en caché
export const dynamic = "force-dynamic";

// 2. Definimos la interfaz como Promesa (Requisito de Next.js 15)
interface HomeProps {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}

// 3. La función debe ser ASYNC
export default async function Home({ searchParams }: HomeProps) {
  
  // 4. ESPERAMOS a que lleguen los parámetros
  const params = await searchParams;
  
  // Extraemos los valores de forma segura
  const search = typeof params.search === 'string' ? params.search : undefined;
  const category = typeof params.category === 'string' ? params.category : undefined;

  console.log("--- FILTRANDO ---");
  console.log("Búsqueda:", search);
  console.log("Categoría:", category);

  // 5. Obtener productos reales de Ventify
  console.log("📡 Obteniendo productos reales de Ventify...");
  const ventifyProducts = await getVentifyProducts();

  // 6. Mapear productos de Ventify al formato esperado por ProductCard
  const products = ventifyProducts.map(prod => {
    // Calcular stock disponible (stock - reservado)
    const physicalStock = prod.stock || 0;
    const reserved = prod.reservedStock || 0;
    const available = Math.max(0, physicalStock - reserved);
    
    return {
      id: prod.id,
      title: prod.name,
      price: prod.price,
      originalPrice: prod.originalPrice || undefined,
      image: prod.imageUrl || prod.image || '/placeholder-product.png', // Usar imageUrl primero
      rating: prod.rating || 4.5,
      category: prod.category || 'General',
      description: prod.description || '',
      stock: available, // Stock disponible calculado
    };
  });

  console.log(`✅ Mapeados ${products.length} productos para mostrar`);

  // 7. Lógica de Filtrado
  const filteredProducts = products.filter(prod => {
    // Si hay búsqueda, comparamos ignorando mayúsculas/minúsculas
    const matchesSearch = !search || 
      prod.title.toLowerCase().includes(search.toLowerCase());
    
    // Si hay categoría, comparamos de forma flexible (ignorando mayúsculas y espacios)
    let matchesCategory = true;
    if (category) {
      const normalizedCategory = category.toLowerCase().trim();
      const normalizedProdCategory = prod.category.toLowerCase().trim();
      
      // Mapeo de categorías para flexibilidad
      if (normalizedCategory === 'playa') {
        // Playa incluye: verano, bebidas, cervezas, adoquines y marcianos
        matchesCategory = 
          normalizedProdCategory === 'verano' ||
          normalizedProdCategory === 'bebidas' ||
          normalizedProdCategory === 'cervezas' ||
          prod.title.toLowerCase().includes('adoquin') ||
          prod.title.toLowerCase().includes('marciano');
      } else if (normalizedCategory === 'bebidas') {
        // Bebidas muestra todos los productos con categoría "Bebidas"
        matchesCategory = normalizedProdCategory === 'bebidas';
      } else if (normalizedCategory === 'cigarros' || normalizedCategory === 'cigarro') {
        // Buscar productos que tengan "cigarro" en el nombre o categoría
        matchesCategory = 
          normalizedProdCategory.includes('cigarro') || 
          prod.title.toLowerCase().includes('cigarro');
      } else {
        matchesCategory = normalizedProdCategory === normalizedCategory;
      }
    }
    
    return matchesSearch && matchesCategory;
  }).sort((a, b) => {
    // Ordenar primero por stock (productos con stock primero)
    // Si ambos tienen stock o ambos no tienen, mantener orden original
    if (a.stock > 0 && b.stock === 0) return -1;
    if (a.stock === 0 && b.stock > 0) return 1;
    return 0;
  });

  // 8. Configuración de Títulos Dinámicos
  let title = "Ofertas de la Semana";
  let subtitle = "Precios bajos por tiempo limitado";
  const isFiltering = !!search || !!category;

  if (search) {
    title = `Resultados para: "${search}"`;
    subtitle = `Encontramos ${filteredProducts.length} coincidencias`;
  } else if (category) {
    title = category;
    subtitle = `Explora nuestra selección de ${category}`;
  }

  return (
    <div className="bg-gray-50 min-h-screen pb-20 selection:bg-blue-600 selection:text-white">
      <Navbar />
      
      {/* Ocultamos Carrusel y Categorías grandes si estamos filtrando */}
      {!isFiltering && (
        <>
          <HeroCarousel className="mb-6 sm:mb-8" />
          <CategoryRail className="mb-6 sm:mb-8" />
        </>
      )}

      {/* Mostramos botón de volver si hay filtros */}
      {isFiltering && (
        <div className="max-w-7xl mx-auto px-3 sm:px-4 mt-4 sm:mt-6">
           <a href="/" className="inline-flex items-center text-xs sm:text-sm font-medium text-blue-600 hover:text-blue-800 hover:underline transition-colors">
             ← Volver al Inicio
           </a>
           {/* Categorías pequeñas para facilitar navegación */}
           <div className="mt-3 sm:mt-4 scale-90 origin-left">
             <CategoryRail />
           </div>
        </div>
      )}

      <main id="catalogo" className="relative max-w-7xl mx-auto p-3 sm:p-4 mt-3 sm:mt-4 z-10">
        {products.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16 sm:py-24 bg-white/60 backdrop-blur-sm rounded-3xl shadow-glass border border-white/50 text-center">
            <div className="text-5xl sm:text-6xl mb-4 animate-bounce">📦</div>
            <h3 className="text-xl sm:text-2xl font-bold text-slate-800 mb-2">Cargando productos...</h3>
            <p className="text-sm sm:text-base text-gray-500 max-w-md mx-auto px-4">
              Estamos obteniendo los productos más frescos de nuestro catálogo.
            </p>
          </div>
        ) : filteredProducts.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16 sm:py-24 bg-white/60 backdrop-blur-sm rounded-3xl shadow-glass border border-white/50 text-center">
            <div className="text-5xl sm:text-6xl mb-4 grayscale opacity-50">🔍</div>
            <h3 className="text-xl sm:text-2xl font-bold text-slate-800 mb-2">No encontramos ese producto</h3>
            <p className="text-sm sm:text-base text-gray-500 max-w-md mx-auto mb-6 sm:mb-8 px-4">
              No hay coincidencias para "{search || category}". Intenta buscar otros términos.
            </p>
            <a 
              href="/" 
              className="px-6 sm:px-8 py-2 sm:py-3 bg-slate-900 text-white font-bold rounded-lg hover:bg-slate-800 transition-all shadow-lg text-sm sm:text-base"
            >
              Ver todo el catálogo
            </a>
          </div>
        ) : (
          <>
            <div className="flex flex-col sm:flex-row sm:items-end gap-2 sm:gap-3 mb-6 sm:mb-8 border-b border-gray-200 pb-3 sm:pb-4">
              <h2 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight capitalize">{title}</h2>
              {/* Solo mostrar cantidad de productos cuando hay filtros activos */}
              {isFiltering && (
                <span className="text-gray-500 font-medium text-base sm:text-lg">• {filteredProducts.length} productos</span>
              )}
            </div>
            
            <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4 lg:gap-5">
              {filteredProducts.map((prod) => (
                <ProductCard
                  key={prod.id}
                  id={prod.id}
                  title={prod.title}
                  price={prod.price}
                  originalPrice={prod.originalPrice}
                  image={prod.image}
                  rating={prod.rating}
                  stock={prod.stock}
                />
              ))}
            </div>
          </>
        )}
      </main>
      
      <CartDrawer />
    </div>
  );
}