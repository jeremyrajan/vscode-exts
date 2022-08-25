![image](https://user-images.githubusercontent.com/2890683/30096520-60ab121e-930b-11e7-8488-39a67dc0ea09.png)

# BrowerSync VSCODE

Starts a browserSync Static server with watch mode at `:3000` by default. The UI for browsersync is available at `:3001`.

- Right click on the folder from your VSCODE explorer menu. And click on `BrowerSync Start`.

![image](https://user-images.githubusercontent.com/2890683/30096027-b67db406-9308-11e7-8fe9-6f3bf893668d.png)

- This will start the server at `localhost:3000` and open up your default browser. And serve the `index.html` file in the directory if present.

![image](https://user-images.githubusercontent.com/2890683/30096048-d4046ff6-9308-11e7-85f0-5aae0bedc29a.png)

- Once started, you can manage the running server on left menu status bar. Which will show the server is running at. Once you click on it, it will give you reload or stop option.

![image](https://user-images.githubusercontent.com/2890683/30096057-dcfad604-9308-11e7-948d-d3d1989a36ec.png)

- Once stop/reload is clicked, it will stop or reload the browsersync server.

![image](https://user-images.githubusercontent.com/2890683/30096069-e9adfe8a-9308-11e7-9098-2fe7f8fe5a36.png)

> Currently, you can only run one server at a time in the workspace. Starting another server within the workspace will close the current running server and spinup a new one at localhost:3000.

# Options

Browsersync allows for 2 options:

1. `openBrowser`: Whether you want to trigger a browser open when server is started.
2. `openExternal`: Opens with external URL
3. `options`: Pass browsersync options from https://www.browsersync.io/docs/options

# Development

Clone the repo and `cd` into `browsersync` folder. Run `npm install`, and you are ready for development.

# Issues

Raise issues [here](https://github.com/remicass/vscode-exts/tree/master/issues).
