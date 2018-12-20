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

## Usage
In Terminal

To run the build

```bash
gulp
```

To run the build automatically each time a file is saved

```bash
gulp watch
```

To build and zip all files

```bash
gulp zip
```