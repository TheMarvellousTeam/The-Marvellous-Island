


var Game = require( '../../../node_server/system/game')
var GameLoop = require( '../../../node_server/handler/gameLoop')
var Ed = require( '../../../node_server/util/eventDispatcher')

var callBack = function(){

    var k= 0
    var fn = function(){
        k++
    }

    fn.count = function(){
        return k
    }

    return fn
}

describe('', function(){
    beforeEach(function(){
        this.ed = Object.create( Ed )
        this.game = Object.create( Game ).init()
        this.gameLoop = Object.create( GameLoop ).init({
            game: this.game,
            ed: this.ed
        })
    })
    afterEach(function(){
        this.ed.reset()
    })
    describe('gameLoop ', function(){

        // wait
        beforeEach(function( ){
            //setTimeout( done, 500)
            jasmine.DEFAULT_TIMEOUT_INTERVAL = 10000
        })

        // build simple world
        beforeEach(function(){
            var w = []
            for( var x=3;x--;)
            for( var y=3;y--;)
            {
                var empty = ( x==1 || y==1 )
                w.push({
                    x: x,
                    y: y,
                    type : empty ? 'watter' : 'grass',
                    height : empty ? 0 : 1,
                    obstacle : false
                })
            }
            this.game.world.length
            this.game.world.push.apply( this.game.world, w )

            // force world update
            this.ed.dispatch('io:viewer-connect')
        })

        describe('one player ', function(){

            // add player at the center
            beforeEach(function( ){

                this.ed.dispatch('io:player-connect', {id: 'ana'})

                this.game.players[ 'ana'].x = this.game.players[ 'ana'].spawnX = 1
                this.game.players[ 'ana'].y = this.game.players[ 'ana'].spawnY = 1
                this.game.players[ 'ana'].name = 'ana '

                // force world update
                this.ed.dispatch('io:viewer-connect')
            })

            describe('start / end resolution with basic commands', function(){

                beforeEach(function( done ){

                    // listen
                    this.ed.listen('gameLoop:start-resolution', this.cb = callBack() )
                    this.ed.listen('gameLoop:end-resolution', done )

                    this.ed.dispatch('io:player-cmds', {
                        id: 'ana',
                        cmds: [{'action': 'peck'}, {'action': 'peck'}, {'action': 'peck'}, {'action': 'peck'}]
                    })
                })

                it('start / end resolution called', function(){
                    expect( this.cb.count() ).toBe( 1 )
                })
            })

            describe('start / end resolution with basic commands 2', function(){

                beforeEach(function( done ){

                    // listen
                    this.ed.listen('gameLoop:start-resolution', this.cb = callBack() )
                    this.ed.listen('gameLoop:end-resolution', done )

                    this.ed.dispatch('io:player-cmds', {
                        id: 'ana',
                        cmds: [
                            {'action': 'move', 'directionX':  1, 'directionY': 0 },
                            {'action': 'move', 'directionX': -1, 'directionY': 0 },
                            {'action': 'move', 'directionX': -1, 'directionY': 0 },
                            {'action': 'move', 'directionX':  1, 'directionY': 0 }
                        ]
                    })
                })

                it('start / end resolution called', function(){
                    expect( this.cb.count() ).toBe( 1 )
                })
            })

            describe('start / end resolution when dead', function(){

                beforeEach(function( done ){

                    var k = 1

                    // listen
                    this.ed.listen('gameLoop:start-resolution', this.cbS = callBack() )
                    this.ed.listen('gameLoop:end-resolution', this.cbE = callBack() )
                    //this.ed.listen('gameLoop:end-resolution', function(){ if( !(k--) ) done() })

                    // kill it
                    this.ed.dispatch('io:player-cmds', {
                        id: 'ana',
                        cmds: [
                            {'action': 'peck'},
                            {'action': 'peck'},
                            {'action': 'move', 'directionX': 1, 'directionY': 0 },
                            {'action': 'move', 'directionX': 1, 'directionY': 0 }
                        ]
                    })
                    
                    setTimeout( done, 9500 )
                })

                it('start / end resolution should be called multiple times', function(){
                    expect( this.cbS.count() > 1 ).toBe( true )
                    expect( this.cbE.count() > 1 ).toBe( true )
                })

            })

        })
    })
})
