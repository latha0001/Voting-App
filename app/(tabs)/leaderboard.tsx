import React, { useMemo } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Trophy, Medal, Award, Crown, Star, Settings } from 'lucide-react-native';
import DarkModeToggle from '@/components/DarkModeToggle';
import { useApp } from '@/contexts/AppContext';
export default function LeaderboardScreen() {
  const { ideas, colors } = useApp();
  const topIdeasByVotes = useMemo(() => {
    return [...ideas]
      .sort((a, b) => b.votes - a.votes)
      .slice(0, 5);
  }, [ideas]);
  const topIdeasByRating = useMemo(() => {
    return [...ideas]
      .sort((a, b) => b.rating - a.rating)
      .slice(0, 5);
  }, [ideas]);
  const getRankIcon = (position: number) => {
    switch (position) {
      case 0:
        return <Crown size={24} color="#FFD700" />;
      case 1:
        return <Medal size={24} color="#C0C0C0" />;
      case 2:
        return <Award size={24} color="#CD7F32" />;
      default:
        return <Star size={24} color="#8B5CF6" />;
    }
  };
  const getRankBackground = (position: number) => {
    switch (position) {
      case 0:
        return ['#FFD700', '#FFA500'];
      case 1:
        return ['#C0C0C0', '#A8A8A8'];
      case 2:
        return ['#CD7F32', '#B8860B'];
      default:
        return ['#E5E7EB', '#D1D5DB'];
    }
  };
  const renderLeaderboardItem = (item: any, index: number, type: 'votes' | 'rating') => (
    <View key={`${type}-${item.id}`} style={styles.itemContainer}>
      <LinearGradient colors={getRankBackground(index)} style={[styles.rankBadge, index < 3 && styles.topThreeRank]}>
        <View style={styles.rankContent}>
          {getRankIcon(index)}
          <Text style={[styles.rankNumber, index < 3 && styles.topThreeText]}> #{index + 1}</Text>
        </View>
      </LinearGradient>
      <View style={styles.ideaInfo}>
        <Text style={styles.ideaName}>{item.name}</Text>
        <Text style={styles.ideaTagline}>{item.tagline}</Text>
        <View style={styles.statsContainer}>
          <View style={styles.statItem}>
            <Text style={styles.statValue}> {type === 'votes' ? item.votes : item.rating}</Text>
            <Text style={styles.statLabel}> {type === 'votes' ? 'Votes' : 'AI Score'}</Text>
          </View>
          <View style={styles.statItem}>
            <Text style={styles.statValue}> {type === 'votes' ? item.rating : item.votes}</Text>
            <Text style={styles.statLabel}> {type === 'votes' ? 'AI Score' : 'Votes'}</Text>
          </View>
        </View>
      </View>
    </View>
  );
  const [selectedTab, setSelectedTab] = React.useState<'votes' | 'rating'>('votes');
  if (ideas.length === 0) {
    return (
      <View style={[styles.container, { backgroundColor: colors.background }]}>
        <LinearGradient colors={['#FFD700', '#FFA500']} style={styles.header}>
          <View style={styles.headerContent}>
            <View style={styles.headerTop}>
              <View style={styles.placeholder} />
              <DarkModeToggle />
            </View>
            <View style={styles.iconContainer}>
              <Trophy size={32} color="#FFFFFF" />
            </View>
            <Text style={styles.title}>Leaderboard</Text>
            <Text style={styles.subtitle}>Top startup ideas by community and AI</Text>
          </View>
        </LinearGradient>
        <View style={styles.emptyState}>
          <Text style={[styles.emptyTitle, { color: colors.text }]}>No Rankings Yet</Text>
          <Text style={[styles.emptySubtitle, { color: colors.textSecondary }]}> Submit and vote on ideas to see the leaderboard!</Text>
        </View>
      </View>
    );
  }
  const currentData = selectedTab === 'votes' ? topIdeasByVotes : topIdeasByRating;
  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <LinearGradient colors={['#FFD700', '#FFA500']} style={styles.header}>
        <View style={styles.headerContent}>
          <View style={styles.headerTop}>
            <View style={styles.placeholder} />
            <DarkModeToggle />
          </View>
          <View style={styles.iconContainer}>
            <Trophy size={32} color="#FFFFFF" />
          </View>
          <Text style={styles.title}>Leaderboard</Text>
          <Text style={styles.subtitle}>Top 5 startup ideas</Text>
        </View>
      </LinearGradient>
      <View style={[styles.tabContainer, { backgroundColor: colors.surface }]}>
        <TouchableOpacity
          style={[styles.tab, selectedTab === 'votes' && { backgroundColor: colors.primary }]} onPress={() => setSelectedTab('votes')}>
          <Text style={[styles.tabText, { color: colors.textSecondary }, selectedTab === 'votes' && { color: '#FFFFFF' }]}> Most Voted</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.tab,  selectedTab === 'rating' && { backgroundColor: colors.primary }]} onPress={() => setSelectedTab('rating')}>
          <Text style={[ styles.tabText, { color: colors.textSecondary }, selectedTab === 'rating' && { color: '#FFFFFF' }]}>
            Highest AI Rated
          </Text>
        </TouchableOpacity>
      </View>
      <FlatList data={currentData} renderItem={({ item, index }) => renderLeaderboardItem(item, index, selectedTab)} keyExtractor={(item, index) => `${selectedTab}-${item.id}-${index}`} contentContainerStyle={styles.list} showsVerticalScrollIndicator={false}/>
      {currentData.length > 0 && (
        <View style={[styles.statsFooter, { backgroundColor: colors.surface }]}>
          <View style={styles.totalStats}>
            <View style={styles.totalStatItem}>
              <Text style={[styles.totalStatValue, { color: colors.primary }]}>{ideas.length}</Text>
              <Text style={[styles.totalStatLabel, { color: colors.textSecondary }]}>Total Ideas</Text>
            </View>
            <View style={styles.totalStatItem}>
              <Text style={[styles.totalStatValue, { color: colors.primary }]}> {ideas.reduce((sum, idea) => sum + idea.votes, 0)}</Text>
              <Text style={[styles.totalStatLabel, { color: colors.textSecondary }]}>Total Votes</Text>
            </View>
            <View style={styles.totalStatItem}>
              <Text style={[styles.totalStatValue, { color: colors.primary }]}> {Math.round(ideas.reduce((sum, idea) => sum + idea.rating, 0) / ideas.length)}</Text>
              <Text style={[styles.totalStatLabel, { color: colors.textSecondary }]}>Avg. AI Score</Text>
            </View>
          </View>
        </View>
      )}
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
  tabContainer: {
    flexDirection: 'row',
    marginHorizontal: 20,
    marginTop: -20,
    borderRadius: 12,
    padding: 4,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
  },
  tab: {
    flex: 1,
    paddingVertical: 12,
    alignItems: 'center',
    borderRadius: 8,
  },
  tabText: {
    fontSize: 14,
    fontWeight: '600',
  },
  list: {
    padding: 20,
    paddingBottom: 120,
  },
  itemContainer: {
    flexDirection: 'row',
    borderRadius: 16,
    marginBottom: 12,
    padding: 16,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  rankBadge: {
    width: 60,
    height: 60,
    borderRadius: 30,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  topThreeRank: {
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
  },
  rankContent: {
    alignItems: 'center',
  },
  rankNumber: {
    fontSize: 12,
    fontWeight: '700',
    color: '#6B7280',
    marginTop: 2,
  },
  topThreeText: {
    color: '#FFFFFF',
  },
  ideaInfo: {
    flex: 1,
  },
  ideaName: {
    fontSize: 16,
    fontWeight: '700',
    color: '#1F2937',
    marginBottom: 4,
  },
  ideaTagline: {
    fontSize: 14,
    color: '#6B7280',
    marginBottom: 8,
    fontStyle: 'italic',
  },
  statsContainer: {
    flexDirection: 'row',
    gap: 20,
  },
  statItem: {
    alignItems: 'center',
  },
  statValue: {
    fontSize: 18,
    fontWeight: '700',
    color: '#8B5CF6',
  },
  statLabel: {
    fontSize: 12,
    color: '#6B7280',
    fontWeight: '600',
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
  statsFooter: {
    position: 'absolute',
    bottom: 90,
    left: 0,
    right: 0,
    marginHorizontal: 20,
    borderRadius: 16,
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
  },
  totalStats: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingVertical: 16,
  },
  totalStatItem: {
    alignItems: 'center',
  },
  totalStatValue: {
    fontSize: 20,
    fontWeight: '700',
  },
  totalStatLabel: {
    fontSize: 12,
    fontWeight: '600',
    marginTop: 4,
  },
});