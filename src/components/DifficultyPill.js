import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { colors } from '../theme/colors';

const difficultyConfig = {
  Easy: { color: colors.success, label: 'Easy' },
  Medium: { color: colors.warning, label: 'Medium' },
  Hard: { color: colors.error, label: 'Hard' },
  Beginner: { color: colors.success, label: 'Beginner' },
  Intermediate: { color: colors.warning, label: 'Intermediate' },
  Advanced: { color: colors.error, label: 'Advanced' },
};

export default function DifficultyPill({ level }) {
  const config = difficultyConfig[level] || { color: colors.textSecondary, label: level };
  return (
    <View style={[styles.pill, { backgroundColor: config.color + '20', borderColor: config.color + '50' }]}>
      <View style={[styles.dot, { backgroundColor: config.color }]} />
      <Text style={[styles.text, { color: config.color }]}>{config.label}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  pill: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 20,
    borderWidth: 1,
    gap: 4,
  },
  dot: {
    width: 5,
    height: 5,
    borderRadius: 3,
  },
  text: {
    fontSize: 11,
    fontWeight: '600',
  },
});
