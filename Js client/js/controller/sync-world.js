var Abstract = require('../util/Abstract')
  , ed = require('../system/eventDispatcher')

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
    var toDelete = this.model.entityPool.filter(function(e){
        return e.type !== 'player'
    })
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
