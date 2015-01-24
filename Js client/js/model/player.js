var Abstract = require('../util/Abstract')
  , ed = require('../system/eventDispatcher')
  , movable = require('./mixin/movable')
  , Entity = require('./entity')


var id=0
var init = function( ){

    Entity.init.call( this )

    this.type = 'player'

    this.x= 5
    this.y= 5

    return this
}



module.exports = Object.create( Entity )
.extend( movable )
.extend({
    init: init
})
