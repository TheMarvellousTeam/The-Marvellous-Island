var Abstract = require('../util/Abstract')
  , ed = require('../system/eventDispatcher')

var init = function( modelBall ){

    this.model = {
        map: modelBall.map,
        entityPool: modelBall.entityPool
    }

    this.doAction = doAction.bind( this )

    return this
}

var doAction = function( action ){

    var type = action.action
    var playerId = action.playerId
    var duration = action.duration / 15 // from ms to frame

    var player
    if ( playerId )
        player = this.model.entityPool.filter(function(c){ return playerId == c.playerId })[ 0 ]

    if( !player )
        return

    switch( type )
    {
        case 'move' :
            player.finishMove()
            player.x = action.fromX
            player.y = action.fromY

            player.engageMove( action.toX, action.toY, duration )
            return

        case 'death' :
            player.finishMove()

            player.state = 'death'

            player.engageWereable( 60, 'null')

            ed.dispatch('change:state', {
                entity: player
            })
            return

        case 'spawn' :
            player.finishMove()
            player.x = action.toX
            player.y = action.toY
            return

        case 'fire_push_bullet' :

            player.finishMove()

            player.state = 'fire'
            player.direction.frontOrBack = action.dirX+action.dirY > 0 ? 'back' : 'front'
            player.direction.sens = action.dirX - action.dirY > 0

            player.engageWereable( 62 )

            ed.dispatch('change:state', {
                entity: player
            })
            return

        case 'peck' :

            player.finishMove()

            player.state = 'picor'

            player.engageWereable( 62 )

            ed.dispatch('change:state', {
                entity: player
            })
            return

        default :
            return
    }
}


var enable = function(){
    this.disable()
    ed.listen( 'io:incoming-action', this.doAction, this )
}
var disable = function(){
    ed.unlisten( 'io:incoming-action', this )
}

module.exports = Object.create( Abstract ).extend({
    init: init,
    enable: enable,
    disable: disable,
})
