var app = require('express')()
var rendererServer = require('http').createServer(app)
var io = require('socket.io')(rendererServer)
var net = require('net')
var game = require('./game')
var dispatcher = require('./dispatchActions')


var rooms = [{
    viewers : [],
    users : [],
    game : game.init()
}]


/////////////
// handle viewer connection
var viewerSocks = []

io.sockets.on('connection', function ( viewerSocket) {

	viewerSocks.push(viewerSocket)

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


/////////////
// handle remote connection

var cmdBuffer = {}

var needToBeResolve = function() {
	var nbCmd = 0;
	rooms[0].users.forEach(function(user){
		nbCmd += cmdBuffer[user.name].length
	})
	return nbCmd == 4*rooms[0].users.length
}

var remoteServer = net.createServer( function(sock) {

    console.log('['+sock.remoteAddress+'] connected')

    var room = rooms[0]

    var user = {
    	socket: sock
    }

    room.users.push(user)

    sock.on('data', function(data){
    	data = JSON.parse(data)
    	console.log('['+sock.remoteAddress+'] send '+data)

    	if( data.op == "name" ) {
    		user.name = data.args.name
    		cmdBuffer[user.name] = []
    		room.game.addPlayer(user.name)
    		viewerSocks.forEach(function(viewerSock){
    			viewerSock.emit('players', {
        			players : room.game.getPlayersAsJson()
    			})
                viewerSock.emit('order', {
                    players : room.game.getOrderAsJson()
                })
    		})
    	} else {

    		data.forEach(function(cmd){
    			cmd.args.player = user.name
    			cmdBuffer[user.name].push(cmd.args)
    		})


    		if ( needToBeResolve() ) {
    			var history = room.game.resolveCommands(cmdBuffer)
                // uncomment to send vibration to client, not finished on the controler
                /*
                history.forEach(function(data){
                    console.log(data)
                    data.actions.forEach(function(action){
                        if( action.action == 'death' && action.player == user.name){
                            user.socket.write("{op:\"vibrate\", args={}}")
                        }
                    })
                })
                */
   				dispatcher.dispatch(
       				dispatcher.historyToMessages( history ),
        			room.viewers,
        			function(){
        				room.users.forEach(function(user){
        					user.socket.write("{op:\"new_turn\", args:{}}");
       						cmdBuffer[user.name] = []
       					})
       				}
   				)

    		}
    	}

    })

    sock.on('error', function(){
    	console.log('['+sock.remoteAddress+'] error !')
        room.users.splice(room.users.indexOf(user), 1)
    	room.game.removePlayer(user.name)
    	delete cmdBuffer[user.name]
    	viewerSocks.forEach(function(viewerSock){
    		viewerSock.emit('players', {
        		players : room.game.getPlayersAsJson()
    		})
            viewerSock.emit('order', {
                players : room.game.getOrderAsJson()
            })
    	})
    })

    sock.on('end', function(){
    	console.log('['+sock.remoteAddress+'] deconnected')
        room.users.splice(room.users.indexOf(user), 1)
    	room.game.removePlayer(user.name)
    	delete cmdBuffer[user.name]
    	viewerSocks.forEach(function(viewerSock){
    		viewerSock.emit('players', {
        		players : room.game.getPlayersAsJson()
    		})
            viewerSock.emit('order', {
                players : room.game.getOrderAsJson()
            })
    	})
    })

})


rendererServer.listen( 1984 )


//remoteServer.listen(31415, '10.45.18.219', function(){
//    console.log('server bound')
//})



rooms[0].game.addPlayer('ana')
rooms[0].game.addPlayer('todd')
rooms[0].game.addPlayer('hesmeralda')
rooms[0].game.addPlayer('remy')

rooms[0].game.players[ 'ana' ].bot =
rooms[0].game.players[ 'todd' ].bot =
rooms[0].game.players[ 'hesmeralda' ].bot =
rooms[0].game.players[ 'remy' ].bot = true

;(function action(){

    var room = rooms[0]

    var orders = {}
    for( var name in game.players )
    {

        var x = game.players[ name ].x
        var y = game.players[ name ].y

        var k = 0 | (Math.random()*4)

        var cmd = {
            type : Math.random() < 0.5 ? 'move' : 'peck',
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


app.get('/', function(req, res) {
    res.sendFile('index.html', {root: './../js_viewer'})
})
app.get('/css/style.css', function(req, res) {
    res.sendFile('css/style.css', {root: './../js_viewer'})
})
app.get('/js/bundle.js', function(req, res) {
    res.sendFile('js/bundle.js', {root: './../js_viewer'})
})
app.get('/asset/:file', function(req, res) {
    res.sendFile('asset/'+req.params.file, {root: './../js_viewer'})
})
app.get('/asset/Mini/:file', function(req, res) {
    res.sendFile('asset/Mini/'+req.params.file, {root: './../js_viewer'})
})
app.listen(20151)
