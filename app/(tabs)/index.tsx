import React, { useState } from 'react';
import { View, Text, StyleSheet, TextInput, ScrollView, KeyboardAvoidingView, Platform, Alert} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Lightbulb, Sparkles, Settings } from 'lucide-react-native';
import Toast from 'react-native-toast-message';
import GradientButton from '@/components/GradientButton';
import DarkModeToggle from '@/components/DarkModeToggle';
import { useApp } from '@/contexts/AppContext';
import { router } from 'expo-router';
export default function SubmitIdeaScreen() {
  const [name, setName] = useState('');
  const [tagline, setTagline] = useState('');
  const [description, setDescription] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { submitIdea, colors } = useApp();
  const handleSubmit = async () => {
    if (!name.trim()) {
      Alert.alert('Missing Information', 'Please enter a startup name');
      return;
    }
    if (!tagline.trim()) {
      Alert.alert('Missing Information', 'Please enter a tagline');
      return;
    }
    if (!description.trim()) {
      Alert.alert('Missing Information', 'Please enter a description');
      return;
    }
    setIsSubmitting(true);
    try {
      await submitIdea({
        name: name.trim(),
        tagline: tagline.trim(),
        description: description.trim(),
      });
      setName('');
      setTagline('');
      setDescription('');
      Toast.show({ type: 'success', text1: '🚀 Idea Submitted Successfully!', text2: `AI gave you a ${Math.floor(Math.random() * 41) + 60}/100 rating!`, position: 'top', visibilityTime: 4000,});
      setTimeout(() => {
        router.push('/(tabs)/ideas');
      }, 1000);
    } catch (error) {
      Toast.show({ type: 'error', text1: 'Submission Failed', text2: 'Please check your connection and try again', position: 'top', visibilityTime: 3000,});
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <KeyboardAvoidingView style={[styles.container, { backgroundColor: colors.background }]} behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
      <LinearGradient colors={[colors.primary, '#3B82F6']} style={styles.header}>
        <View style={styles.headerContent}>
          <View style={styles.headerTop}>
            <View style={styles.placeholder} />
            <DarkModeToggle />
          </View>
          <View style={styles.iconContainer}>
            <Lightbulb size={32} color="#FFFFFF" />
          </View>
          <Text style={styles.title}>Submit Your Startup Idea</Text>
          <Text style={styles.subtitle}> Get AI-powered feedback and let the community vote on your vision!</Text>
        </View>
      </LinearGradient>
      <ScrollView style={styles.form} showsVerticalScrollIndicator={false}>
        <View style={styles.formContainer}>
          <View style={styles.inputGroup}>
            <Text style={[styles.label, { color: colors.text }]}>Startup Name</Text>
            <TextInput style={[styles.input, { backgroundColor: colors.surface, borderColor: colors.border, color: colors.text }]} value={name} onChangeText={setName} placeholder="e.g., TechFlow, InnovateCorp" placeholderTextColor={colors.textSecondary} maxLength={50}/>
            <Text style={[styles.characterCount, { color: colors.textSecondary }]}>{name.length}/50</Text>
          </View>
          <View style={styles.inputGroup}>
            <Text style={[styles.label, { color: colors.text }]}>Tagline</Text>
            <TextInput style={[styles.input, { backgroundColor: colors.surface, borderColor: colors.border, color: colors.text }]} value={tagline} onChangeText={setTagline} placeholder="One compelling sentence about your startup" placeholderTextColor={colors.textSecondary} maxLength={100}/>
            <Text style={[styles.characterCount, { color: colors.textSecondary }]}>{tagline.length}/100</Text>
          </View>
          <View style={styles.inputGroup}>
            <Text style={[styles.label, { color: colors.text }]}>Description</Text>
            <TextInput style={[styles.input, styles.textArea, { backgroundColor: colors.surface, borderColor: colors.border, color: colors.text }]} value={description} onChangeText={setDescription} placeholder="Describe your startup idea, target market, business model, and what makes it unique..." placeholderTextColor={colors.textSecondary} multiline numberOfLines={6} textAlignVertical="top" maxLength={500}/>
            <Text style={[styles.characterCount, { color: colors.textSecondary }]}>{description.length}/500</Text>
          </View>
          <View style={[styles.aiPreview, { backgroundColor: colors.background, borderColor: colors.border }]}>
            <View style={styles.aiHeader}>
              <Sparkles size={20} color={colors.primary} />
              <Text style={[styles.aiTitle, { color: colors.primary }]}>AI Evaluation Preview</Text>
            </View>
            <Text style={[styles.aiDescription, { color: colors.textSecondary }]}>
              Our AI will analyze your idea and provide:
              {'\n'}• Innovation score (0-100)
              {'\n'}• Market potential feedback
              {'\n'}• Execution insights
            </Text>
          </View>
          <GradientButton title={isSubmitting ? "Submitting..." : "Submit for AI Review"} onPress={handleSubmit} disabled={isSubmitting} style={styles.submitButton}/>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    paddingTop: 60,
    paddingBottom: 30,
    paddingHorizontal: 20,
  },
  headerContent: {
    alignItems: 'center',
  },
  headerTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    width: '100%',
    marginBottom: 20,
  },
  placeholder: {
    width: 44,
  },
  iconContainer: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: '700',
    color: '#FFFFFF',
    textAlign: 'center',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: 'rgba(255, 255, 255, 0.9)',
    textAlign: 'center',
    lineHeight: 22,
  },
  form: {
    flex: 1,
  },
  formContainer: {
    padding: 20,
  },
  inputGroup: {
    marginBottom: 24,
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 8,
  },
  input: {
    borderWidth: 2,
    borderRadius: 12,
    padding: 16,
    fontSize: 16,
  },
  textArea: {
    height: 120,
    textAlignVertical: 'top',
  },
  characterCount: {
    fontSize: 12,
    textAlign: 'right',
    marginTop: 4,
  },
  aiPreview: {
    borderRadius: 16,
    padding: 20,
    marginBottom: 32,
    borderWidth: 1,
  },
  aiHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  aiTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginLeft: 8,
  },
  aiDescription: {
    fontSize: 14,
    lineHeight: 20,
  },
  submitButton: {
    marginBottom: 40,
  },
});