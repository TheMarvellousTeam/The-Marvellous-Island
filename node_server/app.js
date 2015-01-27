
var ed = require('./util/eventDispatcher')
var gameLoop = require('./handler/gameLoop')
var game = require('./system/game')
var bot = require('./system/bot')
var viewerUpdateHandler = require('./handler/viewerUpdateHandler')
var controllerUpdateHandler = require('./handler/controllerUpdateHandler')

var rooms = {}


var handleEvent = function( roomName, eventName, data ){
    var room
    if( !(room=rooms[ roomName ]) ) {
        // room does not exist

        var modelBall = {
            ed: Object.create( ed ),
            game : Object.create( game ).init(  ),
            room: roomName
        }
        ed.roomName = roomName

        Object.create( gameLoop ).init( modelBall ),

        Object.create( viewerUpdateHandler ).init( modelBall )
        Object.create( controllerUpdateHandler ).init( modelBall )


        for( var i=1; i--;)
            Object.create( bot ).init( modelBall )

        room = rooms[ roomName ] = modelBall
    }

    room.ed.dispatch( eventName, data )
}


var cleanEmptyRoom = function(){
    // TODO
}


require('./comm/mainSocket').bindEventCb( handleEvent )
require('../website/app')
