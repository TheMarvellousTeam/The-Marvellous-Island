
var PIXI = require('pixi.js')
  , ed = require('../system/eventDispatcher')


var texture = PIXI.Texture.fromImage("./asset/mini/palmier.png")
var buisson_texture = PIXI.Texture.fromImage("./asset/mini/buisson3.png")
var mire = PIXI.Texture.fromImage("./asset/mire.svg")

var create = function(){

    var container = new PIXI.DisplayObjectContainer();

    var sprite = new PIXI.Sprite( texture );
    sprite.pivot.x = sprite.anchor.x = 0.5
    sprite.pivot.y = sprite.anchor.y = 0.95

    sprite.rotation = ( Math.random() - 0.5 ) * 0.6
    sprite.alpha = 0.89

    container.addChild( sprite )

    if ( Math.random() < 0.5 )
        return container

    var sprite = new PIXI.Sprite( buisson_texture )
    sprite.pivot.x = sprite.anchor.x = 0.5
    sprite.pivot.y = sprite.anchor.y = 0.95
    sprite.rotation = ( Math.random() - 0.5 ) * 0.6

    sprite.position.x = ( Math.random() - 0.5 ) * 80
    sprite.position.y =  ( Math.random() - 0.5 ) * 80

    container.addChild( sprite )

    return container
}

module.exports = {
    create: create
}
