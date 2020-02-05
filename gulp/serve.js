var gulp = require("gulp"),
  connect = require("gulp-connect"),
  paths = require("./paths.js"),
  livereload = require("gulp-livereload");

gulp.task("watch", function() {
  gulp.watch(["./src/**/*.js", "./lib/*.js", "./lib/grammar/*.js"], gulp.series("browserifyForDebug"));
  gulp.watch("./src/**/*.scss", gulp.series("makeCss"));
  gulp.watch("./*.html", gulp.series("browserifyForDebug"));
});

gulp.task("connect", function() {
  connect.server({
    root: __dirname + "/../",
    port: 4000,
    livereload: true
  });
});
