var io = require('socket.io-client')



var socket = io.connect( 'localhost:31415' )

socket.on( 'connect' , function( ){
    console.log( 'connect' )
})

var sendName = function( name ){
    var req = {
        op:"name",
        args:{
            name:name
        }
    }
    socket.send(JSON.stringify( req )+'\r\n');
}
var sendCmd = function( type, x, y ){
    var cmds = [
        {
            op : "cmd",
            args : {
                type: type,
                x: x,
                y: y
            }
        }
    ]
    socket.send(JSON.stringify( cmds )+'\r\n');
    socket.emit('data', JSON.stringify( cmds )+'\r\n');
}

document.getElementById('login').addEventListener('change',function(){
    sendName( this.value )
})


/*
//var socket = io.connect('localhost:31415')
var socket = io.connect({port: 31415, host:'localhost'})

socket.on('world', function( event ){

})

document.getElementById('go').addEventListener('click', function(){
    socket.emit('')
}, false)
*/
