var PIXI = require('pixi.js')


var mire = PIXI.Texture.fromImage("./asset/mire.svg")

var textures = [
    PIXI.Texture.fromImage("./asset/buisson1.png"),
    PIXI.Texture.fromImage("./asset/buisson2.png"),
    PIXI.Texture.fromImage("./asset/buisson3.png")
]


var create = function(){

    var container = new PIXI.DisplayObjectContainer();

    var sprite = new PIXI.Sprite( textures[ 0 | ( textures.length * Math.random() ) ] );
    //var sprite = new PIXI.Sprite( mire );
    sprite.pivot.x = 0.5
    sprite.pivot.y = 0.5
    sprite.anchor.x = 0.5
    sprite.anchor.y = 0.8

    sprite.rotation = ( Math.random() - 0.5 ) * 0.6

    //sprite.width = sprite.height = 100

    //sprite.x = ( Math.random() - 0.5 )*10
    //sprite.y = ( Math.random() - 0.5 )*10

    container.addChild( sprite )

    return container
}

module.exports = {
    create: create
}
