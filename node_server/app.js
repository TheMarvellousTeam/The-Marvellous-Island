var app = require('express')()
var rendererServer = require('http').createServer(app)
var io = require('socket.io')(rendererServer)
var net = require('net')
var game = require('./game')
var dispatcher = require('./dispatchActions')
var loop = require('./remote')


var rooms = [{
    viewers : [],
    users : [],
    game : game.init(),
    loop : loop.init()
}]


/////////////
// handle remote connection

var remoteServer = net.createServer( function(sock) {

    console.log('['+sock.remoteAddress+'] connected')

    var room = rooms[0]

    var user = {
    	socket: sock
    }

    room.users.push(user)

    sock.on('end', function(){
    	console.log('['+sock.remoteAddress+'] deconnected')
    })

    sock.on('data', function(data){
    	console.log("=> "+data.op)
    	switch(data.op) {

    		case "name":
    			user.name = data.args.name
    			room.game.addPlayer(user.name)
    			break

    		case "cmd":
    			break

    		default:
    			console.log('['+sock.remoteAddress+'] unknown op '+data)
    	}
    })

    sock.on('error', function(){
    	console.log('['+sock.remoteAddress+'] error !')
    })

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
        order : room.game.getOrderAsJson()
    })
    .emit('players', {
        players : room.game.getPlayersAsJson()
    })

})
server.listen( 1984 )

remoteServer.listen(31415, '10.45.18.219', function(){
    console.log('server bound')
})


;(function action(){

    var room = rooms[0]

    var orders = {}
    for( var name in game.players )
    {

        var x = game.players[ name ].x
        var y = game.players[ name ].y

        var k = 0 | (Math.random()*4)

        var cmd = {
            type : 'move',
            player : name,
            direction : {
                x: k==0 ? -1 : ( k==1 ? 1 : 0 ),
                y:  k==2 ? -1 : ( k==3 ? 1 : 0 ),
            }
        }

        orders[ name ] = [ cmd ]
    }

    var history = game.resolveCommands( orders )

    dispatcher.dispatch(
        dispatcher.historyToMessages( history ),
        room.viewers,
        function(){ setTimeout( action, 200 ) }
    )


})()
