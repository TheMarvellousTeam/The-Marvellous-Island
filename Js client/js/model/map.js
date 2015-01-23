var Abstract = require('../util/Abstract')


var Tile = {
    color : 0,
    height : 1
}

var procedural = function( w, h ){

    // x + y*w
    var map = []

    var r_max = ( (w/2)*(w/2) + (h/2)*(h/2) ) * 1.1

    for ( var x=w; x--; )
    for ( var y=h; y--; )
    {

        // distance to center
        var r = (( x-w )*( x-w ) + ( y-h )*( y-h )) / r_max

        // distance to center ~ random param
        var r_color = Math.min( 1, ( r * ( Math.random() * 0.8 + 0.2 ) ))
        var r_height = Math.min( 1, ( r * ( Math.random() * 0.8 + 0.2 ) ))

        map[ x + y*w ] = {
            color : 0 | ( r_color * 4 ),
            height : 0 | ( r_color * 3 )
        }

    }

    return map
}

var init = function( type ){


    this.width = 16
    this.height = 16
    this.map = procedural( this.width, this.height )

    return this
}
var get = function( x, y ){
    return this.map[ x + y*this.width ]
}

module.exports = Object.create( Abstract )
.extend({
    init: init,
    get: get
})
