var webSocket = require( '../comm/mainSocket' )


var changePlayers = function( ){
    this.broadcastViewer( 'player', this.game.getPlayersAsJson() )
    this.broadcastViewer( 'order', {order: this.game.getOrderAsJson()} )
}
var broadcastViewer = function( room, name, data ){
    webSocket.broadcastViewer( room, name, data )
}

var init = function( modelBall ){

    this.room = modelBall.room
    this.game = modelBall.game
    this.ed = modelBall.ed

    this.broadcastViewer = broadcastViewer.bind( this, this.room )

    this.ed.listen('game:add-player', changePlayers.bind( this ))
    this.ed.listen('game:remove-player', changePlayers.bind( this ))
    this.ed.listen('game:change-player', changePlayers.bind( this ))
    this.ed.listen('gameLoop:action', this.broadcastViewer.bind( null, 'action') )
    this.ed.listen('gameLoop:change-order', this.broadcastViewer.bind( null, 'order') )
    //this.ed.listen('gameLoop:player-change-ready', changePlayers.bind( this ))
    this.ed.listen('gameLoop:start-resolution', this.broadcastViewer.bind( null, 'start-resolution' ) )
    this.ed.listen('gameLoop:end-resolution', this.broadcastViewer.bind( null, 'end-resolution' ) )

    this.ed.listen('io:viewer-connect', function(){
        this.broadcastViewer( 'world', {world: this.game.getWorldAsJson()} )
        this.broadcastViewer( 'players', {players: this.game.getPlayersAsJson()} )
        this.broadcastViewer( 'order', {order: this.game.getOrderAsJson()} )
    }.bind( this ) )

    return this
}

module.exports = {
    init: init
}
