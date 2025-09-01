import { Platform } from 'react-native';
import { SQLJSOpenFactory } from "@powersync/adapter-sql-js";
import Constants from "expo-constants";
import { AppSchema } from "./AppSchema";

// Platform-specific PowerSync database imports following official docs
let PowerSyncDatabase: any, WASQLiteOpenFactory: any;

if (Platform.OS === 'web') {
  // Web platform - use PowerSync Web SDK
  const PowerSyncWeb = require('@powersync/web');
  PowerSyncDatabase = PowerSyncWeb.PowerSyncDatabase;
  WASQLiteOpenFactory = PowerSyncWeb.WASQLiteOpenFactory;
} else {
  // Mobile platform - use PowerSync React Native SDK
  ({ PowerSyncDatabase } = require('@powersync/react-native'));
}

const isExpoGo = Constants.executionEnvironment === "storeClient";
const isWeb = Platform.OS === 'web';

// Create platform-specific PowerSync instance
let powerSync: any;

if (isWeb) {
  // Web implementation following PowerSync docs
  const factory = new WASQLiteOpenFactory({
    dbFilename: 'app.db',
    // Web workers will be configured when we set up the public directory
    worker: '/@powersync/worker/WASQLiteDB.umd.js'
  });
  
  powerSync = new PowerSyncDatabase({
    schema: AppSchema,
    database: factory,
    sync: {
      worker: '/@powersync/worker/SharedSyncImplementation.umd.js'
    }
  });
  
  console.log('🌐 Web PowerSync instance created (connector will be set in App.tsx)');
} else {
  // Mobile implementation
  powerSync = new PowerSyncDatabase({
    schema: AppSchema,
    database: isExpoGo
      ? new SQLJSOpenFactory({
          dbFilename: "app.db",
        })
      : {
          dbFilename: "app.db",
        },
  });
}

export { powerSync };