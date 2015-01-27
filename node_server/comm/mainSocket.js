var io = require('socket.io').listen(31415);

var ioController = io.of('/controller')
.on('connection', function(socket){
    var room
    var messageHandler= function( eventName, data ){
        var o = {id: socket.id}
        for( var i in data )
            o[ i ] = data[ i ]
        eventCb( room, 'io:player-'+eventName, o)
    }

    // set or change room
    socket.on('room', function (data) {

        if (room) {
            eventCb( room, 'io:player-disconnect', {id: socket.id} )
            socket.leave( room )
        }

        room = data.room

        // TODO: rethrow the setName event

        socket.join( room )

        eventCb( room, 'io:player-connect', {id: socket.id} )
    });

    socket.on('cmds', messageHandler.bind( null, 'cmds' ));
    socket.on('name', messageHandler.bind( null, 'name' ));
    socket.on('disconnect', messageHandler.bind( null, 'disconnect' ));
})

var ioViewer = io.of('/viewer')
.on('connection', function (socket) {

    var room

    // set or change room
    socket.on('room', function (data) {

        if (room) {
            eventCb( room, 'io:viewer-disconnect', {id: socket.id} )
            socket.leave( room )
        }
        room = data.room

        socket.join( room )

        eventCb( room, 'io:viewer-connect', {id: socket.id} )
    });

    socket.on('disconnect', function () {
        eventCb( room, 'io:viewer-disconnect', {id: socket.id} )
    });
});

var eventCb = function( room, eventName, data ){}

module.exports  = {
    bindEventCb : function( fn ){
        eventCb = fn || function(){}
    },
    broadcastViewer : function( room, eventName, data) {
        ioViewer.to( room||'' ).emit( eventName, data )
    },
    broadcastController : function( room, eventName, data) {
        ioController.to( room||'' ).emit( eventName, data )
    },
}
