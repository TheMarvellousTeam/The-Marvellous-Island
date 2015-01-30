var Game = require( '../../../node_server/system/game')
var GameLoop = require( '../../../node_server/handler/gameLoop')
var Ed = require( '../../../node_server/util/eventDispatcher')
var Sc = require( '../../scenario')



describe('', function(){


    beforeEach(function(){
        this.ed = Object.create( Ed )
        this.game = Object.create( Game ).init()
        this.gameLoop = Object.create( GameLoop ).init({
            game: this.game,
            ed: this.ed
        })
        this.sc = Object.create( Sc ).init(
            {
                game: this.game,
                ed: this.ed
            },
            function( label ){      // waht do when assert fail
                expect( label ).toBe( '' )
            },
            function(){             // waht do on bootstrap 
                expect( true ).toBe( true )
            },
            1000
        )
    })
    afterEach(function(){
        this.ed.reset()
    })

    describe('actions', function(){

        describe('move', function(){

            beforeEach(function(){
                this.sc.pushMap('cross')
            })
            it( 'do the action', function( done ){

                this.sc.sc()
                .spawn(1,1)
                .emit('io:player-cmds',{cmds:[
                    {'action': 'peck'},
                    {'action': 'peck'},
                    {'action': 'peck'},
                    {'action': 'move', 'directionX':  1, 'directionY': 0 }
                ]})
                .expectEvent('gameLoop:action')
                .expectEvent('gameLoop:action')
                .expectEvent('gameLoop:action')
                .expectEvent('gameLoop:action', {action: 'move'})
                .expectPlayer({x: 2, y: 1})
                .do( function( x ){
                    done();x() })
                .go()
            })
            it( 'died in water', function( done ){

                this.sc.sc()
                .spawn(1,1)
                .emit('io:player-cmds',{cmds:[
                    {'action': 'peck'},
                    {'action': 'peck'},
                    {'action': 'move', 'directionX':  0, 'directionY': 1 },
                    {'action': 'move', 'directionX':  1, 'directionY': 0 }
                ]})
                .expectEvent('gameLoop:action')
                .expectEvent('gameLoop:action')
                .expectEvent('gameLoop:action', {action: 'move'})
                .expectEvent('gameLoop:action', {action: 'move'})
                .expectEvent('gameLoop:action', {action: 'death'})
                .expectPlayer({respawnIn: 1})
                .do( function( x ){
                    done();x() })
                .go()
            })

        })
    })

})
