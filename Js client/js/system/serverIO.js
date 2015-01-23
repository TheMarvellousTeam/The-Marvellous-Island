var Abstract = require('../util/Abstract')
  , ed = require('../system/eventDispatcher')
  , io = require('socket.io-client')


var connect = function( host, port ){

    ed.dispatch('io:connecting')
    this.socket = io.connect( host+':'+port )

    this.socket.on( 'connect' , function( ){
        ed.dispatch('io:connected')
    })

    this.socket.on( 'ping' , function( ){
        ed.dispatch('io:ping')

        this.socket.emit( 'pong', {} )
    })

    return this
}

module.exports = {
    connect : connect
}
