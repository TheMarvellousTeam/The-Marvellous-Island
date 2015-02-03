
var proceduralGenWorld = function( w, h ){

    // x + y*w
    var map = []

    var r_max = ( (w/2)*(w/2) + (h/2)*(h/2) ) * 1.1

    for ( var x=w; x--; )
    for ( var y=h; y--; )
    {

        // distance to center
        var r = (( x-w/2 )*( x-w/2 ) + ( y-h/2 )*( y-h/2 )) / r_max

        // distance to center ~ random param
        var r_height = Math.min( 1, ( Math.pow( r , 1/2 ) * 1.1 * ( Math.random() * 0.3 + 0.7 ) ))

        var height
        if ( r_height < 0.18 )
        height = 3
        else if ( r_height < 0.3 )
        height = 2
        else if ( r_height < 0.5 )
        height = 1
        else
        height = 0

        var obstacle = null

        if ( height>=3 && Math.random()>0.93 || height>=2 && Math.random()>0.96 )
        obstacle = 'tree'

        map[ x + y*w ] = {
            height : height,
            type: ['water', 'sand', 'dirt', 'grass', 'grass'][ height ],
            obstacle: obstacle,
            x: x,
            y: y,
        }

    }

    // #yolo
    map.get = function( x, y ){
        var k = x + y*w
        if(  k<0 || k>=map.length )
        return {
            height: 0,
            type: 'water',
            obstacle: ''
        }
        return map[ k ]
    }

    // fill the ugly gap
    for ( var x=w; x--; )
    for ( var y=h; y--; )
    {
        var startcell = map.get(x, y)
        if ( startcell.height == 0
             && map.get(startcell.x-1, startcell.y).height > 0 
             && map.get(startcell.x+1, startcell.y).height > 0
             && map.get(startcell.x, startcell.y-1).height > 0
             && map.get(startcell.x, startcell.y+1).height > 0 ) {

            startcell.height = 1
            startcell.type = 'sand'
        }
    }

    // cleaning
    var connexion = []

    for ( var x=w; x--; )
    for ( var y=h; y--; )
    {
        if( map.get(x, y).height > 0 ){

            var toCheck = []
            if( map.get(x-1, y).height >0 )
                toCheck.push(x-1+y*w)
            if( map.get(x+1, y).height >0 )
                toCheck.push(x+1+y*w)
            if( map.get(x, y-1).height >0 )
                toCheck.push(x+y*w-w)
            if( map.get(x, y+1).height >0 )
                toCheck.push(x+y*w+w)

            if ( connexion.length == 0 ){
                connexion.push([x+y*w])
            } else {
                var addTo = []

                for(var j=connexion.length; j-- ;)
                for(var i=toCheck.length; i-- ;)
                {
                    if( connexion[j].indexOf(toCheck[i]) != -1 ) {
                        if( addTo.indexOf(j) == -1 )
                            addTo.unshift(j)
                    }
                }

                if( addTo.length == 0 ){
                    connexion.push([x+y*w])
                } else if (addTo.length == 1) {
                    connexion[addTo[0]].push(x+y*w)
                } else {
                    var newConnexion = []
                    for(var i=addTo.length; i-- ;)
                    {
                        // something to fix here
                        newConnexion.concat(connexion[addTo[i]])
                        // that's work, but there is some strange behavior in the array
                        connexion.splice(addTo[i], 1)
                    }
                    connexion.push(newConnexion)
                }
            }

        }
    }

    var maxLen = -1 ;
    var maxI = -1 ;
    for( var i=connexion.length; i--; ) {
        if( connexion[i].length > maxLen ){
            maxLen = connexion[i].length
            maxI = i
        }
    }
    for( var i = connexion.length; i--; ){
        if( i != maxI ){
            connexion[i].forEach(function(position){
                map[position].height = 0
                map[position].type = 'water'
                map[position].obstacle = ''
            })
        }
    }

    return map
}

