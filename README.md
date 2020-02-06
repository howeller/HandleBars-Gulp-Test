# Gulp Compile Handlebars Test
Workflow for using Gulp & Handlebars templates for banner production

## Dependencies
- [gulp v4](https://www.npmjs.com/package/gulp)
- [gulp-compile-handlebars](https://www.npmjs.com/package/gulp-compile-handlebars)
- [gulp-rename](https://www.npmjs.com/package/gulp-rename)
- [gulp-zip](https://www.npmjs.com/package/gulp-zip)
- [fs](https://www.npmjs.com/package/fs)
- [glob](https://www.npmjs.com/package/glob)
- [merge-stream](https://www.npmjs.com/package/merge-stream)
- [path](https://www.npmjs.com/package/path)

## Setup
1) Clone this repo  or copy `gulpfile.js`,`package.json` and `package-lock.json` to the root of your project folder.

2) In Terminal - navigate to your project folder and run `npm install` to download all of the npm packages.

## Usage

To run the build

```cli
gulp
```

To run the build automatically each time a file is saved

```cli
gulp watch
```

To build and zip all files

```cli
gulp zip
```