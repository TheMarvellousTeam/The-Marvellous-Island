var Abstract = require('../util/Abstract')
  , ed = require('../system/eventDispatcher')
  , Tree = require('../model/tree')
  , Deco = require('../model/deco')

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
    this.model.map.m.forEach(function( c , i ){

        if ( !c.obstacle )
            return

        var e = Object.create( Tree ).init()
        e.x = c.x
        e.y = c.y

        entityPool.push( e )
    })


    // add the fucking deco
    /*
    for (var k= 0 | ( 20 * Math.random() ); k--; )
    for (var i=10; i--; )
    {
        var x = 0 | ( Math.random() * this.model.map.width )
        var y = 0 | ( Math.random() * this.model.map.height )

        var c = this.model.map.get( x, y )

        if( c.type == 'water' && !c.obstacle )
            continue

        var e = Object.create( Deco ).init( c.type )
        e.x = x + ( Math.random() - 0.5 )/2
        e.y = y + ( Math.random() - 0.5 )/2

        this.model.entityPool.push( e )

        break
    }
    */


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
