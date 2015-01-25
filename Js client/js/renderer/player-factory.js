
var PIXI = require('pixi.js')


var run_sp = PIXI.Texture.fromImage("./asset/Mini/poulet.png")
var pi_sp = PIXI.Texture.fromImage("./asset/Mini/pistolet.png")



var textures_running_front = []
var textures_running_back = []
for (var i=0; i<5; i++)
{
    textures_running_back.push( new PIXI.Texture( run_sp, {width: 130, height: 160, x: i*130, y: 0 }) )
    textures_running_front.push( new PIXI.Texture( run_sp, {width: 130, height: 160, x: i*130, y: 160 }) )
}

var textures_idl_front = []
var textures_idl_back = []
for (var i=2; i<4; i++)
{
    textures_idl_back.push( new PIXI.Texture( run_sp, {width: 130, height: 160, x: i*130 , y: 0 }) )
    textures_idl_front.push( new PIXI.Texture( run_sp, {width: 130, height: 160, x: i*130 , y: 160 }) )
}

var textures_fire_front = []
var textures_fire_back = []
for (var i=1; i<9; i++)
{
    textures_fire_front.push( new PIXI.Texture( pi_sp, {width: 125, height: 150, x: 20 + (9-i)*125, y: 0 }) )
    textures_fire_back.push( new PIXI.Texture( pi_sp, {width: 125, height: 150, x: 20 + (9-i)*125, y: 0 }) )
}

var textures = {
    running : {
        front: textures_running_front,
        back: textures_running_back,
        speed: 0.23
    },
    idl : {
        front: textures_idl_front,
        back: textures_idl_back,
        speed: 0.06
    },
    fire : {
        front: textures_fire_front,
        back: textures_fire_back,
        speed: 0.1,
        noLoop: true
    }
}

var setState = function( label, frontOrBack, sens ){

    this.removeChildren()

    var m = this.mc[ label ][ frontOrBack ]

    this.addChild( m )

    if ( sens != m.scale.x>0 )
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
        m.loop = !textures[ i ].noLoop
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
