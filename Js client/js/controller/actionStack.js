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
    var playerName = action.player
    var duration = action.duration / 15 // from ms to frame

    var player
    if ( playerName )
        player = this.model.entityPool.filter(function(c){ return playerName == c.name })[ 0 ]


    switch( type )
    {
        case 'move' :
            player.finishMove()
            player.x = action.fromX
            player.y = action.fromY

            player.engageMove( action.toX, action.toY, duration )
            return

        case 'death' :
            // TODO
            return

        case 'spawn' :
            player.finishMove()
            player.x = action.toX
            player.y = action.toY
            return

        case 'fire_push_bullet' :

            player.finishMove()
            player.x = action.fromX
            player.y = action.fromY

            player.state = 'fire'
            player.direction.frontOrBack = action.dirX+action.dirY > 0 ? 'back' : 'front'
            player.direction.sens = action.dirX - action.dirY > 0

            player.engageWereable( 62 )

            ed.dispatch('change:state', {
                entity: player
            })
            return

        default :
            return
    }

    ed.dispatch('action-done', {
        player: player,
        action: type
    })
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
