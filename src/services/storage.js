import AsyncStorage from '@react-native-async-storage/async-storage';

const KEY = 'saved_problems';

export async function getSavedProblems() {
  try {
    const raw = await AsyncStorage.getItem(KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

export async function saveProblem(item) {
  const current = await getSavedProblems();
  const updated = [item, ...current];
  await AsyncStorage.setItem(KEY, JSON.stringify(updated));
  return updated;
}

export async function deleteProblem(id) {
  const current = await getSavedProblems();
  const updated = current.filter((p) => p.id !== id);
  await AsyncStorage.setItem(KEY, JSON.stringify(updated));
  return updated;
}
