var Abstract = require('../util/Abstract')
  , ed = require('../system/eventDispatcher')
  , Player = require('../model/player')

var init = function( modelBall ){

    this.model = {
        entityPool: modelBall.entityPool
    }

    this.sync = sync.bind( this )

    return this
}

var sync = function( data ){
    var ul = document.getElementById("order")
    ul.innerHTML = ""
    data.order.forEach(function(name){
        ul.innerHTML = ul.innerHTML+"<li>"+name+"</li>"
    })

}

var enable = function(){
    this.disable()
    ed.listen( 'io:update-order', this.sync, this )
}
var disable = function(){
    ed.unlisten( 'io:update-order', this )
}

module.exports = Object.create( Abstract ).extend({
    init: init,
    enable: enable,
    disable: disable,
})
