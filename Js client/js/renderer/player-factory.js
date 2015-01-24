
var PIXI = require('pixi.js')


var poulet_spriteSheet = PIXI.Texture.fromImage("./asset/poulet_green.png")
var player_spriteSheet = PIXI.Texture.fromImage("./asset/dude_animation_sheet_stolen.png")
var mire_texture = PIXI.Texture.fromImage("./asset/mire.svg", 128, 128)


var textures_running = []
for (var i=0; i<5; i++)
    textures_running.push( new PIXI.Texture( poulet_spriteSheet, {width: 395, height: 413, x: 265 + i*395, y: 90 }) )

var textures_idl = []
for (var i=0; i<2; i++)
    textures_idl.push( new PIXI.Texture( poulet_spriteSheet, {width: 395, height: 413, x: 265 + i*395, y: 90 + i *10 }) )

var textures = {
    running : {
        front: textures_running,
        back: textures_running,
        speed: 0.23
    },
    idl : {
        front: textures_idl,
        back: textures_idl,
        speed: 0.06
    }
}

var setState = function( label, frontOrBack, sens ){

    this.removeChildren()

    var m = this.mc[ label ][ frontOrBack ]

    this.addChild( m )

    if ( sens != m.scale.x<0 )
        m.scale.x *= -1

    m.gotoAndPlay( label == this.stateLabel ? m.currentFrame : 0 )

    this.stateLabel = label
}

var create = function( name ){

    var player = new PIXI.DisplayObjectContainer();

    var mc = {}
    for ( var i in textures )
    for ( var k in textures[ i ] )
    {
        var m = new PIXI.MovieClip( textures[ i ][ k ] )
        m.animationSpeed = textures[ i ].speed
        m.anchor.x = 0.5
        m.anchor.y = 0.9

        ;( mc[i] = mc[i] || {} )[k] = m
    }
    player.mc = mc

    // LOL no
    //var bitmapFontText = new PIXI.BitmapText( name || 'martin' )
    //player.addChild( bitmapFontText )

    // yolo
    player.setState = setState

    return player
}

module.exports = {
    create: create
}
