var ed = require('../../system/eventDispatcher')

var _wait = function(){

    if( !this._wereable || this._wereable.k-- <= 0 )
        this.finishWereable()

}
var finishWereable = function( ){

    if( this._wereable )
    {
        this.state = this._wereable.restoreState
        ed.dispatch('change:state', {
            entity: this
        })
    }
    this._wereable = null

    ed.unlisten('update', this.id+'_wearable' )
}

// duration  : nb frame
var engageWereable = function( duration, restoreState ){

    this.finishWereable( true )

    this._wereable = {
        k: duration,
        restoreState: 'idl'
    }
    ed.listen('update', _wait.bind( this ), this.id+'_wearable' )
}

module.exports = {
    finishWereable: finishWereable,
    engageWereable: engageWereable
}
