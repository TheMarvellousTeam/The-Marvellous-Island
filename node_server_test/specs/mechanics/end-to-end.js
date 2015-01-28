


var Game = require( '../../../node_server/system/game')
var GameLoop = require( '../../../node_server/handler/gameLoop')
var Ed = require( '../../../node_server/util/eventDispatcher')

describe('', function(){
    beforeEach(function(){
        this.ed = Object.create( Ed )
        this.game = Object.create( Game ).init()
        this.gameLoop = Object.create( GameLoop ).init({
            game: this.game,
            ed: this.ed
        })
    })
    describe('gameLoop ', function(){

        // wait
        beforeEach(function( done ){
            setTimeout( done, 500)
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
            this.game.world = w

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

            describe('start / end resolution', function(){

                beforeEach(function( done ){

                    // listen
                    this.ed.listen('gameLoop:start-resolution', (this.cb = jasmine.createSpy('cb')) )
                    this.ed.listen('gameLoop:end-resolution', function(){ done() })

                    this.ed.dispatch('io:player-cmds', {
                        id: 'ana',
                        cmds: [{'action': 'peck'}, {'action': 'peck'}, {'action': 'peck'}, {'action': 'peck'}]
                    })
                })

                it('start / end resolution called', function(){
                    expect( this.cb.calls.count() ).toBe( 1 )
                })
            })

        })
    })
})
