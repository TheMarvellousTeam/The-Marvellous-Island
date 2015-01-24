var app = require('express')()
var server = require('http').createServer(app)
var io = require('socket.io')(server)
var game = require('./game')
var net = require('net')

var port = 31415
var ip = '192.168.1.1'

var rooms = [{
    viewers : [],
    users : [],
    game : game
}]

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


io.sockets.on('connection', function (socket) {

    var room = rooms[ 0 ]

    room.addViewer( socket )

})


remoteServer.listen(port, ip, function(){
	console.log('server bound')
})


server.listen( 1984 )
