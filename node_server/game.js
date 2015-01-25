

var init = function(){

    this.players = {}

    this.order = []

    this.size = 16

    this.world = proceduralGenWorld( this.size, this.size )

    this.spawnCandidate = computeSpawnCandidate(this.world, this.size, this.size)

    // to delete
    this.addPlayer('platane')
    this.addPlayer('john')
    this.addPlayer('toby')

    return this
}


var resolveOneCommand = function( cmd ){
    var playerName = cmd.player
    var player = this.players[ playerName ]
    var cmdType = cmd.type

    var resulting_actions = []

    if ( player.respawnIn > 0 ){

        player.respawnIn --

        if ( player.respawnIn <= 0 )
        {
            resulting_actions.push({
                'action' : 'spawn',
                'player' : playerName,
                'toX' : player.spawnX,
                'toY' : player.spawnY
            })

            player.x = player.spawnX
            player.y = player.spawnY

        }
        else
            return [{
                'action' : 'fail',
                'label' : 'player is dead',
                'player' : playerName
            }]
    }

    switch( cmdType )
    {
        case 'move' :

            var next_position = {
                x: player.x + cmd.x,
                y: player.y + cmd.y
            }

            // check if the cell is empty
            var next_cell = this.world.get( next_position.x , next_position.y )

            var fail = next_cell.obstacle

            if (!fail){
                // test if another player is on the cell

                for( var i in this.players )
                    if( this.players[i].x == next_cell.x && this.players[i].y == next_cell.y )
                        fail = true
            }

            if (fail)
                return [{
                    'action' : 'fail',
                    'label' : 'forbiden action',
                    'player' : playerName
                }]

            // the move is acceptable
            console.log( 'move ', this.players )
            resulting_actions.push({
                'action' : 'move',
                'player' : playerName,
                'fromX' : player.x,
                'fromY' : player.y,
                'toX' : next_cell.x,
                'toY' : next_cell.y
            })

            player.x = next_cell.x
            player.y = next_cell.y

            // or maybe he fall into the water
            if( next_cell.type == "water" )
            {
                resulting_actions.push({
                    'action' : 'death',
                    'player' : playerName
                })


                // you r dead, go fuck yourself in -99 -999
                player.x = -999
                player.y = -999

                player.respawnIn = 5

            }


            break



    }

    return resulting_actions
}


// cmd is and object containing a list of ordered command for each player
var resolveCommands = function( cmds ){

    var history = []

    while( true )
    {

        var next_player = this.order.shift()

        var next_cmd = cmds[ next_player ].shift()

        if (!next_cmd) {
            // no cmd left
            // next_player didn t play so he is still first player
            this.order.unshift( next_player )
            return history
        }

        // update order
        this.order.push( next_player )

        // add one history entry
        history.push({
            actions : resolveOneCommand.call( this, next_cmd ),
            new_order : this.getOrderAsJson()
        })

    }

}


var addPlayer = function( name ){
	var spawnCeil = this.spawnCandidate.shift()
	this.players[name] = {x: spawnCeil.x, y: spawnCeil.y, spawnX: spawnCeil.x, spawnY: spawnCeil.y}
	this.order.push(name)
    return this
}
var removePlayer = function( name ){

    return this
}

var getPlayersAsJson = function(){
    return this.players
}
var getWorldAsJson = function(){
    return this.world
}
var getOrderAsJson = function(){
    return this.order
}


var proceduralGenWorld = function( w, h ){

    // x + y*w
    var map = []

    var r_max = ( (w/2)*(w/2) + (h/2)*(h/2) ) * 1.1

    for ( var x=w; x--; )
    for ( var y=h; y--; )
    {

        // distance to center
        var r = (( x-w/2 )*( x-w/2 ) + ( y-h/2 )*( y-h/2 )) / r_max

        // distance to center ~ random param
        var r_height = Math.min( 1, ( Math.pow( r , 1/2 ) * 1.1 * ( Math.random() * 0.3 + 0.7 ) ))

        var height
        if ( r_height < 0.18 )
            height = 3
        else if ( r_height < 0.3 )
            height = 2
        else if ( r_height < 0.5 )
            height = 1
        else
            height = 0

        var obstacle = null

        if ( height>=3 && Math.random()>0.9 || height>=2 && Math.random()>0.95 )
            obstacle = 'tree'

        map[ x + y*w ] = {
            height : height,
            type: ['water', 'sand', 'dirt', 'grass', 'grass'][ height ],
            obstacle: obstacle,
            x: x,
            y: y,
        }

    }

    // #yolo
    map.get = function( x, y ){
        var k = x + y*w
        if(  k<0 || k>=map.length )
            return {
                height: 0,
                type: 'water',
                obstacle: ''
            }
        return map[ k ]
    }

    var max_chain = 5

    // cleaning
    for ( var x=w; x--; )
    for ( var y=h; y--; )
    {

    	var startCeil = map.get(x, y)

    	var open = []
    	var closed = []

    	if ( startCeil.height > 0 )
    		open.push(startCeil)

    	while( open.length > 0 && closed.length < max_chain ) {

    		var ceil = open.shift()
    		closed.push(ceil)

    		var neighboor = map.get(x-1, y)
    		if ( neighboor.height > 0 ) {
    			open.push(neighboor)
    		}
    		neighboor = map.get(x+1, y)
    		if ( neighboor.height > 0 ) {
    			open.push(neighboor)
    		}
    		neighboor = map.get(x, y-1)
    		if ( neighboor.height > 0 ) {
    			open.push(neighboor)
    		}
    		neighboor = map.get(x, y+1)
    		if ( neighboor.height > 0 ) {
    			open.push(neighboor)
    		}
    	}

    	if ( closed.length < max_chain ) {
    		closed.forEach(function(ceil){
    			ceil.height = 0
    			ceil.type = 'water'
    			ceil.obstacle = null
    		})
    	}
    }

    return map
}

