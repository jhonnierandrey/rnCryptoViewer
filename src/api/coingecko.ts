import { CryptoMarketData } from "../types/crypto";

const BASE_URL = "https://api.coingecko.com/api/v3";

export async function fetchCryptosByIds(
  ids: string[],
): Promise<CryptoMarketData[]> {
  if (ids.length === 0) return [];

  const queryIds = ids.join(",");

  const response = await fetch(
    `${BASE_URL}/coins/markets?vs_currency=usd&ids=${queryIds}&order=market_cap_desc&per_page=100&page=1&sparkline=false&price_change_percentage=24h`,
  );

  if (!response.ok) {
    throw new Error("Unable to fetch crypto market data.");
  }

  return response.json();
}
