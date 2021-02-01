var placeGrid = [];


var express = require('express');
var app = express();
var serv = require('http').Server(app);

app.get('/',function(req, res) 
	{res.sendFile(__dirname+'/client/index.html');
});
app.use('/client',express.static(__dirname+'/client'));

serv.listen(6969);
console.log("Server started succesfully!");
console.log("theplace by SafetyMax <3");

var SOCKET_LIST = {};

var io = require('socket.io')(serv,{});
io.sockets.on('connection', function(socket){
	
	socket.id = Math.random();
	socket.timer=1;
	socket.zoom =50;
	socket.x = 0;
	socket.y = 0;
	
	SOCKET_LIST[socket.id] = socket;
	console.log('socket connection');
	
	socket.on('disconnect',function(){
		delete SOCKET_LIST[socket.id];
	});
	//listen
	socket.on('input',function(data){
		//work on zoom parameters
		socket.x = data.offsetX;
		socket.y = data.offsetY;
		if(data.mouseWheelDir == 'up'&&socket.zoom<=100){			
			socket.zoom += 2;
		}
		else if(data.mouseWheelDir == 'down'&&socket.zoom>2){
			socket.zoom -= 2;
		}
		//rounding problem shifts input half a cell
		if(data.mouseClick){
			if(data.selectedColour!=null){
				if(placeGrid[Math.floor((data.mouseX+(socket.x*socket.zoom)-10)/socket.zoom)]==null){
					placeGrid[Math.floor((data.mouseX+(socket.x*socket.zoom)-10)/socket.zoom)]= [];

				}
				placeGrid[Math.floor((data.mouseX+(socket.x*socket.zoom)-10)/socket.zoom)][Math.floor((data.mouseY+(socket.y*socket.zoom)-10)/socket.zoom)]=data.selectedColour;
			}
		}
	});
	
	
});

//calculation
setInterval(function(){
	var PixelPack = [];
	for (var i in SOCKET_LIST){
		var socket = SOCKET_LIST[i];
		socket.timer-=1/25;
		
		drawPlace(socket);
		socket.emit("newTimers",{
			timer:socket.timer
		});
		socket.emit('inputRequest');
	}
	
},1000/25);

var drawPlace = function(socket){
	var x = socket.x;
	var y = socket.y;
	var zoom = socket.zoom;
	socket.emit('place',{
		placeGrid:placeGrid,
		zoom:zoom,
		x:x,
		y:y
		});
}