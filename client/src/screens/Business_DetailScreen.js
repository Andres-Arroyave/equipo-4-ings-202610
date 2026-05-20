import React, { useState, useEffect } from 'react';
import {
  StyleSheet,
  View,
  Text,
  Image,
  TouchableOpacity,
  ScrollView,
  ActivityIndicator,
  Dimensions,
  Linking
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import ScreenLayout from '../Components/ScreenLayout';
import BackButton from '../Components/BackButton';
import ProductDetailModal from '../Components/ProductDetailModal';
import { getVendorDetail } from '../services/vendorDetailService';

const { width } = Dimensions.get('window');

const DAYS_NAMES = {
  1: 'Lunes',
  2: 'Martes',
  3: 'Miércoles',
  4: 'Jueves',
  5: 'Viernes',
  6: 'Sábado',
  7: 'Domingo'
};

export default function Business_DetailScreen({ route, navigation }) {
  const { vendor } = route.params;
  const vendorId = vendor.idVendedor;

  const [detail, setDetail] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [showProductModal, setShowProductModal] = useState(false);

  useEffect(() => {
    let active = true;
    setLoading(true);
    getVendorDetail(vendorId)
      .then(data => {
        if (active) {
          setDetail(data);
          setLoading(false);
        }
      })
      .catch(err => {
        console.error("Error fetching detail:", err);
        if (active) setLoading(false);
      });
    return () => { active = false; };
  }, [vendorId]);

  if (loading) {
    return (
      <ScreenLayout>
        <View style={styles.centerContainer}>
          <ActivityIndicator size="large" color="#C0392B" />
        </View>
      </ScreenLayout>
    );
  }

  if (!detail) {
    return (
      <ScreenLayout>
        <View style={styles.centerContainer}>
          <Text>No se pudo cargar la información.</Text>
        </View>
      </ScreenLayout>
    );
  }

  const {
    nombreNegocio,
    nombreCategorias,
    descripcionNeg,
    activo,
    estado,
    horarios,
    productos,
    whatsAppLink
  } = detail;

  const handleWhatsAppPress = async () => {
    try {
      let url = null;
      if (detail?.whatsAppLink) {
        url = detail.whatsAppLink;
      } else if (vendor?.phoneNumber) {
        const raw = String(vendor.phoneNumber);
        const digits = raw.replace(/[^\d]/g, '');
        if (digits.length >= 8 && digits.length <= 15) {
          const message = 'Hola, te encontré en Antojos';
          url = `https://wa.me/${digits}?text=${encodeURIComponent(message)}`;
        } else {
          // Número inválido
          return;
        }
      } else {
        // No hay enlace ni teléfono
        return;
      }

      if (url) {
        const canOpen = await Linking.canOpenURL(url);
        if (canOpen) {
          await Linking.openURL(url);
        } else {
          console.warn('No se puede abrir WhatsApp con la URL', url);
        }
      }
    } catch (e) {
      console.error('Error abriendo WhatsApp', e);
    }
  };

  // Determinar horario de hoy
  // JS getDay() retorna 0 para Domingo, 1 para Lunes... 6 para Sábado.
  // Pero idDia en la BD parece ser 1 para Lunes, 7 para Domingo.
  const todayRaw = new Date().getDay(); // 0-6 (Sun-Sat)
  const todayMapped = todayRaw === 0 ? 7 : todayRaw; // Map Sun 0 to 7
  const currentSchedule = horarios?.find(h => h.idDia === todayMapped);
  const scheduleText = currentSchedule?.activo 
    ? `${currentSchedule.horaInicio} - ${currentSchedule.horaFin}` 
    : 'Cerrado hoy';

  // Construir horario semanal
  const weeklySchedule = [1, 2, 3, 4, 5, 6, 7].map(dayId => {
    const daySchedule = horarios?.find(h => h.idDia === dayId);
    return {
      dayId,
      dayName: DAYS_NAMES[dayId],
      isOpen: daySchedule?.activo ?? false,
      time: daySchedule?.activo
        ? `${daySchedule.horaInicio} - ${daySchedule.horaFin}`
        : 'Cerrado',
      isToday: dayId === todayMapped,
    };
  });

  return (
    <ScreenLayout containerStyle={{ backgroundColor: '#fff' }}>
      <View style={styles.customHeader}>
        <BackButton navigation={navigation} />
        <View style={styles.headerLogo}>
          <View style={styles.logoIcon}>
            <Ionicons name="restaurant" size={18} color="#fff" />
          </View>
          <Text style={styles.logoText}>Antojos</Text>
        </View>

      </View>

      <View style={styles.bannerContainer}>
        <Image
          source={{ uri: 'https://images.unsplash.com/photo-1555503460-23ca2708304a?w=800&h=450&fit=crop' }}
          style={styles.bannerImage}
        />
        <View style={[styles.statusBadge, { backgroundColor: activo ? '#22C55E' : '#94A3B8' }]}>
          <Text style={styles.statusBadgeText}>{estado.toUpperCase()}</Text>
        </View>
      </View>

      <View style={styles.infoSection}>
        <Text style={styles.businessName}>{nombreNegocio}</Text>
        {nombreCategorias && nombreCategorias.length > 0 && (
          <Text style={styles.categoryLine}>{nombreCategorias.join(', ')}</Text>
        )}
        <Text style={styles.description}>
          {descripcionNeg || 'Deliciosos snacks locales y postres artesanales preparados cada día con ingredientes frescos.'}
        </Text>

        <View style={styles.detailList}>
          <View style={styles.detailItem}>
            <Ionicons name="time" size={20} color="#E81123" />
            <Text style={styles.detailText}>{scheduleText}</Text>
          </View>
          {/* Removidos dirección y reseñas según requerimiento */}
        </View>
      </View>

      {/* Sección de horario semanal */}
      <View style={styles.scheduleSection}>
        <Text style={styles.scheduleTitle}>Horario Semanal</Text>
        {weeklySchedule.map(day => (
          <View key={day.dayId} style={styles.scheduleRow}>
            <View>
              <Text style={styles.scheduleDayName}>{day.dayName}</Text>
            </View>
            <Text
              style={[
                styles.scheduleDayTime,
                day.isOpen ? styles.scheduleDayTimeOpen : styles.scheduleDayTimeClosed,
              ]}
            >
              {day.time}
            </Text>
          </View>
        ))}
      </View>

      {/* Sección de productos sin cabecera (Título y Ver todo removidos) */}
      <View style={styles.productSection}>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.productScroll}>
          {productos.map((item) => (
            <TouchableOpacity
              key={item.idProducto}
              style={styles.productCard}
              onPress={() => {
                setSelectedProduct(item);
                setShowProductModal(true);
              }}
            >
              <Image
                source={{ uri: 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=300&h=300&fit=crop' }}
                style={styles.productImage}
              />
              <View style={styles.productInfo}>
                <Text style={styles.productName} numberOfLines={1}>{item.nombreProd}</Text>
                <Text style={styles.productPrice}>${item.precio}</Text>
              </View>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>

      {/* Modal de detalle de producto */}
      <ProductDetailModal
        visible={showProductModal}
        onClose={() => {
          setShowProductModal(false);
          setSelectedProduct(null);
        }}
        product={selectedProduct}
      />

      {/* Floating Action Button for Contact */}
      <TouchableOpacity style={styles.fab} onPress={handleWhatsAppPress}>
        <Ionicons name="call" size={30} color="#fff" />
      </TouchableOpacity>
      
      <View style={styles.bottomGap} />
    </ScreenLayout>
  );
}

const styles = StyleSheet.create({
  centerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  customHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 10,
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
  bannerContainer: {
    width: width - 40,
    height: 200,
    marginHorizontal: 20,
    marginTop: 10,
    borderRadius: 24,
    overflow: 'hidden',
    position: 'relative',
  },
  bannerImage: {
    width: '100%',
    height: '100%',
  },
  statusBadge: {
    position: 'absolute',
    bottom: 15,
    left: 15,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 10,
  },
  statusBadgeText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: '800',
  },
  infoSection: {
    paddingHorizontal: 20,
    marginTop: 20,
  },
  businessName: {
    fontSize: 28,
    fontWeight: '800',
    color: '#111827',
    marginBottom: 10,
  },
  description: {
    fontSize: 16,
    color: '#4B5563',
    lineHeight: 24,
    marginBottom: 20,
  },
  categoryLine: {
    fontSize: 14,
    color: '#047857',
    fontWeight: '600',
    marginBottom: 12,
    fontStyle: 'italic',
  },
  detailList: {
    gap: 12,
  },
  detailItem: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  detailText: {
    fontSize: 15,
    color: '#374151',
    fontWeight: '600',
    marginLeft: 12,
  },
  productSection: {
    marginTop: 35,
  },
  productHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    marginBottom: 15,
  },
  productTitle: {
    fontSize: 22,
    fontWeight: '800',
    color: '#111827',
  },
  verTodoText: {
    fontSize: 14,
    fontWeight: '700',
    color: '#E81123',
  },
  productScroll: {
    paddingLeft: 20,
  },
  productCard: {
    width: 160,
    marginRight: 15,
    backgroundColor: '#fff',
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#F3F4F6',
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.05,
    shadowRadius: 10,
    elevation: 2,
  },
  productImage: {
    width: '100%',
    height: 120,
  },
  productInfo: {
    padding: 12,
  },
  productName: {
    fontSize: 14,
    fontWeight: '700',
    color: '#111827',
    marginBottom: 4,
  },
  productPrice: {
    fontSize: 16,
    fontWeight: '800',
    color: '#E81123',
  },
  fab: {
    position: 'absolute',
    bottom: 30,
    right: 25,
    width: 65,
    height: 65,
    borderRadius: 32.5,
    backgroundColor: '#E81123',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#E81123',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.4,
    shadowRadius: 12,
    elevation: 10,
    zIndex: 999,
  },
  bottomGap: {
    height: 100,
  },
  scheduleSection: {
    marginTop: 30,
    paddingHorizontal: 20,
  },
  scheduleTitle: {
    fontSize: 18,
    fontWeight: '800',
    color: '#111827',
    marginBottom: 16,
  },
  scheduleRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
  },
  scheduleDayName: {
    fontSize: 15,
    fontWeight: '600',
    color: '#374151',
  },
  scheduleDayTime: {
    fontSize: 14,
    fontWeight: '500',
  },
  scheduleDayTimeClosed: {
    color: '#94A3B8',
  },
  scheduleDayTimeOpen: {
    color: '#22C55E',
  },
});
