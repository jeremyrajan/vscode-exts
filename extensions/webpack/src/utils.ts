const fs = require('fs-extra');
const path = require('path');
import { js_beautify } from 'js-prettify';
import { workspace } from 'vscode';
const rootPath = workspace.rootPath;
const packageFile = path.join(rootPath, 'package.json');

const prettyConfig = {
  indent_size: 2,
  indent_char: " ",
  indent_level: 0,
  indent_with_tabs: false,
  preserve_newlines: false,
  max_preserve_newlines: 10,
  jslint_happy: false,
  brace_style: "collapse",
  keep_array_indentation: false,
  keep_function_indentation: false,
  space_before_conditional: true,
  break_chained_methods: false,
  eval_code: false,
  unescape_strings: false,
  wrap_line_length: 0
};

export function checkExists(path) {
  return fs.existsSync(path);
}

export function formatCode(content, config = prettyConfig) {
  try {
    return js_beautify(content, prettyConfig);
  } catch (error) {
    return console.log(error); // lets stop it here :(
  }
}

export function copyFile(src, dest) {
  try {
    fs.copySync(path.resolve(src), dest);
    return true;
  } catch (e) {
    return false;
  }
}

export function createFile(filePath, content, __JSON__ = false) {
  try {
    if (__JSON__) {
      fs.outputJSONSync(filePath, content);
      return true;
    }
    fs.outputFileSync(filePath, content);
    return true;
  } catch (err) {
    return false;
  }
}

export function getAppPath() {
  const appPaths = ['app', 'src'];
  const appPath = appPaths.find(f => checkExists(path.join(rootPath, f)));
  return appPath || 'app';
}

export function getBundlePath() {
  const bundlePaths = ['dist', 'out', 'bundle'];
  const bundlePath = bundlePaths.find(f => checkExists(path.join(rootPath, f)));
  return bundlePath || 'dist';
}

export function getWebpackConfig() {
  const appPath = getAppPath();
  const bundlePath = getBundlePath();
  return `
  const path = require('path');
  module.exports = {
    mode: 'development',
    entry: path.join(__dirname, '${appPath}', 'index'),
    watch: true,
    output: {
      path: path.join(__dirname ,'${bundlePath}'),
      publicPath: '/${bundlePath}/',
      filename: "bundle.js",
      chunkFilename: '[name].js'
    },
    module: {
      rules: [{
        test: /.jsx?$/,
        include: [
          path.resolve(__dirname, '${appPath}')
        ],
        exclude: [
          path.resolve(__dirname, 'node_modules')
        ],
        loader: 'babel-loader',
        query: {
          presets: [
            [
              "@babel/env", {
                "targets": {
                  "browsers": "last 2 chrome versions"
                }
              }
            ]
          ]
        }
      }]
    },
    resolve: {
      extensions: ['.json', '.js', '.jsx']
    },
    devtool: 'source-map',
    devServer: {
      contentBase: path.join(__dirname, '/${bundlePath}/'),
      inline: true,
      host: 'localhost',
      port: 8080,
    }
  };
  `;
}

export function updateDevDependencies() {
  // if we dont have a package file, then no need to update.
  if (!checkExists(packageFile)) {
    return;
  }

  const newPackageInfo = Object.assign({}, require(packageFile));

  const devDependencies = {
    "@babel/core": "^7.2.2",
    "@babel/preset-env": "^7.3.1",
    "babel-loader": "^8.0.5",
    "webpack": "^4.29.0",
    "webpack-cli": "^3.2.1",
    "webpack-dev-server": "^3.1.14"
  };

  newPackageInfo.devDependencies = Object.assign({}, newPackageInfo.devDependencies, devDependencies);

  // write JSON to package.
  try {
    fs.writeJsonSync(packageFile, newPackageInfo);
    return true;
  } catch (error) {
    return false;
  }
}
