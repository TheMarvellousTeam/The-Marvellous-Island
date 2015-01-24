
var PIXI = require('pixi.js')
  , ed = require('../system/eventDispatcher')

var texture_overlay = PIXI.Texture.fromImage("./asset/zeldaWaves_stollen_from_pixi.png")


var animate = function(){

    this.t ++

    this.overlay.tilePosition.x = this.t
    this.overlay.tilePosition.y = this.t
}

var create = function(){

    var container = new PIXI.DisplayObjectContainer();

    this.overlay = new PIXI.TilingSprite( texture_overlay , 630, 410 )

    this.overlay.alpha = 0.1
    container.addChild(this.overlay);

    ed.listen('update', animate.bind(this), this )

    return container
}

module.exports = {
    create: create
}
