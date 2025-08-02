// Platform-specific adapter exports
// Metro will automatically resolve to the correct platform file:
// - index.web.ts for web platform
// - index.native.ts for iOS/Android platforms

// This is a fallback that should never be used in practice
// Metro's platform resolution should always pick the correct file
export const createAdapter = () => {
  throw new Error('Platform-specific adapter not found. Metro should have resolved to index.web.ts or index.native.ts')
} 