# Scount
Scount is an all-in-one app for managing personal, family, and group expenses, combining the features of Smoney and Tricount in one place.

A cross-platform expense tracking app built with Expo, React Native, and TypeScript.

## Quick Start

### Prerequisites

1. Install [Node.js](https://nodejs.org)
2. Install Expo SDK 53

```bash
npm install expo
```

### Setup

```bash
git clone https://github.com/jasonlam510/Scount.git
cd scount
```

### Run the App

#### Web Development

```bash
npx expo start --web
```

#### iOS & Android Development

**Note**: WatermelonDB requires native SQLite libraries that are NOT available in Expo Go or web browsers.

```bash
# Generate native projects (required for WatermelonDB)
npx expo prebuild

# Run on iOS
npx expo run:ios

# Run on Android  
npx expo run:android
```

#### Development Options

- ✅ **Web**: Use `npx expo start --web` (limited WatermelonDB support)
- ✅ **iOS/Android**: Use `npx expo prebuild` + `npx expo run:ios/android` (full WatermelonDB support)
- ❌ **Expo Go**: Not supported due to native SQLite requirements
