var PIXI = require('pixi.js')


var stage = new PIXI.Stage(0x66FF99)
var canvas = document.getElementByID("game-canvas")
var renderer = PIXI.autoDetectRenderer(
	canvas.height,
	canvas.width,
	{view: canvas}
)

var menuTexture = PIXI.Texture.fromImage("resources/menu.png")
var menu = new PIXI.Sprite(menuTexture)

stage.addChild(menu);

requestAnimFrame(update)

var update = function() {
	renderer.render(stage)
	requestAnimFrame(update)
}