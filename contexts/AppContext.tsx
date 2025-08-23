import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useColorScheme } from 'react-native';
export interface StartupIdea { id: string; name: string; tagline: string; description: string; rating: number; feedback: string; votes: number; createdAt: string; hasUserVoted?: boolean;}
interface AppContextType {
  ideas: StartupIdea[];
  userVotes: Set<string>;
  isDarkMode: boolean;
  toggleDarkMode: () => void;
  colors: ColorScheme;
  submitIdea: (idea: Omit<StartupIdea, 'id' | 'rating' | 'feedback' | 'votes' | 'createdAt'>) => Promise<void>;
  voteForIdea: (ideaId: string) => Promise<void>;
  shareIdea: (idea: StartupIdea) => Promise<void>;
  loading: boolean;
}
interface ColorScheme { background: string; surface: string; text: string; textSecondary: string; border: string; card: string; primary: string; success: string; error: string;}
const lightColors: ColorScheme = { background: '#F9FAFB', surface: '#FFFFFF', text: '#1F2937', textSecondary: '#6B7280', border: '#E5E7EB', card: '#FFFFFF', primary: '#8B5CF6', success: '#10B981', error: '#EF4444',};
const darkColors: ColorScheme = { background: '#111827', surface: '#1F2937', text: '#F9FAFB', textSecondary: '#9CA3AF', border: '#374151', card: '#1F2937', primary: '#A78BFA', success: '#34D399', error: '#F87171',};
const AppContext = createContext<AppContextType | undefined>(undefined);
const AI_FEEDBACKS = [
  "Revolutionary concept! This could disrupt the entire industry.",
  "Solid execution potential with strong market validation.",
  "Innovative approach to a common problem. Great thinking!",
  "Strong value proposition with clear monetization path.",
  "Creative solution with significant scalability potential.",
  "Well-thought-out concept with excellent market timing.",
  "Impressive innovation with strong competitive advantages.",
  "Outstanding vision with clear execution roadmap.",
  "Brilliant idea with massive market opportunity.",
  "Exceptional concept with strong investor appeal.",
  "Interesting angle, but needs more market research.",
  "Good foundation, consider expanding the target market.",
  "Nice concept, could benefit from clearer differentiation.",
  "Promising start, focus on unique value proposition.",
  "Creative idea, validate with potential customers first."
];
export function AppProvider({ children }: { children: ReactNode }) {
  const [ideas, setIdeas] = useState<StartupIdea[]>([]);
  const [userVotes, setUserVotes] = useState<Set<string>>(new Set());
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [loading, setLoading] = useState(true);
  const systemColorScheme = useColorScheme();
  useEffect(() => { loadData();}, []);
  const loadData = async () => {
    try {
      const [storedIdeas, storedVotes, storedTheme] = await Promise.all([ AsyncStorage.getItem('startup_ideas'), AsyncStorage.getItem('user_votes'), AsyncStorage.getItem('dark_mode')]);
      if (storedIdeas) {
        const parsedIdeas = JSON.parse(storedIdeas);
        setIdeas(parsedIdeas);
      }
      if (storedVotes) {
        const parsedVotes = JSON.parse(storedVotes);
        setUserVotes(new Set(parsedVotes));
      }
      if (storedTheme !== null) {
        setIsDarkMode(JSON.parse(storedTheme));
      } else {
        setIsDarkMode(systemColorScheme === 'dark');
      }
    } catch (error) {
      console.error('Error loading data:', error);
    } finally {
      setLoading(false);
    }
  };
  const toggleDarkMode = async () => { const newMode = !isDarkMode; setIsDarkMode(newMode);
    try {
      await AsyncStorage.setItem('dark_mode', JSON.stringify(newMode));
    } catch (error) {
      console.error('Error saving theme preference:', error);
    }
  };
  const shareIdea = async (idea: StartupIdea) => {
    const { default: Clipboard } = await import('expo-clipboard');
    const { default: Sharing } = await import('expo-sharing');
    const shareText = `🚀 Check out this startup idea: "${idea.name}"\n\n${idea.tagline}\n\nAI Rating: ${idea.rating}/100\nVotes: ${idea.votes}\n\nDescription: ${idea.description}`;
    try {
      if (await Sharing.isAvailableAsync()) {
        await Sharing.shareAsync(shareText);
      } else {
        await Clipboard.setStringAsync(shareText);
        return 'clipboard';
      }
    } catch (error) {
      console.error('Error sharing idea:', error);
      throw error;
    }
  };
  const generateAIFeedback = (): { rating: number; feedback: string } => {
    const rating = Math.floor(Math.random() * 41) + 60; // 60-100 for positive bias
    const feedbackIndex = Math.floor(Math.random() * AI_FEEDBACKS.length);
    return { rating, feedback: AI_FEEDBACKS[feedbackIndex]};
  };
  const submitIdea = async (newIdea: Omit<StartupIdea, 'id' | 'rating' | 'feedback' | 'votes' | 'createdAt'>) => {
    const { rating, feedback } = generateAIFeedback();
    const idea: StartupIdea = {
      ...newIdea, id: Date.now().toString(), rating, feedback, votes: 0, createdAt: new Date().toISOString()
    };
    const updatedIdeas = [idea, ...ideas];
    setIdeas(updatedIdeas);
    try {
      await AsyncStorage.setItem('startup_ideas', JSON.stringify(updatedIdeas));
    } catch (error) {
      console.error('Error saving idea:', error);
    }
  };
  const voteForIdea = async (ideaId: string) => {
    if (userVotes.has(ideaId)) {
      return; 
    }
    const updatedIdeas = ideas.map(idea => 
      idea.id === ideaId  ? { ...idea, votes: idea.votes + 1 } : idea
    );
    const updatedVotes = new Set([...userVotes, ideaId]);
    setIdeas(updatedIdeas);
    setUserVotes(updatedVotes);
    try {
      await Promise.all([
        AsyncStorage.setItem('startup_ideas', JSON.stringify(updatedIdeas)),
        AsyncStorage.setItem('user_votes', JSON.stringify([...updatedVotes]))
      ]);
    } catch (error) {
      console.error('Error saving vote:', error);
    }
  };
  return (
    <AppContext.Provider value={{
      ideas, userVotes, isDarkMode, toggleDarkMode, colors: isDarkMode ? darkColors : lightColors, submitIdea, voteForIdea, shareIdea, loading
    }}>
      {children}
    </AppContext.Provider>
  );
}
export const useApp = () => {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};