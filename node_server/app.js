var app = require('express')()
var server = require('http').createServer(app)
var io = require('socket.io')(server)
var net = require('net')
var game = require('./game')
var dispatcher = require('./dispatchActions')

var port = 31415
var ip = '192.168.1.1'

var rooms = [{
    viewers : [],
    users : [],
    game : game
}]


/////////////
// handle remote connection

var remoteServer = net.createServer( function(sock) {

    console.log('['+sock.remoteAddress+'] connected')

    var user = {
    	socket: sock
    }

    rooms[0].users.push(user)

    sock.on('end', function(){
    	console.log('['+sock.remoteAddress+'] deconnected')
    })

    sock.on('data', function(data){
    	console.log('['+sock.remoteAddress+'] '+data)
    	if ( data.name ) {
    		user.name = data.name
    		rooms[0].game.addPlayer(user.name)
    	}
    })

})
remoteServer.listen(port, ip, function(){
    console.log('server bound')
})




/////////////
// handle viewer connection

io.sockets.on('connection', function ( viewerSocket) {

    var room = rooms[ 0 ]

    room.viewers.push( viewerSocket )


    // handle disconnection
    viewerSocket
    .on('disconnect', function () {

        // remove from the list of viewers
        for(var i=room.viewers.length; i--;)
            if( room.viewers[i].id == viewerSocket.id )
                room.viewers.splice( i,1 )
    })

    // send him the actual situation
    .emit('world', {
        world : room.game.getWorldAsJson()
    })
    .emit('order', {
        world : room.game.getOrderAsJson()
    })
    .emit('players', {
        world : room.game.getPlayersAsJson()
    })
})
server.listen( 1984 )
