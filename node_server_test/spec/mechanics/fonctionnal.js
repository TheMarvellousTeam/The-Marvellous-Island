var Game = require( '../../../node_server/system/game')
var GameLoop = require( '../../../node_server/handler/gameLoop')
var Ed = require( '../../../node_server/util/eventDispatcher')
var Sc = require( '../../scenario')




describe('', function(){

    beforeEach(function(done){
        setTimeout(done,1000)
    })

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
        this.ed.nolog = true

        jasmine.DEFAULT_TIMEOUT_INTERVAL = 10000

        // atempt to view the tests
        if( false )
            Object.create( require( '../../../node_server/handler/viewerUpdateHandler') ).init({
                game: this.game,
                ed: this.ed,
                room: 'test-room',
            })
    })
    afterEach(function(){
        this.ed.reset()
    })

    describe('resolution phase', function(){
        describe('with one player', function(){
            beforeEach(function(){
                this.sc.pushMap('cross')
            })
            it( 'have start and end resolution events', function( done ){

                this.sc.sc()
                .spawn(1,1)
                .emit('io:player-cmds',{cmds:[
                    {'action': 'peck'},
                    {'action': 'peck'},
                    {'action': 'peck'},
                    {'action': 'peck'}
                ]})
                .expectEvent('gameLoop:start-resolution')
                .expectEvent('gameLoop:end-resolution')
                .do( function( x ){
                    done();x() })
                .go()
            })
            it( 'when dead, dont wait command to start resolution', function( done ){

                this.sc.sc()
                .spawn(1,1)
                .emit('io:player-cmds',{cmds:[
                    {'action': 'peck'},
                    {'action': 'peck'},
                    {'action': 'move', 'directionX':  0, 'directionY': 1 },
                    {'action': 'move', 'directionX':  1, 'directionY': 0 }
                ]})
                .expectEvent('gameLoop:start-resolution')
                .expectEvent('gameLoop:end-resolution')
                .expectEvent('gameLoop:start-resolution')
                .expectEvent('gameLoop:end-resolution')
                .expectEvent('gameLoop:start-resolution')
                .expectEvent('gameLoop:end-resolution')
                .expectEvent('gameLoop:start-resolution')
                .expectEvent('gameLoop:end-resolution')

                .expectNoEvent('gameLoop:start-resolution')

                .do( function( x ){
                    done();x() })
                .go()
            })
            it( 'when dead, respawn after 3 rounds', function( done ){

                this.sc.sc()
                .spawn(1,1)
                .emit('io:player-cmds',{cmds:[
                    {'action': 'peck'},
                    {'action': 'peck'},
                    {'action': 'move', 'directionX':  0, 'directionY': 1 },
                    {'action': 'move', 'directionX':  1, 'directionY': 0 }
                ]})
                .expectEvent('gameLoop:start-resolution')
                .expectEvent('gameLoop:end-resolution')
                .expectEvent('gameLoop:start-resolution')
                .expectEvent('gameLoop:end-resolution')
                .expectEvent('gameLoop:start-resolution')
                .expectEvent('gameLoop:end-resolution')
                .expectEvent('gameLoop:start-resolution')
                .expectEvent('gameLoop:end-resolution')

                .emit('io:player-cmds',{cmds:[
                    {'action': 'peck'},
                    {'action': 'peck'},
                    {'action': 'peck'},
                    {'action': 'peck'}
                ]})

                .expectEvent('gameLoop:start-resolution')
                .expectEvent('gameLoop:action', {action: 'spawn'})
                .expectEvent('gameLoop:action', {action: 'peck'})
                .expectEvent('gameLoop:action', {action: 'peck'})
                .expectEvent('gameLoop:action', {action: 'peck'})
                .expectEvent('gameLoop:action', {action: 'peck'})
                .expectEvent('gameLoop:end-resolution')

                .expectNoEvent('gameLoop:start-resolution')

                .do( function( x ){
                    done();x() })
                .go()
            })
        })
        describe('with two player', function(){
            beforeEach(function(){
                this.sc.pushMap('cross')
            })
        })
    })

    describe('actions', function(){

        describe('peck', function(){

            beforeEach(function(){
                this.sc.pushMap('cross')
            })
            it( 'do the action, do not move', function( done ){

                this.sc.sc()
                .spawn(1,1)
                .emit('io:player-cmds',{cmds:[
                    {'action': 'peck'},
                    {'action': 'peck'},
                    {'action': 'peck'},
                    {'action': 'peck'}
                ]})
                .expectEvent('gameLoop:action')
                .expectEvent('gameLoop:action')
                .expectEvent('gameLoop:action')
                .expectEvent('gameLoop:action', {action: 'peck'})
                .expectPlayer({x: 1, y: 1})
                .do( function( x ){
                    done();x() })
                .go()
            })
        })

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
                .expectPlayer({respawnIn: 3})
                .do( function( x ){
                    done();x() })
                .go()
            })

        })
    })

})
