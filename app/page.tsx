import Navbar from './components/Navbar';
import HeroCarousel from './components/HeroCarousel';
import CategoryRail from './components/CategoryRail';
import ProductCard from './components/ProductCard';
import CartDrawer from './components/CartDrawer';
import { products } from '@/app/data/products';

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

  // 5. Lógica de Filtrado
  const filteredProducts = products.filter(prod => {
    // Si hay búsqueda, comparamos ignorando mayúsculas/minúsculas
    const matchesSearch = !search || 
      prod.title.toLowerCase().includes(search.toLowerCase());
    
    // Si hay categoría, comparamos exacto
    const matchesCategory = !category || 
      prod.category === category;
    
    return matchesSearch && matchesCategory;
  });

  // 6. Configuración de Títulos Dinámicos
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
    <div className="bg-gray-50 min-h-screen pb-20">
      <Navbar />
      
      {/* Ocultamos Carrusel y Categorías grandes si estamos filtrando */}
      {!isFiltering && (
        <>
          <HeroCarousel className="mb-8" />
          <CategoryRail className="mb-8" />
        </>
      )}

      {/* Mostramos botón de volver si hay filtros */}
      {isFiltering && (
        <div className="max-w-7xl mx-auto px-4 mt-6">
           <a href="/" className="inline-flex items-center text-sm font-medium text-blue-600 hover:text-blue-800 hover:underline transition-colors">
             ← Volver al Inicio
           </a>
           {/* Categorías pequeñas para facilitar navegación */}
           <div className="mt-4 scale-90 origin-left">
             <CategoryRail />
           </div>
        </div>
      )}

      <main id="catalogo" className="max-w-7xl mx-auto p-4 mt-4">
        {filteredProducts.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-24 bg-white rounded-2xl shadow-sm border border-gray-100 text-center">
            <div className="text-6xl mb-4">🔍</div>
            <h3 className="text-2xl font-bold text-slate-800 mb-2">No encontramos ese producto</h3>
            <p className="text-gray-500 max-w-md mx-auto mb-8">
              No hay coincidencias para "{search || category}". Intenta buscar "Cerveza", "Vino" o "Whisky".
            </p>
            <a 
              href="/" 
              className="px-8 py-3 bg-slate-900 text-white font-bold rounded-lg hover:bg-slate-800 transition-all shadow-lg"
            >
              Ver todo el catálogo
            </a>
          </div>
        ) : (
          <>
            <div className="flex items-end gap-3 mb-8 border-b border-gray-200 pb-4">
              <h2 className="text-3xl font-black text-slate-900 tracking-tight capitalize">{title}</h2>
              <span className="text-gray-500 font-medium mb-1.5 text-lg">• {filteredProducts.length} productos</span>
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
              {filteredProducts.map((prod) => (
                <ProductCard
                  key={prod.id}
                  id={prod.id}
                  title={prod.title}
                  price={prod.price}
                  originalPrice={prod.originalPrice}
                  image={prod.image}
                  rating={prod.rating}
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