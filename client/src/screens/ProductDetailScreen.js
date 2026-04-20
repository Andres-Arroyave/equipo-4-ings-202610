import React from 'react';
import {
  StyleSheet,
  View,
  Text,
  Image,
  TouchableOpacity,
  ScrollView,
  Linking,
  Dimensions
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import ScreenLayout from '../Components/ScreenLayout';

const { width } = Dimensions.get('window');

export default function ProductDetailScreen({ route, navigation }) {
  const { product, vendorName, whatsAppLink } = route.params;

  const handleWhatsApp = () => {
    if (!whatsAppLink) return;
    const message = encodeURIComponent(`Hola! Estoy interesado en el producto "${product.nombreProd}" de ${vendorName}`);
    const url = `${whatsAppLink}${whatsAppLink.includes('?') ? '&' : '?'}text=${message}`;
    Linking.openURL(url).catch(() => {});
  };

  return (
    <ScreenLayout containerStyle={{ backgroundColor: '#fff' }}>
      <View style={styles.customHeader}>
        <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={24} color="#374151" />
        </TouchableOpacity>
        <View style={styles.headerLogo}>
          <View style={styles.logoIcon}>
            <Ionicons name="restaurant" size={18} color="#fff" />
          </View>
          <Text style={styles.logoText}>Antojos</Text>
        </View>
        <View style={styles.placeholder} />
      </View>

      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={styles.imageContainer}>
          <Image
            source={{ uri: 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=800&h=800&fit=crop' }}
            style={styles.productImage}
          />
        </View>

        <View style={styles.infoSection}>
          <Text style={styles.productName}>{product.nombreProd}</Text>
          <Text style={styles.productPrice}>${product.precio}</Text>
          
          <View style={styles.divider} />
          
          <Text style={styles.sectionTitle}>Descripción</Text>
          <Text style={styles.description}>
            {product.descripcionProd || 'Delicioso producto artesanal preparado con los mejores ingredientes.'}
          </Text>
        </View>
      </ScrollView>

      <TouchableOpacity style={styles.fab} onPress={handleWhatsApp}>
        <Ionicons name="logo-whatsapp" size={30} color="#fff" />
      </TouchableOpacity>
    </ScreenLayout>
  );
}

const styles = StyleSheet.create({
  customHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 10,
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#f3f4f6',
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerLogo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  logoIcon: {
    width: 32,
    height: 32,
    borderRadius: 8,
    backgroundColor: '#C0392B',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 8,
  },
  logoText: {
    fontSize: 20,
    fontWeight: '800',
    color: '#111827',
  },
  placeholder: {
    width: 40,
  },
  imageContainer: {
    width: width,
    height: width,
    backgroundColor: '#f3f4f6',
  },
  productImage: {
    width: '100%',
    height: '100%',
  },
  infoSection: {
    padding: 20,
  },
  productName: {
    fontSize: 28,
    fontWeight: '800',
    color: '#111827',
    marginBottom: 8,
  },
  productPrice: {
    fontSize: 24,
    fontWeight: '700',
    color: '#E81123',
    marginBottom: 16,
  },
  divider: {
    height: 1,
    backgroundColor: '#e5e7eb',
    marginVertical: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#111827',
    marginBottom: 8,
  },
  description: {
    fontSize: 16,
    color: '#4b5563',
    lineHeight: 24,
  },
  fab: {
    position: 'absolute',
    bottom: 30,
    right: 25,
    width: 65,
    height: 65,
    borderRadius: 32.5,
    backgroundColor: '#25D366',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#25D366',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.4,
    shadowRadius: 12,
    elevation: 10,
    zIndex: 999,
  },
});
