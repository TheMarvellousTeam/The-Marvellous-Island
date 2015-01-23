var Abstract = require('../utils/Abstract')

var listener = {};

var dispatch = function( eventName, data ){



    if(true)
        switch(eventName){
            case 'ui-mousemove':
                break;
            default:
            //    console.log(eventName, data)
        }

    this._lock = true

    var l = listener[ eventName ] || []
    for( var i = 0; i<l.length; i++)
        l[i].fn(data, eventName)

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

    ;( listener[ eventName ] = listener[ eventName ] || [] ).push({
        fn: fn,
        key: key
    })
    return this
}
var unlisten = function( eventName, key ){

    if ( this._lock )
        return void ( this._stack = this._stack || [] ).push({ fn:'unlisten', args: arguments })

    var l = ( listener[ eventName ] = listener[ eventName ] || [] )
    for( var i = l.length; i--;)
        if( l[i].key == key )
            l.splice(i,1)
    return this
}
var hasListener = function( eventName, key ){
    return !!( listener[ eventName ] || [] ).length
}
var reset = function( eventName, key ){
    listener = {}
}

module.exports = Object.create( Abstract )
.extend({
    dispatch: dispatch,
    listen: listen,
    unlisten: unlisten,
    hasListener: hasListener,
    reset: reset
})
