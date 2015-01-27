
var app = require('express')()
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


        for( var i=0; i--;)
            Object.create( bot ).init( modelBall )

        room = rooms[ roomName ] = modelBall
    }

    room.ed.dispatch( eventName, data )
}


var cleanEmptyRoom = function(){
    // TODO
}


require('./comm/mainSocket').bindEventCb( handleEvent )



app.get('/', function(req, res) {
    res.sendFile('index.html', {root: './../js_viewer'})
})
app.get('/css/style.css', function(req, res) {
    res.sendFile('css/style.css', {root: './../js_viewer'})
})
app.get('/js/bundle.js', function(req, res) {
    res.sendFile('js/bundle.js', {root: './../js_viewer'})
})
app.get('/asset/:file', function(req, res) {
    res.sendFile('asset/'+req.params.file, {root: './../js_viewer'})
})
app.get('/asset/Mini/:file', function(req, res) {
    res.sendFile('asset/Mini/'+req.params.file, {root: './../js_viewer'})
})
app.listen(20151)
