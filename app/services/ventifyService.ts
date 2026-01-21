// Servicio para integración con la API de Ventify

interface VentifyCustomer {
  customerName: string;
  customerEmail: string;
  customerPhone: string;
}

interface VentifyItem {
  productId: string;
  productName: string;
  quantity: number;
  price: number;
}

interface VentifyOrderPayload {
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  items: VentifyItem[];
  total: number;
  preferredPaymentMethod: string;
  notes?: string;
}

interface VentifyOrderResponse {
  success: boolean;
  order_id?: string;
  external_id?: string;
  message?: string;
  error?: string;
}

interface VentifyProduct {
  id: string;
  name: string;
  price: number;
  image?: string;
  category?: string;
  description?: string;
  rating?: number;
  originalPrice?: number;
}

interface VentifyProductsResponse {
  success: boolean;
  products?: VentifyProduct[];
  error?: string;
}

const API_URL = process.env.NEXT_PUBLIC_VENTIFY_API_URL || '';
const API_KEY = process.env.NEXT_PUBLIC_VENTIFY_API_KEY || '';
const ACCOUNT_ID = process.env.NEXT_PUBLIC_VENTIFY_ACCOUNT_ID || '';

/**
 * Crea una orden en la API de Ventify
 * @param orderData - Datos de la orden a crear
 * @returns Respuesta de la API
 */
export async function createVentifyOrder(
  orderData: VentifyOrderPayload
): Promise<VentifyOrderResponse> {
  try {
    // Validar que existan las credenciales
    if (!API_URL || !API_KEY || !ACCOUNT_ID) {
      console.error('❌ Faltan credenciales de Ventify en variables de entorno');
      return {
        success: false,
        error: 'Configuración de API incompleta'
      };
    }

    console.log('📤 Enviando orden a Ventify:', {
      customerName: orderData.customerName,
      total: orderData.total,
      itemsCount: orderData.items.length
    });

    const response = await fetch(`${API_URL}/api/public/stores/${ACCOUNT_ID}/sale-requests`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-API-Key': API_KEY,
      },
      body: JSON.stringify(orderData),
    });

    const data = await response.json();

    console.log('📥 Respuesta del servidor Ventify:', data);

    if (!response.ok) {
      console.error('❌ Error de Ventify API:', data);
      return {
        success: false,
        error: data.message || `Error ${response.status}`,
        ...data
      };
    }

    console.log('✅ Orden creada exitosamente en Ventify:', data);
    return {
      success: true,
      ...data
    };

  } catch (error) {
    console.error('❌ Error al conectar con Ventify:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Error desconocido'
    };
  }
}

/**
 * Obtiene la lista de productos de Ventify
 * @returns Lista de productos
 */
export async function getVentifyProducts(): Promise<VentifyProduct[]> {
  try {
    // Validar que existan las credenciales
    if (!API_URL || !API_KEY || !ACCOUNT_ID) {
      console.error('❌ Faltan credenciales de Ventify en variables de entorno');
      return [];
    }

    console.log('📤 Obteniendo productos de Ventify...');

    const response = await fetch(`${API_URL}/api/public/stores/${ACCOUNT_ID}/products?active=true`, {
      method: 'GET',
      headers: {
        'X-API-Key': API_KEY,
      },
    });

    const data = await response.json();

    console.log('📥 Respuesta de productos Ventify:', data);

    if (!response.ok) {
      console.error('❌ Error al obtener productos de Ventify:', data);
      return [];
    }

    console.log('✅ Productos obtenidos exitosamente de Ventify:', data.data?.length || 0, 'productos');
    return data.data || []; // Retornar response.data donde viene el array

  } catch (error) {
    console.error('❌ Error al conectar con Ventify:', error);
    return [];
  }
}

/**
 * Genera un ID único para la orden
 */
export function generateOrderId(): string {
  const timestamp = Date.now();
  const random = Math.floor(Math.random() * 10000);
  return `ORDER-${timestamp}-${random}`;
}