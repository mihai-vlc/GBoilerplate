GBoilerplate
===========================
A simple yet powerful grunt setup. Really easy to use and you can get started with it in a few minutes.  

Installation
--------------
 * Clone this repo `git clone https://github.com/ionutvmi/GBoilerplate.git`  
 * Double click on grunt-dev.(bat|command) or do `npm install` and `grunt`
 * Start building your app.


What it does
----------------
  * Compiles sass for you. You can also use compass.
  * Concatenates the `javascript` (/src/assets/css/) files in one scripts.min.js file 
  * You can exclude files from concatenation by adding .lib.js in the file name
  * The files will be concatenated by the order they are listed in the folder.
  * Runs autoprefixer on main.css file from dist/ folder.
  * Generates a main.css.map file to help on debugging your sass files.
  * Wraps your pages with a common header and footer.
  * Adds livereload on your pages.
  * Image optimization using imagemin.
  * `css` and `js` minification using uglify and cssmin
  * The dist/ folder is completely generated from src/ folder.
  * Includes Modernizr 2.1.7
  * Includes jQuery 1.10.2
  * Includes an ftp task for easy deploy to an ftp server.
  * Adds a banner on the top of your css and javascript files.
  * Runs all you html code through the lodash template system.  
  * Builds `all.min.css` from all you css files (based on the order they are read from dist/assets/css). If you want more control use sass to import them :)  
  * Reloads css without reloading the full page.  


The template system
-----------------
This setup will compile all you html code using the [lodash template](http://lodash.com/docs/#template) system.  
That will include you partial files everything in src/pages/content and the header and footer.  
A small example of what the template system can do: 

```html
<div class="container">
    <h4>A simple yet powerful grunt setup !</h4>

    <ul class="text-left">
    <% for(var i = 0; i < 5; i++) { %>
        <li>List item <%= i + 1 %></li>
    <% } %>
    </ul>

    <p>You are on the <%= grunt.current_file %> page !</p>
</div>
```

will output

```html
<div class="container">
    <h4>A simple yet powerful grunt setup !</h4>

    <ul class="text-left">
    
        <li>List item 1</li>
    
        <li>List item 2</li>
    
        <li>List item 3</li>
    
        <li>List item 4</li>
    
        <li>List item 5</li>
    
    </ul>

    <p>You are on the index.html page !</p>
</div>
```

Partial files
---------------
If you repetitive chunks of code like a sidebar you can place that code inside a partial file and include it in your files.
Here is a shot example:

####_sidebar.html
```html
<aside>
  <ul>
    <li><a href="#">Link 1</a></li>
  </ul>
</aside>
```
####index.html
```html
<%= grunt.include("sidebar.html") %>
<div class="content">
  <!-- Content here -->
</div>
```

When compiled index.html will look like this
```html
<!-- header -->
<aside>
  <ul>
    <li><a href="#">Link 1</a></li>
  </ul>
</aside>
<div class="content">
  <!-- Content here -->
</div>
<!-- footer -->
```
All html files that start with `_` will be ignored from direct compilation.  
They will however be compiled if you include it somewhere so you can use template code inside it also.

Contributions
-----------------
If you find a bug or have suggestions open an issue [here](https://github.com/ionutvmi/GBoilerplate/issues)  
Any pull request is welcomed.

