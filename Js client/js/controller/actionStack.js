var Abstract = require('../util/Abstract')
  , ed = require('../system/eventDispatcher')

var init = function( modelBall ){

    this.model = {
        map: modelBall.map,
        entityPool: modelBall.entityPool
    }

    this.receiveAction = receiveAction.bind( this )
    this.update = update.bind( this )

    this.k = 0
    this.stack = []

    return this
}

var doAction = function( action ){

    var who
    if ( action.who )
        who = this.model.entityPool.filter(function(c){ return action.who == c.id })[ 0 ]

    switch( action.type )
    {
        case 'entity-move' :
            who.engageMove( action.x, action.y, 30 )
            return 30

        case 'entity-die' :
            // TODO
            //who.engageMove( action.x, action.y, 300 )
            //ed.dispatch('')
            return 40

        default :
            return 0
    }

    ed.dispatch('action-done', {
        who: who,
        remainingActions: this.stack.length
    })
}

var update = function() {

    var timeBreak = 20

    if ( this.k <= 0 && this.stack.length )
    {
        if( this.stack.length )

            this.k = doAction.call( this, this.stack.shift() ) + timeBreak

    } else
        this.k --

}

var receiveAction = function( event ){
    this.stack.push.apply( this.stack, event.actions )
}

var enable = function(){
    this.disable()
    ed.listen( 'io:receiveAction', this.receiveAction, this )
    ed.listen( 'update', this.update, this )
}
var disable = function(){
    ed.unlisten( 'io:receiveAction', this )
    ed.unlisten( 'update', this )
}

module.exports = Object.create( Abstract ).extend({
    init: init,
    enable: enable,
    disable: disable,
})
