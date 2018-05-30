var gulp = require('gulp'),
    nodemon = require('gulp-nodemon'),
    jade = require('gulp-jade'),
    sass = require('gulp-sass'),
    coffee = require('gulp-coffee'),
    browserSync = require('browser-sync'),
    concat = require('gulp-concat'),
    uglify = require('gulp-uglifyjs'),
    cssnano = require('gulp-cssnano'),
    rename = require('gulp-rename'),
    del = require('del'),
    imagemin = require('gulp-imagemin'),
    pngquant = require('imagemin-pngquant'),
    cache = require('gulp-cache'),
    autoprefixer = require('gulp-autoprefixer');

gulp.task('jade', function() {
  return gulp.src('app/views/**/*.jade')
    .pipe(jade())
    .pipe(gulp.dest('app'))
    .pipe(browserSync.reload({stream:true}))
});

gulp.task('sass', function() {
  return gulp.src('app/sass/**/*.sass')
    .pipe(sass())
    .pipe(autoprefixer(['last 15 versions', '> 1%', 'ie 8', 'ie 7'], { cascade: true }))
    .pipe(gulp.dest('app/css'))
    .pipe(browserSync.reload({stream:true}))
});

gulp.task('coffee', function() {
  return gulp.src('app/coffee/**/*.coffee')
  .pipe(coffee({bare: true}))
  .pipe(gulp.dest('app/js'))
  .pipe(browserSync.reload({stream:true}))
});

gulp.task('scripts', function() {
  return gulp.src([
    'app/libs/jquery/dist/jquery.min.js',
    'app/libs/vue/dist/vue.min.js'
  ])
  .pipe(concat('libs.min.js'))
  .pipe(uglify())
  .pipe(gulp.dest('app/js'))
});

gulp.task('css-libs', ['sass'], function() {
    return gulp.src('app/css/libs.css')
        .pipe(cssnano())
        .pipe(rename({suffix: '.min'}))
        .pipe(gulp.dest('app/css'));
});

gulp.task('browser-sync', ['nodemon'], function() {
  /*browserSync({
    server: {
      baseDir: 'app'
    },
    notify: false
  })*/
  browserSync.init(null, {
		proxy: "http://localhost:5000",
    files: ["**/*.*"],
    port: 7000,
    notify: false
	});
});

gulp.task('nodemon', function (cb) {

	var started = false;

	return nodemon({
		script: 'app/app.js'
	}).on('start', function () {
		if (!started) {
			cb();
			started = true;
		}
	});
});

gulp.task('watch', ['browser-sync', 'jade', 'css-libs', 'coffee', 'scripts'], function() {
  gulp.watch('app/views/**/*.jade', ['jade']);
  gulp.watch('app/sass/**/*.sass', ['sass']);
  gulp.watch('app/coffee/**/*.coffee', ['coffee']);
  gulp.watch('app/app.js', browserSync.reload);
  gulp.watch('app/*.html', browserSync.reload);
  gulp.watch('app/js/**/*.js', browserSync.reload);
});

gulp.task('clean', function() {
    return del.sync('dist');
});

gulp.task('img', function() {
    return gulp.src('app/img/**/*')
        .pipe(cache(imagemin({
            interlaced: true,
            progressive: true,
            svgoPlugins: [{removeViewBox: false}],
            use: [pngquant()]
        })))
        .pipe(gulp.dest('dist/img'));
});

gulp.task('build', ['clean', 'img', 'jade', 'sass', 'coffee', 'scripts'], function() {

    var buildCss = gulp.src([
        'app/css/main.css',
        'app/css/libs.min.css'
        ])
    .pipe(gulp.dest('dist/css'))

    var buildFonts = gulp.src('app/fonts/**/*')
    .pipe(gulp.dest('dist/fonts'))

    var buildJs = gulp.src('app/js/**/*')
    .pipe(gulp.dest('dist/js'))

    var buildHtml = gulp.src('app/*.html')
    .pipe(gulp.dest('dist'));

});

gulp.task('clear', function () {
    return cache.clearAll();
});

gulp.task('default', ['watch']);

/*
gulp.task('mytask', function () {
  return gulp.src('soure-files')
  .pipe(plugin())
  .pipe(gulp.dest('folder'))
})
*/
