var round = 4

var addPlayer = function( data ){
    this.game.addPlayer( data.id, data.name )
    this.playersCmds[ data.id ] = []
    this.ed.dispatch('game:add-player',{
        player: this.game.players[ data.id ]
    })
}
var removePlayer = function( data ){
    var player = this.game.players[ data.id ]
    this.game.removePlayer( data.id )
    delete this.playersCmds[ data.id ]
    if( player )
        this.ed.dispatch('game:remove-player',{
            player: player
        })
}
var setPlayerName = function( data ){
    var player = this.game.players[ data.id ]
    if( !player )
        return
    player.name = data.name
    this.ed.dispatch('game:change-player',{
        player: player
    })
}
var addCommand = function( data ){

    if( this.state != 'waitingCmds')
        return

    // sanitize command
    if( !this.playersCmds[ data.id ] )
        return
    var cmds = ( data.cmds || [] ).slice()

    while( cmds.length && this.playersCmds[ data.id ].length < round )
    {
        // TODO sanitize

        this.playersCmds[ data.id ].push( cmds.shift() )
    }


    this.ed.dispatch('gameLoop:change-player-ready',{
        playerId: data.id,
        ready : true
    })
    checkAllReady.call(this)
}

var checkAllReady = function(){
    // test if everyOne is ready
    for (var id in this.playersCmds )
        if( this.game.players[ id ].respawnIn <= 0 && this.playersCmds[ id ].length < round )
            return

    // launch the resolution phase
    this.state != 'play'
    this.ed.dispatch('gameLoop:start-resolution')

    var history = this.game.resolveCommands( this.playersCmds )

    // clean up
    for (var id in this.playersCmds )
        this.playersCmds[ id ].length = 0


    // replay
    var that = this
    dispatch.call( this, history , function(){
        that.state != 'waitingCmds'
        that.ed.dispatch('gameLoop:end-resolution')

        checkAllReady.call( that )
    })
}


var actionsDelay = {
    "move": 400,
    "death": 200,
    "fail": 200,
    "spawn": 300,
    "fire_push_bullet": 450,
    "fire": 450,
    "peck": 200
}
var dispatch = function( history, cb ){

    // find the next action
    while( !history[ 0 ].actions.length ) {
        this.ed.dispatch('gameLoop:change-order', history[ 0 ].new_order )
        history.shift()

        if( !history.length )
            return void ( cb && cb() )
    }
    var action = history[0].actions.shift()

    action.duration = actionsDelay[ action.action  ] || 0
    this.ed.dispatch('gameLoop:action', action )

    setTimeout( dispatch.bind( this, history, cb ), actionsDelay[ action.action  ] || 0 )
}

var init = function( modelBall ){

    this.ed = modelBall.ed

    this.game = modelBall.game

    this.ed.listen('io:player-connect', addPlayer.bind(this) )
    this.ed.listen('io:player-name', setPlayerName.bind(this) )
    this.ed.listen('io:player-cmds', addCommand.bind(this) )
    this.ed.listen('io:player-disconnect', removePlayer.bind(this) )

    this.playersCmds = {}

    this.state = 'waitingCmds'

    return this
}

module.exports = {
    init: init
}
