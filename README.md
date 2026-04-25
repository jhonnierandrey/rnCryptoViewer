# rnCryptoViewer

A minimal and modern **React Native + Expo** crypto watchlist app that fetches market data from CoinGecko and stores selected assets locally on the device.

![Crypto Viewer](https://www.jaesmadeit.com/assets/img/projects/mobile-apps/cryptoviewer-preview.png)

This project is a refreshed version of the original `rnCryptoViewer` app, rebuilt with Expo to simplify development, modernize the UI, remove dependency on the previous Messari API, and provide cross-platform support for iOS, Android, and Web.

## Overview

`rnCryptoViewer` allows users to track selected cryptocurrency prices by adding CoinGecko crypto IDs such as `bitcoin`, `ethereum`, or `solana`.

The app fetches market data from the CoinGecko public API and stores the selected crypto IDs locally using AsyncStorage, so the watchlist persists after reloads.

## Features

- Add crypto assets by CoinGecko ID
- Fetch current market data from CoinGecko
- View current USD price
- View 24h price change percentage
- Remove assets from the local watchlist
- Refresh prices manually
- Persist selected assets locally with AsyncStorage
- Automatic light/dark mode based on device settings
- Minimal dark-first UI with pure black background in dark mode
- Works on iOS, Android, and Web

## Tech Stack

- React Native
- Expo SDK 54
- TypeScript
- Expo Router
- AsyncStorage
- CoinGecko API
- React Native StyleSheet

## Project Structure

```txt
app/
  _layout.tsx
  index.tsx

src/
  api/
    coingecko.ts
  components/
    CryptoCard.tsx
  constants/
    theme.ts
  storage/
    cryptos.ts
  types/
    crypto.ts
```

## Requirements

Before running the project, make sure you have installed:

- Node.js
- npm
- Expo Go app on your iOS or Android device

## Installation

Clone the repository:

```bash
git clone https://github.com/jhonnierandrey/rnCryptoViewer.git
cd rnCryptoViewer
```

Install dependencies:

```bash
npm install
```

Install Expo-compatible AsyncStorage if needed:

```bash
npx expo install @react-native-async-storage/async-storage
```

## Running the App

Start the Expo development server:

```bash
npx expo start
```

Then choose one of the available options:

- Scan the QR code with Expo Go on iOS or Android
- Press `i` to open the iOS simulator
- Press `a` to open the Android emulator
- Press `w` to open the Web version

## Using the App

Add crypto assets using their CoinGecko IDs.

Examples:

```txt
bitcoin
ethereum
solana
cardano
dogecoin
```

The app currently expects CoinGecko IDs instead of ticker symbols because IDs are more reliable and avoid duplicated symbols across different assets.

## Local Storage

Tracked crypto IDs are stored locally using AsyncStorage under the following key:

```txt
rnCryptoViewer:trackedCryptoIds
```

By default, the app can start with common assets such as:

```txt
bitcoin
ethereum
```

Data remains available after app reloads, but it can be cleared if the app is uninstalled or local storage is reset.

## API

This project uses the CoinGecko public API.

Main endpoint used:

```txt
https://api.coingecko.com/api/v3/coins/markets
```

The app fetches market data using selected asset IDs and displays simplified portfolio-friendly information such as price and 24h percentage change.

No API key is required for this version.

## Data Model

```ts
type CryptoMarketData = {
  id: string;
  symbol: string;
  name: string;
  image: string;
  current_price: number;
  market_cap: number;
  total_volume: number;
  price_change_percentage_24h: number | null;
};
```

## Current Scope

This version focuses on a clean and practical crypto watchlist experience:

- Add assets
- Remove assets
- Fetch prices
- Refresh prices manually
- Store selected assets locally
- Support automatic light/dark mode
- Run across iOS, Android, and Web

Future improvements may include:

- Search suggestions using CoinGecko search
- Sparkline charts
- Favorite assets
- Portfolio quantity tracking
- Pull-to-refresh
- Better offline states

## Development Notes

This project was intentionally rebuilt as a clean Expo app instead of migrating the legacy React Native code line by line. The goal was to modernize the structure, simplify maintenance, replace the previous Messari dependency, and make the project easier to expand in the future.

## Author

Developed by **JAES Made It**  
Portfolio: [https://www.jaesmadeit.com](https://www.jaesmadeit.com)

## License

This project is available for personal and portfolio use.
