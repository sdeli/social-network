// npm i -S gulp-postcss autoprefixer postcss-simple-vars postcss-nested postcss-mixins postcss-import postcss-hexrgba gulp-rename browserify vinyl-source-stream gulp
const gulpPostcss = require("gulp-postcss"),
	  autoprefixer = require("autoprefixer"),
	  postcssSimpleVars = require("postcss-simple-vars"),
	  postcssNested = require("postcss-nested"), 
	  postcssMixins = require("postcss-mixins"),
	  postcssImport = require("postcss-import"),
	  hexRgba = require("postcss-hexrgba"),
	  rename = require("gulp-rename"),
	  browserify = require('browserify'),
	  source = require('vinyl-source-stream'),
	  gulp = require('gulp'),

	  // When changing projects these need to be changed:
	  jsSrcFile = './app/front-end-tmp/js/home-unbundled.js',
	  bundledJsSrcFileName = 'front-end-bundled.js',
	  bundledJsSrcFileDest = './app/public/js/';

	  cssSrcFile = "app/front-end-tmp/css/landing-unbundled.css",
	  bundledCssSrcFileName = 'landing-bundled.css',
	  bundledCssSrcFileDest = 'app/public/css/';

let bundleJavascriptI = 0; 
let bundleCssI = 0; 

gulp.task('bundle-javascript', function() {
	bundleJavascriptI++;
    console.log('bundle-javascript cycles: ' + bundleJavascriptI);

    return browserify(jsSrcFile)
        .bundle()
        .on('error', function(errorInfo){
   		console.log( errorInfo.toString() )
   		this.emit('end');
   		})
        .pipe(source(bundledJsSrcFileName))
        .pipe(gulp.dest(bundledJsSrcFileDest))
});

gulp.task("bundle-css", function(){
	bundleCssI++;
    console.log('bundle-css cycles: ' + bundleCssI);

   	return gulp.src(cssSrcFile)
   	.pipe( gulpPostcss([ postcssImport,autoprefixer({
			browsers: ['last 3 versions'],
			cascade: false
		}),postcssMixins, postcssSimpleVars,hexRgba, postcssNested]) )
   	.on('error', function(errorInfo){
   		console.log( errorInfo.toString() )
   		this.emit('end');
   	})
   	.pipe(rename(bundledCssSrcFileName) )
   	.pipe(gulp.dest(bundledCssSrcFileDest) )
});

gulp.task('default', () => {
	console.log('fut a default i: ' + bundleCssI);
	gulp.watch('./app/front-end-tmp/css/landing-unbundled.css', ['bundle-css']);
	gulp.watch('./app/front-end-tmp/css/css-modules/**/*.css', ['bundle-css']);
	gulp.watch('./app/front-end-tmp/js/front-end-unbundled.js', ['bundle-javascript']);
	gulp.watch('./app/front-end-tmp/js/**/*.js', ['bundle-javascript']);
});
