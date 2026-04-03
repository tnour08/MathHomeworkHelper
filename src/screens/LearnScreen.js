import React, { useState, useMemo } from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  Dimensions,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Feather } from '@expo/vector-icons';
import { colors } from '../theme/colors';
import { COURSES, CATEGORIES } from '../data/courses';

const { width } = Dimensions.get('window');

const LEVEL_COLORS = {
  Beginner:     { bg: colors.success + '20', border: colors.success + '40', text: colors.success },
  Intermediate: { bg: colors.warning + '20', border: colors.warning + '40', text: colors.warning },
  Advanced:     { bg: colors.error   + '20', border: colors.error   + '40', text: colors.error   },
};

const LESSON_TYPE_ICONS = { concept: 'book-open', video: 'play-circle', interactive: 'cpu', quiz: 'clipboard' };

// ─────────────────────────────────────────────────────────────────────────────
// Course Detail view (lessons list)
// ─────────────────────────────────────────────────────────────────────────────
function CourseDetail({ course, onBack }) {
  const lc = LEVEL_COLORS[course.level] || LEVEL_COLORS.Intermediate;
  const totalMin = course.lessons.reduce((sum, l) => {
    const n = parseInt(l.duration);
    return sum + (isNaN(n) ? 0 : n);
  }, 0);
  const hours = Math.floor(totalMin / 60);
  const mins  = totalMin % 60;

  return (
    <ScrollView style={styles.detailScroll} contentContainerStyle={styles.detailContent} showsVerticalScrollIndicator={false}>
      {/* Back */}
      <TouchableOpacity style={styles.backBtn} onPress={onBack} activeOpacity={0.7}>
        <Feather name="arrow-left" size={18} color={colors.primary} />
        <Text style={styles.backBtnText}>All Courses</Text>
      </TouchableOpacity>

      {/* Hero card */}
      <View style={[styles.heroCard, { borderColor: course.color + '50' }]}>
        <View style={[styles.heroIcon, { backgroundColor: course.color + '20' }]}>
          <Feather name={course.icon} size={30} color={course.color} />
        </View>
        <View style={[styles.heroCategoryPill, { backgroundColor: course.color + '20', borderColor: course.color + '40' }]}>
          <Text style={[styles.heroCategoryText, { color: course.color }]}>{course.category}</Text>
        </View>
        <Text style={styles.heroTitle}>{course.title}</Text>
        <Text style={styles.heroDesc}>{course.description}</Text>

        <View style={styles.heroMeta}>
          <View style={[styles.levelBadge, { backgroundColor: lc.bg, borderColor: lc.border }]}>
            <Feather name="bar-chart-2" size={12} color={lc.text} />
            <Text style={[styles.levelBadgeText, { color: lc.text }]}>{course.level}</Text>
          </View>
          <View style={styles.metaItem}>
            <Feather name="book-open" size={13} color={colors.textMuted} />
            <Text style={styles.metaText}>{course.lessonCount} lessons</Text>
          </View>
          <View style={styles.metaItem}>
            <Feather name="clock" size={13} color={colors.textMuted} />
            <Text style={styles.metaText}>{hours > 0 ? `${hours}h ` : ''}{mins}m</Text>
          </View>
        </View>
      </View>

      {/* Lessons */}
      <Text style={styles.lessonsHeader}>Course Lessons</Text>
      {course.lessons.map((lesson, idx) => (
        <View key={lesson.id} style={styles.lessonRow}>
          <View style={styles.lessonNumCol}>
            <View style={[styles.lessonNum, { backgroundColor: course.color + '25' }]}>
              <Text style={[styles.lessonNumText, { color: course.color }]}>{idx + 1}</Text>
            </View>
            {idx < course.lessons.length - 1 && (
              <View style={[styles.lessonLine, { backgroundColor: course.color + '25' }]} />
            )}
          </View>
          <View style={styles.lessonCard}>
            <View style={styles.lessonTop}>
              <Feather name={LESSON_TYPE_ICONS[lesson.type] || 'book-open'} size={14} color={course.color} />
              <Text style={styles.lessonTitle}>{lesson.title}</Text>
            </View>
            <View style={styles.lessonBottom}>
              <Feather name="clock" size={11} color={colors.textMuted} />
              <Text style={styles.lessonDuration}>{lesson.duration}</Text>
            </View>
          </View>
        </View>
      ))}
    </ScrollView>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// Course Card
// ─────────────────────────────────────────────────────────────────────────────
function CourseCard({ course, onPress }) {
  const lc = LEVEL_COLORS[course.level] || LEVEL_COLORS.Intermediate;
  return (
    <TouchableOpacity style={styles.courseCard} onPress={onPress} activeOpacity={0.8}>
      <View style={styles.cardTop}>
        <View style={[styles.cardIcon, { backgroundColor: course.color + '20' }]}>
          <Feather name={course.icon} size={22} color={course.color} />
        </View>
        <View style={[styles.levelPill, { backgroundColor: lc.bg, borderColor: lc.border }]}>
          <Text style={[styles.levelPillText, { color: lc.text }]}>{course.level}</Text>
        </View>
      </View>

      <Text style={styles.cardCategory}>{course.category}</Text>
      <Text style={styles.cardTitle}>{course.title}</Text>
      <Text style={styles.cardDesc} numberOfLines={2}>{course.description}</Text>

      <View style={styles.cardFooter}>
        <View style={styles.cardMeta}>
          <Feather name="book-open" size={12} color={colors.textMuted} />
          <Text style={styles.cardMetaText}>{course.lessonCount} lessons</Text>
        </View>
        <View style={styles.cardMeta}>
          <Feather name="clock" size={12} color={colors.textMuted} />
          <Text style={styles.cardMetaText}>{course.duration}</Text>
        </View>
        <View style={styles.cardArrow}>
          <Feather name="arrow-right" size={14} color={course.color} />
        </View>
      </View>

      {/* Colour accent bar */}
      <View style={[styles.cardAccent, { backgroundColor: course.color }]} />
    </TouchableOpacity>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// Main Screen
// ─────────────────────────────────────────────────────────────────────────────
export default function LearnScreen() {
  const [activeCategory, setActiveCategory] = useState('All');
  const [search, setSearch] = useState('');
  const [selectedCourse, setSelectedCourse] = useState(null);

  const filtered = useMemo(() => {
    let list = activeCategory === 'All' ? COURSES : COURSES.filter(c => c.category === activeCategory);
    if (search.trim()) {
      const q = search.trim().toLowerCase();
      list = list.filter(c =>
        c.title.toLowerCase().includes(q) ||
        c.category.toLowerCase().includes(q) ||
        c.description.toLowerCase().includes(q)
      );
    }
    return list;
  }, [activeCategory, search]);

  // Group by category for "All" view
  const grouped = useMemo(() => {
    if (activeCategory !== 'All' || search.trim()) return null;
    const map = {};
    COURSES.forEach(c => {
      if (!map[c.category]) map[c.category] = [];
      map[c.category].push(c);
    });
    return map;
  }, [activeCategory, search]);

  const stats = useMemo(() => ({
    total: COURSES.length,
    lessons: COURSES.reduce((s, c) => s + c.lessonCount, 0),
    hours: Math.round(COURSES.reduce((s, c) => {
      const [h, m] = c.duration.replace('h', '').replace('m', '').trim().split(' ');
      return s + (parseInt(h) || 0) + (parseInt(m) || 0) / 60;
    }, 0)),
  }), []);

  if (selectedCourse) {
    return (
      <SafeAreaView style={styles.safe} edges={['top']}>
        <CourseDetail course={selectedCourse} onBack={() => setSelectedCourse(null)} />
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.safe} edges={['top']}>
      <ScrollView style={styles.scroll} contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>

        {/* ── Header ── */}
        <View style={styles.header}>
          <View>
            <Text style={styles.title}>Learn Mathematics</Text>
            <Text style={styles.subtitle}>{stats.total} courses · {stats.lessons} lessons · {stats.hours}+ hours</Text>
          </View>
          <View style={styles.headerIcon}>
            <Feather name="book-open" size={20} color={colors.primary} />
          </View>
        </View>

        {/* ── Search ── */}
        <View style={styles.searchBar}>
          <Feather name="search" size={16} color={colors.textMuted} />
          <TextInput
            style={styles.searchInput}
            placeholder="Search courses…"
            placeholderTextColor={colors.textMuted}
            value={search}
            onChangeText={setSearch}
          />
          {search.length > 0 && (
            <TouchableOpacity onPress={() => setSearch('')}>
              <Feather name="x" size={16} color={colors.textMuted} />
            </TouchableOpacity>
          )}
        </View>

        {/* ── Category chips ── */}
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.chips}>
          {CATEGORIES.map(cat => (
            <TouchableOpacity
              key={cat}
              onPress={() => { setActiveCategory(cat); setSearch(''); }}
              style={[styles.chip, activeCategory === cat && styles.chipActive]}
            >
              <Text style={[styles.chipText, activeCategory === cat && styles.chipTextActive]}>{cat}</Text>
            </TouchableOpacity>
          ))}
        </ScrollView>

        {/* ── Stats row ── */}
        {activeCategory === 'All' && !search && (
          <View style={styles.statsRow}>
            {[
              { label: 'Courses', value: stats.total, icon: 'layers' },
              { label: 'Lessons', value: stats.lessons, icon: 'book-open' },
              { label: 'Hours+', value: stats.hours, icon: 'clock' },
            ].map(s => (
              <View key={s.label} style={styles.statBox}>
                <Feather name={s.icon} size={16} color={colors.primary} />
                <Text style={styles.statVal}>{s.value}</Text>
                <Text style={styles.statLabel}>{s.label}</Text>
              </View>
            ))}
          </View>
        )}

        {/* ── Results count when searching ── */}
        {search.trim() && (
          <Text style={styles.resultsText}>
            {filtered.length} result{filtered.length !== 1 ? 's' : ''} for "{search}"
          </Text>
        )}

        {/* ── Grouped (All view) ── */}
        {grouped && !search.trim() ? (
          Object.entries(grouped).map(([cat, courses]) => (
            <View key={cat} style={styles.group}>
              <View style={styles.groupHeader}>
                <Text style={styles.groupTitle}>{cat}</Text>
                <Text style={styles.groupCount}>{courses.length} courses</Text>
              </View>
              {courses.map(course => (
                <CourseCard key={course.id} course={course} onPress={() => setSelectedCourse(course)} />
              ))}
            </View>
          ))
        ) : (
          /* ── Flat filtered list ── */
          filtered.length === 0 ? (
            <View style={styles.empty}>
              <Feather name="search" size={36} color={colors.textMuted} />
              <Text style={styles.emptyTitle}>No courses found</Text>
              <Text style={styles.emptyText}>Try a different search term or category.</Text>
            </View>
          ) : (
            filtered.map(course => (
              <CourseCard key={course.id} course={course} onPress={() => setSelectedCourse(course)} />
            ))
          )
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// Styles
// ─────────────────────────────────────────────────────────────────────────────
const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.background },
  scroll: { flex: 1 },
  content: { paddingHorizontal: 20, paddingBottom: 40 },

  // Header
  header: {
    flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center',
    paddingTop: 20, paddingBottom: 16,
  },
  title: { fontSize: 26, fontWeight: '800', color: colors.textPrimary },
  subtitle: { fontSize: 12, color: colors.textSecondary, marginTop: 3 },
  headerIcon: {
    width: 44, height: 44, borderRadius: 13,
    backgroundColor: colors.primary + '18', borderWidth: 1, borderColor: colors.primary + '30',
    alignItems: 'center', justifyContent: 'center',
  },

  // Search
  searchBar: {
    flexDirection: 'row', alignItems: 'center', gap: 10,
    backgroundColor: colors.card, borderRadius: 14, paddingHorizontal: 14, paddingVertical: 12,
    borderWidth: 1, borderColor: colors.border, marginBottom: 14,
  },
  searchInput: { flex: 1, fontSize: 14, color: colors.textPrimary },

  // Category chips
  chips: { gap: 8, paddingBottom: 16 },
  chip: {
    paddingHorizontal: 16, paddingVertical: 8, borderRadius: 20,
    backgroundColor: colors.card, borderWidth: 1, borderColor: colors.border,
  },
  chipActive: { backgroundColor: colors.primary, borderColor: colors.primary },
  chipText: { fontSize: 13, fontWeight: '600', color: colors.textSecondary },
  chipTextActive: { color: '#fff' },

  // Stats row
  statsRow: {
    flexDirection: 'row', gap: 10, marginBottom: 24,
  },
  statBox: {
    flex: 1, backgroundColor: colors.card, borderRadius: 14,
    borderWidth: 1, borderColor: colors.border,
    alignItems: 'center', paddingVertical: 14, gap: 4,
  },
  statVal: { fontSize: 20, fontWeight: '800', color: colors.textPrimary },
  statLabel: { fontSize: 11, color: colors.textMuted, fontWeight: '600' },

  resultsText: { fontSize: 13, color: colors.textSecondary, marginBottom: 12 },

  // Group
  group: { marginBottom: 8 },
  groupHeader: {
    flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center',
    marginBottom: 12,
  },
  groupTitle: { fontSize: 17, fontWeight: '800', color: colors.textPrimary },
  groupCount: { fontSize: 12, color: colors.textMuted, fontWeight: '600' },

  // Course card
  courseCard: {
    backgroundColor: colors.card, borderRadius: 18, marginBottom: 12,
    borderWidth: 1, borderColor: colors.border, padding: 16, overflow: 'hidden',
  },
  cardTop: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 },
  cardIcon: { width: 44, height: 44, borderRadius: 13, alignItems: 'center', justifyContent: 'center' },
  levelPill: { paddingHorizontal: 10, paddingVertical: 4, borderRadius: 20, borderWidth: 1 },
  levelPillText: { fontSize: 11, fontWeight: '700' },
  cardCategory: { fontSize: 11, fontWeight: '700', color: colors.textMuted, textTransform: 'uppercase', letterSpacing: 0.8, marginBottom: 4 },
  cardTitle: { fontSize: 16, fontWeight: '800', color: colors.textPrimary, marginBottom: 6 },
  cardDesc: { fontSize: 13, color: colors.textSecondary, lineHeight: 19, marginBottom: 12 },
  cardFooter: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  cardMeta: { flexDirection: 'row', alignItems: 'center', gap: 4 },
  cardMetaText: { fontSize: 12, color: colors.textMuted },
  cardArrow: { marginLeft: 'auto' },
  cardAccent: { position: 'absolute', left: 0, top: 0, bottom: 0, width: 4 },

  // Empty
  empty: { alignItems: 'center', paddingVertical: 60, gap: 12 },
  emptyTitle: { fontSize: 17, fontWeight: '700', color: colors.textPrimary },
  emptyText: { fontSize: 14, color: colors.textMuted, textAlign: 'center' },

  // ── Detail view ──
  detailScroll: { flex: 1 },
  detailContent: { paddingHorizontal: 20, paddingBottom: 48 },

  backBtn: {
    flexDirection: 'row', alignItems: 'center', gap: 6,
    paddingTop: 16, paddingBottom: 20,
  },
  backBtnText: { fontSize: 14, fontWeight: '700', color: colors.primary },

  heroCard: {
    backgroundColor: colors.card, borderRadius: 20, padding: 20,
    borderWidth: 1, marginBottom: 28, gap: 10,
  },
  heroIcon: { width: 60, height: 60, borderRadius: 18, alignItems: 'center', justifyContent: 'center' },
  heroCategoryPill: {
    alignSelf: 'flex-start', paddingHorizontal: 12, paddingVertical: 4,
    borderRadius: 20, borderWidth: 1,
  },
  heroCategoryText: { fontSize: 12, fontWeight: '700' },
  heroTitle: { fontSize: 22, fontWeight: '800', color: colors.textPrimary, lineHeight: 28 },
  heroDesc: { fontSize: 14, color: colors.textSecondary, lineHeight: 21 },
  heroMeta: { flexDirection: 'row', alignItems: 'center', gap: 12, marginTop: 4 },
  levelBadge: { flexDirection: 'row', alignItems: 'center', gap: 4, paddingHorizontal: 10, paddingVertical: 4, borderRadius: 20, borderWidth: 1 },
  levelBadgeText: { fontSize: 12, fontWeight: '700' },
  metaItem: { flexDirection: 'row', alignItems: 'center', gap: 4 },
  metaText: { fontSize: 12, color: colors.textMuted },

  lessonsHeader: {
    fontSize: 17, fontWeight: '800', color: colors.textPrimary, marginBottom: 16,
  },

  lessonRow: { flexDirection: 'row', gap: 12, marginBottom: 2 },
  lessonNumCol: { alignItems: 'center', width: 32 },
  lessonNum: { width: 32, height: 32, borderRadius: 16, alignItems: 'center', justifyContent: 'center' },
  lessonNumText: { fontSize: 13, fontWeight: '800' },
  lessonLine: { width: 2, flex: 1, marginVertical: 2 },
  lessonCard: {
    flex: 1, backgroundColor: colors.card, borderRadius: 14,
    padding: 13, borderWidth: 1, borderColor: colors.border,
    marginBottom: 8, gap: 6,
  },
  lessonTop: { flexDirection: 'row', alignItems: 'flex-start', gap: 8 },
  lessonTitle: { flex: 1, fontSize: 14, fontWeight: '600', color: colors.textPrimary, lineHeight: 19 },
  lessonBottom: { flexDirection: 'row', alignItems: 'center', gap: 4 },
  lessonDuration: { fontSize: 11, color: colors.textMuted },
});
