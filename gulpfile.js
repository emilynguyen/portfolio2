/*
 * gulpfile.js
 */

var gulp = require("gulp");
var sass = require("gulp-sass");
var browserSync = require("browser-sync").create();
var nodemon = require("gulp-nodemon");
var postcss = require("gulp-postcss");
var autoprefixer = require("autoprefixer");

gulp.task("nodemon", function(cb) {
  var started = false;
  return nodemon({
    script: "index.js"
  }).on("start", function() {
    if (!started) {
      cb();
      started = true;
    }
  });
});

gulp.task(
  "browserSync",
  gulp.parallel("nodemon", function() {
    browserSync.init(null, {
      proxy: "http://localhost:3000",
      files: ["src/**/*.*"],
      browser: "google chrome",
      port: 5000
    });
  })
);

gulp.task("sass", function() {
  return gulp
    .src("src/scss/main.scss")
    .pipe(sass())
    .pipe(postcss([autoprefixer({ browsers: ["last 2 version"] })]))
    .pipe(gulp.dest("src/css"))
    .pipe(
      browserSync.reload({
        stream: true
      })
    );
});

gulp.task("watch", function() {
  gulp.watch("src/scss/**/*.scss", gulp.series("sass"));
  gulp.watch("views/**/*.*").on("change", browserSync.reload);
  gulp.watch("routes/*.*").on("change", browserSync.reload);
  gulp.watch("./data.json").on("change", browserSync.reload);
});

gulp.task(
  "default",
  gulp.parallel("watch", "sass", "browserSync", function(done) {
    done();
  })
);
