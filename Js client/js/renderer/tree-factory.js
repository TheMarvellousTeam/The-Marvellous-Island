
var PIXI = require('pixi.js')
  , ed = require('../system/eventDispatcher')


var texture = PIXI.Texture.fromImage("./asset/palmier.png")
var mire = PIXI.Texture.fromImage("./asset/mire.svg")

var curve = function( points, curb, l ){
    for( var i=0;i<points.length;i++)
        points[i] += Math.random()*4 - 2
}

var create = function(){

    var points = []
    var l = 4000 / 20
    for( var i=0;i<5;i++)
        points.push(new PIXI.Point(1000, i * l))

    var container = new PIXI.DisplayObjectContainer();

    //var sprite = new PIXI.Rope(texture, []);


    // BLACK MAGIC
    var m = new PIXI.Sprite( mire );
    m.x = -60
    m.y = -50
    container.addChild( m )



    var sprite = new PIXI.Sprite( texture, 2250, 4000 );
    sprite.pivot.x = sprite.anchor.x = 0.5
    sprite.pivot.y = sprite.anchor.y = 0.95

    sprite.rotation = ( Math.random() - 0.5 ) * 0.6
    sprite.alpha = 0.95

    container.addChild( sprite )

    /*
    if ( Math.random() > 0.9 )
        return container

    var sprite2 = new PIXI.Sprite( texture, 2250, 4000 );
    sprite2.pivot.x = sprite2.anchor.x = 0.5
    sprite2.pivot.y = sprite2.anchor.y = 0.95

    sprite2.y = 20

    sprite2.scale.x = sprite2.scale.y = sprite.scale.x * ( Math.random() * 0.3 + 0.6 )

    sprite2.rotation = ( Math.random() - 0.5 ) * 0.6
    sprite2.alpha = 0.86

    container.addChild( sprite2 )

    */


    var k = 0

    ed.listen('update', function(){
        var curb = Math.sin( (k++)/20 )*0.1
        curve( points, curb, l )
    }, this)

    return container
}

module.exports = {
    create: create
}
