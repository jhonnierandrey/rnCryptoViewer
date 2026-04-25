import { Image, StyleSheet, Text, TouchableOpacity, View } from "react-native";

import { AppTheme } from "../constants/theme";
import { CryptoMarketData } from "../types/crypto";

type Props = {
  crypto: CryptoMarketData;
  theme: AppTheme;
  onRemove: () => void;
};

export function CryptoCard({ crypto, theme, onRemove }: Props) {
  const styles = createStyles(theme);

  const priceChange = crypto.price_change_percentage_24h ?? 0;
  const isPositive = priceChange >= 0;

  const formattedPrice = new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: crypto.current_price < 1 ? 6 : 2,
  }).format(crypto.current_price);

  return (
    <View style={styles.card}>
      <View style={styles.topRow}>
        <View style={styles.identity}>
          <Image source={{ uri: crypto.image }} style={styles.logo} />

          <View>
            <Text style={styles.name}>{crypto.name}</Text>
            <Text style={styles.symbol}>{crypto.symbol.toUpperCase()}</Text>
          </View>
        </View>

        <TouchableOpacity onPress={onRemove} activeOpacity={0.7}>
          <Text style={styles.removeText}>Remove</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.bottomRow}>
        <Text style={styles.price}>{formattedPrice}</Text>

        <Text
          style={[
            styles.change,
            { color: isPositive ? theme.positive : theme.negative },
          ]}
        >
          {isPositive ? "+" : ""}
          {priceChange.toFixed(2)}%
        </Text>
      </View>
    </View>
  );
}

const createStyles = (theme: AppTheme) =>
  StyleSheet.create({
    card: {
      backgroundColor: theme.card,
      borderRadius: 20,
      padding: 18,
      marginBottom: 12,
      borderWidth: 1,
      borderColor: theme.border,
    },
    topRow: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
      gap: 12,
    },
    identity: {
      flexDirection: "row",
      alignItems: "center",
      gap: 12,
      flex: 1,
    },
    logo: {
      width: 36,
      height: 36,
      borderRadius: 18,
    },
    name: {
      fontSize: 17,
      fontWeight: "800",
      color: theme.text,
    },
    symbol: {
      marginTop: 2,
      fontSize: 12,
      fontWeight: "700",
      color: theme.mutedText,
    },
    removeText: {
      fontSize: 13,
      fontWeight: "700",
      color: theme.dangerText,
    },
    bottomRow: {
      marginTop: 18,
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "flex-end",
      gap: 12,
    },
    price: {
      fontSize: 26,
      fontWeight: "900",
      color: theme.text,
    },
    change: {
      fontSize: 15,
      fontWeight: "800",
    },
  });
