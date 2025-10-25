// Learn more https://docs.expo.io/guides/customizing-metro
const { getDefaultConfig } = require('expo/metro-config');
const path = require('path');

/** @type {import('expo/metro-config').MetroConfig} */
const config = getDefaultConfig(__dirname);

// Add alias configuration
config.resolver.alias = {
  '@': path.resolve(__dirname, 'src'),
};

// PowerSync React Native Web support configuration
// Based on: https://docs.powersync.com/client-sdk-references/react-native-and-expo/react-native-web-support#4-enable-multiple-platforms

// Enable package exports for PowerSync Web UMD support
config.resolver.unstable_enablePackageExports = true;

// Platform-specific module resolution
config.resolver.resolveRequest = (context, moduleName, platform) => {
  if (platform === 'web') {
    // For web platform, ignore mobile-specific dependencies
    if (['react-native-prompt-android', '@powersync/react-native'].includes(moduleName)) {
      return {
        type: 'empty'
      };
    }
    
    // Map modules for web platform
    const mapping = { 
      'react-native': 'react-native-web', 
      '@powersync/web': '@powersync/web/dist/index.umd.js' 
    };
    
    if (mapping[moduleName]) {
      console.log('PowerSync Metro: remapping', moduleName, 'to', mapping[moduleName]);
      return context.resolveRequest(context, mapping[moduleName], platform);
    }
  } else {
    // For mobile platforms, ignore web-specific dependencies
    if (['@powersync/web'].includes(moduleName)) {
      return {
        type: 'empty'
      };
    }
  }

  // Use default resolver for all other cases
  return context.resolveRequest(context, moduleName, platform);
};

module.exports = config;
