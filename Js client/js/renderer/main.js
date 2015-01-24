var Abstract = require('../util/Abstract')
  , ed = require('../system/eventDispatcher')
  , tileFactory = require('./tile-factory')
  , playerFactory = require('./player-factory')
  , PIXI = require('pixi.js')

var renderStatic = function( ){

    var map = this.model.map
    var container = this.static_layer


    var w = map.width
    var ratio = this.ratio
    var proj = project.bind( this )

    container.removeChildren()

    map.m.map(function( c, i ){
        var x = i%w
        var y = 0|(i/w)
        return {
            x: x,
            y: y,
            z: x+y,
            c: c
        }
    }).sort(function(a, b){
        return a.z>b.z ? 1 : -1
    }).forEach(function( cell ){

        var tile = tileFactory.create( )


        var p = proj( cell.x, cell.y )

        tile.position.x = p.x
        tile.position.y = p.y - cell.c.height * ratio / 20

        tile.height = ratio * 1.5
        tile.width = ratio
        tile.tint = cell.z / ( map.width + map.height )  * 0xFFFFFF
        //tile.scale.x = tile.scale.y

        container.addChild( tile )

    })

    this._static_renderId ++
}
var renderDynamic = function( ){

    var entities = this.model.map
    var container = this.dynamic_layer


    var w = map.width
    var ratio = this.ratio
    var proj = project.bind( this )

    container.removeChildren()

    map.m.map(function( c, i ){
        var x = i%w
        var y = 0|(i/w)
        return {
            x: x,
            y: y,
            z: x+y,
            c: c
        }
    }).sort(function(a, b){
        return a.z>b.z ? 1 : -1
    }).forEach(function( cell ){

        var tile = tileFactory.create( )


        var p = proj( cell.x, cell.y )

        tile.position.x = p.x
        tile.position.y = p.y - cell.c.height * ratio / 20

        tile.height = ratio * 1.5
        tile.width = ratio
        tile.tint = cell.z / ( map.width + map.height )  * 0xFFFFFF
        //tile.scale.x = tile.scale.y

        container.addChild( tile )

    })

    this._static_renderId ++
}

var renderLoop = function(){
    this.renderer.render( this.stage )

    requestAnimationFrame( this.renderLoop )
}

var bootstrapPIXI = function(){
    // create an new instance of a pixi stage
    this.stage = new PIXI.Stage(0x66FF99)

    // create a renderer instance
    this.renderer = new PIXI.autoDetectRenderer(window.innerWidth, window.innerHeight, null, true)

    // add the renderer view element to the DOM
    document.body.appendChild(this.renderer.view)

    this.static_layer = new PIXI.DisplayObjectContainer()
    this.dynamic_layer = new PIXI.DisplayObjectContainer()

    this.stage.addChild( this.static_layer );
    this.stage.addChild( this.dynamic_layer );
}

var computeCamera = function( ){
    var w = Math.min( this.renderer.width, this.renderer.height * 2 )
    this.ratio = w / this.model.map.width
    this.offset = {
        x: 0,
        y: 0
    }
}

var project = function( x, y ){
    return {
        x: (x-y) * this.ratio / 2 + this.offset.x + this.renderer.width/2,
        y: (x+y) * this.ratio / 4 + this.offset.y
    }
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

    computeCamera.call( this )

    this._static_renderId = 0
    renderStatic.call( this )


    var player = playerFactory.create(  )
    player.x = 500
    player.y = 700
    player.setState('running', 'front', true)
    this.dynamic_layer.addChild( player )

    var player2 = playerFactory.create(  )
    player2.x = 300
    player2.y = 200
    player2.setState('idl', 'front', false)
    this.dynamic_layer.addChild( player2 )

    return this
}

module.exports = Object.create( Abstract )
.extend({
    init: init
})
