var io = require('socket.io-client')



var socket = io.connect( 'localhost:31415/viewer' )

socket.on( 'connect' , function( ){
    console.log( 'connected' )
})
socket.on( 'next_turn' , function( ){
    document.getElementById('cmd').style.display = ''
})

var extract = function( k ){
    var v= document.querySelector('[name=direction'+k+']').value.split(';')
    return {
        type: document.getElementById('action'+k).value,
        x:+v[0],
        y:+v[1]
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
        room: this.value
    })

    this.setAttribute('disabled', 'disabled')
    document.getElementById('cmd').style.display = ''
})
document.getElementById('go').addEventListener('click',sendCmd )
