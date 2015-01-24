var Abstract = require('../util/Abstract')
  , ed = require('../system/eventDispatcher')

var init = function( modelBall ){

    this.model = {
        entityPool: modelBall.entityPool
    }

    this.sync = sync.bind( this )

    return this
}

var sync = function( data ){

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
