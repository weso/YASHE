require("require-dir")("./gulp");

var gulp = require("gulp");
gulp.task("default", gulp.series("browserify", "browserifyWithDeps", "makeCss", "makeMainPage"));
gulp.task("serve",  gulp.parallel("makeCss", "makeMainPage", "browserifyForDebug", "watch","connect"));
