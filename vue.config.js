const path = require("path");

// Haha, this is just a bad joke about the current state of js development.
// see https://github.com/firebase/firebaseui-web/issues/392

module.exports = {
  configureWebpack: {
    module: {
      rules: [
        {
          test: /npm\.js$/,
          loader: "string-replace-loader",
          include: path.resolve("node_modules/firebaseui/dist"),
          options: {
            search: "require('firebase/app');",
            replace: "require('firebase/app').default;"
          }
        }
      ]
    }
  }
};
