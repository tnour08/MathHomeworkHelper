import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  Dimensions,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Feather } from '@expo/vector-icons';
import { colors } from '../theme/colors';
import DifficultyPill from '../components/DifficultyPill';
import TopicBadge from '../components/TopicBadge';
const quizzes = [];

const { width } = Dimensions.get('window');

const TABS = ['All', 'New', 'In Progress', 'Completed'];

// Placeholder quiz questions shown in preview mode
const SAMPLE_QUESTION = {
  question: 'Solve for x: 2x + 5 = 13',
  options: ['x = 3', 'x = 4', 'x = 6', 'x = 9'],
  correctIndex: 1,
};

export default function QuizScreen() {
  const [activeTab, setActiveTab] = useState('All');
  const [previewQuiz, setPreviewQuiz] = useState(null);
  const [selectedOption, setSelectedOption] = useState(null);
  const [revealed, setRevealed] = useState(false);

  const filtered = quizzes.filter((q) => {
    if (activeTab === 'All') return true;
    if (activeTab === 'New') return q.attempts === 0;
    if (activeTab === 'Completed') return q.attempts > 0 && q.bestScore >= 70;
    if (activeTab === 'In Progress') return q.attempts > 0 && q.bestScore < 70;
    return true;
  });

  if (previewQuiz) {
    return (
      <SafeAreaView style={styles.safe} edges={['top']}>
        <ScrollView style={styles.scroll} contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
          <TouchableOpacity style={styles.backBtn} onPress={() => { setPreviewQuiz(null); setSelectedOption(null); setRevealed(false); }}>
            <Feather name="arrow-left" size={18} color={colors.textPrimary} />
            <Text style={styles.backText}>Back to Quizzes</Text>
          </TouchableOpacity>

          {/* Quiz info */}
          <View style={[styles.quizInfoCard, { borderColor: previewQuiz.topicColor + '50' }]}>
            <TopicBadge label={previewQuiz.topic} color={previewQuiz.topicColor} />
            <Text style={styles.quizInfoTitle}>{previewQuiz.title}</Text>
            <Text style={styles.quizInfoDesc}>{previewQuiz.description}</Text>
            <View style={styles.quizInfoRow}>
              <View style={styles.quizInfoStat}>
                <Feather name="help-circle" size={13} color={colors.textMuted} />
                <Text style={styles.quizInfoStatText}>{previewQuiz.questions} questions</Text>
              </View>
              <View style={styles.quizInfoStat}>
                <Feather name="clock" size={13} color={colors.textMuted} />
                <Text style={styles.quizInfoStatText}>{previewQuiz.duration}</Text>
              </View>
              <DifficultyPill level={previewQuiz.difficulty} />
            </View>
          </View>

          {/* Sample question */}
          <Text style={styles.sectionTitle}>Sample Question</Text>
          <View style={styles.questionCard}>
            <View style={styles.questionNumRow}>
              <View style={[styles.questionNum, { backgroundColor: previewQuiz.topicColor + '25' }]}>
                <Text style={[styles.questionNumText, { color: previewQuiz.topicColor }]}>Q1</Text>
              </View>
              <Text style={styles.questionNumOf}>of {previewQuiz.questions}</Text>
            </View>
            <Text style={styles.questionText}>{SAMPLE_QUESTION.question}</Text>
            <View style={styles.options}>
              {SAMPLE_QUESTION.options.map((opt, i) => {
                let optStyle = styles.option;
                let textStyle = styles.optionText;
                if (revealed) {
                  if (i === SAMPLE_QUESTION.correctIndex) {
                    optStyle = [styles.option, styles.optionCorrect];
                    textStyle = [styles.optionText, styles.optionTextCorrect];
                  } else if (i === selectedOption) {
                    optStyle = [styles.option, styles.optionWrong];
                    textStyle = [styles.optionText, styles.optionTextWrong];
                  }
                } else if (i === selectedOption) {
                  optStyle = [styles.option, styles.optionSelected];
                  textStyle = [styles.optionText, styles.optionTextSelected];
                }
                return (
                  <TouchableOpacity
                    key={i}
                    style={optStyle}
                    onPress={() => !revealed && setSelectedOption(i)}
                    activeOpacity={0.8}
                  >
                    <View style={[styles.optionLetter, i === selectedOption && !revealed && { backgroundColor: previewQuiz.topicColor }]}>
                      <Text style={styles.optionLetterText}>
                        {['A', 'B', 'C', 'D'][i]}
                      </Text>
                    </View>
                    <Text style={textStyle}>{opt}</Text>
                    {revealed && i === SAMPLE_QUESTION.correctIndex && (
                      <Feather name="check-circle" size={16} color={colors.success} />
                    )}
                    {revealed && i === selectedOption && i !== SAMPLE_QUESTION.correctIndex && (
                      <Feather name="x-circle" size={16} color={colors.error} />
                    )}
                  </TouchableOpacity>
                );
              })}
            </View>
            {selectedOption !== null && !revealed && (
              <TouchableOpacity
                style={[styles.checkBtn, { backgroundColor: previewQuiz.topicColor }]}
                onPress={() => setRevealed(true)}
              >
                <Text style={styles.checkBtnText}>Check Answer</Text>
              </TouchableOpacity>
            )}
            {revealed && (
              <View style={[styles.resultBanner, selectedOption === SAMPLE_QUESTION.correctIndex ? styles.resultCorrect : styles.resultWrong]}>
                <Feather
                  name={selectedOption === SAMPLE_QUESTION.correctIndex ? 'check-circle' : 'x-circle'}
                  size={16}
                  color={selectedOption === SAMPLE_QUESTION.correctIndex ? colors.success : colors.error}
                />
                <Text style={[styles.resultText, { color: selectedOption === SAMPLE_QUESTION.correctIndex ? colors.success : colors.error }]}>
                  {selectedOption === SAMPLE_QUESTION.correctIndex ? 'Correct! Well done.' : `Not quite. The answer is ${SAMPLE_QUESTION.options[SAMPLE_QUESTION.correctIndex]}`}
                </Text>
              </View>
            )}
          </View>

          {/* Start full quiz CTA */}
          <TouchableOpacity style={[styles.startFullBtn, { backgroundColor: previewQuiz.topicColor }]} activeOpacity={0.85}>
            <Feather name="play-circle" size={20} color="#fff" />
            <Text style={styles.startFullBtnText}>Start Full Quiz</Text>
          </TouchableOpacity>
        </ScrollView>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.safe} edges={['top']}>
      <ScrollView style={styles.scroll} contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>

        {/* ── Header ── */}
        <View style={styles.header}>
          <Text style={styles.title}>Quiz</Text>
          <Text style={styles.subtitle}>Test your knowledge</Text>
        </View>

        {/* ── Overall stats ── */}
        <View style={styles.overallRow}>
          {[
            { icon: 'clipboard', label: 'Total Quizzes', value: quizzes.length, color: colors.primary },
            { icon: 'star', label: 'Best Score', value: '90%', color: colors.warning },
            { icon: 'award', label: 'Completed', value: quizzes.filter(q => q.attempts > 0).length, color: colors.success },
          ].map((s) => (
            <View key={s.label} style={styles.overallCard}>
              <View style={[styles.overallIcon, { backgroundColor: s.color + '20' }]}>
                <Feather name={s.icon} size={16} color={s.color} />
              </View>
              <Text style={styles.overallValue}>{s.value}</Text>
              <Text style={styles.overallLabel}>{s.label}</Text>
            </View>
          ))}
        </View>

        {/* ── Tabs ── */}
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.tabs}>
          {TABS.map((tab) => (
            <TouchableOpacity
              key={tab}
              onPress={() => setActiveTab(tab)}
              style={[styles.tab, activeTab === tab && styles.tabActive]}
            >
              <Text style={[styles.tabText, activeTab === tab && styles.tabTextActive]}>{tab}</Text>
            </TouchableOpacity>
          ))}
        </ScrollView>

        {/* ── Quiz list ── */}
        {filtered.length === 0 ? (
          <View style={styles.empty}>
            <Feather name="clipboard" size={36} color={colors.textMuted} />
            <Text style={styles.emptyText}>No quizzes in this category</Text>
          </View>
        ) : (
          filtered.map((quiz) => (
            <TouchableOpacity
              key={quiz.id}
              style={styles.quizCard}
              activeOpacity={0.85}
              onPress={() => setPreviewQuiz(quiz)}
            >
              <View style={styles.quizCardTop}>
                <View style={[styles.quizCardIconWrap, { backgroundColor: quiz.topicColor + '20' }]}>
                  <Feather name="clipboard" size={22} color={quiz.topicColor} />
                </View>
                <View style={{ flex: 1 }}>
                  <View style={styles.quizCardMeta}>
                    <TopicBadge label={quiz.topic} color={quiz.topicColor} />
                    <DifficultyPill level={quiz.difficulty} />
                  </View>
                  <Text style={styles.quizCardTitle}>{quiz.title}</Text>
                  <Text style={styles.quizCardDesc} numberOfLines={2}>{quiz.description}</Text>
                </View>
              </View>

              <View style={styles.quizCardBottom}>
                <View style={styles.quizStat}>
                  <Feather name="help-circle" size={12} color={colors.textMuted} />
                  <Text style={styles.quizStatText}>{quiz.questions} Qs</Text>
                </View>
                <View style={styles.quizStat}>
                  <Feather name="clock" size={12} color={colors.textMuted} />
                  <Text style={styles.quizStatText}>{quiz.duration}</Text>
                </View>
                {quiz.bestScore !== null ? (
                  <View style={[styles.scoreBadge, quiz.bestScore >= 70 ? styles.scoreGood : styles.scoreLow]}>
                    <Text style={[styles.scoreText, quiz.bestScore >= 70 ? styles.scoreTextGood : styles.scoreTextLow]}>
                      Best: {quiz.bestScore}%
                    </Text>
                  </View>
                ) : (
                  <View style={styles.newBadge}>
                    <Text style={styles.newBadgeText}>New</Text>
                  </View>
                )}
                <View style={styles.quizArrow}>
                  <Feather name="arrow-right" size={14} color="#fff" />
                </View>
              </View>
            </TouchableOpacity>
          ))
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.background },
  scroll: { flex: 1 },
  content: { paddingHorizontal: 20, paddingBottom: 32 },

  header: { paddingTop: 16, paddingBottom: 20 },
  title: { fontSize: 26, fontWeight: '800', color: colors.textPrimary },
  subtitle: { fontSize: 14, color: colors.textSecondary, marginTop: 2 },

  overallRow: { flexDirection: 'row', gap: 10, marginBottom: 20 },
  overallCard: {
    flex: 1,
    backgroundColor: colors.card,
    borderRadius: 16,
    padding: 14,
    alignItems: 'center',
    gap: 4,
    borderWidth: 1,
    borderColor: colors.border,
  },
  overallIcon: { width: 34, height: 34, borderRadius: 10, alignItems: 'center', justifyContent: 'center' },
  overallValue: { fontSize: 20, fontWeight: '800', color: colors.textPrimary },
  overallLabel: { fontSize: 10, color: colors.textSecondary, textAlign: 'center' },

  tabs: { gap: 8, paddingBottom: 16 },
  tab: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: colors.card,
    borderWidth: 1,
    borderColor: colors.border,
  },
  tabActive: { backgroundColor: colors.primary, borderColor: colors.primary },
  tabText: { fontSize: 13, color: colors.textSecondary, fontWeight: '600' },
  tabTextActive: { color: '#fff' },

  empty: { alignItems: 'center', paddingVertical: 50, gap: 12 },
  emptyText: { fontSize: 14, color: colors.textMuted },

  quizCard: {
    backgroundColor: colors.card,
    borderRadius: 18,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: colors.border,
    overflow: 'hidden',
    padding: 16,
    gap: 14,
  },
  quizCardTop: { flexDirection: 'row', gap: 12, alignItems: 'flex-start' },
  quizCardIconWrap: { width: 48, height: 48, borderRadius: 14, alignItems: 'center', justifyContent: 'center' },
  quizCardMeta: { flexDirection: 'row', gap: 6, marginBottom: 6 },
  quizCardTitle: { fontSize: 16, fontWeight: '700', color: colors.textPrimary, marginBottom: 4 },
  quizCardDesc: { fontSize: 12, color: colors.textSecondary, lineHeight: 17 },
  quizCardBottom: { flexDirection: 'row', alignItems: 'center', gap: 10 },
  quizStat: { flexDirection: 'row', alignItems: 'center', gap: 4 },
  quizStatText: { fontSize: 12, color: colors.textMuted },
  scoreBadge: { paddingHorizontal: 8, paddingVertical: 3, borderRadius: 20, borderWidth: 1 },
  scoreGood: { backgroundColor: colors.success + '15', borderColor: colors.success + '40' },
  scoreLow: { backgroundColor: colors.warning + '15', borderColor: colors.warning + '40' },
  scoreText: { fontSize: 11, fontWeight: '700' },
  scoreTextGood: { color: colors.success },
  scoreTextLow: { color: colors.warning },
  newBadge: { backgroundColor: colors.primary + '20', borderRadius: 20, paddingHorizontal: 8, paddingVertical: 3, borderWidth: 1, borderColor: colors.primary + '50' },
  newBadgeText: { fontSize: 11, color: colors.primaryLight, fontWeight: '700' },
  quizArrow: { marginLeft: 'auto', backgroundColor: colors.primary, width: 28, height: 28, borderRadius: 10, alignItems: 'center', justifyContent: 'center' },

  // Preview
  backBtn: { flexDirection: 'row', alignItems: 'center', gap: 8, paddingTop: 16, paddingBottom: 16, alignSelf: 'flex-start' },
  backText: { fontSize: 15, color: colors.textPrimary, fontWeight: '600' },
  quizInfoCard: { backgroundColor: colors.card, borderRadius: 18, padding: 16, marginBottom: 24, borderWidth: 1, gap: 8 },
  quizInfoTitle: { fontSize: 20, fontWeight: '800', color: colors.textPrimary },
  quizInfoDesc: { fontSize: 13, color: colors.textSecondary, lineHeight: 18 },
  quizInfoRow: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  quizInfoStat: { flexDirection: 'row', alignItems: 'center', gap: 4 },
  quizInfoStatText: { fontSize: 12, color: colors.textSecondary },
  sectionTitle: { fontSize: 16, fontWeight: '700', color: colors.textPrimary, marginBottom: 12 },
  questionCard: { backgroundColor: colors.card, borderRadius: 18, padding: 18, marginBottom: 20, borderWidth: 1, borderColor: colors.border, gap: 16 },
  questionNumRow: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  questionNum: { paddingHorizontal: 10, paddingVertical: 4, borderRadius: 20 },
  questionNumText: { fontSize: 12, fontWeight: '700' },
  questionNumOf: { fontSize: 12, color: colors.textMuted },
  questionText: { fontSize: 18, fontWeight: '700', color: colors.textPrimary, lineHeight: 26 },
  options: { gap: 10 },
  option: { flexDirection: 'row', alignItems: 'center', gap: 12, backgroundColor: colors.surfaceElevated, borderRadius: 14, padding: 14, borderWidth: 1, borderColor: colors.border },
  optionSelected: { borderColor: colors.primary, backgroundColor: colors.primary + '15' },
  optionCorrect: { borderColor: colors.success, backgroundColor: colors.success + '15' },
  optionWrong: { borderColor: colors.error, backgroundColor: colors.error + '15' },
  optionLetter: { width: 28, height: 28, borderRadius: 8, backgroundColor: colors.border, alignItems: 'center', justifyContent: 'center' },
  optionLetterText: { fontSize: 12, fontWeight: '700', color: colors.textPrimary },
  optionText: { flex: 1, fontSize: 14, color: colors.textPrimary, fontWeight: '500' },
  optionTextSelected: { color: colors.primary },
  optionTextCorrect: { color: colors.success },
  optionTextWrong: { color: colors.error },
  checkBtn: { borderRadius: 14, padding: 14, alignItems: 'center' },
  checkBtnText: { color: '#fff', fontSize: 15, fontWeight: '700' },
  resultBanner: { flexDirection: 'row', alignItems: 'center', gap: 8, borderRadius: 12, padding: 12, borderWidth: 1 },
  resultCorrect: { backgroundColor: colors.success + '15', borderColor: colors.success + '40' },
  resultWrong: { backgroundColor: colors.error + '15', borderColor: colors.error + '40' },
  resultText: { fontSize: 14, fontWeight: '600', flex: 1, lineHeight: 18 },
  startFullBtn: { borderRadius: 16, padding: 16, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 10 },
  startFullBtnText: { color: '#fff', fontSize: 16, fontWeight: '800' },
});
