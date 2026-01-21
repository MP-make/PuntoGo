// Servicio para integración con la API de Ventify

interface VentifyCustomer {
  name: string;
  phone: string;
  email?: string;
  address?: string;
  reference?: string;
}

interface VentifyItem {
  product_id: string;
  name: string;
  price: number;
  quantity: number;
}

interface VentifyOrderPayload {
  external_id: string;
  customer: VentifyCustomer;
  items: VentifyItem[];
  total: number;
  payment_method: string;
  notes?: string;
}

interface VentifyOrderResponse {
  success: boolean;
  order_id?: string;
  external_id?: string;
  message?: string;
  error?: string;
}

const API_URL = process.env.NEXT_PUBLIC_VENTIFY_API_URL || '';
const API_KEY = process.env.NEXT_PUBLIC_VENTIFY_API_KEY || '';

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
    if (!API_URL || !API_KEY) {
      console.error('❌ Faltan credenciales de Ventify en variables de entorno');
      return {
        success: false,
        error: 'Configuración de API incompleta'
      };
    }

    console.log('📤 Enviando orden a Ventify:', {
      external_id: orderData.external_id,
      customer: orderData.customer.name,
      total: orderData.total
    });

    const response = await fetch(`${API_URL}/orders`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${API_KEY}`,
      },
      body: JSON.stringify(orderData),
    });

    const data = await response.json();

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
 * Genera un ID único para la orden
 */
export function generateOrderId(): string {
  const timestamp = Date.now();
  const random = Math.floor(Math.random() * 10000);
  return `ORDER-${timestamp}-${random}`;
}