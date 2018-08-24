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
	  signInPagejsSrcFile = './app/front-end-tmp/js/sign-in-page-unbundled.js',
      signInPagebundledJsSrcFileName = 'sign-in-page-bundled.js',
      signInPagebundledJsSrcFileDest = './app/public/js/',

      dashboardPagejsSrcFile = './app/front-end-tmp/js/dashboard-page-unbundled.js',
	  dashboardPagebundledJsSrcFileName = 'dashboard-page-bundled.js',
	  dashboardPagebundledJsSrcFileDest = './app/public/js/',

      profilePagejsSrcFile = './app/front-end-tmp/js/profile-page-unbundled.js',
      profilePagebundledJsSrcFileName = 'profile-page-bundled.js',
      profilePagebundledJsSrcFileDest = './app/public/js/',

      diffUserProfPagejsSrcFile = './app/front-end-tmp/js/diff-user-page-unbundled.js',
      diffUserProfPagebundledJsSrcFileName = 'diff-user-profile-page-bundled.js',
      diffUserProfPagebundledJsSrcFileDest = './app/public/js/',

	  cssSrcFile = "app/front-end-tmp/css/landing-unbundled.css",
	  bundledCssSrcFileName = 'landing-bundled.css',
	  bundledCssSrcFileDest = 'app/public/css/';

let bundleJavascriptI = 0; 
let bundleCssI = 0; 

gulp.task('default', () => {
    console.log('fut a default i: ' + bundleCssI);
	bundleJavascriptI++;
    console.log('bundle-javascript cycles: ' + bundleJavascriptI);

    gulp.watch('./app/front-end-tmp/css/landing-unbundled.css', ['bundle-css']);
    gulp.watch('./app/front-end-tmp/css/css-modules/**/*.css', ['bundle-css']);

    gulp.watch('./app/front-end-tmp/js/sign-in-page-unbundled.js', ['bundle-sign-in-page-javascript']);
    gulp.watch('./app/front-end-tmp/js/diff-user-page-unbundled.js', ['bundle-diff-user-prof-page-javascript']);
    gulp.watch('./app/front-end-tmp/js/dashboard-page-unbundled.js', ['bundle-dashboard-page-javascript']);
    gulp.watch('./app/front-end-tmp/js/profile-page-unbundled.js', ['bundle-profile-page-javascript']);

    gulp.watch('./app/front-end-tmp/js/**/*.js', [
        'bundle-dashboard-page-javascript', 
        'bundle-sign-in-page-javascript',
        'bundle-profile-page-javascript',
        'bundle-diff-user-prof-page-javascript'
    ]);
});

gulp.task('bundle-sign-in-page-javascript', function() {
    console.log('bundle-sign-in-page-javascript');
    return browserify(signInPagejsSrcFile)
        .bundle()
        .on('error', function(errorInfo){
   		console.log( errorInfo.toString() )
   		this.emit('end');
   		})
        .pipe(source(signInPagebundledJsSrcFileName))
        .pipe(gulp.dest(signInPagebundledJsSrcFileDest));
});

gulp.task('bundle-dashboard-page-javascript', function() {
    console.log('bundle-dashboard-page-javascript');
    return browserify(dashboardPagejsSrcFile)
        .bundle()
        .on('error', function(errorInfo){
        console.log( errorInfo.toString() )
        this.emit('end');
        })
        .pipe(source(dashboardPagebundledJsSrcFileName))
        .pipe(gulp.dest(dashboardPagebundledJsSrcFileDest));
});

gulp.task('bundle-profile-page-javascript', function() {
    console.log('bundle-dashboard-page-javascript');
    return browserify(profilePagejsSrcFile)
        .bundle()
        .on('error', function(errorInfo){
        console.log( errorInfo.toString() )
        this.emit('end');
        })
        .pipe(source(profilePagebundledJsSrcFileName))
        .pipe(gulp.dest(profilePagebundledJsSrcFileDest));
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

gulp.task('bundle-diff-user-prof-page-javascript', function() {
    console.log('bundle-sign-in-page-javascript');
    return browserify(diffUserProfPagejsSrcFile)
        .bundle()
        .on('error', function(errorInfo){
        console.log( errorInfo.toString() )
        this.emit('end');
        })
        .pipe(source(diffUserProfPagebundledJsSrcFileName))
        .pipe(gulp.dest(diffUserProfPagebundledJsSrcFileDest));
});
