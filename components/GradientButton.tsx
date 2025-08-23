import React from 'react';
import { TouchableOpacity, Text, StyleSheet, ViewStyle, TextStyle } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useApp } from '@/contexts/AppContext';
interface GradientButtonProps { title: string; onPress: () => void; disabled?: boolean; style?: ViewStyle; textStyle?: TextStyle; colors?: string[];}
export default function GradientButton({ 
  title, onPress, disabled = false, style, textStyle, colors: customColors
}: GradientButtonProps) {
  const { colors } = useApp();
  const gradientColors = customColors || [colors.primary, '#3B82F6'];
  return (
    <TouchableOpacity style={[styles.container, style]} onPress={onPress} disabled={disabled} activeOpacity={0.8}>
      <LinearGradient colors={disabled ? ['#9CA3AF', '#6B7280'] : gradientColors} start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }} style={styles.gradient}>
        <Text style={[styles.text, textStyle]}>{title}</Text>
      </LinearGradient>
    </TouchableOpacity>
  );
}
const styles = StyleSheet.create({
  container: {borderRadius: 12, overflow: 'hidden', elevation: 3, shadowColor: '#000', shadowOffset: { width: 0, height: 2,}, shadowOpacity: 0.25, shadowRadius: 3.84,},
  gradient: {paddingVertical: 16, paddingHorizontal: 24, alignItems: 'center', justifyContent: 'center',},
  text: { color: '#FFFFFF', fontSize: 16, fontWeight: '600',},
});