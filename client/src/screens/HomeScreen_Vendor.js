import React, { useState, useEffect, useCallback } from 'react';
import {
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  Image,
  useWindowDimensions,
  ActivityIndicator,
  Alert,
  Platform,
  Pressable,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import ScreenLayout from '../Components/ScreenLayout';
import ProductCreateModal from '../Components/ProductCreateModal';
import ProductEditModal from '../Components/ProductEditModal';
import { getVendorDetail, getCatalogoPorVendedor } from '../services/vendorDetailService';
import { getPerfilVendedor } from '../services/profileService';
import {
  crearProducto,
  actualizarProducto,
  eliminarProducto,
  crearCatalogo,
} from '../services/vendorService';

export default function HomeScreen_Vendor({ user }) {
  const { width } = useWindowDimensions();
  const [detail, setDetail] = useState(null);
  const [loading, setLoading] = useState(true);
  const [idVendedor, setIdVendedor] = useState(null);
  const [catalogoId, setCatalogoId] = useState(null);

  const [showCreateModal, setShowCreateModal] = useState(false);
  const [creating, setCreating] = useState(false);

  const [showEditModal, setShowEditModal] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [saving, setSaving] = useState(false);

  const [selectionMode, setSelectionMode] = useState(false);
  const [selectedIds, setSelectedIds] = useState(new Set());

  const numColumns = width > 768 ? 3 : 2;
  const columnWidth = (width - 20 * 2 - 15 * (numColumns - 1)) / numColumns;

  const showAlert = (title, message, onOk) => {
    if (Platform.OS === 'web') {
      alert(`${title}: ${message}`);
      if (onOk) onOk();
    } else {
      Alert.alert(title, message, onOk ? [{ text: 'OK', onPress: onOk }] : [{ text: 'OK' }]);
    }
  };

  const loadData = useCallback(async () => {
    setLoading(true);
    try {
      const perfil = await getPerfilVendedor(user.idUser);
      const vId = perfil.idVendedor;
      setIdVendedor(vId);

      const data = await getVendorDetail(vId);
      setDetail(data);

      try {
        const catalogo = await getCatalogoPorVendedor(vId);
        setCatalogoId(catalogo.idCatalogo);
      } catch {
        setCatalogoId(null);
      }
    } catch (error) {
      console.error('Error fetching vendor data:', error);
      showAlert('Error', 'No se pudo cargar la información del vendedor');
    } finally {
      setLoading(false);
    }
  }, [user.idUser]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  const ensureCatalogo = async () => {
    if (catalogoId) return catalogoId;
    const nombre = detail?.nombreNegocio || 'Mi Tienda';
    const data = await crearCatalogo(user.idUser, `Catálogo de ${nombre}`);
    setCatalogoId(data.idCatalogo);
    return data.idCatalogo;
  };

  const handleCreateProduct = async (productData) => {
    setCreating(true);
    try {
      const catId = await ensureCatalogo();
      await crearProducto(user.idUser, catId, productData);
      setShowCreateModal(false);
      showAlert('Éxito', 'Producto creado correctamente');
      loadData();
    } catch (error) {
      showAlert('Error', error.message || 'No se pudo crear el producto');
    } finally {
      setCreating(false);
    }
  };

  const handleEditProduct = async (productData) => {
    if (!selectedProduct) return;
    setSaving(true);
    try {
      await actualizarProducto(user.idUser, selectedProduct.idProducto, productData);
      setShowEditModal(false);
      setSelectedProduct(null);
      showAlert('Éxito', 'Producto actualizado correctamente');
      loadData();
    } catch (error) {
      showAlert('Error', error.message || 'No se pudo actualizar el producto');
    } finally {
      setSaving(false);
    }
  };

  const handleProductDeleted = () => {
    setShowEditModal(false);
    setSelectedProduct(null);
    loadData();
  };

  const toggleSelection = (idProducto) => {
    setSelectedIds((prev) => {
      const next = new Set(prev);
      if (next.has(idProducto)) next.delete(idProducto);
      else next.add(idProducto);
      return next;
    });
  };

  const confirmDeleteSelected = () => {
    if (selectedIds.size === 0) {
      showAlert('Selección', 'No has seleccionado ningún producto');
      return;
    }
    const msg =
      selectedIds.size === 1
        ? '¿Estás seguro de que deseas eliminar este producto?'
        : `¿Estás seguro de que deseas eliminar estos ${selectedIds.size} productos?`;

    if (Platform.OS === 'web') {
      if (!window.confirm(msg)) return;
      proceedDelete();
    } else {
      Alert.alert('Eliminar productos', msg, [
        { text: 'Cancelar', style: 'cancel' },
        { text: 'Eliminar', style: 'destructive', onPress: proceedDelete },
      ]);
    }
  };

  const proceedDelete = async () => {
    try {
      for (const id of selectedIds) {
        await eliminarProducto(user.idUser, id);
      }
      showAlert('Eliminados', `${selectedIds.size} producto(s) eliminado(s) correctamente`);
      setSelectedIds(new Set());
      setSelectionMode(false);
      loadData();
    } catch (error) {
      showAlert('Error', error.message || 'No se pudieron eliminar los productos');
    }
  };

  const handleProductPress = (product) => {
    if (selectionMode) {
      toggleSelection(product.idProducto);
    } else {
      setSelectedProduct(product);
      setShowEditModal(true);
    }
  };

  if (loading) {
    return (
      <ScreenLayout>
        <View style={styles.centerContainer}>
          <ActivityIndicator size="large" color="#C0392B" />
        </View>
      </ScreenLayout>
    );
  }

  const products = detail?.productos || [];

  return (
    <ScreenLayout containerStyle={{ backgroundColor: '#F9FAFB' }}>
      <View style={styles.header}>
        <View style={styles.headerLeft}>
          <Text style={styles.headerTitle}>{detail?.nombreNegocio || 'Antojos - Mi Tienda'}</Text>
        </View>
      </View>

      <View style={styles.titleSection}>
        <Text style={styles.mainTitle}>Tus productos</Text>
        <View style={styles.itemCountBadge}>
          <Text style={styles.itemCountText}>{products.length} Items</Text>
        </View>
      </View>

      {selectionMode && (
        <View style={styles.selectionBar}>
          <Text style={styles.selectionCount}>{selectedIds.size} seleccionado(s)</Text>
          <View style={styles.selectionActions}>
            <TouchableOpacity
              style={styles.cancelSelectionBtn}
              onPress={() => {
                setSelectionMode(false);
                setSelectedIds(new Set());
              }}
            >
              <Text style={styles.cancelSelectionText}>Cancelar</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.confirmDeleteBtn, selectedIds.size === 0 && styles.confirmDeleteBtnDisabled]}
              onPress={confirmDeleteSelected}
              disabled={selectedIds.size === 0}
            >
              <Ionicons name="trash-outline" size={18} color="#fff" />
              <Text style={styles.confirmDeleteText}>Eliminar</Text>
            </TouchableOpacity>
          </View>
        </View>
      )}

      <View style={styles.grid}>
        {products.map((item) => (
          <Pressable
            key={item.idProducto}
            style={[styles.productCard, { width: columnWidth }]}
            onPress={() => handleProductPress(item)}
          >
            {selectionMode && (
              <View style={[styles.checkbox, selectedIds.has(item.idProducto) && styles.checkboxSelected]}>
                {selectedIds.has(item.idProducto) && (
                  <Ionicons name="checkmark" size={16} color="#fff" />
                )}
              </View>
            )}
            <Image
              source={{ uri: 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=300&h=300&fit=crop' }}
              style={{ width: columnWidth, height: columnWidth, borderRadius: 16, marginBottom: 10 }}
            />
            <Text style={styles.productName} numberOfLines={1}>{item.nombreProd}</Text>
          </Pressable>
        ))}

        <TouchableOpacity
          style={[styles.newItemCard, { width: columnWidth, height: columnWidth + 30 }]}
          onPress={() => setShowCreateModal(true)}
        >
          <View style={styles.plusIconCircle}>
            <Ionicons name="add" size={32} color="#fff" />
          </View>
          <Text style={styles.newItemText}>NUEVO ITEM</Text>
        </TouchableOpacity>
      </View>

      <TouchableOpacity
        style={[styles.deleteButton, selectionMode && styles.deleteButtonActive]}
        onPress={() => setSelectionMode(!selectionMode)}
      >
        <Ionicons name="trash-outline" size={20} color={selectionMode ? '#fff' : '#374151'} />
        <Text style={[styles.deleteButtonText, selectionMode && styles.deleteButtonTextActive]}>
          {selectionMode ? 'Salir de selección' : 'Eliminar productos'}
        </Text>
      </TouchableOpacity>

      <ProductCreateModal
        visible={showCreateModal}
        onClose={() => setShowCreateModal(false)}
        onCreate={handleCreateProduct}
        creating={creating}
      />

      <ProductEditModal
        visible={showEditModal}
        onClose={() => {
          setShowEditModal(false);
          setSelectedProduct(null);
        }}
        product={selectedProduct}
        onSave={handleEditProduct}
        saving={saving}
        userId={user.idUser}
        onDeleted={handleProductDeleted}
      />
    </ScreenLayout>
  );
}

const styles = StyleSheet.create({
  centerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 10,
    paddingBottom: 10,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#111827',
  },
  titleSection: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    marginTop: 25,
    marginBottom: 20,
  },
  mainTitle: {
    fontSize: 26,
    fontWeight: '800',
    color: '#111827',
  },
  itemCountBadge: {
    backgroundColor: '#F3F4F6',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
  },
  itemCountText: {
    fontSize: 14,
    color: '#6B7280',
    fontWeight: '600',
  },
  selectionBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 10,
    backgroundColor: '#FEF2F2',
    marginHorizontal: 20,
    borderRadius: 12,
    marginBottom: 12,
  },
  selectionCount: {
    fontSize: 14,
    fontWeight: '600',
    color: '#DC2626',
  },
  selectionActions: {
    flexDirection: 'row',
    gap: 8,
  },
  cancelSelectionBtn: {
    paddingVertical: 6,
    paddingHorizontal: 14,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#D1D5DB',
  },
  cancelSelectionText: {
    fontSize: 13,
    fontWeight: '600',
    color: '#6B7280',
  },
  confirmDeleteBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingVertical: 6,
    paddingHorizontal: 14,
    borderRadius: 8,
    backgroundColor: '#DC2626',
  },
  confirmDeleteBtnDisabled: {
    opacity: 0.5,
  },
  confirmDeleteText: {
    fontSize: 13,
    fontWeight: '600',
    color: '#fff',
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    paddingHorizontal: 20,
    justifyContent: 'space-between',
  },
  productCard: {
    marginBottom: 25,
    position: 'relative',
  },
  checkbox: {
    position: 'absolute',
    top: 8,
    right: 8,
    width: 26,
    height: 26,
    borderRadius: 13,
    borderWidth: 2,
    borderColor: '#fff',
    backgroundColor: 'rgba(0,0,0,0.25)',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 10,
  },
  checkboxSelected: {
    backgroundColor: '#DC2626',
    borderColor: '#DC2626',
  },
  productName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1F2937',
    textAlign: 'left',
  },
  newItemCard: {
    borderRadius: 16,
    borderWidth: 2,
    borderColor: '#FCA5A5',
    borderStyle: 'dashed',
    backgroundColor: '#FEF2F2',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 25,
  },
  plusIconCircle: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#E81123',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
  },
  newItemText: {
    fontSize: 14,
    fontWeight: '800',
    color: '#E81123',
  },
  deleteButton: {
    flexDirection: 'row',
    backgroundColor: '#E5E7EB',
    marginHorizontal: 20,
    marginTop: 10,
    marginBottom: 30,
    height: 56,
    borderRadius: 14,
    justifyContent: 'center',
    alignItems: 'center',
  },
  deleteButtonActive: {
    backgroundColor: '#DC2626',
  },
  deleteButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#374151',
    marginLeft: 10,
  },
  deleteButtonTextActive: {
    color: '#fff',
  },
});
