var Abstract = require('../util/Abstract')
  , ed = require('../system/eventDispatcher')
  , PIXI = require('pixi.js')

var render = function( domSvg ){



}

var renderLoop = function(){
    this.renderer.render( this.stage )

    requestAnimationFrame( this.renderLoop )
}

var bootstrapPIXI = function(){
    // create an new instance of a pixi stage
    this.stage = new PIXI.Stage(0x66FF99)

    // create a renderer instance
    this.renderer = new PIXI.autoDetectRenderer(800, 600)

    // add the renderer view element to the DOM
    document.body.appendChild(this.renderer.view)

    this.static_layer = new PIXI.DisplayObjectContainer()
    this.dynamic_layer = new PIXI.DisplayObjectContainer()

    this.stage.addChild( this.static_layer );
    this.stage.addChild( this.dynamic_layer );
}

var init = function( modelBall ){

    this.model = {
        map: modelBall.map
    }


    bootstrapPIXI.call( this )

    // start render loop
    this.renderLoop = renderLoop.bind( this )
    this.renderLoop()

    //ed.listen( 'render' , render.bind( this ) , this )

    return this
}

module.exports = Object.create( Abstract )
.extend({
    init: init,
    render: render
})
