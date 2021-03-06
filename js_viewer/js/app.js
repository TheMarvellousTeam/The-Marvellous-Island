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
Object.create( require('./controller/sync-player') ).init( modelBall ).enable()
//Object.create( require('./controller/sync-order') ).init( modelBall ).enable()

var room = location.search.match('room=([^&#]+)')

if ( !room )
    return

serverIO.connect( window.location.hostname+':'+31415+'/comm/viewer', room[ 1 ] )
