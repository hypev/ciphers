module.exports = {
  assetsDir: "static",
  runtimeCompiler: true,

  pwa: {
    name: "Kurr",
    assetsVersion: "0.0.4",
    themeColor: "#272727",
    msTileColor: "#272727",
    appleMobileWebAppCapable: "yes",
    appleMobileWebAppStatusBarStyle: "translucent",
    manifestOptions: {
      background_color: "#272727",
      start_url: "/"
    },
    iconPaths: {
      faviconSVG: null,
      favicon32: null,
      favicon16: null,
      appleTouchIcon: null,
      maskIcon: null,
      msTileImage: null
    }
  }
};
