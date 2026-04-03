import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  Switch,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Feather } from '@expo/vector-icons';
import { colors } from '../theme/colors';
const user = { name: '', grade: '', streak: 0, totalSolved: 0, accuracy: 0, weeklyGoal: 0, weeklyProgress: 0, level: '', xp: 0, nextLevelXp: 100 };
import ProgressBar from '../components/ProgressBar';

const DIFFICULTY_OPTIONS = ['Beginner', 'Intermediate', 'Advanced'];
const THEME_OPTIONS = ['Dark', 'Light', 'System'];

export default function SettingsScreen() {
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);
  const [dailyReminderEnabled, setDailyReminderEnabled] = useState(true);
  const [soundEnabled, setSoundEnabled] = useState(false);
  const [selectedDifficulty, setSelectedDifficulty] = useState('Intermediate');
  const [selectedTheme, setSelectedTheme] = useState('Dark');
  const [showStepByStep, setShowStepByStep] = useState(true);
  const [showHints, setShowHints] = useState(true);

  return (
    <SafeAreaView style={styles.safe} edges={['top']}>
      <ScrollView style={styles.scroll} contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>

        {/* ── Header ── */}
        <View style={styles.header}>
          <Text style={styles.title}>Settings</Text>
        </View>

        {/* ── Profile Card ── */}
        <View style={styles.profileCard}>
          <View style={styles.avatar}>
            <Text style={styles.avatarText}>{user.name[0]}</Text>
          </View>
          <View style={{ flex: 1 }}>
            <Text style={styles.profileName}>{user.name}</Text>
            <Text style={styles.profileGrade}>{user.grade}</Text>
            <Text style={styles.profileLevel}>{user.level} · {user.xp} XP</Text>
          </View>
          <TouchableOpacity style={styles.editBtn}>
            <Feather name="edit-2" size={15} color={colors.primary} />
          </TouchableOpacity>
        </View>

        {/* ── XP Progress ── */}
        <View style={styles.xpSection}>
          <View style={styles.xpRow}>
            <Text style={styles.xpLabel}>Progress to next level</Text>
            <Text style={styles.xpValue}>{user.xp} / {user.nextLevelXp} XP</Text>
          </View>
          <ProgressBar progress={user.xp} total={user.nextLevelXp} color={colors.accent} showLabel={false} height={8} />
        </View>

        {/* ── Learning Preferences ── */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Learning Preferences</Text>

          <View style={styles.settingGroup}>
            {/* Difficulty */}
            <View style={styles.settingItem}>
              <View style={styles.settingLeft}>
                <View style={[styles.settingIcon, { backgroundColor: colors.warning + '20' }]}>
                  <Feather name="sliders" size={16} color={colors.warning} />
                </View>
                <View>
                  <Text style={styles.settingLabel}>Difficulty Level</Text>
                  <Text style={styles.settingDesc}>Sets default quiz difficulty</Text>
                </View>
              </View>
            </View>
            <View style={styles.optionRow}>
              {DIFFICULTY_OPTIONS.map((opt) => (
                <TouchableOpacity
                  key={opt}
                  onPress={() => setSelectedDifficulty(opt)}
                  style={[styles.optionChip, selectedDifficulty === opt && styles.optionChipActive]}
                >
                  <Text style={[styles.optionChipText, selectedDifficulty === opt && styles.optionChipTextActive]}>
                    {opt}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>

            <View style={styles.divider} />

            {/* Step by step */}
            <View style={styles.settingItem}>
              <View style={styles.settingLeft}>
                <View style={[styles.settingIcon, { backgroundColor: colors.info + '20' }]}>
                  <Feather name="list" size={16} color={colors.info} />
                </View>
                <View>
                  <Text style={styles.settingLabel}>Step-by-Step Solutions</Text>
                  <Text style={styles.settingDesc}>Show detailed working</Text>
                </View>
              </View>
              <Switch
                value={showStepByStep}
                onValueChange={setShowStepByStep}
                trackColor={{ false: colors.border, true: colors.primary + '60' }}
                thumbColor={showStepByStep ? colors.primary : colors.textMuted}
              />
            </View>

            <View style={styles.divider} />

            {/* Hints */}
            <View style={styles.settingItem}>
              <View style={styles.settingLeft}>
                <View style={[styles.settingIcon, { backgroundColor: colors.accent + '20' }]}>
                  <Feather name="zap" size={16} color={colors.accent} />
                </View>
                <View>
                  <Text style={styles.settingLabel}>Show Hints</Text>
                  <Text style={styles.settingDesc}>Offer hints on problems</Text>
                </View>
              </View>
              <Switch
                value={showHints}
                onValueChange={setShowHints}
                trackColor={{ false: colors.border, true: colors.accent + '60' }}
                thumbColor={showHints ? colors.accent : colors.textMuted}
              />
            </View>
          </View>
        </View>

        {/* ── Appearance ── */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Appearance</Text>
          <View style={styles.settingGroup}>
            <View style={styles.settingItem}>
              <View style={styles.settingLeft}>
                <View style={[styles.settingIcon, { backgroundColor: colors.primary + '20' }]}>
                  <Feather name="moon" size={16} color={colors.primary} />
                </View>
                <Text style={styles.settingLabel}>Theme</Text>
              </View>
            </View>
            <View style={styles.optionRow}>
              {THEME_OPTIONS.map((opt) => (
                <TouchableOpacity
                  key={opt}
                  onPress={() => setSelectedTheme(opt)}
                  style={[styles.optionChip, selectedTheme === opt && styles.optionChipActive]}
                >
                  <Text style={[styles.optionChipText, selectedTheme === opt && styles.optionChipTextActive]}>
                    {opt}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>
        </View>

        {/* ── Notifications ── */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Notifications</Text>
          <View style={styles.settingGroup}>
            <View style={styles.settingItem}>
              <View style={styles.settingLeft}>
                <View style={[styles.settingIcon, { backgroundColor: colors.error + '20' }]}>
                  <Feather name="bell" size={16} color={colors.error} />
                </View>
                <View>
                  <Text style={styles.settingLabel}>Push Notifications</Text>
                  <Text style={styles.settingDesc}>Get app notifications</Text>
                </View>
              </View>
              <Switch
                value={notificationsEnabled}
                onValueChange={setNotificationsEnabled}
                trackColor={{ false: colors.border, true: colors.error + '60' }}
                thumbColor={notificationsEnabled ? colors.error : colors.textMuted}
              />
            </View>
            <View style={styles.divider} />
            <View style={[styles.settingItem, !notificationsEnabled && styles.disabled]}>
              <View style={styles.settingLeft}>
                <View style={[styles.settingIcon, { backgroundColor: colors.warning + '20' }]}>
                  <Feather name="clock" size={16} color={colors.warning} />
                </View>
                <View>
                  <Text style={styles.settingLabel}>Daily Reminder</Text>
                  <Text style={styles.settingDesc}>Remind me to study daily</Text>
                </View>
              </View>
              <Switch
                value={dailyReminderEnabled}
                onValueChange={setDailyReminderEnabled}
                disabled={!notificationsEnabled}
                trackColor={{ false: colors.border, true: colors.warning + '60' }}
                thumbColor={dailyReminderEnabled ? colors.warning : colors.textMuted}
              />
            </View>
            <View style={styles.divider} />
            <View style={styles.settingItem}>
              <View style={styles.settingLeft}>
                <View style={[styles.settingIcon, { backgroundColor: colors.success + '20' }]}>
                  <Feather name="volume-2" size={16} color={colors.success} />
                </View>
                <View>
                  <Text style={styles.settingLabel}>Sound Effects</Text>
                  <Text style={styles.settingDesc}>Play sounds for correct/wrong</Text>
                </View>
              </View>
              <Switch
                value={soundEnabled}
                onValueChange={setSoundEnabled}
                trackColor={{ false: colors.border, true: colors.success + '60' }}
                thumbColor={soundEnabled ? colors.success : colors.textMuted}
              />
            </View>
          </View>
        </View>

        {/* ── Account ── */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Account</Text>
          <View style={styles.settingGroup}>
            {[
              { icon: 'shield', label: 'Privacy Policy', color: colors.textSecondary },
              { icon: 'file-text', label: 'Terms of Service', color: colors.textSecondary },
              { icon: 'help-circle', label: 'Help & Support', color: colors.info },
              { icon: 'star', label: 'Rate the App', color: colors.warning },
              { icon: 'share-2', label: 'Share with Friends', color: colors.primary },
            ].map((item, i, arr) => (
              <View key={item.label}>
                <TouchableOpacity style={styles.linkItem} activeOpacity={0.7}>
                  <View style={[styles.settingIcon, { backgroundColor: item.color + '20' }]}>
                    <Feather name={item.icon} size={16} color={item.color} />
                  </View>
                  <Text style={styles.linkLabel}>{item.label}</Text>
                  <Feather name="chevron-right" size={16} color={colors.textMuted} />
                </TouchableOpacity>
                {i < arr.length - 1 && <View style={styles.divider} />}
              </View>
            ))}
          </View>
        </View>

        {/* ── Sign out ── */}
        <TouchableOpacity style={styles.signOutBtn} activeOpacity={0.8}>
          <Feather name="log-out" size={16} color={colors.error} />
          <Text style={styles.signOutText}>Sign Out</Text>
        </TouchableOpacity>

        <Text style={styles.version}>Math Homework Helper v1.0.0</Text>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.background },
  scroll: { flex: 1 },
  content: { paddingHorizontal: 20, paddingBottom: 40 },

  header: { paddingTop: 16, paddingBottom: 20 },
  title: { fontSize: 26, fontWeight: '800', color: colors.textPrimary },

  profileCard: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
    backgroundColor: colors.card,
    borderRadius: 20,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: colors.border,
  },
  avatar: {
    width: 56,
    height: 56,
    borderRadius: 18,
    backgroundColor: colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarText: { fontSize: 22, fontWeight: '800', color: '#fff' },
  profileName: { fontSize: 18, fontWeight: '800', color: colors.textPrimary },
  profileGrade: { fontSize: 13, color: colors.textSecondary, marginTop: 1 },
  profileLevel: { fontSize: 12, color: colors.accent, marginTop: 3, fontWeight: '600' },
  editBtn: {
    width: 36,
    height: 36,
    borderRadius: 10,
    backgroundColor: colors.primary + '20',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: colors.primary + '40',
  },

  xpSection: {
    backgroundColor: colors.card,
    borderRadius: 16,
    padding: 16,
    marginBottom: 24,
    borderWidth: 1,
    borderColor: colors.border,
    gap: 10,
  },
  xpRow: { flexDirection: 'row', justifyContent: 'space-between' },
  xpLabel: { fontSize: 13, color: colors.textSecondary },
  xpValue: { fontSize: 13, color: colors.accent, fontWeight: '700' },

  section: { marginBottom: 24 },
  sectionTitle: { fontSize: 14, fontWeight: '700', color: colors.textSecondary, marginBottom: 10, textTransform: 'uppercase', letterSpacing: 1 },
  settingGroup: {
    backgroundColor: colors.card,
    borderRadius: 18,
    borderWidth: 1,
    borderColor: colors.border,
    overflow: 'hidden',
  },
  settingItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 16,
  },
  settingLeft: { flexDirection: 'row', alignItems: 'center', gap: 12, flex: 1 },
  settingIcon: { width: 34, height: 34, borderRadius: 10, alignItems: 'center', justifyContent: 'center' },
  settingLabel: { fontSize: 15, fontWeight: '600', color: colors.textPrimary },
  settingDesc: { fontSize: 11, color: colors.textMuted, marginTop: 1 },
  divider: { height: 1, backgroundColor: colors.divider, marginLeft: 62 },
  disabled: { opacity: 0.4 },

  optionRow: { flexDirection: 'row', gap: 8, paddingHorizontal: 16, paddingBottom: 16 },
  optionChip: {
    flex: 1,
    paddingVertical: 8,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.surfaceElevated,
    alignItems: 'center',
  },
  optionChipActive: { backgroundColor: colors.primary, borderColor: colors.primary },
  optionChipText: { fontSize: 12, color: colors.textSecondary, fontWeight: '600' },
  optionChipTextActive: { color: '#fff' },

  linkItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    padding: 16,
  },
  linkLabel: { flex: 1, fontSize: 15, color: colors.textPrimary, fontWeight: '500' },

  signOutBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    backgroundColor: colors.error + '15',
    borderRadius: 16,
    padding: 16,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: colors.error + '40',
  },
  signOutText: { fontSize: 15, color: colors.error, fontWeight: '700' },

  version: { textAlign: 'center', fontSize: 12, color: colors.textMuted },
});
