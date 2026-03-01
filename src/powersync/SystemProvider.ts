import { Platform } from "react-native";
import { wrapPowerSyncWithKysely } from "@powersync/kysely-driver";
import { AppSchema, Database } from "./AppSchema";
import { Connector } from "./Connector";

// Platform-specific PowerSync database imports following official docs
let PowerSyncDatabase: any, WASQLiteOpenFactory: any;

if (Platform.OS === "web") {
  // Web platform - use PowerSync Web SDK
  const PowerSyncWeb = require("@powersync/web");
  PowerSyncDatabase = PowerSyncWeb.PowerSyncDatabase;
  WASQLiteOpenFactory = PowerSyncWeb.WASQLiteOpenFactory;
} else {
  // Mobile platform - use PowerSync React Native SDK
  ({ PowerSyncDatabase } = require("@powersync/react-native"));
}

const isWeb = Platform.OS === "web";

// Create platform-specific PowerSync instance
let powerSync: any;

if (isWeb) {
  // Web implementation following PowerSync docs
  const factory = new WASQLiteOpenFactory({
    dbFilename: "app.db",
    // Web workers will be configured when we set up the public directory
    worker: "/@powersync/worker/WASQLiteDB.umd.js",
  });

  powerSync = new PowerSyncDatabase({
    schema: AppSchema,
    database: factory,
    sync: {
      worker: "/@powersync/worker/SharedSyncImplementation.umd.js",
    },
  });

  console.log(
    "🌐 Web PowerSync instance created (connector will be set in App.tsx)",
  );
} else {
  // Mobile implementation
  powerSync = new PowerSyncDatabase({
    schema: AppSchema,
    database: {
      dbFilename: "app.db",
    },
  });
}

// Create Kysely wrapper for type-safe database operations using PowerSync-generated types
export const db = wrapPowerSyncWithKysely<Database>(powerSync);

// Connection function for App.tsx initialization
export const connectDatabase = async () => {
  return await powerSync.connect(new Connector());
};

// Disconnect function for logout - clears local database
export const disconnectDatabase = async () => {
  try {
    if (powerSync) {
      await powerSync.disconnectAndClear();
      console.log("✅ PowerSync disconnected and cleared successfully");
    }
  } catch (error) {
    console.error("❌ Failed to disconnect PowerSync:", error);
    throw error;
  }
};

// Keep powerSync internal - but export for direct transaction access if needed
export { powerSync };
