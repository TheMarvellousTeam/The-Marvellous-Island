var gulp = require('gulp')
  , exec = require('child_process').exec
  , watch = require('gulp-watch')
  , rename = require('gulp-rename')
  , connect = require('gulp-connect')
  , autoprefixer = require('gulp-autoprefixer')
  , less =require('less')
  , Stream = require('stream').Stream


gulp.task('browserify', function () {

    exec(
        'node ./node_modules/browserify/bin/cmd.js js/app.js -o js/bundle.js --debug ' ,
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
        compress: !true,
        paths: ['./css'],
    }))
    .pipe(autoprefixer({
        cascade: true,
        browsers: ['last 2 versions'],
    }))
    .pipe(rename('style.css'))
    .pipe(gulp.dest('./css'))
});

gulp.task('serve', function () {
    connect.server({
        root: '.',
        livereload: false,
        port : 8082
    });
});

gulp.task('watch', function () {

	gulp.watch( ['css/**/*.less'] , ['less'] )

	gulp.watch( ['js/**/*', '!js/bundle.js'] , ['browserify'] )

});


gulp.task('build', [ 'browserify' , 'less' ]);

gulp.task('default', [ 'browserify' , 'less' , 'watch' , 'serve' ]);
