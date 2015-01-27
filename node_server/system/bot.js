var Solver  =require('./solver')

var connect = function(){
    this.ed.dispatch('io:player-connect', {id: this.id} )
    this.ed.dispatch('io:player-name', {id: this.id, name: this.name} )
}

var sendCmds = function(){

    var cmds = this.solver.solve( this.game )

    this.ed.dispatch('io:player-cmds', {
        id: this.id,
        cmds: cmds
    })
}

var id = 0
var init = function( modelBall ){

    this.game = modelBall.game
    this.ed = modelBall.ed


    this.id = 'bot_'+(id++)
    this.name = 'ana'
    this.solver = Object.create( Solver ).init( this.id, this.game )

    this.ed.listen('gameLoop:end-resolution', sendCmds.bind( this ) )

    connect.call( this )

    sendCmds.call( this )

    return this
}

module.exports = {
    init: init
}
