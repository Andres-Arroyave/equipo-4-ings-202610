import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  ScrollView,
  ActivityIndicator
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Linking } from 'react-native';
import ScreenLayout from '../Components/ScreenLayout';
import BackButton from '../Components/BackButton';
import { getCatalogoPorVendedor, getProductosPorCatalogo } from '../services/vendorService';

const VendorDetailStoreScreen = ({ route, navigation }) => {
  const { vendor } = route.params;
  const [productos, setProductos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const catalogo = await getCatalogoPorVendedor(vendor.idVendedor);
        const prods = await getProductosPorCatalogo(catalogo.idCatalogo);
        setProductos(prods);
      } catch (err) {
        console.error('Error al cargar productos:', err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [vendor.idVendedor]);

  const handleWhatsApp = () => {
    const phone = vendor.usuario?.telefono || vendor.contactoVen;

    if (!phone) {
      alert('Este vendedor no tiene número de WhatsApp registrado');
      return;
    }

    const message = `Hola, vengo desde Antojos y estoy viendo ${vendor.nombreNegocio}. Me gustaría hacer un pedido.`;
    const url = `https://wa.me/${phone}?text=${encodeURIComponent(message)}`;

    Linking.openURL(url).catch(() => {
      alert('No se pudo abrir WhatsApp');
    });
  };

  return (
    <ScreenLayout>
      <ScrollView>
        <View style={styles.container}>

          <BackButton navigation={navigation} />

          {/* Header */}
          <View style={styles.header}>
            <View style={styles.logo}>
              <Ionicons name="restaurant" size={24} color="#fff" />
            </View>
            <View style={styles.headerInfo}>
              <Text style={styles.name}>{vendor.nombreNegocio}</Text>
              <View style={styles.statusBadge}>
                <View style={[
                  styles.statusDot,
                  { backgroundColor: vendor.activo ? '#22c55e' : '#9ca3af' }
                ]} />
                <Text style={styles.statusText}>{vendor.estado || (vendor.activo ? 'Abierto' : 'Cerrado')}</Text>
              </View>
            </View>
          </View>

          {/* Descripción */}
          <View style={styles.infoSection}>
            <Text style={styles.description}>
              {vendor.descripcionNeg || vendor.descripcion || 'Sin descripción disponible'}
            </Text>
            {vendor.nombreCategoria && (
              <View style={styles.categoryBadge}>
                <Text style={styles.categoryText}>{vendor.nombreCategoria}</Text>
              </View>
            )}
          </View>

          {/* Productos */}
          <Text style={styles.sectionTitle}>Productos</Text>

          {loading ? (
            <View style={styles.loadingContainer}>
              <ActivityIndicator size="large" color="#e81123" />
              <Text style={styles.loadingText}>Cargando productos...</Text>
            </View>
          ) : error ? (
            <View style={styles.errorContainer}>
              <Text style={styles.errorText}>No se pudieron cargar los productos</Text>
            </View>
          ) : productos.length === 0 ? (
            <View style={styles.emptyContainer}>
              <Text style={styles.emptyText}>Este negocio aún no tiene productos</Text>
            </View>
          ) : (
            <View style={styles.productsGrid}>
              {productos.map((producto) => (
                <TouchableOpacity
                  key={producto.idProducto}
                  style={styles.productCard}
                  onPress={() => navigation.navigate('ProductDetail', { producto, vendor })}
                >
                  <View style={styles.productImagePlaceholder}>
                    <Ionicons name="fast-food" size={32} color="#9ca3af" />
                  </View>
                  <Text style={styles.productName} numberOfLines={2}>
                    {producto.nombreProd}
                  </Text>
                  <Text style={styles.productPrice}>
                    ${producto.precio?.toLocaleString() || '0'}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          )}

        </View>
      </ScrollView>

      {/* Botón flotante WhatsApp */}
      <TouchableOpacity style={styles.whatsappButton} onPress={handleWhatsApp}>
        <Ionicons name="logo-whatsapp" size={24} color="#fff" />
      </TouchableOpacity>

    </ScreenLayout>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 20,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  logo: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: '#e81123',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 15,
  },
  headerInfo: {
    flex: 1,
  },
  name: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#111827',
    marginBottom: 4,
  },
  statusBadge: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  statusDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginRight: 6,
  },
  statusText: {
    fontSize: 14,
    color: '#6b7280',
  },
  infoSection: {
    marginBottom: 25,
  },
  description: {
    fontSize: 15,
    color: '#4b5563',
    lineHeight: 22,
    marginBottom: 12,
  },
  categoryBadge: {
    alignSelf: 'flex-start',
    backgroundColor: '#fef3c7',
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 12,
  },
  categoryText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#92400e',
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#111827',
    marginBottom: 15,
  },
  loadingContainer: {
    alignItems: 'center',
    paddingVertical: 40,
  },
  loadingText: {
    marginTop: 10,
    color: '#6b7280',
  },
  errorContainer: {
    alignItems: 'center',
    paddingVertical: 20,
    backgroundColor: '#fee2e2',
    borderRadius: 12,
  },
  errorText: {
    color: '#dc2626',
  },
  emptyContainer: {
    alignItems: 'center',
    paddingVertical: 30,
    backgroundColor: '#f3f4f6',
    borderRadius: 12,
  },
  emptyText: {
    color: '#9ca3af',
    fontSize: 14,
  },
  productsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    marginBottom: 80,
  },
  productCard: {
    width: '48%',
    backgroundColor: '#ffffff',
    borderRadius: 12,
    padding: 12,
    marginBottom: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    borderWidth: 1,
    borderColor: '#f3f4f6',
  },
  productImagePlaceholder: {
    height: 100,
    backgroundColor: '#f9fafb',
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 10,
  },
  productName: {
    fontSize: 14,
    fontWeight: '600',
    color: '#111827',
    marginBottom: 4,
  },
  productPrice: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#e81123',
  },
  whatsappButton: {
    position: 'absolute',
    bottom: 20,
    right: 20,
    backgroundColor: '#25D366',
    width: 60,
    height: 60,
    borderRadius: 30,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
  },
});

export default VendorDetailStoreScreen;
