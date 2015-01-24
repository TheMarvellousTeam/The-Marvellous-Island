var Abstract = require('../util/Abstract')
, ed = require('../system/eventDispatcher')
, Entity = require('./entity')


var id=0
var init = function( ){

    Entity.init.call( this )

    this.type = 'tree'

    this.x = 6
    this.y = 10

    return this
}



module.exports = Object.create( Entity )
.extend({
    init: init
})
