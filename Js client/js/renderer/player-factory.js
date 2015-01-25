
var PIXI = require('pixi.js')


var run_sp = PIXI.Texture.fromImage("./asset/Mini/poulet.png")
var pi_sp = PIXI.Texture.fromImage("./asset/Mini/pistolet.png")
var death_sp = PIXI.Texture.fromImage("./asset/Mini/death.png")
var pic_sp = PIXI.Texture.fromImage("./asset/Mini/picorer.png")



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
    textures_fire_back.push( new PIXI.Texture( pi_sp, {width: 125, height: 150, x: 20 + (9-i)*125, y: 0 }) )
    textures_fire_front.push( new PIXI.Texture( pi_sp, {width: 125, height: 150, x: 20 + (9-i)*125, y: 150 }) )
}

var textures_death_front = []
var textures_death_back = []
for (var i=1; i<4; i++)
{
    textures_death_back.push( new PIXI.Texture( death_sp, {width: 180, height: 130, x:  5+ i*180, y: 0 }) )
    textures_death_front.push( new PIXI.Texture( death_sp, {width: 180, height: 130, x:  5+ i*180, y: 130 }) )
}

var textures_null_front = [ new PIXI.Texture( run_sp, {width: 1, height: 1, x: 0, y: 0 }) ]

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
    death : {
        front: textures_death_front,
        back: textures_death_back,
        speed: 0.04,
        noLoop: true
    },
    fire : {
        front: textures_fire_front,
        back: textures_fire_back,
        speed: 0.11,
        noLoop: true
    },
    null : {
        front: textures_null_front,
        back: textures_null_front,
        speed: 0.11,
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
    var text = new PIXI.Text('name', {font: "bold 60px Podkova", fill: "#cc00ff", align: "center", stroke: "#FFFFFF", strokeThickness: 6});
    text.anchor.x = text.anchor.y = 0.5;
    text.position.x = 10;
    text.position.y = 10;

    player.addChild( text )

    // yolo
    player.setState = setState

    return player
}

module.exports = {
    create: create
}
