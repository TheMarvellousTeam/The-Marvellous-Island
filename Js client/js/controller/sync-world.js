var Abstract = require('../util/Abstract')
  , ed = require('../system/eventDispatcher')
  , Tree = require('../model/Tree')
  , Deco = require('../model/Deco')

var init = function( modelBall ){

    this.model = {
        map: modelBall.map,
        entityPool: modelBall.entityPool
    }

    this.sync = sync.bind( this )

    return this
}

var sync = function( data ){
    // empty entityPool from all non player object
    var entityPool = this.model.entityPool

    var not_player = entityPool.filter(function(e){
        return e.type == 'player'
    })
    entityPool.length = 0
    entityPool.push.apply( entityPool, not_player )

    // clone the map
    this.model.map.m.length = 0
    this.model.map.m.push.apply( this.model.map.m, data.world )

    // add the fucking trees
    // TODO


    this.model.map.m.forEach(function( c , i ){

        if ( !c.obstacle )
            return

        var e = Object.create( Tree ).init()
        e.x = c.x
        e.y = c.y

        entityPool.push( e )
    })


    // add the fucking deco
    // TODO

    ed.dispatch('change:map')
    ed.dispatch('add:entity')
}

var enable = function(){
    this.disable()
    ed.listen( 'io:update-world', this.sync, this )
}
var disable = function(){
    ed.unlisten( 'io:update-world', this )
}

module.exports = Object.create( Abstract ).extend({
    init: init,
    enable: enable,
    disable: disable,
})
