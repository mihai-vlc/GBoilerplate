GBoilerplate
===========================
A simple yet powerful grunt setup. Really easy to use and you can get started with it in a few minutes.  

Video walk-through http://www.youtube.com/watch?v=MuBtfrtFwkY

Installation
--------------
 * Clone this repo `git clone https://github.com/ionutvmi/GBoilerplate.git`  
 * Double click on grunt-dev.(bat|command) or do `npm install` and `grunt`
 * Start building your app.


What it does
----------------
  * Compiles sass for you. You can also use compass.
  * Concatenates the `css` (/src/assets/css/) and `javascript` (/src/assets/css/) files 
  * You can exclude files from concatenation by adding .lib.js or .lib.css in the file name
  * The files will be concatenated by the order they are listed in the folder.
  * Runs autoprefixer on main.css file from dist/ folder.
  * Wraps your pages with a common header and footer.
  * Adds livereload on your pages.
  * Image optimization using imagemin.
  * `css` and `js` minification using uglify and cssmin
  * The dist/ folder is completely generated from src/ folder.
  * Includes Modernizr 2.1.7
  * Includes jQuery 1.10.2
  * Includes an ftp task for easy deploy to an ftp server
  * Adds a banner on the top of your css and javascript files

Contributions
-----------------
If you find a bug or have suggestions open an issue [here](https://github.com/ionutvmi/GBoilerplate/issues)  
Any pull request is welcomed.

