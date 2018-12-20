// Node & NPM packages
const fs=require('fs'),
			glob = require('glob'),
			merge = require('merge-stream'),
			path = require('path');

// Include Gulp Plugins
const gulp = require('gulp'),
			rename = require('gulp-rename'),
			gch = require('gulp-compile-handlebars'),
			gzip = require('gulp-zip');

const config = require('./config.json');

const srcPath = './src/banners',
			partialsPath ='./src/lib',
			distPath = './dist',
			srcFolders = getFolders(srcPath);

// Watch All Project Source & Libray Files For Changes
const watcher = () => {gulp.watch([srcPath+'/**','./src/lib/**/*'],build)}
const zipper = gulp.series(build, zipFiles);

gulp.task('zip', zipper);
gulp.task('watch', watcher);
gulp.task('default', build);

/*function getName() {return this._name; }
function getJsName() {return this._name+'.js';}
function getCssName() {return this._name+'.css';}
function getSharedJs() {return this.sharedFile+'.js';} 
function getSharedCss() {return this.sharedFile+'.css'; }
function getEndLogo() { return this.endLogo }*/

function build(){
	let task = srcFolders.map(function(folder) {
		let _src = path.join(srcPath, folder),// Path source files
				_dist = mkDirByPathSync(path.join(distPath, folder)),//Path to final production files
				_imgPath = mkDirByPathSync(path.join(_dist, '/images/')),
				_name = path.basename(folder), 
				_data = config[_name];

		_data['_name'] = _name; // Store the folder name as a new JSON key/value. Avoids repeating the key name in JSON.
		
		// Configure gulp-compile-handlebars options
		let option = {
			ignorePartials:false,
			batch:[_src, partialsPath+'/css', partialsPath+'/html', partialsPath+'/js', partialsPath+'/svg'],
			helpers : {
				fileName	: function(){	return this._name; },
				bannerJs	: function(){	return this._name+'.js';},
				bannerCss : function(){	return this._name+'.css';} ,
				sharedJs	: function(){	return this.sharedFile+'.js';},
				sharedCss : function(){	return this.sharedFile+'.css'; },
				endLogo 	: function(){	return this.endLogo }
			}
		}

		let _html = gulp.src(partialsPath+'/html/*.hbs')
				.pipe(gch(_data, option))
				.pipe(rename(_name+'.html'))
				.pipe(gulp.dest(_dist));

		// Copy all images into dist
		let _images = gulp.src(_src+'/images/**',{base:_src})
			.pipe(gulp.dest(_dist));

		return merge(_images, _html);

		/*let jsOptions = {
			ignorePartials:false, 
			batch:[_src, partialsPath+'/js'], 
			helpers : { getFileName : getName }
		}
		// console.log('•• HANDLEBARS1 •• '+_data._name);

		let _js = gulp.src(partialsPath+'/js/template.hbs')
				.pipe(gch(_data, jsOptions))
				.pipe(rename(_name+'.js'))
				.pipe(gulp.dest(_dist));
		return merge(_images, _js, _html);*/

	});
	let lastStream = task[task.length-1];
	return lastStream;
}

// Zip up all final files
function zipFiles() {
	let task = srcFolders.map(function(folder) {
		let _src = path.join('./dist/', folder); // Path to each src folder
		let _dist = './zips/' // Where to put the zips
		// Set the source to all files in dist folder
		let _final =  gulp.src([_src+'/*.html',_src+'/*.css',_src+'/*.js',_src+'/images/**'],{base:_src})
			.pipe(gzip('_final.zip'))
			.pipe(rename(function(file){
				let temp = path.basename(folder);
				file.basename = temp + file.basename;
			}))
			.pipe(gulp.dest(_dist));
			return _final;
	});
	let lastStream = task[task.length-1];
	return lastStream;
}


// Scans basePath for sub directories (individual banner folders)
function getFolders(dir) {
	return fs.readdirSync(dir).filter(function(file) {
		return fs.statSync(path.join(dir, file)).isDirectory();
	});
}
function mkDirByPathSync(targetDir, { isRelativeToScript = false } = {}) {
	const sep = path.sep;
	const initDir = path.isAbsolute(targetDir) ? sep : '';
	const baseDir = isRelativeToScript ? __dirname : '.';

	return targetDir.split(sep).reduce((parentDir, childDir) => {
		const curDir = path.resolve(baseDir, parentDir, childDir);
		try {
			fs.mkdirSync(curDir);
		} catch (err) {
			if (err.code === 'EEXIST') { // curDir already exists!
				return curDir;
			}
			// To avoid `EISDIR` error on Mac and `EACCES`-->`ENOENT` and `EPERM` on Windows.
			if (err.code === 'ENOENT') { // Throw the original parentDir error on curDir `ENOENT` failure.
				throw new Error(`EACCES: permission denied, mkdir '${parentDir}'`);
			}
			const caughtErr = ['EACCES', 'EPERM', 'EISDIR'].indexOf(err.code) > -1;
			if (!caughtErr || caughtErr && curDir === path.resolve(targetDir)) {
				throw err; // Throw if it's just the last created dir.
			}
		}
		return curDir;
	}, initDir);
}