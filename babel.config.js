module.exports = {
  presets: ["module:metro-react-native-babel-preset"],
  plugins: [
    [
      "module:react-native-dotenv",
      {
        moduleName: "@env",
        path: ".env",
        blacklist: null,
        whitelist: null,
        safe: false,
        allowUndefined: true,
      },
    ],
    [
      "@babel/plugin-transform-private-methods",
      {
        loose: true, // ✅ loose 옵션 추가!
      },
    ],
    [
      "@babel/plugin-transform-class-properties",
      {
        loose: true, // ✅ loose 옵션 추가!
      },
    ],
    [
      "@babel/plugin-transform-private-property-in-object",
      {
        loose: true, // ✅ loose 옵션 추가!
      },
    ],
  ],
};
