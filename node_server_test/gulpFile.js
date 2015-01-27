var gulp = require('gulp')
  , exec = require('child_process').exec
  , watch = require('gulp-watch')

gulp.task('browserify', function () {

    exec(
        'node ./node_modules/browserify/bin/cmd.js ./jasmine-bundle-src.js -o ./jasmine-bundle.js --debug ' ,
        function( err , out , code ){
            if(err)
                console.log( err )
            }
        )
    });


gulp.task('watch', function () {

	gulp.watch( ['./**/*.js' , '!./jasmine-bundle.js'] , ['browserify'] )

});


gulp.task('build', [ 'browserify' ]);

gulp.task('default', [ 'browserify', 'watch' ]);
