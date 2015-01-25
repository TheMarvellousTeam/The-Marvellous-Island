var net = require('net')
var Promise = require('promise')



var client = net.connect(
    {port: 31415, host:'localhost'},function(){
        console.log('connected')
});


client.on('data', function(data) {
    console.log(data.toString());
    client.end();
});
client.on('end', function() {
    console.log('disconnected from server');
});


read()
.then( sendName )
.then( read )

var read= function(){
    return new Promise(function(resolve, reject){
        process.stdin.resume();
        process.stdin.setEncoding('utf8');
        process.stdin.on('data', function (text) {
            process.stdin.pause();
            resolve( text )
        })
    })
}
var sendName =function( name ){
    client.write(JSON.stringify({
        op:"name",
        args:{
            name:name
        }
    })+'\r\n');
}
var sendCmd= function( type, x, y ){
    var cmds = [
        {
            op : "cmd",
            args : {
                type: type,
                x: x,
                y: y
            }
        }
    ]
    client.write(JSON.stringify( cmds )+'\r\n');
}
