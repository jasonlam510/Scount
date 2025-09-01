# Scount
Scount is an all-in-one app for managing personal, family, and group expenses, combining the features of Smoney and Tricount in one place.

A cross-platform expense tracking app built with Expo, React Native, and TypeScript.

## Quick Start

### Prerequisites

1. Install [Node.js](https://nodejs.org) on your machine

2. Install Expo SDK 53 into the repo
```bash
npm install expo
```

3. Install powersync-web into the repo
```bash
npx powersync-web copy-assets
```

### Setup

```bash
git clone https://github.com/jasonlam510/Scount.git
cd scount
```

### Run the App

```bash
npx expo start
```

### Useful Commands

#### Reset Database (Web)

To reset the database and seed data on web platform:

```javascript
// Open browser console (F12) and run:
localStorage.clear()
indexedDB.deleteDatabase('scountDB')
// Then refresh the page
```

#### Reset Database (Mobile)

To reset the database on mobile platforms:

```bash
# Delete the app from device/simulator
# Then reinstall and run:
npx expo run:ios
# or
npx expo run:android