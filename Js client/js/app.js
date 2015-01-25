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




serverIO.connect( "localhost", 1984 )
