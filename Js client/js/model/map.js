var Abstract = require('../util/Abstract')

var init = function( type ){


    this.width = 16
    this.height = 16
    this.m = []

    return this
}
var get = function( x, y ){
    var k = x + y*this.width
    if(  k<0 || k>=this.m.length )
        return {
            height: 0
        }
    return this.m[ k ]
}

module.exports = Object.create( Abstract )
.extend({
    init: init,
    get: get
})
