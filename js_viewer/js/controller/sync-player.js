var Abstract = require('../util/Abstract')
  , ed = require('../system/eventDispatcher')
  , Player = require('../model/player')

var init = function( modelBall ){

    this.model = {
        entityPool: modelBall.entityPool
    }

    this.sync = sync.bind( this )

    return this
}

var sync = function( data ){

    var finds = {}

    // empty entityPool from all non player object
    var entityPool = this.model.entityPool


    // delete the ones that are no longeur in
    for( var i = entityPool.length; i-- ;)
    {

        if ( entityPool[ i ].type != 'player' )
            continue

        if ( !data.players[ entityPool[ i ].playerId ] )
            entityPool.splice( i,1 )
        else
            finds[ entityPool[ i ].playerId ] = true
    }

    // add the ones that are not yet in
    for ( var i in data.players )
        if ( !finds[ i ] ){
            var e = Object.create( Player ).init()
            e.playerId = data.players[ i ].playerId
            e.playerId = i
            e.x = data.players[ i ].x
            e.y = data.players[ i ].y
            entityPool.push( e )
        }


    ed.dispatch('add:entity')

}

var enable = function(){
    this.disable()
    ed.listen( 'io:update-players', this.sync, this )
}
var disable = function(){
    ed.unlisten( 'io:update-players', this )
}

module.exports = Object.create( Abstract ).extend({
    init: init,
    enable: enable,
    disable: disable,
})
