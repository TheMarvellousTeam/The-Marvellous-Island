var gulp = require('gulp')
  , watch = require('gulp-watch')
  , connect = require('gulp-connect')
  , exec = require('child_process').exec


gulp.task('browserify', function () {

      exec(
          'node ./node_modules/browserify/bin/cmd.js ./source.js -o bundle.js --debug ' ,
          function( err , out , code ){
              if(err)
              console.log( err )
          }
      )
});
gulp.task('watch', function () {

    gulp.watch( ['source.js'] , ['browserify'] )

});
gulp.task('serve', function () {
    connect.server({
        root: '.',
        livereload: false,
        port : 8081
    });
});

gulp.task('default', [ 'browserify', 'watch', 'serve' ]);
