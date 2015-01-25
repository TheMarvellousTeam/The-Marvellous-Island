
var actionsDelay = {
    "move": 200,
    "death": 200,
    "fail": 200,
    "spawn": 200,
}


var dispatchOne = function( message, viewers ){

    var name = message.name ? message.name : 'action'

    message.duration = actionsDelay[ message.action ] || 0

    viewers.forEach(function(v){
        v.emit( name , message )
    })

}
var dispatch = function( messages, viewers, cb ){

    var message = messages.shift()

    if( !message )
        return void ( cb && cb() )

    dispatchOne( message , viewers )

    setTimeout( dispatch.bind( null, messages, viewers, cb ), actionsDelay[ message.action ] || 0 )
}


var historyToMessages = function( history ){
    return history.reduce(function( prev, c ){
            return prev.concat( c.actions ).concat({ name : 'order', 'order': c.new_order })
        },[])
}




module.exports = {
    dispatch: dispatch,
    historyToMessages: historyToMessages
}
