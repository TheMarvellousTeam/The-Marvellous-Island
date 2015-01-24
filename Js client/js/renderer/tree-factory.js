
var PIXI = require('pixi.js')
  , ed = require('../system/eventDispatcher')


var texture = PIXI.Texture.fromImage("./asset/snake.png")

var curve = function( points, curb, l ){
    for( var i=0;i<points.length;i++)
        points[i] += Math.random()*4 - 2
}

var create = function(){

    var points = []
    var l = 918 / 5
    for( var i=0;i<5;i++)
        points.push(new PIXI.Point(i * l, 0))


    var sprite = new PIXI.Rope(texture, []);

    //var sprite = new PIXI.Sprite(texture);

    //sprite.rotation = Math.PI/2

    //sprite.scale.x = 0.3
    //sprite.scale.y = 0.15

    //sprite.anchor.x = 0.99
    //sprite.anchor.y = 0.5

    var k = 0

    ed.listen('update', function(){
        var curb = Math.sin( (k++)/20 )*0.1
        curve( points, curb, l )
    }, this)

    return sprite
}

module.exports = {
    create: create
}
