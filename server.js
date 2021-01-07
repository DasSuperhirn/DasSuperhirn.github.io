const WebSocket = require("ws");

var socket = new WebSocket("wss://dassuperhirn.github.io", "protocolOne");

socket.onopen = function(event){

    socket.send("haha u mum gay");
};
