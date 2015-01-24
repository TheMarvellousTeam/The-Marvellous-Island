var Abstract = require('../util/Abstract')
  , ed = require('../system/eventDispatcher')
  , io = require('socket.io-client')


var connect = function( host, port ){

    ed.dispatch('io:connecting')
    this.socket = io.connect( host+':'+port )

    this.socket.on( 'connect' , function( ){
        ed.dispatch('io:connected')
    })


    this.socket
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
