var Abstract = require('../util/Abstract')
  , ed = require('../system/eventDispatcher')
  , io = require('socket.io-client')


var connect = function( url ){

    ed.dispatch('io:connecting')
    var socket = this.socket = io.connect( url )

    this.socket.on( 'connect' , function( ){

        socket.emit('room', {room: 'mainRoom'})

        ed.dispatch('io:connected')
    })

    .on( 'order' , function( data ){
        ed.dispatch('io:update-order', data)
    })
    .on( 'players' , function( data ){
        ed.dispatch('io:update-players', data)
    })
    .on( 'world' , function( data ){
        ed.dispatch('io:update-world', data)
    })
    .on( 'action' , function( data ){
        ed.dispatch('io:incoming-action', data)
    })

    return this
}

module.exports = {
    connect : connect
}
