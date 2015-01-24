var Abstract = require('../util/Abstract')
  , ed = require('../system/eventDispatcher')
  , tileFactory = require('./tile-factory')
  , playerFactory = require('./player-factory')
  , treeFactory = require('./tree-factory')
  , decoFactory = require('./deco-factory')
  , water = require('./water')
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
    }).filter(function( cell ){
        return cell.c.height > 0
    }).sort(function(a, b){
        return a.z>b.z ? 1 : -1
    }).forEach(function( cell ){

        var tile = tileFactory.create( cell.c.type )


        var p = proj( cell.x, cell.y )

        tile.position.x = p.x
        tile.position.y = p.y - cell.c.height * ratio / 20

        tile.height = ratio * 60/100
        tile.width = ratio

        container.addChild( tile )

    })

    this._static_renderId ++
}
var renderDynamic = function( ){

    var entities = this.model.entityPool
    var map = this.model.map
    var container = this.dynamic_layer

    var ratio = this.ratio
    var proj = project.bind( this )

    var renderId = this._dynamic_renderId

    entities.sort(function(a, b){
        var za = a.x+a.y + ( a.type == 'player' ? 0.1 : 0 )
        var zb = b.x+b.y + ( b.type == 'player' ? 0.1 : 0 )
        return za>zb ? 1 : -1
    }).forEach(function( entity , i ){


        // find the associated entity
        var sprite
        var r = container.children.filter(function( c ){
            return c.id == entity.id
        })

        // create it if it does not exist
        if (!r.length) {
            switch( entity.type ){
                case 'player':
                    sprite = playerFactory.create( )
                    sprite.setState( entity.state, entity.direction.frontOrBack, entity.direction.sens )
                    sprite.width =  ratio / 1.2
                    sprite.height = ratio / 1.2
                    break
                case 'tree':
                    sprite = treeFactory.create( )
                    sprite.width =  ratio / 20
                    sprite.height = ratio / 20
                    break
                case 'deco':
                    sprite = decoFactory.create(  )
                    sprite.width =  ratio / 4000
                    sprite.height = ratio / 4000
                    break
                default :
                    return
            }
            sprite.id = entity.id
            container.addChild( sprite )
        } else {
            sprite = r[ 0 ]
        }

        sprite._render_id = renderId

        // set z index
        container.setChildIndex( sprite, i )


        //entity.x = entity.y = 6

        // set position
        var p = proj( entity.x, entity.y )

        var y = map.get( Math.round( entity.x ) , Math.round( entity.y ) ).height



        sprite.position.x = p.x
        sprite.position.y = p.y + ratio / 4 - y * ratio / 20

        //sprite.position.x = sprite.position.y = 0

    })

    // delete removed entities
    var toDelete = container.children.filter(function( c ){
        return c._render_id !== renderId
    })
    .forEach( container.removeChild.bind( container ) )

    this._dynamic_renderId ++
}

var renderLoop = function(){

    ed.dispatch('update')

    this.renderer.render( this.stage )

    if ( this.must_render_dynamic_id == this._dynamic_renderId )
        renderDynamic.call( this )

    if ( this.must_render_static_id == this._static_renderId )
        renderDynamic.call( this )

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

var changeState = function( event ){
    var r = this.dynamic_layer.children.filter(function( c ){
        return c.id == event.entity.id
    })
    if(!r.length)
        return
    r[ 0 ].setState( event.entity.state, event.entity.direction.frontOrBack, event.entity.direction.sens )
}

var init = function( modelBall ){

    this.model = {
        map: modelBall.map,
        entityPool: modelBall.entityPool,
    }

    bootstrapPIXI.call( this )

    // start render loop
    this.renderLoop = renderLoop.bind( this )
    this.renderLoop()

    //ed.listen( 'render' , render.bind( this ) , this )

    computeCamera.call( this )

    this._static_renderId = 0
    renderStatic.call( this )

    this._dynamic_renderId = 0
    renderDynamic.call( this )


    // water layer
    this.stage.addChildAt( water.create(), 0 )


    ed.listen('change:position',function(){
        this.must_render_dynamic_id = this._dynamic_renderId
    }.bind(this))

    ed.listen('change:map',function(){
        this.must_render_static_id = this._static_renderId
    }.bind(this))

    ed.listen('change:state',changeState.bind(this))
    ed.listen('change:direction',changeState.bind(this))


    ed.listen('delete:entity',function(){
        this.must_render_dynamic_id = this._dynamic_renderId
    }.bind(this))
    ed.listen('add:entity',function(){
        this.must_render_dynamic_id = this._dynamic_renderId
    }.bind(this))



    return this
}

module.exports = Object.create( Abstract )
.extend({
    init: init
})
