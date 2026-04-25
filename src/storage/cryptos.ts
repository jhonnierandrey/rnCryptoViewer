import AsyncStorage from "@react-native-async-storage/async-storage";

const STORAGE_KEY = "rnCryptoViewer:trackedCryptoIds";

export async function getTrackedCryptoIds(): Promise<string[]> {
  try {
    const data = await AsyncStorage.getItem(STORAGE_KEY);
    return data ? JSON.parse(data) : ["bitcoin", "ethereum"];
  } catch (error) {
    console.error("Error loading tracked cryptos:", error);
    return ["bitcoin", "ethereum"];
  }
}

export async function saveTrackedCryptoIds(ids: string[]) {
  try {
    await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(ids));
  } catch (error) {
    console.error("Error saving tracked cryptos:", error);
  }
}

export async function addTrackedCryptoId(id: string) {
  const current = await getTrackedCryptoIds();
  const normalizedId = id.trim().toLowerCase();

  if (!normalizedId || current.includes(normalizedId)) return current;

  const updated = [...current, normalizedId];
  await saveTrackedCryptoIds(updated);

  return updated;
}

export async function removeTrackedCryptoId(id: string) {
  const current = await getTrackedCryptoIds();
  const updated = current.filter((item) => item !== id);

  await saveTrackedCryptoIds(updated);

  return updated;
}
