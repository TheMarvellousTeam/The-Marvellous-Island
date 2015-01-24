

var init = function(){

    this.players = {
        'platane' : { x:5, y:6 },
        'john' : { x:10, y:7 },
    }

    this.order = []

    this.size = 16

    this.world = proceduralGenWorld( this.size, this.size )

    return this
}


var resolveOneCommand = function( cmd ){
    var playerName = cmd.player
    var player = this.players[ playerName ]
    var cmdType = cmd.type
    var direction = cmd.direction ? cmd.direction : null

    var resulting_actions = []

    if ( player.respawnIn > 0 ){

        player.respawnIn --

        if ( player.respawnIn <= 0 )
            resulting_actions.push({
                'action' : 'spawn',
                'player' : playerName,
                'toX' : player.spawnX,
                'toY' : player.spawnY
            })
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
                    if( this.players.x == next_cell.x && this.players.y == next_cell.y )
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
            new_order : this.orderAsJson()
        })

    }

}


var addPlayer = function( name ){

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
        var k = x + y*this.width
        if(  k<0 || k>=map.length )
            return {
                height: 0,
                type: 'water'
            }
        return map[ k ]
    }

    return map
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
