import React from 'react';
import { 
  KeyboardAvoidingView, 
  ScrollView, 
  Platform, 
  StyleSheet, 
  View 
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

const ScreenLayout = ({ children, scrollStyle, containerStyle }) => {
  const insets = useSafeAreaInsets();

  return (
    <View style={[
      styles.container, 
      containerStyle, 
      { 
        // Eliminamos paddingTop de aquí para que el scroll llegue hasta arriba
        paddingBottom: insets.bottom,
        paddingLeft: insets.left,
        paddingRight: insets.right,
      }
    ]}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={{ flex: 1 }}
      >
        <ScrollView
          contentContainerStyle={[
            styles.scrollContainer, 
            { 
              paddingTop: insets.top + 10 
            },
            scrollStyle
          ]}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="always"
          nestedScrollEnabled
        >
          {children}
        </ScrollView>
      </KeyboardAvoidingView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f7f7fa', // Fondo global de la app
  },
  scrollContainer: {
    flexGrow: 1,
  },
});

export default ScreenLayout;