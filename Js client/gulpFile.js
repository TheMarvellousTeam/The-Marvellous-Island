var gulp = require('gulp')
  , exec = require('child_process').exec
  , watch = require('gulp-watch')
  , rename = require('gulp-rename')
  , autoprefixer = require('gulp-autoprefixer')
  , less =require('less')
  , Stream = require('stream').Stream
  , uglify = require('gulp-uglify')


var production = !!process.env.PRODUCTION_BUILD
console.log( 'production '+production )

gulp.task('browserify', function () {

    exec(
        'node ./node_modules/browserify/bin/cmd.js js/app.js -o js/bundle.js '+( production ? '' : '--debug ') ,
        function( err , out , code ){
            if(err)
                console.log( err )

            if ( production )
                    gulp.src( './js/bundle.js' )
                    .pipe( uglify() )
                    .pipe( gulp.dest('./js/') )
        }
    )
});

gulp.task('browserify-test', function () {

    exec(
        'node ./node_modules/browserify/bin/cmd.js test/jasmine-bundle-src.js -o test/jasmine-bundle.js --debug ' ,
        function( err , out , code ){
            if(err)
                console.log( err )
            }
        )
    });

gulp.task('less', function () {

    var lessify = function(options){
        options = options || {}

        var stream = new Stream();
        stream.writable = stream.readable = true
        var pending = 0,closed=false;
        stream.write = function( file ){

            options.fileName = file.path

            pending++
            less.render(
                file.contents.toString('utf8'),
                options,
                function (e, css) {
                    if(e)
                        console.log(file.path+'\nline:'+e.line+': '+e.extract[2]+'\n'+e.message)

                    var f = file.path.split('.')
                    f[f.length-1] = 'css'

                    file.path = f.join('.')
                    file.contents = new Buffer(css.css||'')
                    stream.emit('data',file)

                    pending--
                    stream.end()
                }
            );
        }
        stream.destroy = function(){ this.emit('close') };
        stream.end = function(){
            if(closed||pending)
                return
            this.emit('end')
            closed = true
        }
        return stream
    }

    return gulp.src( './css/style.less' )
    .pipe( lessify({
        compress: production,
        paths: ['./css'],
    }))
    .pipe(autoprefixer({
        cascade: !production,
        browsers: ['last 2 versions'],
    }))
    .pipe(rename('style.css'))
    .pipe(gulp.dest('./css'))
});


gulp.task('watch', function () {

	gulp.watch( ['css/**/*.less'] , ['less'] )

	gulp.watch( ['js/**/*', '!js/bundle.js'] , ['browserify', 'browserify-test'] )

	gulp.watch( ['test/**/*' , '!test/jasmine-bundle.js'] , ['browserify-test'] )

});


gulp.task('build', [ 'browserify' , 'less' ]);

gulp.task('default', [ 'browserify-test', 'browserify' , 'less' , 'watch' ]);
