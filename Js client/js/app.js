var Map = require('./model/map')
  , Player = require('./model/player')
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

modelBall.entityPool.push( Object.create( Player ).init() )
ed.dispatch('add:entity')

var p = modelBall.entityPool[ 0 ]
document.addEventListener('keydown', function(event){

    var duration = 30
    switch( event.which ){
        case 38 : // up
            p.engageMove( p.x -1 ,p.y, duration )
            break
        case 40 : // down
            p.engageMove( p.x +1 ,p.y, duration )
            break
        case 37 : // left
            p.engageMove( p.x ,p.y +1, duration )
            break
        case 39 : // right
            p.engageMove( p.x ,p.y -1, duration )
            break
    }
})
