

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
    this.addPlayer('toto')

    return this
}

var timeDead = 5

var resolveOneCommand = function( cmd ){
    var playerName = cmd.player
    var player = this.players[ playerName ]
    var cmdType = cmd.type
    var direction = cmd.direction ? cmd.direction : null

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
                x: player.x + direction.x,
                y: player.y + direction.y
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

                player.respawnIn = timeDead

            }
            break



            case 'fire_push_bullet' :

                resulting_actions.push({
                    'action' : 'fire_push_bullet',
                    'player' : playerName,
                    'fromX' : player.x,
                    'fromY' : player.y,
                    'dirX' : direction.x,
                    'dirY' : direction.y
                })


                // check the players in the line of fire
                var in_lines = []
                var ox = player.x + direction.x
                var oy = player.y + direction.y

                while( true )
                {

                    for ( var name in this.players )
                        if( this.players[ name ].x == ox && this.players[ name ].y == oy )
                            in_lines.push( name )

                    ox += direction.x
                    oy += direction.y

                    if( this.size < ox  || ox < 0 || this.size < oy  || oy < 0  )
                        break
                }


                // push the fuckers
                var that =this
                in_lines.forEach(function( name ){

                    var ax = that.players[ name ].x
                    var ay = that.players[ name ].y

                    for( var i= 3; i--; )
                    {
                        ax += direction.x
                        ay += direction.y

                        if ( that.world.get( ax , ay ).obstacle )
                        {
                            // bim you take a tree in your face and now your dead, happy now ?
                            resulting_actions.push({
                                'action' : 'push',
                                'player' : name,
                                'fromX' : that.players[ name ].x,
                                'fromY' : that.players[ name ].y,
                                'toX' : ax - direction.x,
                                'toY' : ay - direction.y
                            })

                            resulting_actions.push({
                                'action' : 'death',
                                'player' : name
                            })

                            // you r dead, go fuck yourself in -99 -999
                            that.players[ name ].x = -999
                            that.players[ name ].y = -999

                            that.players[ name ].respawnIn = timeDead

                            return
                        }
                    }
                    resulting_actions.push({
                        'action' : 'push',
                        'player' : name,
                        'fromX' : that.players[ name ].x,
                        'fromY' : that.players[ name ].y,
                        'toX' : ax - direction.x,
                        'toY' : ay - direction.y
                    })

                    /// is the fucker in the water ?
                    if ( that.world.get( ax , ay ).type == 'water' ){
                        resulting_actions.push({
                            'action' : 'death',
                            'player' : name
                        })
                        // you r dead, go fuck yourself in -99 -999
                        that.players[ name ].x = -999
                        that.players[ name ].y = -999

                        that.players[ name ].respawnIn = timeDead
                    }
                })

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
	var spawncell = this.spawnCandidate.shift()
	this.players[name] = {x: spawncell.x, y: spawncell.y, spawnX: spawncell.x, spawnY: spawncell.y}
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

    	var startcell = map.get(x, y)

    	var open = []
    	var closed = []

    	if ( startcell.height > 0 )
    		open.push(startcell)

    	while( open.length > 0 && closed.length < max_chain ) {

    		var cell = open.shift()
    		closed.push(cell)

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
    		closed.forEach(function(cell){
    			cell.height = 0
    			cell.type = 'water'
    			cell.obstacle = null
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
    	var startcell = map.get(x, y)
    	var max_chain = 5

    	var open = []
    	var closed = []

    	if ( startcell.height > 0 )
    		open.push(startcell)

    	while( open.length > 0 && closed.length < max_chain ) {

    		var cell = open.shift()
    		closed.push(cell)

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

    	if ( closed.length >= max_chain ) {
    		nextWater.push(startcell)
    	}
    }

    console.log(nextWater)

    spawn.push(nextWater.shift())

    var cell = nextWater.shift()
    var max = {
    	cell: cell,
    	dst: Math.sqrt(Math.pow(spawn[0].x - cell.x, 2)+Math.pow(spawn[0].y - cell.y, 2))
    }

    nextWater.forEach(function(cell){
    	var dst = Math.sqrt(Math.pow(spawn[0].x - cell.x, 2)+Math.pow(spawn[0].y - cell.y, 2))
    	if( dst > max.dst ){
    		max.cell = cell
    		max.dst = dst
    	}
    })

    spawn.push(max.cell)
    nextWater.splice(nextWater.indexOf(max.cell), 1)

    var cell = nextWater.shift()
    var max = {
    	cell: cell,
    	dst: Math.pow(Math.sqrt(Math.pow(spawn[0].x - cell.x, 2)+Math.pow(spawn[0].y - cell.y, 2)), 2) 
    	   + Math.pow(Math.sqrt(Math.pow(spawn[1].x - cell.x, 2)+Math.pow(spawn[1].y - cell.y, 2)), 2)
    }

    nextWater.forEach(function(cell){
    	var dst = Math.pow(Math.sqrt(Math.pow(spawn[0].x - cell.x, 2)+Math.pow(spawn[0].y - cell.y, 2)), 2) 
    			+ Math.pow(Math.sqrt(Math.pow(spawn[1].x - cell.x, 2)+Math.pow(spawn[1].y - cell.y, 2)), 2)
    	if( dst > max.dst ){
    		max.cell = cell
    		max.dst = dst
    	}
    })

    spawn.push(max.cell)
    nextWater.splice(nextWater.indexOf(max.cell), 1)

    var cell = nextWater.shift()
    var max = {
    	cell: cell,
    	dst: Math.pow(Math.sqrt(Math.pow(spawn[0].x - cell.x, 2)+Math.pow(spawn[0].y - cell.y, 2)), 2) 
    	   + Math.pow(Math.sqrt(Math.pow(spawn[1].x - cell.x, 2)+Math.pow(spawn[1].y - cell.y, 2)), 2)
    	   + Math.pow(Math.sqrt(Math.pow(spawn[2].x - cell.x, 2)+Math.pow(spawn[2].y - cell.y, 2)), 2)
    }

    nextWater.forEach(function(cell){
    	var dst = Math.pow(Math.sqrt(Math.pow(spawn[0].x - cell.x, 2)+Math.pow(spawn[0].y - cell.y, 2)), 2) 
    			+ Math.pow(Math.sqrt(Math.pow(spawn[1].x - cell.x, 2)+Math.pow(spawn[1].y - cell.y, 2)), 2)
    			+ Math.pow(Math.sqrt(Math.pow(spawn[2].x - cell.x, 2)+Math.pow(spawn[2].y - cell.y, 2)), 2)
    	if( dst > max.dst ){
    		max.cell = cell
    		max.dst = dst
    	}
    })

    spawn.push(max.cell)

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
