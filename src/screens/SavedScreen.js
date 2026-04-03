import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  Image,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Feather } from '@expo/vector-icons';
import { colors } from '../theme/colors';
import { useSaved } from '../context/SavedContext';

const ALL = 'All';

export default function SavedScreen() {
  const { savedItems, removeSaved } = useSaved();
  const [activeFilter, setActiveFilter] = useState(ALL);
  const [expandedId, setExpandedId] = useState(null);
  const [expandedStep, setExpandedStep] = useState(null);

  const topics = [ALL, ...Array.from(new Set(savedItems.map((p) => p.topic).filter(Boolean)))];

  const filtered =
    activeFilter === ALL
      ? savedItems
      : savedItems.filter((p) => p.topic === activeFilter);

  function confirmDelete(id, problem) {
    Alert.alert(
      'Remove Problem',
      `Remove this problem from saved?`,
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Remove', style: 'destructive', onPress: () => removeSaved(id) },
      ]
    );
  }

  function toggleExpand(id) {
    setExpandedId(expandedId === id ? null : id);
    setExpandedStep(null);
  }

  return (
    <SafeAreaView style={styles.safe} edges={['top']}>
      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        {/* ── Header ── */}
        <View style={styles.header}>
          <View>
            <Text style={styles.title}>Saved Problems</Text>
            <Text style={styles.subtitle}>
              {savedItems.length === 0
                ? 'No problems saved yet'
                : `${savedItems.length} problem${savedItems.length === 1 ? '' : 's'} saved`}
            </Text>
          </View>
          <View style={styles.headerIcon}>
            <Feather name="bookmark" size={20} color={colors.primary} />
          </View>
        </View>

        {/* ── Topic Filters ── */}
        {savedItems.length > 0 && (
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.filters}
          >
            {topics.map((t) => (
              <TouchableOpacity
                key={t}
                onPress={() => setActiveFilter(t)}
                style={[styles.filterChip, activeFilter === t && styles.filterChipActive]}
              >
                <Text style={[styles.filterText, activeFilter === t && styles.filterTextActive]}>
                  {t}
                </Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        )}

        {/* ── Empty State ── */}
        {savedItems.length === 0 && (
          <View style={styles.empty}>
            <View style={styles.emptyIcon}>
              <Feather name="bookmark" size={36} color={colors.textMuted} />
            </View>
            <Text style={styles.emptyTitle}>Nothing saved yet</Text>
            <Text style={styles.emptyText}>
              Scan a math problem from the Home tab and tap{' '}
              <Text style={{ fontWeight: '700', color: colors.primary }}>"Save to Saved"</Text>{' '}
              to store it here with its full solution.
            </Text>
          </View>
        )}

        {/* ── Filtered empty ── */}
        {savedItems.length > 0 && filtered.length === 0 && (
          <View style={styles.empty}>
            <Feather name="filter" size={32} color={colors.textMuted} />
            <Text style={styles.emptyText}>No {activeFilter} problems saved yet.</Text>
          </View>
        )}

        {/* ── Problem Cards ── */}
        {filtered.map((p) => {
          const isExpanded = expandedId === p.id;
          return (
            <TouchableOpacity
              key={p.id}
              style={styles.card}
              activeOpacity={0.85}
              onPress={() => toggleExpand(p.id)}
            >
              {/* Card header */}
              <View style={styles.cardHeader}>
                {p.imageUri ? (
                  <Image source={{ uri: p.imageUri }} style={styles.thumb} resizeMode="cover" />
                ) : (
                  <View style={[styles.thumb, styles.thumbPlaceholder]}>
                    <Feather name="image" size={18} color={colors.textMuted} />
                  </View>
                )}
                <View style={styles.cardInfo}>
                  <View style={styles.cardBadges}>
                    {p.topic ? (
                      <View style={styles.topicPill}>
                        <Text style={styles.topicPillText}>{p.topic}</Text>
                      </View>
                    ) : null}
                    {p.difficulty ? (
                      <View style={[styles.diffPill, difficultyStyle(p.difficulty)]}>
                        <Text style={[styles.diffPillText, difficultyTextStyle(p.difficulty)]}>
                          {p.difficulty}
                        </Text>
                      </View>
                    ) : null}
                  </View>
                  <Text style={styles.problemText} numberOfLines={isExpanded ? undefined : 2}>
                    {p.problem}
                  </Text>
                  <Text style={styles.savedDate}>{p.savedAt}</Text>
                </View>
                <Feather
                  name={isExpanded ? 'chevron-up' : 'chevron-down'}
                  size={18}
                  color={colors.textMuted}
                />
              </View>

              {/* Expanded */}
              {isExpanded && (
                <View style={styles.expanded}>
                  <View style={styles.divider} />

                  {/* Answer */}
                  <View style={styles.answerBox}>
                    <Text style={styles.answerLabel}>Answer</Text>
                    <Text style={styles.answerValue}>{p.answer}</Text>
                  </View>

                  {/* Steps */}
                  {p.steps?.length > 0 && (
                    <View style={styles.stepsSection}>
                      <Text style={styles.sectionLabel}>Step-by-Step Breakdown</Text>
                      {p.steps.map((s) => {
                        const stepKey = `${p.id}-${s.step}`;
                        return (
                          <TouchableOpacity
                            key={stepKey}
                            style={styles.stepCard}
                            onPress={() => setExpandedStep(expandedStep === stepKey ? null : stepKey)}
                            activeOpacity={0.8}
                          >
                            <View style={styles.stepHeader}>
                              <View style={styles.stepNum}>
                                <Text style={styles.stepNumText}>{s.step}</Text>
                              </View>
                              <Text style={styles.stepTitle}>{s.title}</Text>
                              <Feather
                                name={expandedStep === stepKey ? 'chevron-up' : 'chevron-down'}
                                size={15}
                                color={colors.textMuted}
                              />
                            </View>
                            {expandedStep === stepKey && (
                              <View style={styles.stepBody}>
                                {s.expression ? (
                                  <View style={styles.expressionBox}>
                                    <Text style={styles.expressionText}>{s.expression}</Text>
                                  </View>
                                ) : null}
                                <Text style={styles.stepExplanation}>{s.explanation}</Text>
                              </View>
                            )}
                          </TouchableOpacity>
                        );
                      })}
                    </View>
                  )}

                  {/* Tip */}
                  {p.tip && (
                    <View style={styles.tipBox}>
                      <Feather name="zap" size={13} color={colors.warning} />
                      <Text style={styles.tipText}>{p.tip}</Text>
                    </View>
                  )}

                  {/* Delete */}
                  <TouchableOpacity
                    style={styles.deleteBtn}
                    onPress={() => confirmDelete(p.id, p.problem)}
                    activeOpacity={0.8}
                  >
                    <Feather name="trash-2" size={15} color={colors.error} />
                    <Text style={styles.deleteBtnText}>Remove from Saved</Text>
                  </TouchableOpacity>
                </View>
              )}
            </TouchableOpacity>
          );
        })}
      </ScrollView>
    </SafeAreaView>
  );
}

function difficultyStyle(level) {
  const map = {
    Easy: { backgroundColor: colors.success + '20', borderColor: colors.success + '40' },
    Medium: { backgroundColor: colors.warning + '20', borderColor: colors.warning + '40' },
    Hard: { backgroundColor: colors.error + '20', borderColor: colors.error + '40' },
  };
  return map[level] || map['Medium'];
}

function difficultyTextStyle(level) {
  const map = {
    Easy: { color: colors.success },
    Medium: { color: colors.warning },
    Hard: { color: colors.error },
  };
  return map[level] || map['Medium'];
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.background },
  scroll: { flex: 1 },
  content: { paddingHorizontal: 20, paddingBottom: 40 },

  header: {
    flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center',
    paddingTop: 20, paddingBottom: 16,
  },
  title: { fontSize: 26, fontWeight: '800', color: colors.textPrimary },
  subtitle: { fontSize: 13, color: colors.textSecondary, marginTop: 3 },
  headerIcon: {
    width: 44, height: 44, borderRadius: 13,
    backgroundColor: colors.primary + '18', borderWidth: 1, borderColor: colors.primary + '30',
    alignItems: 'center', justifyContent: 'center',
  },

  filters: { gap: 8, paddingBottom: 16 },
  filterChip: {
    paddingHorizontal: 16, paddingVertical: 8, borderRadius: 20,
    backgroundColor: colors.card, borderWidth: 1, borderColor: colors.border,
  },
  filterChipActive: { backgroundColor: colors.primary, borderColor: colors.primary },
  filterText: { fontSize: 13, color: colors.textSecondary, fontWeight: '600' },
  filterTextActive: { color: '#fff' },

  empty: { alignItems: 'center', paddingVertical: 60, gap: 14, paddingHorizontal: 20 },
  emptyIcon: {
    width: 72, height: 72, borderRadius: 22,
    backgroundColor: colors.card, borderWidth: 1, borderColor: colors.border,
    alignItems: 'center', justifyContent: 'center',
  },
  emptyTitle: { fontSize: 18, fontWeight: '700', color: colors.textPrimary },
  emptyText: { fontSize: 14, color: colors.textMuted, textAlign: 'center', lineHeight: 21 },

  card: {
    backgroundColor: colors.card, borderRadius: 18, marginBottom: 14,
    borderWidth: 1, borderColor: colors.border, overflow: 'hidden',
  },
  cardHeader: { flexDirection: 'row', alignItems: 'flex-start', padding: 14, gap: 12 },
  thumb: { width: 64, height: 64, borderRadius: 12 },
  thumbPlaceholder: { backgroundColor: colors.border, alignItems: 'center', justifyContent: 'center' },
  cardInfo: { flex: 1, gap: 5 },
  cardBadges: { flexDirection: 'row', gap: 6 },
  topicPill: {
    backgroundColor: colors.primary + '20', paddingHorizontal: 10, paddingVertical: 3,
    borderRadius: 20, borderWidth: 1, borderColor: colors.primary + '40',
  },
  topicPillText: { fontSize: 11, fontWeight: '700', color: colors.primary },
  diffPill: { paddingHorizontal: 10, paddingVertical: 3, borderRadius: 20, borderWidth: 1 },
  diffPillText: { fontSize: 11, fontWeight: '700' },
  problemText: { fontSize: 14, color: colors.textPrimary, fontWeight: '500', lineHeight: 20 },
  savedDate: { fontSize: 11, color: colors.textMuted },

  expanded: { gap: 12, paddingBottom: 14 },
  divider: { height: 1, backgroundColor: colors.border },

  answerBox: {
    marginHorizontal: 14, backgroundColor: colors.success + '15',
    borderRadius: 13, padding: 14, borderWidth: 1, borderColor: colors.success + '40', gap: 4,
  },
  answerLabel: {
    fontSize: 11, fontWeight: '700', color: colors.success,
    textTransform: 'uppercase', letterSpacing: 0.8,
  },
  answerValue: { fontSize: 20, fontWeight: '800', color: colors.textPrimary },

  stepsSection: { paddingHorizontal: 14, gap: 8 },
  sectionLabel: {
    fontSize: 11, fontWeight: '700', color: colors.textMuted,
    textTransform: 'uppercase', letterSpacing: 0.8, marginBottom: 2,
  },
  stepCard: {
    backgroundColor: colors.background, borderRadius: 11,
    borderWidth: 1, borderColor: colors.border, overflow: 'hidden',
  },
  stepHeader: { flexDirection: 'row', alignItems: 'center', padding: 11, gap: 9 },
  stepNum: {
    width: 24, height: 24, borderRadius: 12,
    backgroundColor: colors.primary, alignItems: 'center', justifyContent: 'center',
  },
  stepNumText: { color: '#fff', fontWeight: '800', fontSize: 11 },
  stepTitle: { flex: 1, fontSize: 13, fontWeight: '600', color: colors.textPrimary },
  stepBody: {
    paddingHorizontal: 11, paddingBottom: 12, gap: 7,
    borderTopWidth: 1, borderTopColor: colors.border,
  },
  expressionBox: {
    backgroundColor: colors.card, borderRadius: 9, padding: 10,
    marginTop: 6, borderWidth: 1, borderColor: colors.border,
  },
  expressionText: { fontSize: 14, color: colors.accent, fontWeight: '700', fontFamily: 'monospace' },
  stepExplanation: { fontSize: 13, color: colors.textSecondary, lineHeight: 20 },

  tipBox: {
    flexDirection: 'row', gap: 8, alignItems: 'flex-start', marginHorizontal: 14,
    backgroundColor: colors.warning + '15', borderRadius: 11, padding: 11,
    borderWidth: 1, borderColor: colors.warning + '40',
  },
  tipText: { flex: 1, fontSize: 13, color: colors.textSecondary, lineHeight: 19 },

  deleteBtn: {
    flexDirection: 'row', alignItems: 'center', gap: 6,
    marginHorizontal: 14, paddingVertical: 10, paddingHorizontal: 14,
    borderRadius: 11, borderWidth: 1, borderColor: colors.error + '40',
    backgroundColor: colors.error + '10', alignSelf: 'flex-start',
  },
  deleteBtnText: { color: colors.error, fontWeight: '600', fontSize: 13 },
});
