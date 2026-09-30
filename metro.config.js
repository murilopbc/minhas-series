const { getDefaultConfig } = require("expo/metro-config");
const { withNativeWind } = require("nativewind/metro");

const config = getDefaultConfig(__dirname);

// Permite que o Metro resolva o arquivo .wasm do expo-sqlite na web
config.resolver.assetExts.push("wasm");

module.exports = withNativeWind(config, { input: "./global.css" });