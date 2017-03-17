const fs = require('fs-extra');
const path = require('path');
import {js_beautify} from 'js-prettify';
import {workspace} from 'vscode';
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

export function checkExists (path) {
  return fs.existsSync(path);
}

export function formatCode (content, config = prettyConfig) {
  try {
    return js_beautify(content, prettyConfig);
  } catch (error) {
    return console.log(error); // lets stop it here :(
  }
}

export function copyFile (src, dest) {
  try {
    fs.copySync(path.resolve(src), dest);
    return true;
  } catch (e) {
    return false;
  }
}

export function createFile (filePath, content, __JSON__ = false) {
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

export function getAppPath () {
  const appPaths = ['app', 'src'];
  const appPath = appPaths.find(f => checkExists(path.join(rootPath, f)));
  return appPath || 'app';
}

export function getBundlePath () {
  const bundlePaths = ['dist', 'out', 'bundle'];
  const bundlePath = bundlePaths.find(f => checkExists(path.join(rootPath, f)));
  return bundlePath || 'dist';
}

export function getWebpackConfig () {
  const appPath = getAppPath();
  const bundlePath = getBundlePath();
  // update devDeps before we update webpack.
  if (!updateDevDependencies()) {
    return;
  }
  return `
    const path = require('path');
    
    module.exports = {
      entry: path.join(__dirname, '${appPath}', 'index'),
      output: {
        filename: 'bundle.js',
        path: path.resolve(__dirname, '${bundlePath}')
      },
      module: {
        rules: [
          {
            test: /\.jsx?$/,
            include: [
              path.resolve(__dirname, '${appPath}')
            ],
            exclude: [
              path.resolve(__dirname, 'node_modules'),
              path.resolve(__dirname, 'bower_components')
            ],
            loader: 'babel-loader',
            query: {
              presets: ['es2015']
            }
          }
        ]
      },
      resolve: {
        extensions: ['.json', '.js', '.jsx', '.css']
      },
      devtool: 'source-map',
      devServer: {
        publicPath: path.join('/${bundlePath}/')
      }
    };
  `;
}

export function updateDevDependencies () {
  // if we dont have a package file, then no need to update.
  if (!checkExists(packageFile)) {
    return;
  }

  const devDependencies = {
    "babel-core": "^6.21.0",
    "babel-loader": "^6.2.10",
    "babel-preset-es2015": "^6.18.0",
    "webpack": "^2.2.1"
  };

  const newPackageInfo = Object.assign({}, require(packageFile), {
    devDependencies: devDependencies
  });

  return newPackageInfo;
}
