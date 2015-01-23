
var PIXI = require('pixi.js')


var texture_tile = PIXI.Texture.fromImage("./asset/tile-placeholder.svg")


var create = function(){
    var tile = new PIXI.Sprite( texture_tile )

    tile.anchor.x = 0.5
    tile.anchor.y = 0.166666

    return tile
}

module.exports = {
    create: create
}
