import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  Image,
  Alert,
  ActivityIndicator,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Feather } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
import { colors } from '../theme/colors';
import { analyzeMathImage } from '../services/openrouter';
import { useSaved } from '../context/SavedContext';

export default function DashboardScreen() {
  const { addSaved } = useSaved();
  const [photo, setPhoto] = useState(null);
  const [analyzing, setAnalyzing] = useState(false);
  const [result, setResult] = useState(null);
  const [expandedStep, setExpandedStep] = useState(null);
  const [saved, setSaved] = useState(false);

  async function pickAndAnalyze(uri) {
    setPhoto(uri);
    setResult(null);
    setExpandedStep(null);
    setSaved(false);
    setAnalyzing(true);
    try {
      const analysis = await analyzeMathImage(uri);
      setResult(analysis);
    } catch (e) {
      Alert.alert('Analysis failed', e.message);
    } finally {
      setAnalyzing(false);
    }
  }

  async function handleUpload() {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert('Permission needed', 'Please allow access to your photo library.');
      return;
    }
    const res = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ['images'],
      quality: 1,
      allowsEditing: true,
    });
    if (!res.canceled) pickAndAnalyze(res.assets[0].uri);
  }

  async function handleCamera() {
    const { status } = await ImagePicker.requestCameraPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert('Permission needed', 'Please allow access to your camera.');
      return;
    }
    const res = await ImagePicker.launchCameraAsync({
      quality: 1,
      allowsEditing: true,
    });
    if (!res.canceled) pickAndAnalyze(res.assets[0].uri);
  }

  function clearScan() {
    setPhoto(null);
    setResult(null);
    setExpandedStep(null);
    setSaved(false);
    setAnalyzing(false);
  }

  async function handleSave() {
    if (!result) return;
    await addSaved({
      id: Date.now().toString(),
      imageUri: photo,
      problem: result.problem,
      answer: result.answer,
      topic: result.topic,
      difficulty: result.difficulty,
      steps: result.steps,
      tip: result.tip,
      savedAt: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
    });
    setSaved(true);
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
            <Text style={styles.greeting}>Math Homework Helper</Text>
            <Text style={styles.subtitle}>Scan a problem to get started</Text>
          </View>
          <View style={styles.iconBadge}>
            <Feather name="cpu" size={22} color={colors.primary} />
          </View>
        </View>

        {/* ── Scan Widget ── */}
        <View style={styles.widgetCard}>
          <View style={styles.widgetTitleRow}>
            <Feather name="camera" size={16} color={colors.primary} />
            <Text style={styles.widgetTitle}>Scan Your Problem</Text>
          </View>

          {!photo ? (
            /* ── Empty state ── */
            <View style={styles.uploadArea}>
              <View style={styles.uploadIcon}>
                <Feather name="image" size={34} color={colors.primary} />
              </View>
              <Text style={styles.uploadTitle}>Upload a math problem</Text>
              <Text style={styles.uploadSub}>
                Take a photo or pick from your library and get an instant AI-powered solution with step-by-step breakdown
              </Text>
              <View style={styles.uploadBtns}>
                <TouchableOpacity style={styles.cameraBtn} onPress={handleCamera} activeOpacity={0.8}>
                  <Feather name="camera" size={18} color="#fff" />
                  <Text style={styles.cameraBtnText}>Take Photo</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.uploadBtn} onPress={handleUpload} activeOpacity={0.8}>
                  <Feather name="upload" size={18} color={colors.primary} />
                  <Text style={styles.uploadBtnText}>Upload</Text>
                </TouchableOpacity>
              </View>
            </View>
          ) : (
            <View>
              {/* Photo + action bar */}
              <Image source={{ uri: photo }} style={styles.preview} resizeMode="cover" />
              <View style={styles.previewActions}>
                <TouchableOpacity style={styles.previewBtn} onPress={handleCamera} activeOpacity={0.8}>
                  <Feather name="camera" size={14} color={colors.primary} />
                  <Text style={styles.previewBtnText}>Retake</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.previewBtn} onPress={handleUpload} activeOpacity={0.8}>
                  <Feather name="upload" size={14} color={colors.primary} />
                  <Text style={styles.previewBtnText}>Replace</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.clearBtn} onPress={clearScan} activeOpacity={0.8}>
                  <Feather name="x" size={14} color={colors.error} />
                  <Text style={styles.clearBtnText}>Clear</Text>
                </TouchableOpacity>
              </View>

              {/* Analyzing spinner */}
              {analyzing && (
                <View style={styles.analyzingBox}>
                  <ActivityIndicator size="large" color={colors.primary} />
                  <Text style={styles.analyzingText}>Analyzing your problem…</Text>
                  <Text style={styles.analyzingSub}>AI is reading and solving this for you</Text>
                </View>
              )}

              {/* AI Result */}
              {result && !analyzing && (
                <View style={styles.resultBox}>

                  {/* Detected Problem */}
                  <View style={styles.resultSection}>
                    <Text style={styles.resultLabel}>Detected Problem</Text>
                    <Text style={styles.resultProblem}>{result.problem}</Text>
                    <View style={styles.resultMeta}>
                      <View style={styles.metaPill}>
                        <Feather name="book" size={11} color={colors.info} />
                        <Text style={[styles.metaPillText, { color: colors.info }]}>{result.topic}</Text>
                      </View>
                      <View style={[styles.metaPill, { backgroundColor: colors.warning + '20', borderColor: colors.warning + '40' }]}>
                        <Feather name="bar-chart-2" size={11} color={colors.warning} />
                        <Text style={[styles.metaPillText, { color: colors.warning }]}>{result.difficulty}</Text>
                      </View>
                    </View>
                  </View>

                  {/* Answer */}
                  <View style={styles.answerBox}>
                    <Text style={styles.answerLabel}>Answer</Text>
                    <Text style={styles.answerValue}>{result.answer}</Text>
                  </View>

                  {/* Steps */}
                  <View style={styles.resultSection}>
                    <Text style={styles.resultLabel}>Step-by-Step Breakdown</Text>
                    {result.steps?.map((s) => (
                      <TouchableOpacity
                        key={s.step}
                        style={styles.stepCard}
                        onPress={() => setExpandedStep(expandedStep === s.step ? null : s.step)}
                        activeOpacity={0.8}
                      >
                        <View style={styles.stepHeader}>
                          <View style={styles.stepNum}>
                            <Text style={styles.stepNumText}>{s.step}</Text>
                          </View>
                          <Text style={styles.stepTitle}>{s.title}</Text>
                          <Feather
                            name={expandedStep === s.step ? 'chevron-up' : 'chevron-down'}
                            size={16}
                            color={colors.textMuted}
                          />
                        </View>
                        {expandedStep === s.step && (
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
                    ))}
                  </View>

                  {/* Tip */}
                  {result.tip && (
                    <View style={styles.aiTipBox}>
                      <Feather name="zap" size={14} color={colors.warning} />
                      <Text style={styles.aiTipText}>{result.tip}</Text>
                    </View>
                  )}

                  {/* Save button */}
                  <TouchableOpacity
                    style={[styles.saveBtn, saved && styles.saveBtnDone]}
                    onPress={handleSave}
                    activeOpacity={0.8}
                    disabled={saved}
                  >
                    <Feather name={saved ? 'check' : 'bookmark'} size={18} color="#fff" />
                    <Text style={styles.saveBtnText}>{saved ? 'Saved!' : 'Save to Saved'}</Text>
                  </TouchableOpacity>
                </View>
              )}
            </View>
          )}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.background },
  scroll: { flex: 1 },
  content: { paddingHorizontal: 20, paddingBottom: 40 },

  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: 20,
    paddingBottom: 20,
  },
  greeting: { fontSize: 22, fontWeight: '800', color: colors.textPrimary },
  subtitle: { fontSize: 13, color: colors.textSecondary, marginTop: 3 },
  iconBadge: {
    width: 46,
    height: 46,
    borderRadius: 14,
    backgroundColor: colors.primary + '18',
    borderWidth: 1,
    borderColor: colors.primary + '30',
    alignItems: 'center',
    justifyContent: 'center',
  },

  widgetCard: {
    backgroundColor: colors.card,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: colors.border,
    overflow: 'hidden',
  },
  widgetTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    paddingHorizontal: 16,
    paddingVertical: 14,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  widgetTitle: { fontSize: 15, fontWeight: '700', color: colors.textPrimary },

  uploadArea: { alignItems: 'center', paddingVertical: 36, paddingHorizontal: 24, gap: 10 },
  uploadIcon: {
    width: 72,
    height: 72,
    borderRadius: 22,
    backgroundColor: colors.primary + '15',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 6,
  },
  uploadTitle: { fontSize: 17, fontWeight: '700', color: colors.textPrimary },
  uploadSub: { fontSize: 13, color: colors.textSecondary, textAlign: 'center', lineHeight: 19 },
  uploadBtns: { flexDirection: 'row', gap: 12, marginTop: 14 },
  cameraBtn: {
    flexDirection: 'row', alignItems: 'center', gap: 8,
    backgroundColor: colors.primary, paddingHorizontal: 22, paddingVertical: 13, borderRadius: 13,
  },
  cameraBtnText: { color: '#fff', fontWeight: '700', fontSize: 14 },
  uploadBtn: {
    flexDirection: 'row', alignItems: 'center', gap: 8,
    backgroundColor: colors.primary + '18', paddingHorizontal: 22, paddingVertical: 13, borderRadius: 13,
    borderWidth: 1, borderColor: colors.primary + '40',
  },
  uploadBtnText: { color: colors.primary, fontWeight: '700', fontSize: 14 },

  preview: { width: '100%', height: 220 },
  previewActions: {
    flexDirection: 'row', gap: 8, padding: 12,
    borderBottomWidth: 1, borderBottomColor: colors.border,
  },
  previewBtn: {
    flexDirection: 'row', alignItems: 'center', gap: 5,
    paddingHorizontal: 14, paddingVertical: 8, borderRadius: 10,
    backgroundColor: colors.primary + '15', borderWidth: 1, borderColor: colors.primary + '30',
  },
  previewBtnText: { color: colors.primary, fontWeight: '600', fontSize: 13 },
  clearBtn: {
    flexDirection: 'row', alignItems: 'center', gap: 5,
    paddingHorizontal: 14, paddingVertical: 8, borderRadius: 10,
    backgroundColor: colors.error + '15', borderWidth: 1, borderColor: colors.error + '30',
    marginLeft: 'auto',
  },
  clearBtnText: { color: colors.error, fontWeight: '600', fontSize: 13 },

  analyzingBox: {
    alignItems: 'center', paddingVertical: 32, gap: 10,
    borderTopWidth: 1, borderTopColor: colors.border,
  },
  analyzingText: { fontSize: 16, fontWeight: '700', color: colors.textPrimary },
  analyzingSub: { fontSize: 13, color: colors.textSecondary },

  resultBox: { borderTopWidth: 1, borderTopColor: colors.border },
  resultSection: { padding: 16, gap: 10, borderBottomWidth: 1, borderBottomColor: colors.border },
  resultLabel: {
    fontSize: 11, fontWeight: '700', color: colors.textMuted,
    textTransform: 'uppercase', letterSpacing: 0.8,
  },
  resultProblem: { fontSize: 15, color: colors.textPrimary, fontWeight: '500', lineHeight: 22 },
  resultMeta: { flexDirection: 'row', gap: 8, marginTop: 4 },
  metaPill: {
    flexDirection: 'row', alignItems: 'center', gap: 4,
    backgroundColor: colors.info + '20', borderWidth: 1, borderColor: colors.info + '40',
    paddingHorizontal: 10, paddingVertical: 4, borderRadius: 20,
  },
  metaPillText: { fontSize: 12, fontWeight: '600' },

  answerBox: {
    margin: 16, backgroundColor: colors.success + '15',
    borderRadius: 14, padding: 16,
    borderWidth: 1, borderColor: colors.success + '40', gap: 4,
  },
  answerLabel: {
    fontSize: 11, fontWeight: '700', color: colors.success,
    textTransform: 'uppercase', letterSpacing: 0.8,
  },
  answerValue: { fontSize: 22, fontWeight: '800', color: colors.textPrimary },

  stepCard: {
    backgroundColor: colors.background,
    borderRadius: 12, borderWidth: 1, borderColor: colors.border, overflow: 'hidden',
  },
  stepHeader: { flexDirection: 'row', alignItems: 'center', padding: 12, gap: 10 },
  stepNum: {
    width: 26, height: 26, borderRadius: 13,
    backgroundColor: colors.primary, alignItems: 'center', justifyContent: 'center',
  },
  stepNumText: { color: '#fff', fontWeight: '800', fontSize: 12 },
  stepTitle: { flex: 1, fontSize: 14, fontWeight: '600', color: colors.textPrimary },
  stepBody: {
    paddingHorizontal: 12, paddingBottom: 14, gap: 8,
    borderTopWidth: 1, borderTopColor: colors.border,
  },
  expressionBox: {
    backgroundColor: colors.card, borderRadius: 10, padding: 12,
    marginTop: 8, borderWidth: 1, borderColor: colors.border,
  },
  expressionText: { fontSize: 15, color: colors.accent, fontWeight: '700', fontFamily: 'monospace' },
  stepExplanation: { fontSize: 14, color: colors.textSecondary, lineHeight: 21 },

  aiTipBox: {
    flexDirection: 'row', gap: 8, alignItems: 'flex-start',
    margin: 16, marginBottom: 0,
    backgroundColor: colors.warning + '15', borderRadius: 12, padding: 12,
    borderWidth: 1, borderColor: colors.warning + '40',
  },
  aiTipText: { flex: 1, fontSize: 13, color: colors.textSecondary, lineHeight: 19 },

  saveBtn: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8,
    margin: 16, backgroundColor: colors.primary,
    paddingVertical: 14, borderRadius: 14,
  },
  saveBtnDone: { backgroundColor: colors.success },
  saveBtnText: { color: '#fff', fontWeight: '700', fontSize: 15 },
});
