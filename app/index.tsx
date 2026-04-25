import { useFocusEffect } from "expo-router";
import { useCallback, useState } from "react";
import {
  Alert,
  FlatList,
  Keyboard,
  Platform,
  SafeAreaView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  useColorScheme,
  View,
} from "react-native";

import { fetchCryptosByIds } from "../src/api/coingecko";
import { CryptoCard } from "../src/components/CryptoCard";
import { darkTheme, lightTheme } from "../src/constants/theme";
import {
  addTrackedCryptoId,
  getTrackedCryptoIds,
  removeTrackedCryptoId,
} from "../src/storage/cryptos";
import { CryptoMarketData } from "../src/types/crypto";

export default function HomeScreen() {
  const colorScheme = useColorScheme();
  const theme = colorScheme === "dark" ? darkTheme : lightTheme;
  const styles = createStyles(theme);

  const [cryptoId, setCryptoId] = useState("");
  const [cryptos, setCryptos] = useState<CryptoMarketData[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const loadCryptos = async () => {
    try {
      const ids = await getTrackedCryptoIds();
      const marketData = await fetchCryptosByIds(ids);
      setCryptos(marketData);
    } catch (error) {
      console.error(error);
      Alert.alert("Unable to load prices", "Please try again later.");
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useFocusEffect(
    useCallback(() => {
      loadCryptos();
    }, []),
  );

  const handleRefresh = async () => {
    setRefreshing(true);
    await loadCryptos();
  };

  const handleAddCrypto = async () => {
    const normalizedId = cryptoId.trim().toLowerCase();

    if (!normalizedId) {
      Alert.alert("Missing crypto", "Please enter a CoinGecko crypto ID.");
      return;
    }

    try {
      const preview = await fetchCryptosByIds([normalizedId]);

      if (preview.length === 0) {
        Alert.alert(
          "Crypto not found",
          "Try a valid CoinGecko ID like bitcoin, ethereum, or solana.",
        );
        return;
      }

      await addTrackedCryptoId(normalizedId);

      setCryptos((current) => {
        const exists = current.some((item) => item.id === preview[0].id);
        return exists ? current : [...current, preview[0]];
      });

      setCryptoId("");
      Keyboard.dismiss();
    } catch (error) {
      console.error(error);
      Alert.alert("Unable to add crypto", "Please try again later.");
    }
  };

  const removeCrypto = async (id: string) => {
    await removeTrackedCryptoId(id);

    setCryptos((current) => current.filter((item) => item.id !== id));
  };

  const handleRemoveCrypto = (id: string) => {
    if (Platform.OS === "web") {
      const confirmed = window.confirm(`Remove ${id} from your watchlist?`);

      if (confirmed) {
        removeCrypto(id);
      }

      return;
    }

    Alert.alert("Remove crypto", `Remove ${id} from your watchlist?`, [
      { text: "Cancel", style: "cancel" },
      {
        text: "Remove",
        style: "destructive",
        onPress: () => removeCrypto(id),
      },
    ]);
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        <View style={styles.hero}>
          <Text style={styles.kicker}>CoinGecko Watchlist</Text>
          <Text style={styles.title}>Crypto Viewer</Text>
          <Text style={styles.subtitle}>
            Track selected crypto assets locally with a clean Expo interface.
          </Text>

          <View style={styles.inputRow}>
            <TextInput
              style={styles.input}
              placeholder="bitcoin"
              placeholderTextColor={theme.mutedText}
              value={cryptoId}
              onChangeText={setCryptoId}
              autoCapitalize="none"
              autoCorrect={false}
              returnKeyType="done"
              onSubmitEditing={handleAddCrypto}
            />

            <TouchableOpacity
              style={styles.addButton}
              onPress={handleAddCrypto}
              activeOpacity={0.85}
            >
              <Text style={styles.addButtonText}>Add</Text>
            </TouchableOpacity>
          </View>

          <TouchableOpacity
            style={styles.refreshButton}
            onPress={handleRefresh}
            activeOpacity={0.85}
          >
            <Text style={styles.refreshButtonText}>
              {refreshing ? "Refreshing..." : "Refresh"}
            </Text>
          </TouchableOpacity>
        </View>

        {loading ? (
          <Text style={styles.helperText}>Loading prices...</Text>
        ) : cryptos.length === 0 ? (
          <View style={styles.emptyState}>
            <Text style={styles.emptyIcon}>₿</Text>
            <Text style={styles.emptyTitle}>No assets yet</Text>
            <Text style={styles.emptyText}>
              Add a CoinGecko ID like bitcoin, ethereum, or solana.
            </Text>
          </View>
        ) : (
          <FlatList
            data={cryptos}
            keyExtractor={(item) => item.id}
            showsVerticalScrollIndicator={false}
            contentContainerStyle={styles.list}
            renderItem={({ item }) => (
              <CryptoCard
                crypto={item}
                theme={theme}
                onRemove={() => handleRemoveCrypto(item.id)}
              />
            )}
          />
        )}
      </View>
    </SafeAreaView>
  );
}

const createStyles = (theme: typeof lightTheme) =>
  StyleSheet.create({
    safeArea: {
      flex: 1,
      backgroundColor: theme.background,
    },
    container: {
      flex: 1,
      padding: 20,
    },
    hero: {
      paddingBottom: 20,
      marginBottom: 18,
      borderBottomWidth: 1,
      borderBottomColor: theme.border,
    },
    kicker: {
      fontSize: 12,
      fontWeight: "800",
      color: theme.mutedText,
      textTransform: "uppercase",
      letterSpacing: 1,
    },
    title: {
      marginTop: 8,
      fontSize: 34,
      fontWeight: "900",
      color: theme.text,
    },
    subtitle: {
      marginTop: 8,
      fontSize: 15,
      lineHeight: 22,
      color: theme.mutedText,
    },
    inputRow: {
      flexDirection: "row",
      gap: 10,
      marginTop: 22,
    },
    input: {
      flex: 1,
      backgroundColor: theme.card,
      borderRadius: 16,
      borderWidth: 1,
      borderColor: theme.border,
      paddingHorizontal: 14,
      paddingVertical: 13,
      color: theme.text,
      fontSize: 15,
    },
    addButton: {
      backgroundColor: theme.primary,
      borderRadius: 16,
      paddingHorizontal: 18,
      justifyContent: "center",
      alignItems: "center",
    },
    addButtonText: {
      color: theme.primaryText,
      fontWeight: "900",
      fontSize: 15,
    },
    refreshButton: {
      marginTop: 12,
      paddingVertical: 14,
      borderRadius: 16,
      alignItems: "center",
      borderWidth: 1,
      borderColor: theme.border,
      backgroundColor: theme.card,
    },
    refreshButtonText: {
      color: theme.text,
      fontWeight: "800",
      fontSize: 15,
    },
    helperText: {
      textAlign: "center",
      color: theme.mutedText,
    },
    list: {
      paddingBottom: 32,
    },
    emptyState: {
      flex: 1,
      justifyContent: "center",
      alignItems: "center",
      paddingBottom: 80,
    },
    emptyIcon: {
      fontSize: 48,
      color: theme.primary,
    },
    emptyTitle: {
      marginTop: 16,
      fontSize: 22,
      fontWeight: "900",
      color: theme.text,
    },
    emptyText: {
      marginTop: 8,
      textAlign: "center",
      fontSize: 15,
      lineHeight: 22,
      color: theme.mutedText,
    },
  });
