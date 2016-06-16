## Setup

* Run `npm install` in the directory to fetch the npm packages.
* Run the `gulp` command to build the javascript file:

  ```
  gulp
  ```
* (Optional) Add a `client/www/js/debug.js` file to customize the constants like `HOST`, `DEBUG` etc.
* Visit `http://localhost:8001/` to view the files.

## Debugging

* If your `js/bundle.js` file is blank it's most likely because of a SyntaxError.
  To debug it, run the following command:
  ```
  browserify -t [babelify --presets react] www/js/app.js -o www/js/bundle.js
  ```
