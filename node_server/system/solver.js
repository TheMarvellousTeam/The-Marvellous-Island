
var solve = function( game ){

    var nb = 4

    var cmds = [], action

    while( nb -- ){

        var k = Math.random()

        if ( k<10.3 ){
            action = 'peck'
        } else if ( k<1 ) {
            action = 'move'
        }

        var m = [
            {x: 0, y: 1},
            {x: 0, y:-1},
            {x: 1, y: 0},
            {x:-1, y: 0}
        ]

        var dir = m[ 0|(Math.random()*m.length) ]

        cmds.push({
            directionX: dir.x,
            directionY: dir.y,
            action: action
        })
    }

    return cmds
}

var init = function( id, game ){

    this.id = id

    return this
}

module.exports = {
    init: init,
    solve: solve
}
