var Abstract = require('../util/Abstract')
  , ed = require('../system/eventDispatcher')
  , movable = require('./mixin/movable')
  , wereable = require('./mixin/wereable')
  , Entity = require('./entity')


var init = function( ){

    Entity.init.call( this )

    this.type = 'player'

    this.x= 5
    this.y= 5

    this.name

    return this
}



module.exports = Object.create( Entity )
.extend( movable )
.extend( wereable )
.extend({
    init: init
})
