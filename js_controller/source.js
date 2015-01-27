var io = require('socket.io-client')



var socket = io.connect( 'localhost:31415/controller' )

socket.on( 'connect' , function( ){
    console.log( 'connected' )
})
socket.on( 'end-resolution' , function( ){
    document.getElementById('cmd').style.display = ''
})

var extract = function( k ){
    var v = [0,0]
    var vs= document.querySelectorAll('[name=direction'+k+']')
    for( var i=vs.length; i--;)
        if (vs[ i ].checked )
            v = vs[ i ].value.split(';')

    return {
        action: document.getElementById('action'+k).value,
        directionX:+v[0],
        directionY:+v[1]
    }
}
var sendCmd = function(){

    document.getElementById('cmd').style.display = 'none'

    socket.emit('cmds', {cmds: [
        extract(1),
        extract(2),
        extract(3),
        extract(4)

        ] });
}

document.getElementById('login').addEventListener('change',function(){

    socket.emit('room',{
        room: document.getElementById('room').value
    })
    socket.emit('name',{
        name: this.value
    })

    this.setAttribute('disabled', 'disabled')
    document.getElementById('room').setAttribute('disabled', 'disabled')
    document.getElementById('cmd').style.display = ''
})
document.getElementById('go').addEventListener('click',sendCmd )
