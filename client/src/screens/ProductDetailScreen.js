import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  ScrollView
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Linking } from 'react-native';
import ScreenLayout from '../Components/ScreenLayout';
import BackButton from '../Components/BackButton';

const ProductDetailScreen = ({ route, navigation }) => {
  const { producto, vendor } = route.params;

  const handleWhatsApp = () => {
    const phone = vendor?.usuario?.telefono || vendor?.contactoVen;

    if (!phone) {
      alert('Este vendedor no tiene número de WhatsApp registrado');
      return;
    }

    const message = `Hola, estoy interesado en el producto "${producto.nombreProd}" que vi en ${vendor.nombreNegocio}. ¿Está disponible?`;

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

          {/* Imagen */}
          <View style={styles.imageContainer}>
            {producto.imagen ? (
              <Image source={{ uri: producto.imagen }} style={styles.productImage} />
            ) : (
              <>
                <Ionicons name="fast-food" size={60} color="#9ca3af" />
                <Text style={styles.imagePlaceholderText}>Sin imagen</Text>
              </>
            )}
          </View>

          {/* Precio */}
          <View style={styles.priceContainer}>
            <Text style={styles.price}>
              ${producto.precio?.toLocaleString() || '0'}
            </Text>
          </View>

          {/* Nombre */}
          <Text style={styles.title}>{producto.nombreProd}</Text>

          {/* Descripción */}
          <View style={styles.descriptionContainer}>
            <Text style={styles.descriptionLabel}>Descripción</Text>
            <Text style={styles.description}>
              {producto.descripcionProd || 'Sin descripción disponible'}
            </Text>
          </View>

          {/* Footer tienda */}
          {vendor && (
            <TouchableOpacity
              style={styles.vendorFooter}
              onPress={() => navigation.goBack()}
            >
              <View style={styles.logo}>
                <Ionicons name="restaurant" size={20} color="#fff" />
              </View>
              <View style={styles.vendorInfo}>
                <Text style={styles.vendorName}>{vendor.nombreNegocio}</Text>
                <Text style={styles.vendorLabel}>Ver negocio</Text>
              </View>
              <Ionicons name="chevron-forward" size={20} color="#9ca3af" />
            </TouchableOpacity>
          )}

        </View>
      </ScrollView>

      {/* WhatsApp */}
      <TouchableOpacity style={styles.whatsappButton} onPress={handleWhatsApp}>
        <Ionicons name="logo-whatsapp" size={24} color="#fff" />
        <Text style={styles.whatsappText}>Contactar</Text>
      </TouchableOpacity>

    </ScreenLayout>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 20,
    flex: 1,
  },
  imageContainer: {
    height: 250,
    backgroundColor: '#f9fafb',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 16,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: '#f3f4f6',
  },
  productImage: {
    width: '100%',
    height: '100%',
    borderRadius: 16,
  },
  imagePlaceholderText: {
    marginTop: 10,
    color: '#9ca3af',
    fontSize: 14,
  },
  priceContainer: {
    marginBottom: 8,
  },
  price: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#e81123',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#111827',
    marginBottom: 20,
  },
  descriptionContainer: {
    marginBottom: 30,
  },
  descriptionLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: '#6b7280',
    marginBottom: 8,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  description: {
    fontSize: 16,
    color: '#4b5563',
    lineHeight: 24,
  },
  vendorFooter: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#ffffff',
    padding: 15,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#f3f4f6',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    marginBottom: 100,
  },
  logo: {
    width: 45,
    height: 45,
    borderRadius: 22,
    backgroundColor: '#e81123',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  vendorInfo: {
    flex: 1,
  },
  vendorName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#111827',
  },
  vendorLabel: {
    fontSize: 13,
    color: '#9ca3af',
    marginTop: 2,
  },
  whatsappButton: {
    position: 'absolute',
    bottom: 20,
    right: 20,
    backgroundColor: '#25D366',
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    height: 56,
    borderRadius: 28,
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
  },
  whatsappText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '600',
    marginLeft: 8,
  },
});

export default ProductDetailScreen;
