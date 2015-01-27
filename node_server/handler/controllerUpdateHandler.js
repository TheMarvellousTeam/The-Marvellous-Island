var webSocket = require( '../comm/mainSocket' )


var changePlayers = function( ){
    this.broadcastController( 'player', this.game.getPlayersAsJson() )
    this.broadcastController( 'order', {order: this.game.getOrderAsJson()} )
}
var broadcastController = function( room, name, data ){
    webSocket.broadcastController( room, name, data )
}

var init = function( modelBall ){

    this.room = modelBall.room
    this.game = modelBall.game
    this.ed = modelBall.ed

    this.broadcastController = broadcastController.bind( this, this.room )

    this.ed.listen('game:add-player', changePlayers.bind( this ))
    this.ed.listen('game:remove-player', changePlayers.bind( this ))
    this.ed.listen('game:change-player', changePlayers.bind( this ))

    this.ed.listen('gameLoop:change-order', this.broadcastController.bind( null, 'order') )

    this.ed.listen('gameLoop:start-resolution', this.broadcastController.bind( null, 'start-resolution' ) )
    this.ed.listen('gameLoop:end-resolution', this.broadcastController.bind( null, 'end-resolution' ) )

    this.ed.listen('io:controller-connect', function(){
        this.broadcastController( 'players', {players: this.game.getPlayersAsJson()} )
        this.broadcastController( 'order', {order: this.game.getOrderAsJson()} )
    }.bind( this ) )

    return this
}

module.exports = {
    init: init
}
