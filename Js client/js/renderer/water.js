
var PIXI = require('pixi.js')
  , ed = require('../system/eventDispatcher')

var texture_overlay = PIXI.Texture.fromImage("./asset/zeldaWaves_stollen_from_pixi.png")
var displacement_map = PIXI.Texture.fromImage("./asset/displacement_map_stollen_from_pixi.jpg")


var animate = function(){

    this.t ++

    this.displacementFilter.offset.x = this.t *2
    this.displacementFilter.offset.y = this.t *1.2

    this.overlay.tilePosition.x = this.t
    this.overlay.tilePosition.y = this.t
}

var create = function(){

    var container = new PIXI.DisplayObjectContainer();


    this.overlay = new PIXI.TilingSprite( texture_overlay , window.innerWidth, window.innerHeight )
    this.overlay.tileScale.y = 0.3

    this.overlay.alpha = 0.5
    container.addChild(this.overlay);

    this.displacementFilter = new PIXI.DisplacementFilter(displacement_map);

    this.displacementFilter.scale.x = 50;
    this.displacementFilter.scale.y = 50;

    container.filters = [ this.displacementFilter ]


    this.t = 0
    ed.listen('update', animate.bind(this), this )

    return container
}

module.exports = {
    create: create
}
