
var PIXI = require('pixi.js')


var player_spriteSheet = PIXI.Texture.fromImage("./asset/dude_animation_sheet_stolen.png")


var textures_running = []
for (var i=0; i<7; i++)
    textures_running.push( new PIXI.Texture( player_spriteSheet, {width: 128, height: 128, x: i*128, y: 0}) )

var textures_idl = []
for (var i=0; i<2; i++)
    textures_idl.push( new PIXI.Texture( player_spriteSheet, {width: 128, height: 128, x: i*128, y: 128*3}) )

var textures = {
    running : {
        front: textures_running,
        back: textures_running,
        speed: 0.4
    },
    idl : {
        front: textures_idl,
        back: textures_idl,
        speed: 0.2
    }
}

var setState = function( label, frontOrBack, sens ){
    this.textures = textures[ label ][ frontOrBack ]
    if ( sens != this.mc.scale.x>0 )
        this.mc.scale.x *= -1
    this.mc.animationSpeed = textures[ label ].speed
    this.mc.gotoAndPlay(0)
}

var create = function(){

    var player = new PIXI.DisplayObjectContainer();

    player.mc = new PIXI.MovieClip( textures.running.front )
    player.addChild( player.mc )

    player.mc.scale.x = player.mc.scale.y = 0.5

    player.mc.anchor.x = 0.5
    player.mc.anchor.y = 0.8


    // yolo
    player.setState = setState

    return player
}

module.exports = {
    create: create
}
