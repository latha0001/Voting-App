import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Alert } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Heart, ChevronDown, ChevronUp, Share2 } from 'lucide-react-native';
import Toast from 'react-native-toast-message';
import { StartupIdea, useApp } from '@/contexts/AppContext';

interface IdeaCardProps { idea: StartupIdea; onVote: (ideaId: string) => void; hasUserVoted: boolean; expanded?: boolean; onToggleExpanded?: () => void;}

export default function IdeaCard({ idea, onVote, hasUserVoted, expanded = false, onToggleExpanded }: IdeaCardProps) {
  const { shareIdea, colors } = useApp();
  const getRatingColor = (rating: number) => {
    if (rating >= 90) return '#10B981';
    if (rating >= 80) return '#F59E0B';
    if (rating >= 70) return '#EF4444';
    return '#6B7280';
  };
  const getRatingLabel = (rating: number) => {
    if (rating >= 90) return 'Excellent';
    if (rating >= 80) return 'Very Good';
    if (rating >= 70) return 'Good';
    return 'Needs Work';
  };
  const handleShare = async () => {
    try {
      const result = await shareIdea(idea);
      if (result === 'clipboard') {
        Toast.show({ type: 'success', text1: 'Copied to Clipboard', text2: 'Idea details copied successfully!', position: 'top',});
      } else {
        Toast.show({ type: 'success', text1: 'Shared Successfully', text2: 'Thanks for spreading the word!', position: 'top',});
      }
    } catch (error) {
      Toast.show({ type: 'error', text1: 'Share Failed', text2: 'Please try again', position: 'top',});
    }
  };
  return (
    <View style={[styles.container, { backgroundColor: colors.card }]}>
      <LinearGradient colors={[colors.card, colors.background]} style={styles.card}>
        <View style={styles.header}>
          <View style={styles.titleSection}>
            <Text style={[styles.name, { color: colors.text }]}>{idea.name}</Text>
            <Text style={[styles.tagline, { color: colors.textSecondary }]}>{idea.tagline}</Text>
          </View>
          <View style={styles.ratingContainer}>
            <View style={[styles.ratingBadge, { backgroundColor: getRatingColor(idea.rating) }]}>
              <Text style={styles.ratingText}>{idea.rating}</Text>
            </View>
            <Text style={[styles.ratingLabel, { color: getRatingColor(idea.rating) }]}> {getRatingLabel(idea.rating)}</Text>
          </View>
        </View>
        {expanded && (
          <View style={styles.expandedContent}>
            <Text style={[styles.description, { color: colors.text }]}>{idea.description}</Text>
            <View style={[styles.feedbackContainer, { backgroundColor: colors.background, borderLeftColor: colors.primary }]}>
              <Text style={[styles.feedbackLabel, { color: colors.primary }]}>AI Feedback:</Text>
              <Text style={[styles.feedback, { color: colors.text }]}>{idea.feedback}</Text>
            </View>
          </View>
        )}
        <View style={styles.footer}>
          <View style={styles.leftActions}>
            <TouchableOpacity
              style={[ styles.voteButton, { backgroundColor: colors.background, borderColor: colors.border }, hasUserVoted && styles.votedButton ]} onPress={() => onVote(idea.id)} disabled={hasUserVoted}>
              <Heart size={20} color={hasUserVoted ? '#EF4444' : colors.textSecondary} fill={hasUserVoted ? '#EF4444' : 'transparent'}/>
              <Text style={[styles.voteText, { color: colors.textSecondary }, hasUserVoted && styles.votedText]}> {idea.votes} votes</Text>
            </TouchableOpacity>
            <TouchableOpacity style={[styles.shareButton, { backgroundColor: colors.background, borderColor: colors.border }]} onPress={handleShare}>
              <Share2 size={18} color={colors.primary} />
            </TouchableOpacity>
          </View>
          {onToggleExpanded && (
            <TouchableOpacity style={styles.expandButton} onPress={onToggleExpanded}>
              <Text style={styles.expandText}> {expanded ? 'Show less' : 'Read more'}</Text>
              {expanded ? (
                <ChevronUp size={16} color={colors.primary} />
              ) : (
                <ChevronDown size={16} color={colors.primary} />
              )}
            </TouchableOpacity>
          )}
        </View>
      </LinearGradient>
    </View>
  );
}
const styles = StyleSheet.create({
  container: {
    marginBottom: 16,
    borderRadius: 16,
    overflow: 'hidden',
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2,},
    shadowOpacity: 0.1,
    shadowRadius: 8,
  },
  card: {
    padding: 20,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  titleSection: {
    flex: 1,
    marginRight: 16,
  },
  name: {
    fontSize: 18,
    fontWeight: '700',
    color: '#1F2937',
    marginBottom: 4,
  },
  tagline: {
    fontSize: 14,
    color: '#6B7280',
    fontStyle: 'italic',
  },
  ratingContainer: {
    alignItems: 'center',
  },
  ratingBadge: {
    width: 50,
    height: 50,
    borderRadius: 25,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 4,
  },
  ratingText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '700',
  },
  ratingLabel: {
    fontSize: 12,
    fontWeight: '600',
  },
  expandedContent: {
    marginBottom: 16,
  },
  description: {
    fontSize: 15,
    color: '#4B5563',
    lineHeight: 22,
    marginBottom: 16,
  },
  feedbackContainer: {
    backgroundColor: '#F3F4F6',
    borderRadius: 12,
    padding: 16,
    borderLeftWidth: 4,
    borderLeftColor: '#8B5CF6',
  },
  feedbackLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: '#8B5CF6',
    marginBottom: 8,
  },
  feedback: {
    fontSize: 14,
    color: '#4B5563',
    fontStyle: 'italic',
    lineHeight: 20,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  leftActions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  voteButton: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    borderRadius: 8,
    borderWidth: 1,
  },
  votedButton: {
    backgroundColor: '#FEF2F2',
    borderColor: '#FECACA',
  },
  shareButton: {
    padding: 12,
    borderRadius: 8,
    borderWidth: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  voteText: {
    marginLeft: 8,
    fontSize: 14,
    fontWeight: '600',
  },
  votedText: {
    color: '#EF4444',
  },
  expandButton: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 8,
  },
  expandText: {
    fontSize: 14,
    fontWeight: '600',
    marginRight: 4,
  },
});