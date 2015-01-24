var Map = require('./model/map')
  , Player = require('./model/player')
  , Tree = require('./model/Tree')
  , WorlRenderer = require('./renderer/main')
  //, serverIO = require('./system/serverIO')

var modelBall = {
    map: Object.create( Map ).init(),
    entityPool: []
}

WorlRenderer.init( modelBall )

//serverIO.connect( "localhost", 1984 )

var ed = window.ed = require('./system/eventDispatcher')

modelBall.entityPool.push( Object.create( Player ).init() )
ed.dispatch('add:entity')

var p = modelBall.entityPool[ 0 ]
document.addEventListener('keydown', function(event){

    var duration = 30
    var x = p._move ? p._move.targetX : p.x
    var y = p._move ? p._move.targetY : p.y
    switch( event.which ){
        case 38 : // up
            p.engageMove( x -1 , y , duration )
            break
        case 40 : // down
            p.engageMove( x +1 , y , duration )
            break
        case 37 : // left
            p.engageMove( x , y +1 , duration )
            break
        case 39 : // right
            p.engageMove( x , y -1 , duration )
            break
    }
})

modelBall.entityPool.push( Object.create( Tree ).init() )
