var fs = require('fs'),
    gulp = require('gulp'),
    exec = require('child_process').exec,
    connect = require('gulp-connect'),
    browserify = require('browserify'),
    less      = require('gulp-less'),
    livereload = require('gulp-livereload');


gulp.task('connect', function() {
    connect.server({
	root: "www",
	host: "0.0.0.0",
	port: 80,
	livereload: true
    });
});

gulp.task('less', function(done){
    gulp.src('./less/*.less')
    .pipe(less())
    .pipe(gulp.dest('www/css/'))
    .on('end', done);
});

gulp.task('watch', function() {
  gulp.watch('./less/*.less', ['less']);
});

gulp.task('js', function() {
    var bb = browserify('./www/js/app.js', {
	cache: {},
	packageCache: {}
    });
    bb.plugin("watchify")
	.transform("babelify", {presets: ["es2015", "react"]});
    function bundle() {
	bb.bundle()
            .pipe(fs.createWriteStream("www/js/bundle.js"));
    }
    bb.on("update", bundle);
    bundle();
    bb.on("error", function(err) {
    	console.log(err);
    });
});

gulp.task('default', ['less', 'js', 'connect', 'watch']);
