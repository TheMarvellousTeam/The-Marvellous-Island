var ed = require('../../system/eventDispatcher')

var _move = function(){

    var alpha = ( this._move.k ++ )/this._move.duration

    if ( alpha>=1 )
        return this.finishMove()

    this.x = this._move.targetX * alpha + this._move.originX * (1-alpha)
    this.y = this._move.targetY * alpha + this._move.originY * (1-alpha)

    ed.dispatch('change:position', {
        entity: this
    })

}
var finishMove = function( noStateChange ){

    if ( this._move ) {
        this.x = this._move.targetX
        this.y = this._move.targetY
    }
    this._move = null

    ed.dispatch('change:position', {
        entity: this
    })

    ed.unlisten('update', this.id+'_movable' )

    // set state
    if ( !noStateChange && this.state != 'idl' ) {
        this.state = 'idl'
        ed.dispatch('change:state', {
            entity: this
        })
    }
}

// duration  : nb frame
var engageMove = function( x, y, duration ){

    this.finishMove( true )


    // prepare transition
    this._move = {

        targetX: x,
        targetY: y,

        originX: this.x,
        originY: this.y,

        duration: duration,
        k: 0
    }
    ed.listen('update', _move.bind( this ), this.id+'_movable' )


    // set direction
    this.direction.frontOrBack = (x-this.x)+(y-this.y) > 0 ? 'back' : 'front'
    this.direction.sens = (x-this.x) - (y-this.y) > 0

    ed.dispatch('change:direction', {
        entity: this
    })

    // set state
    if ( this.state != 'running' ) {
        this.state = 'running'
        ed.dispatch('change:state', {
            entity: this
        })
    }
}

module.exports = {
    finishMove: finishMove,
    engageMove: engageMove
}
