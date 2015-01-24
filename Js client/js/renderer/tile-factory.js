
var PIXI = require('pixi.js')


var texture_tile = PIXI.Texture.fromImage("./asset/tile-placeholder.svg")
var textures = {
    dirt: PIXI.Texture.fromImage("./asset/dirt2.png"),
    sand: PIXI.Texture.fromImage("./asset/sand.png"),
    grass: PIXI.Texture.fromImage("./asset/grass.png"),
}


var create = function( type ){
    var tile = new PIXI.Sprite( textures[ type ] || textures.sand )

    tile.anchor.x = 0.5
    tile.anchor.y = 0.001

    return tile
}

module.exports = {
    create: create
}
