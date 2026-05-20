import React, { useState, useMemo, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert, Platform, ActivityIndicator } from 'react-native';
import BoxSha from '../Components/BoxSha';
import ChecklistSelectField from '../Components/ChecklistSelectField';
import ScreenLayout from '../Components/ScreenLayout';
import BackButton from '../Components/BackButton';
import { registerVendor } from '../services/authService';
import { getCategorias } from '../services/profileService';
import { validateVendorDetailsForm } from '../utils/validators';

const VendorFinishRegisterScreen = ({ route, navigation }) => {
    const { initialData } = route.params || {};

    const [description, setDescription] = useState('');
    const [whatsappLink, setWhatsappLink] = useState('');
    const [instagramLink, setInstagramLink] = useState('');
    const [categoryIds, setCategoryIds] = useState([]);
    const [categories, setCategories] = useState([]);
    const [loadingCats, setLoadingCats] = useState(true);

    useEffect(() => {
        fetchCats();
    }, []);

    const fetchCats = async () => {
        try {
            const data = await getCategorias();
            setCategories(data);
        } catch (error) {
            console.error("Error al cargar categorías:", error);
        } finally {
            setLoadingCats(false);
        }
    };

    const categoryOptions = useMemo(
        () => categories.map((c) => ({ value: c.idCategoriaV, label: c.nombreCategoria })),
        [categories]
    );

    const showAlert = (title, message, onOk) => {

        if (Platform.OS === 'web') {
            alert(`${title}: ${message}`);
            if (onOk) onOk();
        } else {
            Alert.alert(title, message, onOk ? [{ text: "OK", onPress: onOk }] : [{ text: "OK" }]);
        }
    };

    const handleFinalRegister = async () => {

        const ds = description.trim();
        const wl = whatsappLink.trim();
        const il = instagramLink.trim();

        const errors = validateVendorDetailsForm(ds, categoryIds, wl, il);

        if (errors.length > 0) {
            showAlert("Campos incorrectos", errors.join("\n"));
            return;
        }


        try {
            const payload = {
                nombreNegocio: initialData.b,
                nombrePropietario: initialData.o,
                email: initialData.e,
                contrasena: initialData.p,
                telefono: initialData.t,
                descripcionNeg: ds,
                idCategoriasV: categoryIds,
                whatsAppLink: wl,
                instagramLink: il
            };

            await registerVendor(payload);

            showAlert("¡Éxito!", "Vendedor registrado correctamente", () => {
                navigation.navigate('Login');
            });
            
        } catch (error) {
            console.error(error);
            const message = error.message === "Failed to fetch" || error.message.includes("Network Error") 
                ? "No se pudo conectar con el servidor. Verifica tu IP e intenta de nuevo." 
                : error.message;
                
            showAlert("Aviso", message);
        }
    };

    return (
        <ScreenLayout scrollStyle={styles.scrollContainer}>
            <BackButton navigation={navigation} />
            <View style={styles.formContainer}>

                <BoxSha>
                    <Text style={styles.title}>Termina el Registro</Text>
                    <Text style={styles.infoText}>Paso 2 de 2: Información básica</Text>

                    <Text style={styles.label}>Descripción</Text>
                    <TextInput
                        placeholder="Mi negocio trata de:"
                        placeholderTextColor="#9ca3af"
                        style={styles.input}
                        multiline
                        onChangeText={setDescription}
                    />

                    <View style={styles.selectBlock}>
                        {loadingCats ? (
                            <ActivityIndicator size="small" color="#064e3b" />
                        ) : (
                            <ChecklistSelectField
                                title="Categorías del negocio"
                                placeholder="Selecciona categorías (1-5)"
                                hintText="Toca para elegir categorías"
                                values={categoryIds}
                                onSelect={setCategoryIds}
                                options={categoryOptions}
                                minSelect={1}
                                maxSelect={5}
                                marginBottom={false}
                            />
                        )}
                    </View>

                    <Text style={styles.label}>WhatsApp Link *</Text>
                    <TextInput
                        style={styles.input}
                        placeholder="https://wa.me/57300..."
                        placeholderTextColor="#9ca3af"
                        value={whatsappLink}
                        onChangeText={setWhatsappLink}
                        keyboardType="url"
                        autoCapitalize="none"
                        autoCorrect={false}
                    />

                    <Text style={styles.label}>Instagram Link</Text>
                    <TextInput
                        style={styles.input}
                        placeholder="https://instagram.com/..."
                        placeholderTextColor="#9ca3af"
                        value={instagramLink}
                        onChangeText={setInstagramLink}
                        keyboardType="url"
                        autoCapitalize="none"
                        autoCorrect={false}
                    />

                    <TouchableOpacity style={styles.registerButton} onPress={handleFinalRegister}>
                        <Text style={styles.registerButtonText}>Finalizar Registro</Text>
                    </TouchableOpacity>

                    <View style={styles.divider} />


                </BoxSha>
            </View>
        </ScreenLayout>
    );
};

const styles = StyleSheet.create({

    scrollContainer: {
        paddingHorizontal: 24,
        paddingVertical: 40,
    },
    formContainer: {
        flex: 1,
        justifyContent: 'center',
    },
    title: {
        fontSize: 32,
        fontWeight: 'bold',
        color: '#064e3b',
        marginBottom: 8,
        textAlign: 'center',
    },
    infoText: {
        fontSize: 14,
        color: '#6b7280',
        marginBottom: 16,
        marginTop: 10,
        textAlign: 'center',
        fontWeight: 'bold',
    },
    label: {
        fontSize: 14,
        fontWeight: '600',
        color: '#374151',
        marginBottom: 6,
        marginLeft: 4
    },
    input: {
        backgroundColor: '#ffffff',
        borderRadius: 12,
        paddingVertical: 12,
        paddingHorizontal: 12,
        fontSize: 16,
        color: '#1f2937',
        marginBottom: 13,
        borderWidth: 0.5,
        borderColor: '#e5e7eb',
        shadowColor: 'rgba(6, 78, 59, 0.2)',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 1,
        shadowRadius: 2,
        elevation: 1,
    },
    selectBlock: {
        marginBottom: 13,
    },
    registerButton: {
        backgroundColor: '#064e3b', // green for vendors
        borderRadius: 12,
        paddingVertical: 12,
        alignItems: 'center',
        marginTop: 8,
        shadowColor: 'rgba(6, 78, 59, 0.2)',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 1,
        shadowRadius: 4,
        elevation: 4,
    },
    registerButtonText: {
        color: '#ffffff',
        fontSize: 16,
        fontWeight: '600'
    },
});

export default VendorFinishRegisterScreen;
