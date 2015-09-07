# Jekyll blog

This is a blog theme built on Jekyll. Source is compiled, minified etc using Gulp.

This repo contains only source. Dependencies must be installed it and must be built out. It contains separate source, testing and deployment environments. This site is designed to deploy to a web host and not to Github pages, hence the somewhat unusual file structure.

## Install

* `npm install` to install gulp dependencies
* `bower install` to install bower dependencies
* `gulp` to build test and dist folders
* install jekyll in test folders
* `gulp listen` to listen for changes and update the site

## Use

* `gulp listen` builds out the site for deployment


## Structure

* src -- source code, sass, js, html, svg, images
* test -- compiled by not minified css, js, html, svg, images
* dist -- html, css, js, svg, images, sized,  minified, ready to deploy.
