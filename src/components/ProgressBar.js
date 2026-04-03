import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { colors } from '../theme/colors';

export default function ProgressBar({ progress, total, color = colors.primary, showLabel = true, height = 6 }) {
  const pct = total > 0 ? Math.min((progress / total) * 100, 100) : 0;
  return (
    <View style={styles.container}>
      <View style={[styles.track, { height }]}>
        <View style={[styles.fill, { width: `${pct}%`, backgroundColor: color, height }]} />
      </View>
      {showLabel && (
        <Text style={styles.label}>{progress}/{total}</Text>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  track: {
    flex: 1,
    backgroundColor: colors.border,
    borderRadius: 999,
    overflow: 'hidden',
  },
  fill: {
    borderRadius: 999,
  },
  label: {
    fontSize: 11,
    color: colors.textSecondary,
    minWidth: 32,
    textAlign: 'right',
  },
});
