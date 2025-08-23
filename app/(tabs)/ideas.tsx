import React, { useState } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, RefreshControl } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { List, Filter, TrendingUp, Settings } from 'lucide-react-native';
import Toast from 'react-native-toast-message';
import IdeaCard from '@/components/IdeaCard';
import DarkModeToggle from '@/components/DarkModeToggle';
import { useApp } from '@/contexts/AppContext';

type SortOption = 'rating' | 'votes' | 'newest';
export default function IdeasScreen() {
  const { ideas, userVotes, voteForIdea, loading, colors } = useApp();
  const [sortBy, setSortBy] = useState<SortOption>('newest');
  const [expandedItems, setExpandedItems] = useState<Set<string>>(new Set());
  const [refreshing, setRefreshing] = useState(false);
  const sortedIdeas = [...ideas].sort((a, b) => {
    switch (sortBy) {
      case 'rating':
        return b.rating - a.rating;
      case 'votes':
        return b.votes - a.votes;
      case 'newest':
      default:
        return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
    }
  });
  const handleVote = async (ideaId: string) => {
    if (userVotes.has(ideaId)) {
      Toast.show({ type: 'info', text1: 'Already Voted', text2: 'You can only vote once per idea', position: 'top', visibilityTime: 2000,});
      return;
    }

    try {
      await voteForIdea(ideaId);
      Toast.show({ type: 'success', text1: 'Vote Recorded Successfully', text2: 'Thanks for supporting this idea!', position: 'top', visibilityTime: 3000,});
    } catch (error) {
      Toast.show({ type: 'error', text1: 'Vote Failed', text2: 'Please check your connection and try again', position: 'top', visibilityTime: 3000,});
    }
  };

  const toggleExpanded = (ideaId: string) => {
    const newExpanded = new Set(expandedItems);
    if (expandedItems.has(ideaId)) {
      newExpanded.delete(ideaId);
    } else {
      newExpanded.add(ideaId);
    }
    setExpandedItems(newExpanded);
  };
  const handleRefresh = async () => {
    setRefreshing(true);
    setTimeout(() => {
      setRefreshing(false);
    }, 1000);
  };
  const getSortLabel = (option: SortOption) => {
    switch (option) {
      case 'rating': return 'AI Rating';
      case 'votes': return 'Most Voted';
      case 'newest': return 'Newest';
    }
  };
  const renderSortButton = (option: SortOption, label: string, icon: React.ReactNode) => (
    <TouchableOpacity
      style={[ styles.sortButton,  { backgroundColor: colors.background, borderColor: colors.border }, sortBy === option && { backgroundColor: colors.primary, borderColor: colors.primary }]} onPress={() => setSortBy(option)}>
      {icon}
      <Text style={[ styles.sortButtonText, { color: colors.textSecondary }, sortBy === option && { color: '#FFFFFF' }]}>
        {label}
      </Text>
    </TouchableOpacity>
  );
  if (ideas.length === 0 && !loading) {
    return (
      <View style={[styles.container, { backgroundColor: colors.background }]}>
        <LinearGradient colors={[colors.primary, '#3B82F6']} style={styles.header}>
          <View style={styles.headerContent}>
            <View style={styles.headerTop}>
              <View style={styles.placeholder} />
              <DarkModeToggle />
            </View>
            <View style={styles.iconContainer}>
              <List size={32} color="#FFFFFF" />
            </View>
            <Text style={styles.title}>Browse Startup Ideas</Text>
            <Text style={styles.subtitle}> Discover innovative concepts from the community </Text>
          </View>
        </LinearGradient>
        <View style={styles.emptyState}>
          <Text style={[styles.emptyTitle, { color: colors.text }]}>No Ideas Yet</Text>
          <Text style={[styles.emptySubtitle, { color: colors.textSecondary }]}> Be the first to submit a startup idea and get AI feedback!</Text>
        </View>
      </View>
    );
  }
  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <LinearGradient colors={[colors.primary, '#3B82F6']} style={styles.header}>
        <View style={styles.headerContent}>
          <View style={styles.headerTop}>
            <View style={styles.placeholder} />
            <DarkModeToggle />
          </View>
          <View style={styles.iconContainer}>
            <List size={32} color="#FFFFFF" />
          </View>
          <Text style={styles.title}>Browse Startup Ideas</Text>
          <Text style={styles.subtitle}> {ideas.length} innovative concepts to explore</Text>
        </View>
      </LinearGradient>
      <View style={[styles.sortContainer, { backgroundColor: colors.surface, borderBottomColor: colors.border }]}>
        <View style={styles.sortHeader}>
          <Filter size={16} color={colors.textSecondary} />
          <Text style={[styles.sortTitle, { color: colors.textSecondary }]}>Sort by:</Text>
        </View>
        <View style={styles.sortButtons}>
          {renderSortButton('newest', 'Newest', <TrendingUp size={16} color={sortBy === 'newest' ? '#FFFFFF' : colors.textSecondary} />)}
          {renderSortButton('rating', 'AI Rating', <Text style={[styles.sortIcon, { color: sortBy === 'rating' ? '#FFFFFF' : colors.textSecondary }]}>🤖</Text>)}
          {renderSortButton('votes', 'Votes', <Text style={[styles.sortIcon, { color: sortBy === 'votes' ? '#FFFFFF' : colors.textSecondary }]}>❤️</Text>)}
        </View>
      </View>
      <FlatList
        data={sortedIdeas}
        renderItem={({ item }) => (
          <IdeaCard
            idea={item}
            onVote={handleVote}
            hasUserVoted={userVotes.has(item.id)}
            expanded={expandedItems.has(item.id)}
            onToggleExpanded={() => toggleExpanded(item.id)}/>
        )}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.list}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={handleRefresh}
            colors={[colors.primary]}
            tintColor={colors.primary}/>
        }
      />
    </View>
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
  },
  sortContainer: {
    paddingVertical: 16,
    paddingHorizontal: 20,
    borderBottomWidth: 1,
  },
  sortHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  sortTitle: {
    fontSize: 14,
    fontWeight: '600',
    marginLeft: 8,
  },
  sortButtons: {
    flexDirection: 'row',
    gap: 8,
  },
  sortButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 20,
    borderWidth: 1,
  },
  sortButtonText: {
    fontSize: 14,
    fontWeight: '600',
    marginLeft: 6,
  },
  sortIcon: {
    fontSize: 14,
  },
  list: {
    padding: 20,
    paddingBottom: 100,
  },
  emptyState: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 40,
  },
  emptyTitle: {
    fontSize: 20,
    fontWeight: '700',
    marginBottom: 12,
  },
  emptySubtitle: {
    fontSize: 16,
    textAlign: 'center',
    lineHeight: 22,
  },
});