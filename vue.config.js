module.exports = {
  transpileDependencies: [
    "vuetify",
    "vue-tel-input-vuetify"
  ],
  configureWebpack: {
    module: {
      rules: [
        {
          test: /\.js$/,
          include: /node_modules\/@smileid\/web-components/,
          use: {
            loader: 'babel-loader',
            options: {
              presets: ['@babel/preset-env']
            }
          }
        }
      ]
    }
  },
  pwa: {
    name: "LC",
    appleMobileWebAppStatusBarStyle: 'white',
    themeColor: "#1976D2",
    msTileColor: "#ffffff",
    manifestOptions: {
      start_url: '/',
      scope: '/'
    },
    workboxOptions: {
      // navigateFallback: '/index.html',
    },
  }
};