var computeSpawnCandidate = function(map, w, h) {
	var nextWater = []
	var spawn = []

    for ( var x=w; x--; )
    for ( var y=h; y--; )
    {
    	var startCeil = map.get(x, y)
    	var max_chain = 5

    	var open = []
    	var closed = []

    	if ( startCeil.height > 0 )
    		open.push(startCeil)

    	while( open.length > 0 && closed.length < max_chain ) {

    		var ceil = open.shift()
    		closed.push(ceil)

    		var neighboor = map.get(x-1, y)
    		if ( neighboor.height == 0 ) {
    			open.push(neighboor)
    		}
    		neighboor = map.get(x+1, y)
    		if ( neighboor.height == 0 ) {
    			open.push(neighboor)
    		}
    		neighboor = map.get(x, y-1)
    		if ( neighboor.height == 0 ) {
    			open.push(neighboor)
    		}
    		neighboor = map.get(x, y+1)
    		if ( neighboor.height == 0 ) {
    			open.push(neighboor)
    		}
    	}

    	if ( closed.length > max_chain ) {
    		nextWater.push(startCeil)
    	}
    }

    spawn.push(nextWater.shift())

    var ceil = nextWater.shift()
    var max = {
    	ceil: ceil,
    	dst: Math.sqrt(Math.pow(spawn[0].x - ceil.x, 2)+Math.pow(spawn[0].y - ceil.y, 2))
    }

    nextWater.forEach(function(ceil){
    	var dst = Math.sqrt(Math.pow(spawn[0].x - ceil.x, 2)+Math.pow(spawn[0].y - ceil.y, 2))
    	if( dst > max.dst ){
    		max.ceil = ceil
    		max.dst = dst
    	}
    })

    spawn.push(max.ceil)
    nextWater.splice(nextWater.indexOf(max.ceil), 1)

    var ceil = nextWater.shift()
    var max = {
    	ceil: ceil,
    	dst: Math.pow(Math.sqrt(Math.pow(spawn[0].x - ceil.x, 2)+Math.pow(spawn[0].y - ceil.y, 2)), 2) 
    	   + Math.pow(Math.sqrt(Math.pow(spawn[1].x - ceil.x, 2)+Math.pow(spawn[1].y - ceil.y, 2)), 2)
    }

    nextWater.forEach(function(ceil){
    	var dst = Math.pow(Math.sqrt(Math.pow(spawn[0].x - ceil.x, 2)+Math.pow(spawn[0].y - ceil.y, 2)), 2) 
    			+ Math.pow(Math.sqrt(Math.pow(spawn[1].x - ceil.x, 2)+Math.pow(spawn[1].y - ceil.y, 2)), 2)
    	if( dst > max.dst ){
    		max.ceil = ceil
    		max.dst = dst
    	}
    })

    spawn.push(max.ceil)
    nextWater.splice(nextWater.indexOf(max.ceil), 1)

    var ceil = nextWater.shift()
    var max = {
    	ceil: ceil,
    	dst: Math.pow(Math.sqrt(Math.pow(spawn[0].x - ceil.x, 2)+Math.pow(spawn[0].y - ceil.y, 2)), 2) 
    	   + Math.pow(Math.sqrt(Math.pow(spawn[1].x - ceil.x, 2)+Math.pow(spawn[1].y - ceil.y, 2)), 2)
    	   + Math.pow(Math.sqrt(Math.pow(spawn[2].x - ceil.x, 2)+Math.pow(spawn[2].y - ceil.y, 2)), 2)
    }

    nextWater.forEach(function(ceil){
    	var dst = Math.pow(Math.sqrt(Math.pow(spawn[0].x - ceil.x, 2)+Math.pow(spawn[0].y - ceil.y, 2)), 2) 
    			+ Math.pow(Math.sqrt(Math.pow(spawn[1].x - ceil.x, 2)+Math.pow(spawn[1].y - ceil.y, 2)), 2)
    			+ Math.pow(Math.sqrt(Math.pow(spawn[2].x - ceil.x, 2)+Math.pow(spawn[2].y - ceil.y, 2)), 2)
    	if( dst > max.dst ){
    		max.ceil = ceil
    		max.dst = dst
    	}
    })

    spawn.push(max.ceil)

    return spawn

}

module.exports = {
    init: init,

    addPlayer: addPlayer,
    removePlayer: removePlayer,

    resolveCommands: resolveCommands,

    getPlayersAsJson: getPlayersAsJson,
    getWorldAsJson: getWorldAsJson,
    getOrderAsJson: getOrderAsJson,
}
