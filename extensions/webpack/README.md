# Webpack

Creates a minimal webpack config file with babel transpiling (ES6).

## Usage

Launch the command pallete and look for `Webpack Create`. This will:

* Create a `webpack.config.js` file with babel transpiling. The ext looks for `app` or `src` folder to set the entry point. And `dist` or `out` for bundle path.
* Updates project `package.json` with babel and es2015 libs.

By default, `app` and `dist` folder is used, if it can't find the folders.

![image](https://cloud.githubusercontent.com/assets/2890683/22660145/7411a69c-ecc6-11e6-8c24-51d24bccb53a.png)

![image](https://cloud.githubusercontent.com/assets/2890683/22660438/8b0e7586-ecc7-11e6-92da-0dd1a9fd8bbc.png)

![image](https://cloud.githubusercontent.com/assets/2890683/22660177/8e7d1eb2-ecc6-11e6-846c-aeea22d4a32e.png)

## Development

1. Clone the repo and open the individual ext folder in VSCODE.
2. Run `npm i`
3. Start debugging via VSCODE debug.

