var Abstract = require('../util/Abstract')
, ed = require('../system/eventDispatcher')
, Entity = require('./entity')



var init = function( ){

    Entity.init.call( this )

    this.type = 'tree'

    this.x = 5
    this.y = 5

    return this
}



module.exports = Object.create( Entity )
.extend({
    init: init
})
