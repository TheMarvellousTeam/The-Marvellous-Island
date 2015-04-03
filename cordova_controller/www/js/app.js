//var PIXI = require('pixi.js')
(function(){
	var stage = new PIXI.Stage(0x66FF99)
	var canvas = document.getElementById("game-canvas")
	var renderer = PIXI.autoDetectRenderer(
		canvas.height,
		canvas.width,
		{view: canvas}
	)

	var ratio = canvas.width / canvas.height

	var menuTexture = PIXI.Texture.fromImage("img/menu.png")
	var menuSplit = new PIXI.Texture(menuTexture, {x:0, y:0, width:480, height:800})
	var menu = new PIXI.Sprite(menuSplit)
	menu.width = canvas.width
	menu.height = canvas.height
	
	stage.addChild(menu)
	
	var update = function() {
		renderer.render(stage)
		requestAnimFrame(update)
	}
	
	requestAnimFrame(update)

})();
