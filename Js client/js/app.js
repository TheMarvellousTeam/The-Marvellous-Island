var Map = require('./model/map')
  , WorlRenderer = require('./renderer/main')
  //, serverIO = require('./system/serverIO')

var modelBall = {
    map: Object.create( Map ).init()
}

WorlRenderer.init( modelBall )

//serverIO.connect( "localhost", 1984 )

window.ed = require('./system/eventDispatcher')
