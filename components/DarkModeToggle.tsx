import React from 'react';
import { TouchableOpacity, StyleSheet, Animated } from 'react-native';
import { Sun, Moon } from 'lucide-react-native';
import { useApp } from '@/contexts/AppContext';

export default function DarkModeToggle() {
  const { isDarkMode, toggleDarkMode, colors } = useApp();
  const [scaleAnim] = React.useState(new Animated.Value(1));
  const handlePress = () => {
    Animated.sequence([
      Animated.timing(scaleAnim, { toValue: 0.9, duration: 100, useNativeDriver: true,}),
      Animated.timing(scaleAnim, { toValue: 1, duration: 100, useNativeDriver: true,}),
    ]).start(); toggleDarkMode();};
  return (
    <Animated.View style={{ transform: [{ scale: scaleAnim }] }}>
      <TouchableOpacity style={[ styles.container,
          {
            backgroundColor: colors.surface,
            borderColor: colors.border,
          }
        ]} onPress={handlePress} activeOpacity={0.7}>
        {isDarkMode ? (
          <Sun size={20} color={colors.primary} />
        ) : (
          <Moon size={20} color={colors.primary} />
        )}
      </TouchableOpacity>
    </Animated.View>
  );
}
const styles = StyleSheet.create({
  container: {width: 44, height: 44, borderRadius: 22, justifyContent: 'center', alignItems: 'center', borderWidth: 2, elevation: 2, shadowColor: '#000', shadowOffset: { width: 0, height: 1,}, shadowOpacity: 0.1, shadowRadius: 2,},
});