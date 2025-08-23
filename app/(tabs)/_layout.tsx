import { Tabs } from 'expo-router';
import { Lightbulb, List, Trophy } from 'lucide-react-native';
import { useApp } from '@/contexts/AppContext';

export default function TabLayout() {
  const { colors } = useApp();

  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: colors.primary,
        tabBarInactiveTintColor: colors.textSecondary,
        tabBarStyle: {backgroundColor: colors.surface, borderTopColor: colors.border, borderTopWidth: 1, paddingBottom: 8, paddingTop: 8, height: 80,},
        tabBarLabelStyle: {fontSize: 12, fontWeight: '600', marginTop: 4,},
      }}>
      <Tabs.Screen name="index" options={{title: 'Submit Idea', tabBarIcon: ({ size, color }) => ( <Lightbulb size={size} color={color} />),}}/>
      <Tabs.Screen name="ideas" options={{ title: 'Browse Ideas', tabBarIcon: ({ size, color }) => ( <List size={size} color={color} />),}}/>
      <Tabs.Screen name="leaderboard" options={{ title: 'Leaderboard', tabBarIcon: ({ size, color }) => ( <Trophy size={size} color={color} /> ), }}/>
    </Tabs>
  );
}