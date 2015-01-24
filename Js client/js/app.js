var Map = require('./model/map')
  , WorlRenderer = require('./renderer/main')

  , serverIO = require('./system/serverIO')

var modelBall = {
    map: Object.create( Map ).init(),
    entityPool: []
}





Object.create( WorlRenderer ).init( modelBall )

Object.create( require('./controller/actionStack') ).init( modelBall ).enable()
Object.create( require('./controller/sync-world') ).init( modelBall ).enable()




/*
for (var k= 0 | ( 10 * Math.random() ); k--; )
    for (var i=10; i--; )
    {
        var x = 0 | ( Math.random() * modelBall.map.width )
        var y = 0 | ( Math.random() * modelBall.map.height )

        var c = modelBall.map.get( x, y )

        if( c.type == 'water' && !c.obstacle )
            continue

        var e = Object.create( Deco ).init( c.type )
        e.x = x
        e.y = y

        modelBall.entityPool.push( e )

        break
    }
*/


serverIO.connect( "localhost", 1984 )


/*
var ed = window.ed = require('./system/eventDispatcher')
var p
modelBall.entityPool.push( p = Object.create( Player ).init() )
ed.dispatch('add:entity')
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
*/
