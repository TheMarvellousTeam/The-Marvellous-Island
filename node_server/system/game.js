var proceduralGen = require('./proceduralGen')

var init = function(){

    this.players = {}

    this.order = []

    this.size = 16

    this.world = proceduralGen.genWorld( this.size, this.size )

    this.spawnCandidate = proceduralGen.computeSpawnCandidate(this.world, this.size, this.size)

    return this
}

var timeDead = 5

var resolveOneCommand = function( cmd ){

    var playerId = cmd.playerId
    var player = this.players[ playerId ]
    var cmdType = cmd.action
    var direction = {x: cmd.directionX, y: cmd.directionY}


    var resulting_actions = []

    if ( player.respawnIn > 0 ){

        player.respawnIn --

        if ( player.respawnIn <= 0 )
        {
            resulting_actions.push({
                'action' : 'spawn',
                'playerId' : playerId,
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
                'playerId' : playerId
            }]
    }

    switch( cmdType )
    {
        case 'move' :

            if ( Math.abs( direction.x ) + Math.abs( direction.y ) > 1 )
                console.log( direction )

            var next_position = {
                x: player.x + direction.x,
                y: player.y + direction.y
            }

            // check if the cell is empty
            var next_cell = this.world.get( next_position.x , next_position.y ) || {obstacle: 'true'}

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
                    'playerId' : playerId
                }]

            // the move is acceptable
            resulting_actions.push({
                'action' : 'move',
                'playerId' : playerId,
                'fromX' : player.x,
                'fromY' : player.y,
                'toX' : next_position.x,
                'toY' : next_position.y
            })

            player.x = next_cell.x
            player.y = next_cell.y

            // or maybe he fall into the water
            if( next_cell.type == "water" )
            {
                resulting_actions.push({
                    'action' : 'death',
                    'playerId' : playerId
                })


                // you r dead, go fuck yourself in -99 -999
                player.x = -999
                player.y = -999

                player.respawnIn = timeDead

            }
            break


        case 'peck' :

            resulting_actions.push({
                'action' : 'peck',
                'playerId' : playerId,
                'fromX' : player.x,
                'fromY' : player.y,
            })
            break


        case 'fire_push_bullet' :

            resulting_actions.push({
                'action' : 'fire_push_bullet',
                'playerId' : playerId,
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
            in_lines.reverse().forEach(function( name ){

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


var addPlayer = function( id, name ){
	var spawncell = this.spawnCandidate.shift()
	this.order.push(id)
	return this.players[id] = {
        x: spawncell.x,
        y: spawncell.y,
        spawnX: spawncell.x,
        spawnY: spawncell.y,
        name: name
    }
}
var removePlayer = function( id ){
    if ( this.players[id] )
	   this.spawnCandidate.push({x: this.players[id].spawnX, y: this.players[id].spawnY})
	this.order.splice(this.order.indexOf(id), 1)
	delete this.players[id]
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


module.exports = {
    init: init,

    addPlayer: addPlayer,
    removePlayer: removePlayer,

    resolveCommands: resolveCommands,

    getPlayersAsJson: getPlayersAsJson,
    getWorldAsJson: getWorldAsJson,
    getOrderAsJson: getOrderAsJson,
}
