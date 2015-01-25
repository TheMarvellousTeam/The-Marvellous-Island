var Abstract = require('../util/Abstract')
  , ed = require('../system/eventDispatcher')


var id=0
var init = function( ){

    this.id = (id++)
    this.x = 5
    this.y = 5

    this.state = "idl"

    this.direction = {
        frontOrBack : 'front',
        sens : true
    }

    return this
}



module.exports = Object.create( Abstract )
.extend({
    init: init
})
