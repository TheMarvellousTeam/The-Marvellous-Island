(function(){
	
	var stage = new PIXI.Stage(0x66FF99)
	
	var renderer = PIXI.autoDetectRenderer( window.innerWidth, window.innerHeight, null )
	document.body.appendChild(renderer.view)
	renderer.view.style.position = "absolute"
	renderer.view.style.top = "0px"
	renderer.view.style.left = "0px"


	var field = document.createElement("input")//getElementById("nameField")
	field.type = "text"
	field.id = "nameField"
	field.value = "Blackbird"
	document.body.appendChild(field)
	field.style.top = field.offsetTop+"px"		// little trick to use % in css without affect appareance 
												// during keyboard popup on 

	var menuTexture = PIXI.Texture.fromImage("img/menu.png")
	var menuTextureLeft = new PIXI.Texture(menuTexture, {x:0, y:0, width:480, height:800})
	var menuTextureRight = new PIXI.Texture(menuTexture, {x:480, y:0, width:480, height:800})

	var menu = new PIXI.Sprite(menuTextureLeft)
	menu.width = window.innerWidth
	menu.height = window.innerHeight
	menu.interactive = true
	menu.mousedown = menu.touchstart = function(data) {
		if( data.global.x < window.innerWidth / 2 && data.global.y > window.innerHeight /2  ) {
			stage.removeChild(menu)
			stage.addChild(menuStart)
			setTimeout(function() {
				switchState()
			}, 500)
		}
	}
	stage.addChild(menu)

	var menuStart = new PIXI.Sprite(menuTextureRight)
	menuStart.width = window.innerWidth
	menuStart.height = window.innerHeight

	var switchState = function() {
		//TODO
		document.body.removeChild(field)
		console.log(field.value+" gonna join the game !")
	}
	
	var update = function() {
		renderer.render(stage)
		requestAnimFrame(update)
	}
	
	requestAnimFrame(update)

})();