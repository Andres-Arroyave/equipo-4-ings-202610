import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  Image,
  Modal,
  Pressable,
  FlatList,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import ScreenLayout from '../Components/ScreenLayout';
import { getAllVendedores, buscarVendedores } from '../services/vendorService';
import { getCategorias } from '../services/profileService';

const VendorCard = ({ vendor, onPress }) => (
  <TouchableOpacity style={styles.vendorCard} onPress={onPress}>
    <Image
      source={{ uri: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=200&h=200&fit=crop' }}
      style={styles.vendorImage}
    />
    <View style={styles.vendorInfo}>
      <Text style={styles.vendorName}>{vendor.nombreNegocio}</Text>
      <Text style={styles.vendorDetails}>
        {(vendor.nombreCategorias?.join(', ')) || 'Sin categoría'} • {vendor.estado}
      </Text>
    </View>
    <Ionicons name="chevron-forward" size={20} color="#9ca3af" />
  </TouchableOpacity>
);

const FilterModal = ({
  visible,
  onClose,
  categorias,
  selectedCategorias,
  onSelectCategorias,
  selectedDisponibilidad,
  onSelectDisponibilidad,
  onApply,
  onClear
}) => {
  const [localCategorias, setLocalCategorias] = useState(selectedCategorias || []);
  const [localDisponibilidad, setLocalDisponibilidad] = useState(selectedDisponibilidad);

  useEffect(() => {
    setLocalCategorias(selectedCategorias || []);
  }, [selectedCategorias, visible]);

  useEffect(() => {
    setLocalDisponibilidad(selectedDisponibilidad);
  }, [selectedDisponibilidad, visible]);

  const toggleCategoria = (idCategoriaV) => {
    setLocalCategorias((prev) => {
      if (prev.includes(idCategoriaV)) {
        return prev.filter((id) => id !== idCategoriaV);
      } else {
        return [...prev, idCategoriaV];
      }
    });
  };

  const handleSelectDisponibilidad = (value) => {
    setLocalDisponibilidad((prev) => prev === value ? null : value);
  };

  const handleApply = () => {
    onSelectCategorias(localCategorias);
    onSelectDisponibilidad(localDisponibilidad);
    onApply();
    onClose();
  };

  const handleClear = () => {
    setLocalCategorias([]);
    setLocalDisponibilidad(null);
    onSelectCategorias([]);
    onSelectDisponibilidad(null);
    onClear();
    onClose();
  };

  const FILTER_OPTIONS_DISPONIBILIDAD = [
    { value: true, label: 'Disponible' },
    { value: false, label: 'No disponible' },
  ];

  return (
    <Modal visible={visible} transparent animationType="fade" onRequestClose={onClose}>
      <Pressable style={styles.modalOverlay} onPress={onClose}>
        <Pressable style={styles.filterModalCard} onPress={(e) => e.stopPropagation()}>
          <Text style={styles.filterModalTitle}>Filtrar por</Text>

          <Text style={styles.filterSectionLabel}>Categoría</Text>
          <Text style={styles.filterHint}>Selecciona una o más categorías</Text>
          <FlatList
            data={categorias}
            keyExtractor={(item) => String(item.idCategoriaV)}
            style={styles.filterList}
            renderItem={({ item }) => {
              const selected = localCategorias.includes(item.idCategoriaV);
              return (
                <Pressable
                  style={[styles.filterOption, selected && styles.filterOptionSelected]}
                  onPress={() => toggleCategoria(item.idCategoriaV)}
                >
                  <Text style={[styles.filterOptionText, selected && styles.filterOptionTextSelected]}>
                    {item.nombreCategoria}
                  </Text>
                  {selected && <Ionicons name="checkmark" size={20} color="#C0392B" />}
                </Pressable>
              );
            }}
          />

          <Text style={[styles.filterSectionLabel, { marginTop: 16 }]}>Disponibilidad</Text>
          <View style={styles.disponibilidadOptions}>
            {FILTER_OPTIONS_DISPONIBILIDAD.map((opt) => {
              const selected = localDisponibilidad === opt.value;
              return (
                <Pressable
                  key={String(opt.value)}
                  style={[styles.disponibilidadOption, selected && styles.filterOptionSelected]}
                  onPress={() => handleSelectDisponibilidad(opt.value)}
                >
                  <Text style={[styles.filterOptionText, selected && styles.filterOptionTextSelected]}>
                    {opt.label}
                  </Text>
                  {selected && <Ionicons name="checkmark" size={20} color="#C0392B" />}
                </Pressable>
              );
            })}
          </View>

          <View style={styles.filterButtons}>
            <TouchableOpacity style={styles.clearButton} onPress={handleClear}>
              <Text style={styles.clearButtonText}>Limpiar</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.applyButton} onPress={handleApply}>
              <Text style={styles.applyButtonText}>Aplicar</Text>
            </TouchableOpacity>
          </View>
        </Pressable>
      </Pressable>
    </Modal>
  );
};

const MenuScreen = ({ navigation, route }) => {
  const [searchText, setSearchText] = useState('');
  const [vendors, setVendors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [categorias, setCategorias] = useState([]);
  const [selectedCategorias, setSelectedCategorias] = useState([]);
  const [selectedDisponibilidad, setSelectedDisponibilidad] = useState(null);
  const [filterModalVisible, setFilterModalVisible] = useState(false);
  const appliedInitialFilter = useRef(false);

  useEffect(() => {
    const loadCategorias = async () => {
      try {
        const data = await getCategorias();
        setCategorias(data);
      } catch (e) {
        console.error('Error cargando categorías:', e);
      }
    };
    loadCategorias();
  }, []);

  useEffect(() => {
    const categoryFilter = route.params?.categoryFilter;
    if (categoryFilter && categorias.length > 0 && !appliedInitialFilter.current) {
      const match = categorias.find(
        (c) => c.nombreCategoria.toLowerCase() === categoryFilter.toLowerCase()
      );
      if (match) {
        setSelectedCategorias([match.idCategoriaV]);
        appliedInitialFilter.current = true;
        navigation.setParams({ categoryFilter: undefined });
      }
    }
    if (!categoryFilter) {
      appliedInitialFilter.current = false;
    }
  }, [route.params?.categoryFilter, categorias, navigation]);

  useEffect(() => {
    let active = true;
    const fetchVendors = async () => {
      setLoading(true);
      try {
        if (searchText.trim() === '') {
          const list = await getAllVendedores();
          if (active) setVendors(list);
        } else {
          const list = await buscarVendedores(searchText);
          if (active) setVendors(list);
        }
      } catch (e) {
        console.error(e);
      } finally {
        if (active) setLoading(false);
      }
    };

    const timeoutId = setTimeout(() => {
      fetchVendors();
    }, 400);

    return () => {
      active = false;
      clearTimeout(timeoutId);
    };
  }, [searchText]);

  const filteredVendors = React.useMemo(() => {
    let result = vendors;

    if (selectedCategorias.length > 0) {
      result = result.filter((v) => {
        const categoriaNombres = v.nombreCategorias?.map(n => n.toLowerCase()) || [];
        return categorias.some((c) =>
          selectedCategorias.includes(c.idCategoriaV) &&
          categoriaNombres.includes(c.nombreCategoria.toLowerCase())
        );
      });
    }

    if (selectedDisponibilidad !== null) {
      result = result.filter((v) => v.activo === selectedDisponibilidad);
    }

    return result;
  }, [vendors, selectedCategorias, categorias, selectedDisponibilidad]);

  return (
    <ScreenLayout>
      <View style={styles.container}>
        <View style={styles.header}>
          <View style={styles.logoContainer}>
            <View style={styles.logoIcon}>
              <Ionicons name="restaurant" size={20} color="#fff" />
            </View>
            <Text style={styles.logoText}>Antojos</Text>
          </View>
        </View>

        <View style={styles.searchContainer}>
          <View style={styles.searchBar}>
            <Ionicons name="search" size={20} color="#9ca3af" style={styles.searchIcon} />
            <TextInput
              style={styles.searchInput}
              placeholder="Buscar tiendas..."
              placeholderTextColor="#9ca3af"
              value={searchText}
              onChangeText={setSearchText}
            />
            <TouchableOpacity
              style={styles.filterButton}
              onPress={() => setFilterModalVisible(true)}
            >
              <View style={styles.filterIconContainer}>
                <Ionicons name="funnel" size={18} color={selectedCategorias.length > 0 || selectedDisponibilidad !== null ? "#C0392B" : "#6b7280"} />
                {(selectedCategorias.length > 0 || selectedDisponibilidad !== null) && <View style={styles.filterActiveDot} />}
              </View>
            </TouchableOpacity>
          </View>
        </View>

        <FilterModal
          visible={filterModalVisible}
          onClose={() => setFilterModalVisible(false)}
          categorias={categorias}
          selectedCategorias={selectedCategorias}
          onSelectCategorias={setSelectedCategorias}
          selectedDisponibilidad={selectedDisponibilidad}
          onSelectDisponibilidad={setSelectedDisponibilidad}
          onApply={() => {}}
          onClear={() => {
            setSelectedCategorias([]);
            setSelectedDisponibilidad(null);
          }}
        />

        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>
            {searchText.trim() === '' && selectedCategorias.length === 0 && selectedDisponibilidad === null
              ? 'Todas las tiendas'
              : searchText.trim() !== '' && selectedCategorias.length > 0 && selectedDisponibilidad !== null
              ? 'Resultados de búsqueda, categoría y disponibilidad'
              : searchText.trim() !== '' && selectedCategorias.length > 0
              ? 'Resultados de búsqueda y categoría'
              : searchText.trim() !== '' && selectedDisponibilidad !== null
              ? 'Resultados de búsqueda y disponibilidad'
              : searchText.trim() !== ''
              ? 'Resultados de búsqueda'
              : selectedCategorias.length > 0 && selectedDisponibilidad !== null
              ? 'Resultados por categoría y disponibilidad'
              : selectedCategorias.length > 0
              ? 'Resultados por categoría'
              : selectedDisponibilidad !== null
              ? 'Resultados por disponibilidad'
              : 'Todas las tiendas'}
          </Text>
          <View style={styles.accentLine} />
        </View>

        <View style={styles.vendorList}>
          {loading ? (
            <Text style={{ textAlign: 'center', marginTop: 10, color: '#9ca3af' }}>Cargando tiendas...</Text>
          ) : filteredVendors.length === 0 ? (
            <Text style={{ textAlign: 'center', marginTop: 10, color: '#9ca3af' }}>No se encontraron negocios</Text>
          ) : (
            filteredVendors.map((vendor) => (
              <VendorCard
                key={vendor.idVendedor}
                vendor={vendor}
                onPress={() => navigation.navigate('BusinessDetail', { vendor })}
              />
            ))
          )}
        </View>

        <View style={styles.bottomPadding} />
      </View>
    </ScreenLayout>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    paddingHorizontal: 20,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: 10,
    paddingBottom: 10,
  },
  logoContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  logoIcon: {
    width: 36,
    height: 36,
    borderRadius: 10,
    backgroundColor: '#C0392B',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 10,
  },
  logoText: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#111827',
  },
  searchContainer: {
    marginVertical: 15,
  },
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f3f4f6',
    borderRadius: 25,
    paddingHorizontal: 15,
    height: 48,
  },
  searchIcon: {
    marginRight: 10,
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
    color: '#374151',
  },
  filterButton: {
    padding: 8,
  },
  filterIconContainer: {
    position: 'relative',
    alignItems: 'center',
    justifyContent: 'center',
  },
  filterActiveDot: {
    position: 'absolute',
    top: -2,
    right: -4,
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#C0392B',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(15, 23, 42, 0.48)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  filterModalCard: {
    width: '85%',
    maxWidth: 340,
    backgroundColor: '#ffffff',
    borderRadius: 18,
    padding: 20,
    maxHeight: '70%',
  },
  filterModalTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#111827',
    marginBottom: 16,
  },
  filterSectionLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: '#374151',
    marginBottom: 8,
    marginLeft: 4,
  },
  filterHint: {
    fontSize: 12,
    color: '#6b7280',
    marginBottom: 8,
    marginLeft: 4,
  },
  disponibilidadOptions: {
    flexDirection: 'row',
    gap: 10,
  },
  disponibilidadOption: {
    flex: 1,
    paddingVertical: 12,
    paddingHorizontal: 14,
    borderRadius: 10,
    backgroundColor: '#f9fafb',
    alignItems: 'center',
  },
  filterList: {
    maxHeight: 250,
  },
  filterOption: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 12,
    paddingHorizontal: 14,
    borderRadius: 10,
    marginVertical: 2,
    backgroundColor: '#f9fafb',
  },
  filterOptionSelected: {
    backgroundColor: '#FEE2E2',
  },
  filterOptionText: {
    fontSize: 16,
    color: '#374151',
  },
  filterOptionTextSelected: {
    fontWeight: '600',
    color: '#C0392B',
  },
  filterButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 16,
  },
  clearButton: {
    flex: 1,
    paddingVertical: 12,
    marginRight: 8,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#d1d5db',
    alignItems: 'center',
  },
  clearButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#6b7280',
  },
  applyButton: {
    flex: 1,
    paddingVertical: 12,
    marginLeft: 8,
    borderRadius: 10,
    backgroundColor: '#C0392B',
    alignItems: 'center',
  },
  applyButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#ffffff',
  },
  sectionHeader: {
    marginBottom: 15,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#111827',
    marginBottom: 8,
  },
  accentLine: {
    height: 4,
    width: 60,
    backgroundColor: '#F0A500',
    borderRadius: 2,
  },
  vendorList: {
    marginBottom: 20,
  },
  vendorCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 12,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    borderWidth: 1,
    borderColor: '#f3f4f6',
  },
  vendorImage: {
    width: 70,
    height: 70,
    borderRadius: 10,
    backgroundColor: '#f3f4f6',
  },
  vendorInfo: {
    flex: 1,
    marginLeft: 12,
  },
  vendorName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#111827',
    marginBottom: 4,
  },
  vendorDetails: {
    fontSize: 14,
    color: '#9ca3af',
  },
  bottomPadding: {
    height: 20,
  },
});

export default MenuScreen;
