var Abstract = require('../util/Abstract')

// use the stack only if its the same event listened


var dispatch = function( eventName, data ){

    if(!this.nolog)
        switch(eventName){
            case 'update':
                break;
            default:
                console.log('--- '+ this.roomName +' [ '+eventName+' ] ', data)
        }

    this._lock = true

    var l = (this.listener || {})[ eventName ] || []
    for( var i = 0; i<l.length; i++)
        l[i].fn(data, eventName)


    // as the listen / unlisten is locked during the event loop, redo it here
    this._lock = false
    while( (this._stack||[]).length ){
        var o = this._stack.shift()
        this[ o.fn ].apply( this, o.args)
    }

    return this
}
var listen = function( eventName, fn , key ){

    if ( this._lock )
        return void ( this._stack = this._stack || [] ).push({ fn:'listen', args: arguments })

    this.listener = this.listener || {}
    ;( this.listener[ eventName ] = this.listener[ eventName ] || [] ).push({
        fn: fn,
        key: key
    })
    return this
}
var unlisten = function( eventName, keyOrFn ){

    if ( this._lock )
        return void ( this._stack = this._stack || [] ).push({ fn:'unlisten', args: arguments })

    var l = (this.listener || {})[ eventName ] || []
    for( var i = l.length; i--;)
        if( l[i].key == keyOrFn || l[i].fn == keyOrFn )
            l.splice(i,1)
    return this
}
var hasListener = function( eventName, key ){
    return !!( (this.listener || {})[ eventName ] || [] ).length
}
var reset = function( eventName, key ){
    this.listener = {}
}

module.exports = Object.create( Abstract )
.extend({
    dispatch: dispatch,
    listen: listen,
    unlisten: unlisten,
    hasListener: hasListener,
    reset: reset
})