var computeSpawnCandidate = function(map, w, h) {
    var nextWater = []
    var spawn = []

    for ( var x=w; x--; )
    for ( var y=h; y--; )
    {
        var startcell = map.get(x, y)
        var max_chain = 5

        var open = []
        var closed = []

        if ( startcell.height > 0 )
        open.push(startcell)

        while( open.length > 0 && closed.length < max_chain ) {

            var cell = open.shift()
            closed.push(cell)

            var neighboor = map.get(x-1, y)
            if ( neighboor.height == 0 ) {
                open.push(neighboor)
            }
            neighboor = map.get(x+1, y)
            if ( neighboor.height == 0 ) {
                open.push(neighboor)
            }
            neighboor = map.get(x, y-1)
            if ( neighboor.height == 0 ) {
                open.push(neighboor)
            }
            neighboor = map.get(x, y+1)
            if ( neighboor.height == 0 ) {
                open.push(neighboor)
            }
        }

        if ( closed.length >= max_chain ) {
            nextWater.push(startcell)
        }
    }

    spawn.push(nextWater.shift())

    var cell = nextWater.shift()
    var max = {
        cell: cell,
        dst: Math.sqrt(Math.pow(spawn[0].x - cell.x, 2)+Math.pow(spawn[0].y - cell.y, 2))
    }

    nextWater.forEach(function(cell){
        var dst = Math.sqrt(Math.pow(spawn[0].x - cell.x, 2)+Math.pow(spawn[0].y - cell.y, 2))
        if( dst > max.dst ){
            max.cell = cell
            max.dst = dst
        }
    })

    spawn.push(max.cell)
    nextWater.splice(nextWater.indexOf(max.cell), 1)

    var cell = nextWater.shift()
    var max = {
        cell: cell,
        dst: Math.pow(Math.sqrt(Math.pow(spawn[0].x - cell.x, 2)+Math.pow(spawn[0].y - cell.y, 2)), 2)
        + Math.pow(Math.sqrt(Math.pow(spawn[1].x - cell.x, 2)+Math.pow(spawn[1].y - cell.y, 2)), 2)
    }

    nextWater.forEach(function(cell){
        var dst = Math.pow(Math.sqrt(Math.pow(spawn[0].x - cell.x, 2)+Math.pow(spawn[0].y - cell.y, 2)), 2)
        + Math.pow(Math.sqrt(Math.pow(spawn[1].x - cell.x, 2)+Math.pow(spawn[1].y - cell.y, 2)), 2)
        if( dst > max.dst ){
            max.cell = cell
            max.dst = dst
        }
    })

    spawn.push(max.cell)
    nextWater.splice(nextWater.indexOf(max.cell), 1)

    var cell = nextWater.shift()
    var max = {
        cell: cell,
        dst: Math.pow(Math.sqrt(Math.pow(spawn[0].x - cell.x, 2)+Math.pow(spawn[0].y - cell.y, 2)), 2)
        + Math.pow(Math.sqrt(Math.pow(spawn[1].x - cell.x, 2)+Math.pow(spawn[1].y - cell.y, 2)), 2)
        + Math.pow(Math.sqrt(Math.pow(spawn[2].x - cell.x, 2)+Math.pow(spawn[2].y - cell.y, 2)), 2)
    }

    nextWater.forEach(function(cell){
        var dst = Math.pow(Math.sqrt(Math.pow(spawn[0].x - cell.x, 2)+Math.pow(spawn[0].y - cell.y, 2)), 2)
        + Math.pow(Math.sqrt(Math.pow(spawn[1].x - cell.x, 2)+Math.pow(spawn[1].y - cell.y, 2)), 2)
        + Math.pow(Math.sqrt(Math.pow(spawn[2].x - cell.x, 2)+Math.pow(spawn[2].y - cell.y, 2)), 2)
        if( dst > max.dst ){
            max.cell = cell
            max.dst = dst
        }
    })

    spawn.push(max.cell)

    return spawn

}

module.exports = {
    genWorld : proceduralGenWorld,
    computeSpawnCandidate : computeSpawnCandidate
}
