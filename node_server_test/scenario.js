
var pushMap =(function(){
    var maps = {}
    maps[ 'cross' ]={
        size:3,
        m: []
    }

    for( var x=3;x--;)
    for( var y=3;y--;)
    {
        var water = ( x!=1 && y!=1 )
        maps[ 'cross' ].m[ x + y*3 ] = {
            x: x,
            y: y,
            type : water ? 'water' : 'grass',
            height : water ? 0 : 1,
            obstacle : false
        }
    }


    return pushMap = function( _m, _size ){
        var m,size
        if ( Array.isArray( m ) ){
            m = _m
            size = _size
        }else{
            var t = maps[ m ] || maps[ 'cross' ]
            m = t.m
            size = t.size
        }

        this.game.size = size
        this.game.world.length = 0
        this.game.world.push.apply( this.game.world, m )
        this.game.world.get = function(x,y){
            return m[ x + y*size ]
        }


        // force world update
        this.ed.dispatch('io:viewer-connect')
    }
})()

var id_c = 0
var k = 1
var spawn = function( x, y, done ){
    var id = this.playerId = 'ana_'+(id_c++)
    this.ed.dispatch('io:player-connect', {id: id})

    this.game.players[ id ].x = this.game.players[ id ].spawnX = x
    this.game.players[ id ].y = this.game.players[ id ].spawnY = y
    this.game.players[ id ].name = 'ana '


    // force world update
    this.ed.dispatch('io:viewer-connect')

    done()
}
var emit = function( eventName, data, done ){
    var d = {}
    for (var i in data )
        d[ i ] = data[ i ]
    if( !d.playerId )
        d.playerId = this.playerId
    if( !d.id )
        d.id = this.playerId

    for( var i in this._events )
        this._events[ i ].length = 0

    this.ed.dispatch( eventName, d )
    done()
}
var expectEvent = function( eventName, dataExpected, done ){

    var key = k++

    var accept = function( data ){


        this.ed.unlisten( eventName, accept )
        this._willCatch = false
        clearInterval( timeout )

        //test shit
        if ( dataExpected ){
            if ( !data )
                return this.whenAssertFail('expected '+eventName+' to to fire a data object, got nothing')
            for ( var i in dataExpected ){
                if ( dataExpected[ i ] != data[ i ] )
                return this.whenAssertFail('expected the attribute '+i+' to be '+dataExpected[ i ]+' got '+data[ i ]+' instead ')
            }
        }


        done()
    }.bind( this )

    var last = this._events[ eventName ].shift()
    if ( last && last.k < this.k && !last.consumed )
        return accept( last )

    var timeout = setTimeout( function(){
        this.whenAssertFail('expected '+eventName+', never got it after '+this.timeout+ ' ms')
        clearInterval( timeout )
        this.ed.unlisten( eventName, key )
    }.bind( this ), this.timeout )

    this._willCatch = true
    this.ed.listen( eventName, accept )
}
var expectPlayer = function( dataExpected, done ){

    var player = this.game.players[ this.playerId ]
    for ( var i in dataExpected )
        if ( dataExpected[ i ] != player[ i ] )
            return this.whenAssertFail('expected the attribute '+i+' to be '+dataExpected[ i ]+' got '+player[ i ]+' instead ')

    done()
}
var addStack = function( pipe ){
    this.stack.push( pipe )
}
var gotEvent = function( eventName, data ){
    if( !this._willCatch )
        this._events[ eventName ].push({
            data: data,
            k: this.k
        })
}
var resolve = function(){
    // do
    if( this.k >= this.stack.length )
        return
    var fn = this.stack[ this.k ]
    this.k ++
    fn( resolve.bind( this ) )
}
var S = {
    init: function( ed, game, whenAssertFail, timeout ){
        this.ed = ed
        this.game = game
        this.stack = []
        this._events = {}
        this.whenAssertFail = whenAssertFail
        this.timeout = timeout
        return this
    },
    spawn: function( x, y ){
        addStack.call( this, spawn.bind( this, x, y ) )
        return this
    },
    wait: function( delay ){
        addStack.call( this, function( delay, done ){
            setTimeout( done, delay )
        }.bind( this, delay ) )
        return this
    },
    emit: function( eventName, data ){
        addStack.call( this, emit.bind( this, eventName, data ) )
        return this
    },
    do: function( fn ){
        addStack.call( this, fn )
        return this
    },
    expectEvent: function( eventName, data ){
        if ( !this._events[ eventName ])
        {
            this.ed.listen( eventName , gotEvent.bind( this, eventName ) )
            this._events[ eventName ] = []
        }
        addStack.call( this, expectEvent.bind( this, eventName, data ) )
        return this
    },
    expectPlayer: function( data ){
        addStack.call( this, expectPlayer.bind( this, data ) )
        return this
    },
    go: function(){
        this.k = 0
        resolve.call( this )
        return this
    }
}

var init = function( modelBall, whenAssertFail, bootstrap, timeout ){
    this.ed = modelBall.ed
    this.game = modelBall.game
    this.whenAssertFail = whenAssertFail || function(){}
    this.bootstrap = bootstrap || function(){}
    this.timeout = timeout || 2000
    return this
}

module.exports = {
    init: init,
    pushMap: pushMap,
    sc: function(){
        this.bootstrap()
        var sc = Object.create( S ).init( this.ed, this.game, this.whenAssertFail, this.timeout)
        return sc
    }
}
