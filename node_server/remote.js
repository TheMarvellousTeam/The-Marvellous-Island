

var broadcast = function(data) {
	room.users.foreach(function(user){
		users.socket.write(data)
	})
}

var init = function(room) {
	this.room = room
}

module.exports = {
	init: init
}