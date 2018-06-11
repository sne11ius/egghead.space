/* global require */
/* global module */

const path = require("path");

const commitHash = require("child_process")
  .execSync("git rev-parse --short HEAD")
  .toString();
const branchName = require("child_process")
  .execSync(
    "git rev-parse --abbrev-ref HEAD | grep -v ^HEAD$ || git rev-parse HEAD"
  )
  .toString();

const webpack = require("webpack");

module.exports = {
  configureWebpack: {
    plugins: [
      new webpack.DefinePlugin({
        __COMMIT_HASH__: JSON.stringify(commitHash),
        __BRANCH_NAME__: JSON.stringify(branchName),
        __BUILD_DATE__: JSON.stringify(new Date())
      })
    ],
    module: {
      rules: [
        {
          // Haha, this is just a bad joke about the current state of js development.
          // see https://github.com/firebase/firebaseui-web/issues/392
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
