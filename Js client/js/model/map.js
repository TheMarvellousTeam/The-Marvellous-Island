var Abstract = require('../util/Abstract')


var procedural = function( w, h ){

    // x + y*w
    var map = []

    var r_max = ( (w/2)*(w/2) + (h/2)*(h/2) ) * 1.1

    for ( var x=w; x--; )
    for ( var y=h; y--; )
    {

        // distance to center
        var r = (( x-w/2 )*( x-w/2 ) + ( y-h/2 )*( y-h/2 )) / r_max

        // distance to center ~ random param
        var r_color = Math.min( 1, ( r * ( Math.random() * 0.2 + 0.8 ) ))
        var r_height = Math.min( 1, ( Math.pow( r , 1/2 ) * 1.1 * ( Math.random() * 0.3 + 0.7 ) ))

        var height
        if ( r_height < 0.18 )
            height = 3
        else if ( r_height < 0.3 )
            height = 2
        else if ( r_height < 0.5 )
            height = 1
        else
            height = 0

        map[ x + y*w ] = {
            color : 0 | ( r_color * 4 ),
            height : height
        }

    }

    return map
}

var init = function( type ){


    this.width = 16
    this.height = 16
    this.m = procedural( this.width, this.height )

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
