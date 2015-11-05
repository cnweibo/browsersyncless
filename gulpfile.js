// node and gulp plugin section
var config = require('./gulp.config.js')();
var gulp = require('gulp');
var concat =require('gulp-concat');
var uglify = require('gulp-uglify');
var less = require('gulp-less-sourcemap');
var expect = require('gulp-expect-file');
var printfileinfo = require('gulp-print');
var inject = require('gulp-inject');
var argv = require('yargs').argv;
var ngAnnotate = require('gulp-ng-annotate');
var rename = require('gulp-rename');
var sourcemaps = require('gulp-sourcemaps');
var plumber = require('gulp-plumber');
var spawn = require('child_process').spawn;
var browserSync = require('browser-sync');

// local variable defination section
var projectrootdir = config.projectrootdir;
var projectrootabsdir = '/home/vagrant/Code/kidsit/';
// lazy load gulp plugins
var $ = require('gulp-load-plugins')({lazy: true});
/**
 * List the available gulp tasks
 */
var jsbuildpath = config.jsbuildpath;
gulp.task('help', $.taskListing);
gulp.task('default', ['help']);
gulp.task('less',function(){
    var pagelessentry = config.pagelessentry;
    log(pagelessentry);
   return gulp
       .src(pagelessentry)
       .pipe(plumber())
       .pipe(expect({ checkRealFile: true },pagelessentry))
       .pipe(printfileinfo())
       
       // .pipe(sourcemaps.init())
       .pipe(less())
       // .pipe(rename('bootstrap.css'))
       // .on('error',errorhandler)
       // .pipe(sourcemaps.write())
       .pipe(gulp.dest(projectrootdir+'css/'));
});
gulp.task('watchless',function(){
    log(config.lessfiles);
    gulp.watch('../Code/bem-less/src/less/**/*.less', ['less'])
        .on('change',function (event) {
            // var srcPattern = new RegExp('/.*(?=/')
            log(event.type);
        }); 
    startBrowserSync();
    
});
function startBrowserSync () {
    if(browserSync.active){
        return;
    }
    log('starting browser-sync ...');
    var options={
        files: ['/home/vagrant/Code/bem-less/src/css/*.css'], //projectrootdir+'public
        server: {
            baseDir: "../Code/bem-less/src",
            directory: true
        },
        ghostMode: {
            clicks: true,
            location: false,
            forms: true,
            scroll: true
        },
        injectChanges: true,
        logFileChanges: true,
        logLevel: 'debug',
        logPrefix: 'kidist-browser-sync',
        notify: true,
        reloadDelay: 0
    };
    browserSync(options);

}

// support functions

/**
 * Log a message or series of messages using chalk's blue color.
 * Can pass in a string, object or array.
 */
function log(msg) {
    if (typeof(msg) === 'object') {
        for (var item in msg) {
            if (msg.hasOwnProperty(item)) {
                $.util.log($.util.colors.blue(msg[item]));
            }
        }
    } else {
        $.util.log($.util.colors.blue(msg));
    }
}
function errorhandler (error) {
    log('*** start of error: ***');
    log(error);
    log('*** end of error! ***');
    this.emit('end');
}