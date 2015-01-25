var PIXI = require('pixi.js')


var mire = PIXI.Texture.fromImage("./asset/mire.svg")

var textures = [
    PIXI.Texture.fromImage("./asset/mini/buisson1.png"),
    PIXI.Texture.fromImage("./asset/mini/buisson2.png"),
    PIXI.Texture.fromImage("./asset/mini/buisson3.png"),
    PIXI.Texture.fromImage("./asset/mini/roc1.png"),
    PIXI.Texture.fromImage("./asset/mini/roc2.png"),
    PIXI.Texture.fromImage("./asset/mini/roc3.png")
]


var create = function( type ){

    var container = new PIXI.DisplayObjectContainer();


    var sprite = new PIXI.Sprite( textures[ 0 | ( textures.length * Math.random() ) ] );
    //var sprite = new PIXI.Sprite( mire );
    sprite.pivot.x = 0.5
    sprite.pivot.y = 0.5
    sprite.anchor.x = 0.5
    sprite.anchor.y = 0.8

    sprite.rotation = ( Math.random() - 0.5 ) * 0.6

    container.addChild( sprite )

    return container
}

module.exports = {
    create: create
}
