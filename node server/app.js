var app = require('express')()
var server = require('http').createServer(app)
var io = require('socket.io')(server)
var game = require('./game')

var rooms = [{
    viewers : [],
    users : [],
    game : game
}]



io.sockets.on('connection', function (socket) {

    var room = rooms[ 0 ]

    room.addViewer( socket )

})




server.listen( 1984 )
